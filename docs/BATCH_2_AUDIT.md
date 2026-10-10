# Batch 2 — Authentication & Onboarding Audit

**Branch:** `batch-2/auth-onboarding`  
**Parent:** `batch-1/stabilization-build-repair`

## Findings and implementation

1. **Implicit authentication was unsafe:** the development API previously returned a demo identity when no bearer token was supplied. The session endpoint now returns `authenticated=false` for anonymous requests. Development demo access requires the explicit `Bearer demo-token` credential; that token is not accepted as a production identity.
2. **Auth state was duplicated per hook instance:** replaced independent `useAuth` state with one `AuthProvider` shared by the application. Session restoration, loading/error state, and sign-out now update one source of truth.
3. **Sign-in flows:** added Firebase Web SDK configuration, email/password sign-in, account creation, profile display-name update, Firebase session observation, ID-token forwarding to the backend, and sign-out. Demo sign-in remains separately labelled for local development. Firebase email/password UI stays disabled until all required `VITE_FIREBASE_*` variables are configured.
4. **Route protection:** onboarding routes use the existing protected-route boundary. The sidebar displays the active session type and provides sign-in/sign-out controls.
5. **Onboarding continuity:** personal details are restored from saved state and prefilled from the authenticated profile when available. State updates merge rather than erase other fields; malformed stored state is rejected; emergency contacts persist on add/remove and are reused by the Emergency Contacts page.
6. **Per-user browser storage:** onboarding, emergency-contact, and location data are namespaced by the current Firebase UID or demo identity to reduce cross-account data leakage on a shared browser. Existing unscoped data is migrated only to the explicit demo scope.
7. **Location continuity and manual entry:** saved device location is restored. Users can request browser geolocation, manually enter latitude/longitude with range validation, or continue without location. Location is persisted before continuing.
8. **Automated checks:** backend smoke tests cover anonymous session behavior, explicit development demo authentication, and rejection of missing credentials by the protected auth dependency. Vitest/jsdom tests cover anonymous sessions, demo-token login and failure cleanup, onboarding persistence, malformed storage, and account scoping. CI runs frontend build + unit tests and backend API/auth tests for Batch 2 pushes.

## Important boundaries

- Demo identity is not production authentication.
- Real Firebase authentication requires Firebase Email/Password to be enabled and valid frontend `VITE_FIREBASE_*` settings plus backend `FIREBASE_PROJECT_ID`/Firebase verification configuration.
- Onboarding and emergency-contact details currently persist in browser local storage; they are not synced to a user database or available across devices.
- Location permission is optional. A missing location must never be interpreted as low flood risk.
- Official emergency directory entries remain placeholders until authoritative, current data is integrated.
