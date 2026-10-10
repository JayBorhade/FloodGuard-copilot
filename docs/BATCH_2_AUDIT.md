# Batch 2 — Authentication & Onboarding Audit

**Branch:** `batch-2/auth-onboarding`  
**Parent:** `batch-1/stabilization-build-repair`

## Findings and implementation

1. **Implicit authentication was unsafe:** the development API previously returned a demo identity when no bearer token was supplied. The session endpoint now returns `authenticated=false` for anonymous requests. Development demo access requires the explicit `Bearer demo-token` credential; the token is not accepted as a production identity.
2. **Auth state was duplicated per hook instance:** replaced independent `useAuth` state with one `AuthProvider` shared by the application. Session restoration, explicit demo sign-in, loading/error state, and sign-out now update a single source of truth.
3. **Demo sign-in was navigation-only:** the button now establishes and verifies the explicit demo session before navigating. Session tokens are cleared on sign-out and when a sign-in attempt fails.
4. **Route protection:** onboarding routes use the existing protected-route boundary. The sidebar displays the current session type and provides sign-in/sign-out.
5. **Onboarding continuity:** personal details are restored from saved state; state updates merge instead of erasing other onboarding fields; stored state is validated when parsed; emergency contacts persist on add/remove and are reused by the Emergency Contacts page.
6. **Location continuity and manual entry:** previously saved device location is restored. Users can request browser geolocation, manually enter latitude/longitude with range validation, or continue without location. Location is persisted before continuing.
7. **Automated checks:** backend smoke tests now cover anonymous session behavior, explicit development demo authentication, and rejection of missing credentials by the protected auth dependency. CI runs for Batch 2 pushes.

## Important boundaries

- Demo identity is not production authentication.
- Firebase verification still requires a configured project ID and a real Firebase ID token.
- Onboarding and emergency-contact details currently persist in the browser's local storage; they are not synced to a user database.
- Location permission is optional. A missing location must never be interpreted as low flood risk.
- Official emergency directory entries remain placeholders until authoritative, current data is integrated.
