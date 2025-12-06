# Starto - AI Startup Intelligence Platform

Starto is an AI-powered platform that helps founders analyze business feasibility in specific locations using real-world data and execution intelligence.

## Features
- **Feasibility Analysis**: AI-driven demand and competition scoring.
- **Execution Intelligence**: Nearby freelancers, available workspaces, and investor guidance content-aware to the business type.
- **Real-time Map**: Interactive map for location selection.

## data
This Project uses a SQLite database with mock data that is "seeded" to provide a realistic experience.

## Running the Project

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API Key (in `backend/.env`)

### 1. Backend
Navigate to the `backend` directory and run:
```bash
cd backend
# Create/Activate virtual environment if needed
# pip install -r requirements.txt
python run.py
```
The API will start at `http://localhost:8000`.

### 2. Frontend
Navigate to the `frontend` directory and run:
```bash
cd frontend
npm install
npm run dev
```
The App will start at `http://localhost:5173`.

### 3. Reset Data (Optional)
To reset the database with fresh random data:
```bash
cd backend
python run_seed.py
```
