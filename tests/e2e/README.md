# End-to-End Testing

> **Artifact status:** Draft — Awaiting Review  
> **Scope:** Web and mobile end-to-end test setup  
> **Review Gate:** Confirm app stacks, launch commands, app identifier, and test environments before adding runnable business-flow tests.

## Tool responsibilities

- **Playwright:** browser-based E2E tests for the ResMan web interface.
- **Maestro:** UI flows for the ResMan native/mobile app.

These tools cover different targets. Playwright mobile device emulation is browser testing, not a replacement for native mobile testing with Maestro.

## Current repository facts

At the time this scaffold was added, src/frontend/README.md and src/backend/README.md are placeholders and the repository has no app package manifest or mobile app identifier. Therefore this change configures the Playwright test runner but does not claim that the application is runnable or that E2E tests pass. Maestro flows are intentionally deferred until the real app ID and first screen are known.

## Review checklist

- [ ] Confirm web framework and the frontend start command.
- [ ] Confirm the local/staging URL and required environment variables.
- [ ] Confirm mobile framework, Android application ID, and/or iOS bundle ID.
- [ ] Confirm how a testable mobile build is produced.
- [ ] Add a smoke test only after the initial UI and stable selectors are available.
- [ ] Decide whether tests should run in CI and which secrets/environment values are needed.
- [ ] Review and approve this setup before treating it as project standard.
