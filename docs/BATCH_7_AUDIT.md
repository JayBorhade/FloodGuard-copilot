# Batch 7 Audit — Community Reports & Route Safety

## Implemented
- SQLite-backed community report submission and retrieval, with bounded field lengths, coordinate validation, parameterized SQL, creation/expiry timestamps, pending-review status, and flagging.
- Community UI for submissions, report list, refresh, and flagging.
- Reports expire from the active list after 24 hours and remain explicitly unverified.
- Route-safety API accepts validated origin/destination coordinates but fails closed with `unknown`, no polyline, and no recommendation until a routing engine and verified hazard/road data are configured.
- Community reports never change the flood risk assessment or masquerade as official alerts.

## Operational limitations
- The SQLite database path is configurable with `DATABASE_PATH` (default `data/floodguard.sqlite3`). Use a persistent volume and single-writer plan or migrate to managed PostgreSQL before horizontal scaling.
- Before public deployment, add authenticated submissions or edge rate limiting, abuse monitoring, moderation staffing, retention/deletion policy, and privacy review.
- No image uploads, verified shelter dataset, road-closure feed, route engine, or automatic evacuation advice is connected.
