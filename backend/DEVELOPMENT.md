# Backend development setup

## Requirements

- Node.js 24 or later
- npm 11 or later
- PostgreSQL 15 or later

## Install

Run from the repository root:

```powershell
cd backend
Copy-Item .env.example .env
```

Edit `backend/.env` with the local PostgreSQL connection and required secrets. Do not commit `.env`.

Install and prepare the backend:

```powershell
npm install
npm run prisma:validate
npm run prisma:generate
npm run build
```

The Prisma schema is stored at `../prisma/schema.prisma`; Prisma 7 configuration and migration path are defined in `prisma.config.ts`. Generated Prisma Client files are placed in `src/generated/prisma` and ignored by Git.

## Run the API

```powershell
npm run start:dev
```

The global API prefix is `/api/v1`.

Health check:

```http
GET http://localhost:3000/api/v1/health
```

Expected response:

```json
{"status":"ok","service":"resman-backend"}
```

## Implemented API modules

| Module | Current endpoints | Access |
|---|---|---|
| Auth | `POST /auth/login`, `GET /auth/profile` | Login public; profile JWT |
| Users | `GET /users`, `POST /users` | JWT + permissions |
| Tables | CRUD `/tables` | JWT + permissions |
| Sessions | `POST /sessions`, `GET /sessions/table/:tableId/active`, `GET /sessions/:id` | JWT + permissions |
| Order Staff | `GET /orders/active`, `PATCH /orders/items/:itemId/note`, `DELETE /orders/items/:itemId` | JWT + permissions |
| Kitchen | `GET /kitchen/queue`, `PATCH /kitchen/items/:itemId/status` | JWT + permissions |
| Payments | `GET /payments/sessions/:sessionId/summary`, `POST /payments/sessions/:sessionId/confirm` | JWT + permissions |
| Inventory | `GET /inventory/ingredients`, `POST /inventory/ingredients`, `PATCH /inventory/ingredients/:ingredientId`, `POST /inventory/ingredients/:ingredientId/stock-in`, `POST /inventory/ingredients/:ingredientId/count`, `GET /inventory/movements`, `GET /inventory/counts` | JWT + permissions |
| Reports | `GET /reports/overview`, `GET /reports/revenue`, `GET /reports/best-sellers`, `GET /reports/orders`, `GET /reports/inventory` | JWT + `reports:read` |
| Menu | `GET /menu` | Public guest menu |
| Guest Orders | `GET /guest/session`, `POST /guest/session/items`, `DELETE /guest/session/items/:itemId` | `X-Session-Code` header |

Opening a session creates its order and marks the table occupied in one database transaction. The generated 256-bit random `sessionCode` is a bearer capability for guest access to that active session. Guest endpoints require it in the `X-Session-Code` request header (never in the URL); treat it as a secret and do not expose it in logs or public listings. Guest calls create new order-item rows with price/name snapshots and initial status history. Guests can cancel only items still in `AWAITING_ACCEPTANCE`.

Menu reads expose only active categories and active, available items. The server rechecks menu availability and session state when accepting a guest order; client-supplied prices and totals are never accepted.

## Database migrations

The versioned migrations live in `../prisma/migrations`. Check status and apply migrations using:

```powershell
npx prisma migrate status
npx prisma migrate deploy
```

For local development migration authoring, follow `../prisma/migrations/README.md`. Do not use `prisma db push` as a substitute for versioned migrations.

## Current implementation boundary

Implemented foundations: PostgreSQL/Prisma service, JWT employee authentication, permission guard, employee account management, table management, opening/reading dining sessions, public menu reading, guest order-item creation/cancellation, Order Staff item operations, kitchen queue/status workflow, payment confirmation with atomic session closure, manual inventory management with stock-in and physical counts, and management reports for revenue, sales, orders, and inventory.

Inventory balances are changed only by explicit stock-in and physical-count operations. Order creation does not deduct ingredients automatically. Count adjustments are recorded as stock movements; all stock changes retain the acting employee and timestamp.

Still to implement: manager menu CRUD and automated API/integration tests. Do not infer that a module is complete merely because its Prisma models exist.
