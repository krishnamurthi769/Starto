import os
import requests
import random
from statistics import mean
from sqlalchemy.orm import Session
from . import models
from openai import OpenAI
from dotenv import load_dotenv
import json
import time

load_dotenv()

# Use Environment Key or Fallback to provided key
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "AIzaSyAGJ3C35cVY8ueM-HPf19zf19ps7CBJNGs")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# --- Configuration ---
BUSINESS_RADII = {
    "cafe": 1500,
    "salon": 1000,
    "coaching": 2000,
    "retail": 1200,
    "gym": 1500,
    "restaurant": 1500,
    "tech": 3000
}

PEOPLE_PLACES = [
  "bus station",
  "metro station",
  "office",
  "college",
  "school",
  "mall"
]

# --- 1. Real-time Competitors & Profiles ---

def fetch_all_places(keyword: str, lat: float, lng: float, radius: int, type_filter: str = None):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "key": GOOGLE_PLACES_API_KEY,
        "location": f"{lat},{lng}",
        "radius": radius,
        "keyword": keyword
    }
    if type_filter:
        params["type"] = type_filter

    all_results = []
    
    while True:
        try:
            resp = requests.get(url, params=params).json()
        except Exception as e:
            print(f"Error fetching places: {e}")
            break
            
        results = resp.get("results", [])
        all_results.extend(results)

        next_token = resp.get("next_page_token")
        if not next_token:
            break
        
        time.sleep(2) # Required delay for next_page_token
        params["pagetoken"] = next_token
        
        # Safety break to avoid infinite loops if something weird happens
        if len(all_results) > 60: 
            break

    return all_results

def fetch_competitors(business_type: str, lat: float, lng: float):
    # Determine correct radius and type
    key = business_type.lower()
    radius = 2000 # Default
    
    # Simple partial matching for config
    for k, r in BUSINESS_RADII.items():
        if k in key:
            radius = r
            break
            
    # Refine type based on business for better filtering
    type_filter = None
    if "cafe" in key: type_filter = "cafe"
    elif "restaurant" in key: type_filter = "restaurant"
    elif "gym" in key: type_filter = "gym"
    
    raw_places = fetch_all_places(key, lat, lng, radius, type_filter)
    
    # Deduplicate by place_id
    unique_places = {}
    for p in raw_places:
        pid = p.get("place_id")
        if pid:
            unique_places[pid] = p
            
    competitors = list(unique_places.values())
    
    formatted_results = []
    for place in competitors:
        formatted_results.append({
            "place_id": place.get("place_id"),
            "name": place.get("name"),
            "lat": place["geometry"]["location"]["lat"],
            "lng": place["geometry"]["location"]["lng"],
            "rating": place.get("rating"),
            "user_ratings_total": place.get("user_ratings_total", 0),
            "address": place.get("vicinity"),
        })
        
    return formatted_results

def get_activity_score(lat: float, lng: float):
    score = 0
    # Check for activity proxies within 1500m
    for k in PEOPLE_PLACES:
        # Just need counts, not details. Limit 5 per category to save time/bandwidth
        places = fetch_places_by_keyword(k, lat, lng, radius=1500, limit=5)
        score += len(places)
    return score

# --- 2. Market Demand & Risk Assessment ---

def compute_market_metrics(competitors: list, activity_score: int):
    competitor_count = len(competitors)

    ratings = [c["rating"] for c in competitors if c.get("rating") is not None]
    reviews = [c["user_ratings_total"] for c in competitors]

    avg_rating = round(mean(ratings), 2) if ratings else 0
    avg_review_count = round(mean(reviews), 2) if reviews else 0

    # Competition level (Buckets)
    if competitor_count <= 5:
        competition_level = "LOW"
    elif 6 <= competitor_count <= 15:
        competition_level = "MEDIUM"
    else:
        competition_level = "HIGH"

    # Demand level (Refined with Activity Score)
    if competitor_count == 0 and activity_score < 5:
        demand_level = "LOW"
    elif competitor_count > 0 and activity_score >= 10:
        demand_level = "HIGH"
    else:
        demand_level = "MODERATE"

    strong_competitors = (avg_rating >= 4.2 and avg_review_count >= 100) # Stricter definition

    return {
        "competitor_count": competitor_count,
        "avg_rating": avg_rating,
        "avg_review_count": avg_review_count,
        "competition_level": competition_level,
        "demand_level": demand_level,
        "strong_competitors": strong_competitors,
        "activity_score": activity_score
    }

def compute_risk_score(metrics: dict):
    risk = 0
    
    comp = metrics["competition_level"]
    demand = metrics["demand_level"]
    strong = metrics["strong_competitors"]
    activity = metrics["activity_score"]

    # Competition pressure logic
    if comp == "HIGH" and demand != "HIGH":
        risk += 40
    elif comp == "HIGH":
        risk += 25
    elif comp == "MEDIUM":
        risk += 15

    # Strong incumbents
    if strong:
        risk += 25

    # Footfall weakness
    if activity < 5:
        risk += 20

    risk_score = min(risk, 100)

    if risk_score <= 35:
        risk_category = "LOW RISK"
    elif 36 <= risk_score <= 65:
        risk_category = "MEDIUM RISK"
    else:
        risk_category = "HIGH RISK"

    return risk_score, risk_category

def generate_ai_summary(business_type, city, area, metrics, risk_score, risk_category):
    if not client:
        return f"Risk Analysis: {risk_category} ({risk_score}/100). Demand is {metrics['demand_level']} based on {metrics['activity_score']} activity points nearby."
        
    prompt = f"""
    You are a professional business analyst.
    Business: {business_type}
    Location: {area}, {city}
    
    Data:
    - Competitors: {metrics['competitor_count']} ({metrics['competition_level']})
    - Avg Rating: {metrics['avg_rating']}
    - Avg Reviews: {metrics['avg_review_count']}
    - Demand Signal: {metrics['demand_level']} (Activity Score: {metrics['activity_score']})
    - Risk: {risk_score}/100 ({risk_category})
    
    Write a concise, realistic 3-4 sentence market summary. Mention if high risk is due to saturation or low footfall.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI Error: {e}")
        return "Analysis generated. Validate footfall manually."

def build_market_landscape(business_type, city, area, lat, lng):
    # 1. Competitors
    competitors = fetch_competitors(business_type, lat, lng)
    
    # 2. Activity Score
    activity_score = get_activity_score(lat, lng)
    
    # 3. Compute Metrics
    metrics = compute_market_metrics(competitors, activity_score)
    risk_score, risk_category = compute_risk_score(metrics)

    ai_summary = generate_ai_summary(
        business_type, city, area, metrics, risk_score, risk_category
    )

    # Top 20 competitors
    competitors_for_frontend = sorted(
        competitors, key=lambda c: c["user_ratings_total"], reverse=True
    )[:20]

    return {
        "competitorCount": metrics["competitor_count"],
        "competitionLevel": metrics["competition_level"],
        "demandLevel": metrics["demand_level"],
        "avgRating": metrics["avg_rating"],
        "avgReviewCount": metrics["avg_review_count"],
        "riskScore": risk_score, # For UI Gauge
        "riskCategory": risk_category,
        "aiSummary": ai_summary,
        "competitors": competitors_for_frontend,
        "activityScore": activity_score # Optional for debug/UI
    }

# --- 3. Freelancers / Talent Integration ---

TALENT_MAPPING = {
    "cafe": [
        {"label": "Interior Designers", "keyword": "interior designer"},
        {"label": "Food Suppliers", "keyword": "food supplier"},
        {"label": "Digital Marketing Agencies", "keyword": "digital marketing agency"},
        {"label": "Printing & Branding", "keyword": "printing shop"},
    ],
    "salon": [
        {"label": "Salon Equipment", "keyword": "salon equipment"},
        {"label": "Interior Designers", "keyword": "interior designer"},
        {"label": "Cosmetics Wholesalers", "keyword": "cosmetics wholesaler"},
    ],
    "coaching": [
        {"label": "Stationery Shops", "keyword": "stationery shop"},
        {"label": "Printing Press", "keyword": "printing press"},
        {"label": "Hostels / PGs", "keyword": "hostel"},
    ],
    "restaurant": [
        {"label": "Kitchen Equipment", "keyword": "commercial kitchen equipment"},
        {"label": "Food Distributors", "keyword": "food distributor"},
        {"label": "Interior Designers", "keyword": "restaurant interior designer"},
    ],
    "gym": [
         {"label": "Fitness Equipment", "keyword": "fitness equipment store"},
         {"label": "Supplement Stores", "keyword": "vitamin and supplements store"},
    ],
    "tech": [
        {"label": "Co-working Spaces", "keyword": "coworking space"},
        {"label": "Legal Services", "keyword": "corporate lawyer"},
        {"label": "Accounting", "keyword": "chartered accountant"},
    ]
}

def fetch_places_by_keyword(keyword: str, lat: float, lng: float, radius: int = 2000, limit: int = 5):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "key": GOOGLE_PLACES_API_KEY,
        "location": f"{lat},{lng}",
        "radius": radius,
        "keyword": keyword
    }
    try:
        resp = requests.get(url, params=params).json()
        results = resp.get("results", [])[:limit]
    except Exception as e:
        print(f"Error fetching keyword {keyword}: {e}")
        return []

    places = []
    for place in results:
        # Strict filter slightly here too if needed, but per request mainly on Talent
        places.append({
            "name": place.get("name"),
            "rating": place.get("rating"),
            "reviews": place.get("user_ratings_total", 0),
            "address": place.get("vicinity"),
            "lat": place["geometry"]["location"]["lat"],
            "lng": place["geometry"]["location"]["lng"],
            "mapUrl": f"https://www.google.com/maps/search/?api=1&query=place_id:{place.get('place_id')}"
        })
    return places

def build_nearby_talent(business_type: str, lat: float, lng: float):
    # Normalize key lookup
    key = business_type.lower()
    # Partial matching or default
    config = []
    for k, v in TALENT_MAPPING.items():
        if k in key:
            config = v
            break
    if not config:
        config = TALENT_MAPPING.get("cafe") # Default fallback

    categories = []
    for item in config:
        places = fetch_places_by_keyword(item["keyword"], lat, lng, radius=1000, limit=5) # 1000m radius strict
        
        # Strict Filtering: Rating >= 4.0
        filtered_places = [p for p in places if p["rating"] and p["rating"] >= 4.0]
        
        # Sort by rating
        filtered_places.sort(key=lambda x: x["rating"], reverse=True)
        
        # Limit to top 3
        final_places = filtered_places[:3]

        categories.append({
            "label": item["label"],
            "places": final_places
        })

    return {
        "categories": categories
    }

# --- 4. Investors / Funding Integration ---

FUNDING_MAPPING = {
    "cafe": [
        {
            "title": "Self-funding & Family Support",
            "body": "Most cafes in India start with personal savings or family loans. Keep initial scope small and test the location before heavy investment."
        },
        {
            "title": "Bank & MSME / Mudra Loans",
            "body": "You can explore MSME and Mudra loan schemes with local banks. Prepare a basic business plan and projected cash flows."
        }
    ],
    "coaching": [
        {
            "title": "Low-capital Bootstrapping",
            "body": "Coaching centres can start with rented classrooms or co-working spaces, keeping fixed costs low until student intake stabilises."
        },
        {
            "title": "Education-focused Incubators",
            "body": "If you plan to build a scalable EdTech product, incubators and accelerators are better than traditional VCs at the start."
        }
    ],
    "tech": [
        {
            "title": "Incubators & Accelerators",
            "body": "Join programs like T-Hub, NSRCEL, or YC for mentorship and seed funding."
        },
         {
            "title": "Angel Investors",
            "body": "Look for angel networks in your city. You need a MVP and some traction."
        }
    ]
}

def fetch_incubators(lat: float, lng: float, radius: int = 5000):
    incubators = fetch_places_by_keyword("startup incubator", lat, lng, radius, limit=5)
    cowork = fetch_places_by_keyword("coworking space", lat, lng, radius, limit=5)
    return incubators + cowork

def build_funding_guidance(business_type: str, lat: float, lng: float):
    # Normalize
    key = business_type.lower()
    paths = []
    for k, v in FUNDING_MAPPING.items():
        if k in key:
            paths = v
            break
    if not paths:
        paths = [
             {
                "title": "Small Business Loans",
                "body": "Contact your local bank for MSME or business loan options."
            },
            {
                "title": "Bootstrapping",
                "body": "Start small and reinvest profits to grow."
            }
        ]
        
    incubators = fetch_incubators(lat, lng)

    return {
        "paths": paths,
        "nearbyIncubators": incubators
    }

# --- 5. Space Insights ---

def build_space_insights(business_type: str, lat: float, lng: float, market_data: dict):
    # Reuse valid competitors if available or fetch new
    commercial = fetch_places_by_keyword("commercial complex", lat, lng, radius=1000, limit=5)
    coworking = fetch_places_by_keyword("coworking space", lat, lng, radius=2000, limit=5)
    
    # Determine Area Type
    comm_count = len(commercial)
    cowork_count = len(coworking)
    
    if comm_count >= 2 or cowork_count >= 2:
        area_type = "Commercial Hub"
        rent_level = "High"
    else:
        area_type = "Residential / Mixed"
        rent_level = "Medium"
        
    return {
        "areaType": area_type,
        "rentLevel": rent_level,
        "commercialComplexes": commercial,
        "coWorkingSpaces": coworking
    }

# --- Legacy Database Seeding (Preserved to avoid errors in routes.py imports) ---
def seed_database(db: Session):
    if db.query(models.BusinessCategory).first():
        return
    db.add(models.BusinessCategory(name="Cafe", typical_competitor_keywords="cafe"))
    db.add(models.BusinessCategory(name="Gym", typical_competitor_keywords="gym"))
    db.commit()

# --- Legacy Support for old Routes ---
def calculate_distance(lat1, lng1, lat2, lng2):
    import math
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) * math.sin(dlat / 2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlng / 2) * math.sin(dlng / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def is_skill_relevant(skill, category):
    return True
