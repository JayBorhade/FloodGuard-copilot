# Batch 2 — Validation Record

**Scope:** shared authentication state, explicit development demo sign-in, protected onboarding, local onboarding persistence, emergency contact CRUD, and location selection.

## Automated checks

| Check | Command / method | Result |
|---|---|---|
| Frontend TypeScript and production bundle | `cd frontend && npm run build` | Pending CI for this branch |
| Backend Python syntax | `cd backend && python -m compileall -q app` | Pending CI for this branch |
| Existing API smoke tests | `python -m pytest -q` | Pending CI for this branch |
| Anonymous session | `GET /api/v1/auth/session` without bearer token | Expected HTTP 200 with `authenticated=false` |
| Explicit demo session | Same endpoint with `Authorization: Bearer demo-token` in development | Expected authenticated demo user |
| Missing protected dependency credentials | Direct auth dependency test | Expected HTTP 401 |

## Manual review checklist

- [x] Authentication is explicit; anonymous sessions are not silently promoted to demo users.
- [x] Sign-in and sign-out share one application-wide auth state.
- [x] Onboarding routes require an authenticated session.
- [x] Personal details and emergency contacts are restored from browser storage.
- [x] Emergency contacts can be added and removed after onboarding without losing saved state.
- [x] Device location can be restored; manual coordinates are range-validated.
- [x] Demo-only and local-only behavior is disclosed in the UI and audit notes.
- [ ] Confirm final GitHub Actions jobs pass before marking Batch 2 validated.

## Out of scope

Firebase sign-up/password flows, password reset, Firestore persistence, server-side emergency-contact CRUD, email verification, and production identity-provider configuration are not claimed complete by this batch.
