# Deployment Guide

## Backend (Render)
1. Create a new Web Service on Render.
2. Connect your repository.
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `python run.py` (or `uvicorn app.main:app --host 0.0.0.0 --port 10000`)
5. Add Environment Variable: `OPENAI_API_KEY`.

## Frontend (Vercel)
1. Import project to Vercel.
2. Set **Framework Preset**: Vite.
3. Add Environment Variable: `VITE_GOOGLE_MAPS_API_KEY`.
4. Deploy.

## Environment Variables
Ensure these are set in your production environment:
- `OPENAI_API_KEY` (Backend)
- `VITE_GOOGLE_MAPS_API_KEY` (Frontend)
