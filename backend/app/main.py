from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database, routes

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Starto API", description="AI-Powered Startup Intelligence")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174", 
        "https://starto-1.onrender.com", 
        "https://starto.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Starto API"}
