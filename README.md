# FloodGuard

FloodGuard is a flood-awareness and emergency-preparedness web application. See `docs/DEPLOYMENT_SECURITY.md` for deployment requirements and limitations.

## Local development
Backend: `cd backend && python -m pip install -r requirements.txt && uvicorn app.main:app --reload`

Frontend: `cd frontend && npm install && npm run dev`

## Container preview
Copy `.env.example` to `.env`, then run `docker compose up --build`. Open `http://localhost:8080`. The backend database is stored in the `floodguard_data` volume.

## Safety and data status
- Open-Meteo provides weather context, not flood clearance.
- IMD alerts require an explicitly configured and validated API endpoint.
- Flood risk stays unknown without sufficient trusted hydrological and official-alert evidence.
- Community reports are unverified and do not change the risk engine.
- Route safety remains unknown until a verified routing engine and hazard/road feeds are available.
- Emergency support links to India's ERSS number 112; the app does not dispatch responders or automatically send coordinates.
