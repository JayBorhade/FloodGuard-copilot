# FloodGuard

FloodGuard is a flood-safety and emergency-assistance platform. It is currently in an incremental foundation and integration phase.

## Architecture

```text
External providers → backend adapters → normalized FastAPI schemas → React services/hooks → FloodGuard UI
```

The frontend must not call Nominatim, routing providers, weather providers, or government data sources directly. Provider-specific responses belong behind backend adapters and must be normalized before reaching React.

## Current structure

- `frontend/` — React, TypeScript, Vite, React Router, centralized CSS tokens
- `backend/` — FastAPI, Pydantic schemas, authentication boundary, versioned API routes

Current API foundation:

- `GET /api/v1/health`
- `GET /api/v1/status`
- `GET /api/v1/notifications`
- `GET /api/v1/auth/session`

The notifications endpoint is explicitly demo-labelled until a real notification store/provider is connected. Firebase authentication verification is enabled when the backend is configured for production.

## Local development

```bash
cd frontend
npm install
npm run build
npm run dev
```

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Use `frontend/.env.example` and `backend/.env.example` as configuration templates. Never commit real credentials.

## Safety and data rules

- Missing data is represented as unknown/unavailable, not safe.
- A route provider result is not automatically a safe route.
- Official alerts, community reports, derived risk, ML predictions, and system messages remain separate provenance categories.
- Demo data must remain clearly labelled and must never look like a live emergency warning.
- Firebase Admin credentials and provider secrets remain server-side.

## Known limitations

MapLibre, Firebase web authentication, Firestore, FCM, provider adapters, live alerts, weather/river feeds, routing hazard analysis, community reporting, and admin operations are not yet connected. Their UI/API boundaries should be implemented incrementally and validated before being presented as live functionality.
