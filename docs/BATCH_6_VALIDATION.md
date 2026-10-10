# Batch 6 Validation

CI runs the frontend TypeScript/production build and unit tests, backend compile check, and pytest suite.

Manual checks:
- Test the `tel:112` link on a device without placing a test call.
- Verify Web Notifications permission denied/granted paths in supported browsers.
- Verify the share sheet and clipboard fallback on secure origins.
- Confirm no user coordinates are transmitted automatically.
