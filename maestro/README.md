# Maestro — Mobile E2E

> **Status:** Initial scaffold — Awaiting Review

Maestro is the proposed UI automation tool for the ResMan mobile application. This repository does not yet identify the mobile framework, app identifier, or build artifact, so no runnable flow is included yet. Placeholder app IDs and guessed UI labels would produce misleading tests.

## Prerequisites to confirm

- Mobile framework and supported platform(s): Android, iOS, or both.
- Android application ID and/or iOS bundle ID.
- How to build and install a testable app on an emulator/simulator or device.
- Stable labels/test IDs for the initial screen and key controls.
- Test account and test-data strategy, without committing secrets.

## Proposed workflow

1. Install Maestro using its official installation instructions: https://docs.maestro.dev/getting-started/installing-maestro
2. Build and launch the ResMan app on a supported emulator/device.
3. Add a flow under maestro/flows/ using the confirmed app ID and actual UI labels.
4. Run the flow with `maestro test maestro/flows/<flow-file>.yaml`.
5. Review the result and add the flow to CI only after a stable mobile build pipeline exists.

## Candidate first flows (not implemented yet)

- Launch app and verify the initial screen.
- Customer opens the menu and begins an order.
- Kitchen staff views the preparation queue and updates a dish status.

These scenarios remain proposals until the app and acceptance criteria are available. Do not store credentials or production data in Maestro flows.
