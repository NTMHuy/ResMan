# Playwright — Web E2E

> **Status:** Initial scaffold — Awaiting Review

## Prerequisites

- Node.js and npm installed.
- ResMan frontend running at the configured URL.
- A stable test environment with any required seed data.

## Setup

From the repository root:

```bash
npm install
npx playwright install chromium
```

Set the frontend URL if it is not the default:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e:web
```

Other commands:

```bash
npm run test:e2e:web:ui
npm run test:e2e:web:report
```

The frontend start command is deliberately not configured in Playwright webServer because the actual frontend framework and start script have not yet been confirmed.

## Initial test candidates (not implemented yet)

1. Customer can view the menu.
2. Order staff can open and process an incoming order.
3. Kitchen staff can see the queue and update preparation status.
4. Inventory staff can view and update stock.
5. Manager can access operational reports.

These are candidate scenarios based on the project scope, not approved acceptance criteria for automation. Add tests after the app UI and test data are available.
