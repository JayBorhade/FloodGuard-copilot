# Batch 7 Validation

Automated tests cover report creation/persistence, validation of coordinates/descriptions, and the fail-closed route-safety response.

Manual checks:
- Submit and refresh a community report against a persistent database volume.
- Confirm reports show pending review/unverified state and expire from the active list after 24 hours.
- Flag a report and verify the flag count persists.
- Confirm the route panel never displays a route/polyline when providers are absent.
- Test with malformed inputs and verify no report changes the risk engine.
