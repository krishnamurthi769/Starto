from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from . import database, models, services

router = APIRouter()

class AnalyzeRequest(BaseModel):
    businessType: str
    lat: float
    lng: float
    city: str
    area: str
    # Optional context for future extensibility if needed, though not in user's strict request
    context: Optional[str] = None 

@router.post("/analyze")
def analyze(req: AnalyzeRequest):
    # 1. Market landscape (competitors + demand + risk)
    market = services.build_market_landscape(
        req.businessType, req.city, req.area, req.lat, req.lng
    )

    # 2. Nearby talent / services
    talent = services.build_nearby_talent(req.businessType, req.lat, req.lng)

    # 3. Space insights
    space = services.build_space_insights(req.businessType, req.lat, req.lng, market)

    # 4. Funding guidance
    funding = services.build_funding_guidance(req.businessType, req.lat, req.lng)

    data = {
        "marketLandscape": market,
        "nearbyTalent": talent,
        "spaceInsights": space,
        "fundingGuidance": funding
    }

    # Disable caching for real-time feel
    return JSONResponse(
        content=data,
        headers={"Cache-Control": "no-store"}
    )

# --- Legacy / Auxiliary Endpoints ---

@router.get("/freelancers")
def get_freelancers(
    lat: Optional[float] = None, 
    lng: Optional[float] = None, 
    radius_km: int = 25, 
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
    
    # Fallback
    fallback_results = []
    for f in all_freelancers:
         dist = services.calculate_distance(lat, lng, f.location_lat, f.location_lng)
         f.distance_km = round(dist, 1)
         fallback_results.append(f)
    
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
    return {"flights": []}
