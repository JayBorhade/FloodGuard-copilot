# Batch 6 Audit — Notifications & Emergency Assistance

## Implemented
- Added `GET /api/v1/emergency/guidance` with India's official ERSS emergency number 112, source attribution, and practical call guidance.
- Added an emergency support page with direct `tel:112` action, saved-coordinate sharing/copy, and browser notification permission flow.
- Added emergency support navigation and replaced the generic emergency contact placeholder with verified Government of India ERSS information.
- Tests verify the official number and explicitly assert that the service does not claim to dispatch responders.

## Delivery limits
- Browser notification permission is not server push. Firebase Cloud Messaging, SMS, email delivery, background delivery, and an emergency dispatch integration are not configured.
- Location sharing is a user-initiated device share/copy action; FloodGuard does not transmit coordinates to emergency services.
- Do not test-call emergency services.
