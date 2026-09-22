# FloodGuard

FloodGuard is a flood-safety, monitoring, awareness, and emergency-assistance platform designed to help users understand local flood conditions and take safer action quickly.

This repository is currently in the foundation phase. It establishes the technical structure needed before the UI/UX implementation begins.

## Current foundation

- React + Vite frontend scaffold
- FastAPI backend scaffold
- Shared typed API contract examples
- Design tokens and responsive base theme
- Routing shell with placeholder public/user/admin screens
- Environment examples for frontend and backend
- mock/demo-aware data conventions

## Structure

- `frontend/` — React app
- `backend/` — FastAPI app

## Notes

- The frontend should consume normalized FloodGuard API responses rather than provider-specific JSON.
- The backend is the integration boundary for weather, routing, geocoding, government sources, Firebase, and ML/risk logic.
- The UI should treat mock data as demo data and clearly label it as non-live.

## Start locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The default frontend dev server runs on `http://localhost:5173`.
The default backend runs on `http://localhost:8000`.
