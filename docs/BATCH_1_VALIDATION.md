# Batch 1 — Validation Record

**Validated code commit:** `86e8f5d315501d6381cb8858951e96480dde9366`  
**CI run:** [Batch 1 Stabilization](https://github.com/JayBorhade/FloodGuard-copilot/actions/runs/38022644540)

## Automated checks

| Check | Command / method | Result |
|---|---|---|
| Frontend TypeScript and production bundle | `cd frontend && npm run build` (`tsc -b && vite build`) | **Passed** on the validated code commit |
| Backend Python syntax | `cd backend && python -m compileall -q app` | **Passed** |
| Health route | pytest smoke test | **Passed** — HTTP 200 and `status=ok` |
| Status route | pytest smoke test | **Passed** — HTTP 200 and expected status |
| Notifications route | pytest smoke test | **Passed** — HTTP 200 and response schema fields |
| Development auth session | pytest smoke test | **Passed** — HTTP 200 and explicitly demo-labelled user |
| Backend test suite | `python -m pytest -q` | **4 passed** |

## Fixes made after the first CI attempt

The first frontend build identified three additional TypeScript blockers after the route JSX was repaired: a MapLibre ref type mismatch, nullable onboarding state being spread into required state, and a comparison against a location state (`requested`) that does not exist. All were corrected, and the subsequent CI run passed both jobs.

## Warnings

The backend smoke tests passed with one upstream Starlette deprecation warning about using `httpx` with `starlette.testclient`. It did not affect the test result and should be revisited when updating the test stack.

## Completion gate

The frontend production build and backend smoke-test jobs both passed for the validated code commit. The workflow also runs for subsequent pushes and pull requests to `main`. This batch validates the current foundation only; it does not claim live flood data, flood-risk endpoint availability, map hazard layers, or production integrations.
