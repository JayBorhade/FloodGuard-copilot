# Deployment & Security Checklist

## Local container preview
1. Copy `.env.example` to `.env` and review values.
2. Run `docker compose up --build`.
3. Open `http://localhost:8080`; Nginx proxies API requests to the private backend.
4. Check `/api/v1/health` and review service logs.

## Required before production
- Terminate HTTPS at a trusted proxy/load balancer; keep backend private. Configure HSTS at the TLS edge.
- Set exact `ALLOWED_ORIGINS` and `ALLOWED_HOSTS` JSON arrays. Never use wildcard CORS with credentials.
- Configure Firebase identity settings and secrets through a secret manager; never commit service-account files.
- Configure `DATABASE_PATH` on persistent backed-up storage. SQLite is only for single-writer/small deployments; use managed PostgreSQL and migrations for multi-instance production.
- Add edge rate limiting, WAF/bot controls, abuse monitoring and moderation before public anonymous report submissions.
- Define privacy notice, location consent, retention/deletion workflow and incident response.
- Validate an approved IMD endpoint, credentials, payload schema, source timestamps and failure behavior. Empty/unavailable data is not a no-alert state.
- Configure monitoring, backups, restore drills and dependency/security scanning. Avoid logging tokens or unnecessary precise coordinates.
- Test geolocation and browser notification permissions on HTTPS/localhost.
- Review map tile provider terms/attribution and traffic limits before public use.

## Current limitations
No live CWC river gauge is configured; IMD alerts are unavailable by default; no server-push/SMS/email or automatic emergency dispatch is connected; route safety remains unknown without a routing engine and verified hazard feeds; community reports are unverified; flood risk remains unknown without sufficient trusted evidence.

## Controls included
Configurable trusted-host allowlist, security response headers, provider timeouts, allowlisted IMD host, bounded request fields, parameterized SQLite queries, non-root backend container, and health checks.
