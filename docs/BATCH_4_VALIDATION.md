# Batch 4 Validation

## Automated checks
The Batch 4 workflow runs the frontend TypeScript/production build and unit tests, plus backend compilation and API tests.

Expected API behavior:
- `GET /api/v1/map/layers` returns normalized layer metadata.
- Until verified providers are configured, `data_available=false` and all hazard-layer entries have `available=false` and `source=null`.
- Frontend build verifies MapLibre imports and map component typing.

## Manual browser checks still required
- Confirm OpenFreeMap tiles load from the target deployment and comply with the provider's usage terms.
- Test geolocation success, denied permission, timeout, and unavailable-device cases.
- Verify map interactions on desktop and narrow mobile viewports.
- Connect verified provider data before enabling any hazard layer.
