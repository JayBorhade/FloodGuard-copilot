# Batch 2 — Validation Record

**Validated code commit:** `ce7f90f0bfbc927dca10460c365eb24165b0e7d4`  
**CI run:** [Batch 2 build and API validation](https://github.com/JayBorhade/FloodGuard-copilot/actions/runs/38023470835)

## Automated checks

| Check | Command / method | Result |
|---|---|---|
| Frontend TypeScript and production bundle | `cd frontend && npm run build` (`tsc -b && vite build`) | **Passed** |
| Backend Python syntax | `cd backend && python -m compileall -q app` | **Passed** |
| Backend API/auth tests | `python -m pytest -q` | **6 passed** |
| Anonymous session | `GET /api/v1/auth/session` without bearer token | **Passed** — `authenticated=false` |
| Explicit development demo session | Same endpoint with `Authorization: Bearer demo-token` | **Passed** — authenticated demo user |
| Missing protected dependency credentials | Auth dependency test | **Passed** — HTTP 401 |

## Manual review checklist

- [x] Authentication is explicit; anonymous sessions are not silently promoted to demo users.
- [x] Firebase email/password sign-in and account creation are implemented behind configuration checks.
- [x] Sign-in, session restore, and sign-out share one application-wide auth state.
- [x] Onboarding routes require an authenticated session.
- [x] Personal details and emergency contacts are restored from browser storage.
- [x] Emergency contacts can be added and removed after onboarding without losing saved state.
- [x] Onboarding and location storage are namespaced by the active account/demo identity.
- [x] Device location can be restored; manual coordinates are range-validated.
- [x] Demo-only and local-only behavior is disclosed in the UI and audit notes.

## Configuration still required for live Firebase sign-in

The repository contains only an example environment file. Before real email/password sign-in can work, configure the Firebase Web values in a local `frontend/.env`, enable Email/Password in Firebase Authentication, and configure the backend's Firebase project ID. Do not commit actual environment files or service-account credentials.

## Known limitations

- This batch does not add Firestore persistence or server-side emergency-contact CRUD.
- Firebase email/password sign-in was compile/build validated, but cannot be live-authentication tested without a configured Firebase project and valid credentials.
- CI reports one upstream Starlette deprecation warning concerning the httpx test client; tests still pass.
- Official emergency numbers remain unverified placeholders.
