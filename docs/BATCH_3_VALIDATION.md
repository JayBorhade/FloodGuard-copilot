# Batch 3 Validation

## Automated checks
The Batch 3 workflow runs:
- Frontend TypeScript/production build.
- Frontend unit tests.
- Backend Python compilation.
- Backend API tests, including risk endpoint unknown-state behavior and invalid/missing coordinate rejection.

## Expected safety behavior
- Valid coordinates return HTTP 200 with `level=unknown`, `confidence=0`, and `data_available=false` while no trusted provider is configured.
- Out-of-range or missing coordinates return HTTP 422.
- The frontend renders unknown/unavailable status instead of implying the area is safe.
- API failures are represented as unavailable and stale/unknown rather than a risk score.

## Manual follow-up still required
- Connect a trusted, documented rainfall/river/official-alert data provider.
- Verify source attribution, update cadence, stale thresholds, and failure modes against provider responses.
- Test browser location permissions and responsive dashboard behavior in a real browser.
