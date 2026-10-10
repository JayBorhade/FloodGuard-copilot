# Batch 1 — Validation Record

This record separates repository changes from checks that have actually executed.

## Automated checks

| Check | Command / method | Expected evidence | Result |
|---|---|---|---|
| Frontend TypeScript and production bundle | `cd frontend && npm run build` | TypeScript and Vite both exit successfully | Pending GitHub Actions run |
| Backend Python syntax | `cd backend && python -m compileall -q app` | No syntax errors | Pending GitHub Actions run |
| Health route | pytest smoke test | `GET /api/v1/health` returns HTTP 200 and `status=ok` | Pending GitHub Actions run |
| Status route | pytest smoke test | `GET /api/v1/status` returns HTTP 200 | Pending GitHub Actions run |
| Notifications route | pytest smoke test | `GET /api/v1/notifications` returns HTTP 200 and response schema fields | Pending GitHub Actions run |
| Development auth session | pytest smoke test | `GET /api/v1/auth/session` returns HTTP 200 and an explicitly demo user | Pending GitHub Actions run |

## Manual review performed

- Corrected invalid route JSX expressions in `frontend/src/App.tsx`.
- Confirmed the MapLibre import exists in source and added its package dependency.
- Confirmed `backend/app/main.py` registers the health, notifications, and auth routers.
- Confirmed the flood-risk endpoint is not part of the registered API baseline and has not been represented as working by this batch.

## Completion gate

Batch 1 is not considered validated until the frontend build and backend smoke-test jobs finish successfully in GitHub Actions. If either job fails, fix the root cause and rerun the checks before marking this batch complete.
