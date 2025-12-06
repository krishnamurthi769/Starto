from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict
from . import database, models, services

router = APIRouter()

class AnalyzeRequest(BaseModel):
    lat: float
    lng: float
    category: str
    location_name: str = "Unknown Location"
    context: Optional[str] = None

class InsightResponse(BaseModel):
    demand_score: int
    competition_score: int
    risk_level: str
    market_saturation: str
    competitor_density: str
    ai_insight: str
    competitors: List[dict] = []
    market_trends: List[dict] = []
    breakdown: List[dict]
    risk_factors: List[str]
    # Execution Intelligence Layer
    relevant_freelancers: List[dict] = []
    relevant_workspaces: List[dict] = []
    investor_guidance: Dict[str, str] = {}

@router.post("/analyze", response_model=InsightResponse)
def analyze_location(request: AnalyzeRequest, db: Session = Depends(database.get_db)):
    # 1. Calculate Scores
    data = services.calculate_demand(request.lat, request.lng, request.category)
    
    # 2. Get AI Insight (Structured)
    ai_data = services.generate_ai_insight(data, request.location_name, request.category, request.context)
    
    # 3. Execution Intelligence Layer (Filtering)
    # Fetch all and filter in python for MVP (Dataset is small ~50 items)
    all_freelancers = db.query(models.Freelancer).all()
    all_workspaces = db.query(models.Workspace).all()
    
    relevant_freelancers = [
        {
            "id": f.id, "name": f.name, "skill": f.skill, "rating": f.rating, 
            "distance_km": f.distance_km, "contact": f.contact
        }
        for f in all_freelancers 
        if services.is_skill_relevant(f.skill, request.category)
    ]
    # Simple distance sort/filter could go here, but random distance in seed is fine for now
    relevant_freelancers = sorted(relevant_freelancers, key=lambda x: x['distance_km'])[:5]

    relevant_workspaces = [
        {
            "id": w.id, "name": w.name, "type": w.type, "rent": w.rent, 
            "area_sqft": w.area_sqft, "contact": w.contact
        }
        for w in all_workspaces
        if services.is_space_relevant(w.type, request.category)
    ]
    relevant_workspaces = relevant_workspaces[:5]

    investor_info = services.get_investor_guidance(request.category)

    return {
        **data,
        "ai_insight": ai_data.get("insight", "No insight available."),
        "competitors": ai_data.get("competitors", []),
        "market_trends": ai_data.get("market_trends", []),
        "relevant_freelancers": relevant_freelancers,
        "relevant_workspaces": relevant_workspaces,
        "investor_guidance": investor_info
    }

@router.get("/freelancers")
def get_freelancers(
    lat: Optional[float] = None, 
    lng: Optional[float] = None, 
    radius_km: int = 25, # Default to demo-safe 25km
    category: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    all_freelancers = db.query(models.Freelancer).all()
    
    if lat is None or lng is None:
        return {"freelancers": all_freelancers[:10], "is_fallback": False}

    filtered_results = []
    for f in all_freelancers:
        dist = services.calculate_distance(lat, lng, f.location_lat, f.location_lng)
        if dist <= radius_km:
            if category and not services.is_skill_relevant(f.skill, category):
                continue
            f.distance_km = round(dist, 1)
            filtered_results.append(f)
            
    if filtered_results:
        return {"freelancers": sorted(filtered_results, key=lambda x: x.distance_km), "is_fallback": False}
    
    # Fallback Logic: Return closest 3 ignoring skill/radius strictness (safe demo)
    fallback_results = []
    for f in all_freelancers:
         dist = services.calculate_distance(lat, lng, f.location_lat, f.location_lng)
         f.distance_km = round(dist, 1)
         fallback_results.append(f)
    
    # Sort by distance and take top 3
    fallback_results.sort(key=lambda x: x.distance_km)
    return {"freelancers": fallback_results[:3], "is_fallback": True}

@router.get("/workspaces")
def get_workspaces(db: Session = Depends(database.get_db)):
    return db.query(models.Workspace).all()

@router.get("/categories")
def get_categories(db: Session = Depends(database.get_db)):
    return db.query(models.BusinessCategory).all()

@router.post("/seed")
def seed_data(db: Session = Depends(database.get_db)):
    services.seed_database(db)
    return {"message": "Database seeded successfully"}

@router.get("/live-flights")
def get_live_flights(lat: float, lng: float, radius_km: int = 50):
    import requests
    
    # 1 degree lat ~= 111km. 50km radius ~= 0.45 degrees.
    # Bounding box calculation
    deg_radius = radius_km / 111.0
    lamin = lat - deg_radius
    lamax = lat + deg_radius
    lomin = lng - deg_radius
    lomax = lng + deg_radius
    
    try:
        # OpenSky Free API (Anonymous)
        # Limitations: 10s resolution, restricted bandwidth.
        # Ideally use authenticated account for production.
        url = "https://opensky-network.org/api/states/all"
        params = {
            "lamin": lamin,
            "lomin": lomin,
            "lamax": lamax,
            "lomax": lomax
        }
        
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        flights = []
        if data["states"]:
            for s in data["states"]:
                # State vector index mapping: 
                # 0: icao24, 1: callsign, 2: origin_country, 5: longitude, 6: latitude, 
                # 9: velocity (m/s), 10: true_track (heading), 13: geo_altitude
                flights.append({
                    "id": s[0],
                    "callsign": s[1].strip(),
                    "origin_country": s[2],
                    "lng": s[5],
                    "lat": s[6],
                    "velocity": s[9],
                    "heading": s[10]
                })
        
        return {"flights": flights}

    except Exception as e:
        print(f"OpenSky API Error: {e}")
        return {"flights": [], "error": str(e)}
