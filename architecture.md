# Starto - System Architecture

## Overview
Starto is a full-stack AI-powered platform designed to help founders validate business ideas. It combines location-based data analysis with OpenAI's generative capabilities to provide actionable insights.

## Architecture Diagram

```mermaid
graph TD
    User[User] -->|Browser| Frontend[Frontend (React + Vite)]
    
    subgraph "Frontend Layer"
        Frontend -->|Visuals| Tailwind[TailwindCSS]
        Frontend -->|Charts| Recharts[Recharts]
        Frontend -->|Maps| GMap[Google Maps API]
    end
    
    Frontend -->|HTTP/JSON| Backend[Backend (FastAPI)]
    
    subgraph "Backend Layer"
        Backend -->|API Routes| Routes[FastAPI Routes]
        Routes -->|Logic| Services[Business Logic Services]
        Services -->|AI| OpenAI[OpenAI API (GPT-4o-mini)]
        Services -->|Data| DB[(SQLite Database)]
    end
    
    subgraph "Data Sources"
        DB -->|Retrieve| MockData[Mock Datasets]
        MockData --> Freelancers
        MockData --> Workspaces
        MockData --> Categories
    end
```

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: TailwindCSS
- **Visualization**: Recharts / Chart.js
- **Maps**: Google Maps JavaScript API
- **State Management**: React Hooks (Context/State)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (Simple, file-based for MVP)
- **AI Integration**: OpenAI Python SDK
- **Environment**: Python 3.9+

## Data Flow
1. **User Input**: User selects a location (Lat/Lng) and a Business Category on the Frontend.
2. **Analysis Request**: Frontend sends coordinates and category to Backend `/analyze`.
3. **Data Processing**: 
   - Backend calculates Demand Score and Competition Score based on mock algorithms (distance to competitors, population density proxies).
   - Backend queries SQLite for nearby Freelancers and Workspaces.
4. **AI Insight Generation**:
   - Backend constructs a prompt with the calculated scores and location context.
   - Sends prompt to OpenAI API.
   - Receives natural language insight.
5. **Response**: Backend aggregates data (Scores, Graphs, Freelancers, Workspaces, AI Insight) and sends JSON to Frontend.
6. **Visualization**: Frontend renders the Dashboard with Maps, Charts, and the AI Insight text.

## Database Schema

### 1. Freelancers
- `id`: Integer, PK
- `name`: String
- `skill`: String (Designer, Developer, etc.)
- `rating`: Float
- `distance_km`: Float
- `location_lat`: Float
- `location_lng`: Float
- `contact`: String

### 2. Workspaces
- `id`: Integer, PK
- `name`: String
- `type`: String (Coworking, Office, etc.)
- `rent`: String
- `area_sqft`: Integer
- `location_lat`: Float
- `location_lng`: Float
- `contact`: String

### 3. Business Categories
- `id`: Integer, PK
- `name`: String
- `typical_competitor_keywords`: String
