from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Freelancer(Base):
    __tablename__ = "freelancers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    skill = Column(String)
    rating = Column(Float)
    distance_km = Column(Float)
    location_lat = Column(Float)
    location_lng = Column(Float)
    contact = Column(String)

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    rent = Column(String)
    area_sqft = Column(Integer)
    location_lat = Column(Float)
    location_lng = Column(Float)
    contact = Column(String)

class BusinessCategory(Base):
    __tablename__ = "business_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    typical_competitor_keywords = Column(String)
