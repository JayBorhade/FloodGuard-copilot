# Batch 1 — Stabilization & Build Repair Audit

**Branch:** `batch-1/stabilization-build-repair`  
**Scope:** repair baseline build blockers, audit route wiring/dependencies, add repeatable CI validation, and document verified boundaries.

## Findings and changes

1. **Frontend route syntax:** `frontend/src/App.tsx` used invalid `element=(...)` syntax on several routes. These route elements now use valid JSX expressions.
2. **Route boundary:** the admin placeholder is now wrapped in the existing `ProtectedRoute`. It remains a placeholder and does not imply admin operations have been implemented.
3. **Map dependency:** `MapLibreMap.tsx` dynamically imports `maplibre-gl`, but the dependency was absent from `frontend/package.json`. The package is now declared.
4. **Backend route registration:** the current FastAPI application registers the health, notifications, and auth routers under the configured API prefix. No flood-risk router is registered in this batch; that is a later feature batch, not a build-repair change.
5. **Configuration:** the backend reads its environment configuration through Pydantic Settings. `backend/.env.example` and `frontend/.env.example` remain templates; real credentials must not be committed.
6. **Validation automation:** a GitHub Actions workflow now runs the frontend TypeScript/production build and backend smoke tests on the Batch 1 branch and pull requests to `main`.

## Intentionally not implemented in Batch 1

- Live flood-risk API, live weather/river data, and official alert providers.
- Map hazard layers or safe-route computation.
- Firebase web sign-in, persistent notification storage, FCM, or production deployment.
- Any claim that the heuristic flood-risk function is a validated forecast.

Those remain separate workstreams and must retain clear unavailable/demo states until real integrations are verified.
