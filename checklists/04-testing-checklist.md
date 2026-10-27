# Testing Checklist

> **Artifact status:** Draft — Awaiting Review  
> **Purpose:** Proposed testing readiness checklist for ResMan.

## Repository and tooling

- [ ] Review and approve the Playwright configuration for web E2E tests.
- [ ] Confirm the Node.js version and install dependencies with npm.
- [ ] Confirm the frontend start command and PLAYWRIGHT_BASE_URL.
- [ ] Confirm mobile framework, app ID/bundle ID, and test-build procedure for Maestro.
- [ ] Confirm whether CI should execute web tests, mobile tests, or both.
- [ ] Ensure reports, screenshots, traces, and build artifacts do not expose secrets or personal data.

## Web E2E — Playwright

- [ ] Customer menu view.
- [ ] Customer order creation.
- [ ] Customer order-status tracking.
- [ ] Order staff receives and manages an order.
- [ ] Kitchen queue and preparation status.
- [ ] Inventory view, stock update, and low-stock state.
- [ ] Manager overview and operational reports.
- [ ] Verify negative paths and role-based access where acceptance criteria define them.

## Mobile E2E — Maestro

- [ ] App launches on the supported emulator/device.
- [ ] Initial screen is verified using an actual UI label or stable identifier.
- [ ] Critical customer flow is covered if customer ordering is available in mobile.
- [ ] Critical staff flow is covered only if staff functionality is available in mobile.
- [ ] Test data and test accounts are isolated from production.

## Review Gate

- [ ] Human reviewer confirms platform scope and the test scenarios.
- [ ] Human reviewer confirms app commands, environment variables, and test data.
- [ ] Tests have been run against a real build; results are recorded accurately.
- [ ] No artifact is marked Approved until an authorized human explicitly approves it.

## Known limitations

The repository currently contains placeholders for the frontend/backend and does not yet identify a mobile app ID. Consequently, the items above are readiness checks and candidate scenarios, not evidence that tests currently pass.
