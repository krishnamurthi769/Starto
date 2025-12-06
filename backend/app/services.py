import os
import random
import math
from sqlalchemy.orm import Session
from . import models
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

def seed_database(db: Session):
    if db.query(models.BusinessCategory).first():
        return

    # Categories
    categories = [
        {"name": "Cafe", "keywords": "coffee, starbucks, bakery"},
        {"name": "Gym", "keywords": "fitness, gym, workout"},
        {"name": "Coworking", "keywords": "wework, office, shared space"},
        {"name": "Restaurant", "keywords": "food, dining, restaurant"},
        {"name": "Tech Startup", "keywords": "software, tech, it services"},
        {"name": "Studio", "keywords": "design, agency, creative"},
    ]
    for cat in categories:
        db.add(models.BusinessCategory(name=cat["name"], typical_competitor_keywords=cat["keywords"]))
    
    # Freelancers (Real-world mapping)
    freelancer_profiles = [
        {"skill": "Menu Designer", "category_fit": ["Cafe", "Restaurant"]},
        {"skill": "Food Photographer", "category_fit": ["Cafe", "Restaurant"]},
        {"skill": "Social Media Marketer", "category_fit": ["Cafe", "Restaurant", "Gym", "Studio"]},
        {"skill": "Interior Designer", "category_fit": ["Cafe", "Restaurant", "Coworking", "Studio"]},
        {"skill": "Frontend Developer", "category_fit": ["Tech Startup", "Studio"]},
        {"skill": "Backend Developer", "category_fit": ["Tech Startup"]},
        {"skill": "UI/UX Designer", "category_fit": ["Tech Startup", "Studio"]},
        {"skill": "Fitness Trainer", "category_fit": ["Gym"]},
        {"skill": "Digital Marketer", "category_fit": ["Tech Startup", "Coworking"]},
        {"skill": "Copywriter", "category_fit": ["Tech Startup", "Studio", "Coworking"]},
    ]

    for i in range(30): # Generate more for density
        profile = random.choice(freelancer_profiles)
        db.add(models.Freelancer(
            name=f"Freelancer {i+1}",
            skill=profile["skill"],
            rating=round(random.uniform(4.0, 5.0), 1), # Good ratings for demo
            distance_km=round(random.uniform(0.5, 8.0), 1),
            location_lat=random.uniform(-0.05, 0.05),
            location_lng=random.uniform(-0.05, 0.05),
            contact=f"contact{i}@example.com"
        ))

    # Workspaces (Real-world mapping)
    workspace_types = [
        {"type": "Shop Front", "category_fit": ["Cafe", "Restaurant", "Gym", "Studio"]},
        {"type": "Retail Unit", "category_fit": ["Cafe", "Restaurant"]},
        {"type": "Large Hall", "category_fit": ["Gym"]},
        {"type": "Private Office", "category_fit": ["Tech Startup", "Coworking", "Studio"]},
        {"type": "Coworking Desk", "category_fit": ["Tech Startup", "Coworking"]},
        {"type": "Creative Studio", "category_fit": ["Studio"]},
    ]

    for i in range(20):
        space = random.choice(workspace_types)
        db.add(models.Workspace(
            name=f"Space {i+1}",
            type=space["type"],
            rent=f"${random.randint(500, 3000)}/mo",
            area_sqft=random.randint(200, 2000),
            location_lat=random.uniform(-0.05, 0.05),
            location_lng=random.uniform(-0.05, 0.05),
            contact=f"space{i}@example.com"
        ))
    
    
    # Specific Seeding: Aman Sharma (Brand Designer) at 12.9716, 77.5946 (Bangalore Demo)
    if not db.query(models.Freelancer).filter_by(name="Aman Sharma").first():
        db.add(models.Freelancer(
            name="Aman Sharma",
            skill="Brand Designer",
            rating=4.7,
            distance_km=0.0,
            location_lat=12.9716,
            location_lng=77.5946,
            contact="aman@example.com"
        ))
        
    # Seed a few more around the demo location (Bangalore)
    demo_freelancers = [
        {"name": "Sneha Gupta", "skill": "Social Media Marketer", "lat": 12.9750, "lng": 77.6000},
        {"name": "Rohan Mehta", "skill": "Web Developer", "lat": 12.9680, "lng": 77.5900},
        {"name": "Karthik R", "skill": "Interior Designer", "lat": 12.9800, "lng": 77.5850}
    ]
    
    for df in demo_freelancers:
        if not db.query(models.Freelancer).filter_by(name=df["name"]).first():
             db.add(models.Freelancer(
                name=df["name"],
                skill=df["skill"],
                rating=round(random.uniform(4.5, 4.9), 1),
                distance_km=0.0,
                location_lat=df["lat"],
                location_lng=df["lng"],
                contact=f"{df['name'].lower().replace(' ', '')}@example.com"
            ))

    db.commit()

def calculate_distance(lat1, lng1, lat2, lng2):
    # Haversine formula
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) * math.sin(dlat / 2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlng / 2) * math.sin(dlng / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

CATEGORY_WEIGHTS = {
    "Cafe": {"competition": 0.6, "demand": 0.4},
    "Gym": {"competition": 0.5, "demand": 0.5},
    "Coworking": {"competition": 0.3, "demand": 0.7},
    "Restaurant": {"competition": 0.7, "demand": 0.3},
    "Tech Startup": {"competition": 0.2, "demand": 0.8},
}

def calculate_demand(lat: float, lng: float, category: str):
    # Mock Logic: Deterministic based on coords to seem real
    random.seed(f"{lat}{lng}{category}")
    
    # Base scores
    raw_demand = random.randint(40, 95)
    raw_competition = random.randint(20, 90)
    
    # Apply Category Weights
    weights = CATEGORY_WEIGHTS.get(category, {"competition": 0.5, "demand": 0.5})
    
    weighted_demand = raw_demand * weights["demand"] * 2 # Scale back to ~100
    weighted_competition = raw_competition * weights["competition"] * 2
    
    # Normalize
    final_demand = min(100, int(weighted_demand))
    final_competition = min(100, int(weighted_competition))
    
    # Risk Logic
    risk_level = "Low"
    risk_factors = []
    
    if final_competition > 75:
        risk_level = "High"
        risk_factors.append("High Market Saturation")
    elif final_competition > 50:
        risk_level = "Medium"
        risk_factors.append("Moderate Competition")
        
    if final_demand < 40:
        risk_level = "High" if risk_level == "Medium" else risk_level
        risk_factors.append("Low Local Demand")
        
    if not risk_factors:
        risk_factors.append("Stable Market Conditions")

    # Explainability Breakdown
    breakdown = [
        {"label": "Competitor Density", "value": f"-{int(final_competition * 0.3)}%", "color": "text-red-500"},
        {"label": "Area Activity", "value": f"+{int(final_demand * 0.4)}%", "color": "text-green-500"},
        {"label": "Category Fit", "value": "High", "color": "text-blue-500"}
    ]
        
    return {
        "demand_score": final_demand,
        "competition_score": final_competition,
        "risk_level": risk_level,
        "market_saturation": f"{int(final_competition)}%",
        "competitor_density": "High" if final_competition > 70 else "Moderate" if final_competition > 40 else "Low",
        "breakdown": breakdown,
        "risk_factors": risk_factors
    }

def get_investor_guidance(category: str):
    guidance_map = {
        "Cafe": {"type": "Self-funded / MSME loan", "advice": "Focus on cash flow and local grants."},
        "Restaurant": {"type": "Self-funded / Bank Loan", "advice": "High initial capex. Look for partners."},
        "Tech Startup": {"type": "Angel Investor / VC", "advice": "Scalability is key. Pitch to accelerators."},
        "Coworking": {"type": "Local Partner / Real Estate Backing", "advice": "Asset-heavy. Partner with landlords."},
        "Gym": {"type": "Small Business Loan / Franchise", "advice": "Equipment leasing is a good option."},
        "Studio": {"type": "Bootstrapped", "advice": "Client-funded growth is best."},
    }
    return guidance_map.get(category, {"type": "General Business Loan", "advice": "Maintain healthy credit."})

# Mapping helper
def is_skill_relevant(skill, category):
    # Demo-Friendly Permissive Logic
    allowed_skills = {
        "Cafe": ["Menu Designer", "Food Photographer", "Interior Designer", "Social Media Marketer", "General Designer", "Marketing"],
        "Restaurant": ["Menu Designer", "Food Photographer", "Interior Designer", "Social Media Marketer", "General Designer", "Marketing"],
        "Tech Startup": ["Frontend Developer", "Backend Developer", "UI/UX Designer", "Digital Marketer", "Copywriter", "Web Developer", "Brand Designer", "General Designer"],
        "Coworking": ["Digital Marketer", "Interior Designer", "Copywriter", "General Designer"],
        "Gym": ["Fitness Trainer", "Social Media Marketer", "General Designer", "Marketing"],
        "Studio": ["Frontend Developer", "UI/UX Designer", "Interior Designer", "Social Media Marketer", "Brand Designer", "General Designer"],
    }
    
    # Check strict match first
    relevant_list = allowed_skills.get(category, [])
    if skill in relevant_list:
        return True
        
    # Check reliable general fallbacks if strictly needed (though the list above covers most)
    if skill in ["General Designer", "Marketing", "Social Media Marketer"]:
        return True
        
    return False

def is_space_relevant(space_type, category):
    space_map = {
        "Cafe": ["Shop Front", "Retail Unit"],
        "Restaurant": ["Shop Front", "Retail Unit"],
        "Tech Startup": ["Private Office", "Coworking Desk"],
        "Coworking": ["Private Office", "Coworking Desk"],
        "Gym": ["Large Hall", "Shop Front"],
        "Studio": ["Creative Studio", "Private Office"],
    }
    return space_type in space_map.get(category, [])

def generate_ai_insight(data: dict, location_name: str, category: str, context: str = None):
    if not client:
        return {
            "insight": "AI Insights unavailable (Missing API Key). Please configure OPENAI_API_KEY in .env.",
            "competitors": [],
            "market_trends": []
        }

    context_str = f"Context: {context}" if context else ""

    prompt = f"""
    Perform a professional Feasibility & Risk Assessment for a {category} business at coordinates {location_name}.
    {context_str}
    
    Data: 
    - Demand Score: {data['demand_score']}/100
    - Competition Intensity: {data['competition_score']}/100
    - Risk Level: {data['risk_level']}
    
    Provide a response in strictly valid JSON format with the following structure:
    {{
        "insight": "Strategic advice for the founder based on the feasibility assessment...",
        "competitors": [
            {{"name": "Competitor A", "market_share": 30, "strength": "High"}},
            {{"name": "Competitor B", "market_share": 20, "strength": "Medium"}}
        ],
        "market_trends": [
            {{"month": "Jan", "demand": 60}},
            {{"month": "Feb", "demand": 65}},
            {{"month": "Mar", "demand": 80}}
        ]
    }}
    Do not include markdown formatting like ```json. Just the raw JSON string.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a startup consultant. Output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )
        content = response.choices[0].message.content.strip()
        # Clean potential markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
            
        import json
        return json.loads(content)
    except Exception as e:
        print(f"AI Error: {e}")
        return {
            "insight": "Could not generate detailed insights at this time.",
            "competitors": [],
            "market_trends": []
        }
