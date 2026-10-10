# Batch 5 Validation

Automated CI is triggered for Batch 5–8 branches by the shared GitHub Actions workflow.

Checks include frontend TypeScript/production build and unit tests, backend compilation, and pytest API/provider tests.

New tests:
- Weather provider normalization and provider timeout handling.
- Official alert endpoint absent/configured-host guard/normalized response.
- Existing risk and map-layer safety tests continue to run.

Manual production checks still required:
- Confirm Open-Meteo API availability and applicable terms for the deployment.
- Obtain and configure a documented IMD API endpoint and credentials where required.
- Validate the actual IMD response schema and source timestamps against the original official bulletin.
- Never equate an empty/unavailable feed with “no active alerts” or “safe”.
