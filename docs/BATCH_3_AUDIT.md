# Batch 3 Audit — Dashboard and Flood-Risk Engine

## Scope
- Expose a validated location-aware `GET /api/v1/flood/risk` endpoint.
- Connect the dashboard to the risk endpoint using the saved device location.
- Surface loading, missing-location, unavailable-data, source, confidence, and freshness states.
- Keep emergency contacts and notifications available.

## Findings
- A frontend flood-risk service already expected `/api/v1/flood/risk`, but the backend router was not registered.
- The dashboard previously displayed a static demo card and did not request an assessment.
- No trusted live rainfall, river gauge, or official flood-alert provider is configured in this repository.
- The prior backend calculator could assign a safe level when it received no evidence. That behavior is unsafe for a flood-safety product.

## Safety decision
The endpoint returns `unknown`, confidence 0, and `data_available=false` until trusted inputs are connected. Missing data is never treated as a low or safe risk level. Coordinates are validated but are not yet used to retrieve external data.

## Out of scope
Live weather/river providers, official alert ingestion, interactive map layers, route safety, notifications delivery, and predictive ML are not claimed as implemented.
