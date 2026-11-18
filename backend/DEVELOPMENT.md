# Backend development setup

## Requirements
- Node.js 24+
- npm 11+
- PostgreSQL 15+

## Install and validate

Run from the repository root:

\`\`\`powershell
cd backend
Copy-Item .env.example .env
\`\`\`

Configure \`DATABASE_URL\`, \`PORT\`, \`JWT_SECRET\`, and the \`INITIAL_ADMIN_*\` values in \`.env\`. Never commit this file.

\`\`\`powershell
npm install
npm run prisma:validate
npm run prisma:generate
npm run build
\`\`\`

The Prisma schema is \`../prisma/schema.prisma\`; Prisma 7 configuration and migrations are defined by \`prisma.config.ts\`.

## Run the API

\`\`\`powershell
npm run start:dev
\`\`\`

Base URL: \`http://localhost:3000/api/v1\`

Health check: \`GET /health\`

## API modules

| Module | Endpoints | Access |
|---|---|---|
| Auth | \`POST /auth/login\`, \`GET /auth/profile\` | Login public; profile JWT |
| Users | \`GET /users\`, \`POST /users\` | JWT + permissions |
| Tables | CRUD \`/tables\` | JWT + permissions |
| Sessions | \`POST /sessions\`, \`GET /sessions/table/:tableId/active\`, \`GET /sessions/:id\` | JWT + permissions |
| Guest menu | \`GET /menu\`, optional \`categoryId\` | Public |
| Menu management | \`GET /menu/management\`, \`POST /menu/categories\`, \`PATCH /menu/categories/:id\`, \`POST /menu/items\`, \`PATCH /menu/items/:id\`, \`DELETE /menu/items/:id\` | JWT + \`menu:manage\` |
| Guest orders | \`GET /guest/session\`, \`POST /guest/session/items\`, \`DELETE /guest/session/items/:itemId\` | \`X-Session-Code\` |
| Order staff | \`GET /orders/active\`, \`PATCH /orders/items/:itemId/note\`, \`DELETE /orders/items/:itemId\` | JWT + permissions |
| Kitchen | \`GET /kitchen/queue\`, \`PATCH /kitchen/items/:itemId/status\` | JWT + permissions |
| Payments | \`GET /payments/sessions/:sessionId/summary\`, \`POST /payments/sessions/:sessionId/confirm\` | JWT + permissions |
| Inventory | \`/inventory/ingredients\`, \`/inventory/movements\`, \`/inventory/counts\` | JWT + permissions |
| Reports | \`/reports/overview\`, \`/reports/revenue\`, \`/reports/best-sellers\`, \`/reports/orders\`, \`/reports/inventory\` | JWT + \`reports:read\` |

Menu category and item records are soft-deactivated, not physically deleted. This preserves historical order references. Menu activation (\`isActive\`) is separate from manual availability (\`availabilityStatus\`). Guest menu reads show only active categories and active, available items. Stock is not automatically deducted when an order is created.

Guest session codes are bearer secrets. Send them only through the \`X-Session-Code\` header; never put them in URLs or logs. CORS allows this header for browser clients.

## Seed roles and first manager

\`\`\`powershell
npm run db:seed
\`\`\`

The seed is idempotent and synchronizes roles, permissions, and the initial manager account from \`INITIAL_ADMIN_*\`. Run it after deploying code that introduces new permissions, such as \`menu:manage\`.

## Database migrations

Migrations are versioned under \`../prisma/migrations\`.

\`\`\`powershell
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate:deploy
\`\`\`

Use \`npx prisma migrate status --config ./prisma.config.ts\` to inspect migration state. Do not use \`prisma db push\` as a replacement for migrations.

## Implementation status

Core API modules are implemented for employee authentication/permissions, users, tables, dining sessions, guest ordering, order staff, kitchen workflow, payment/session closure, manual inventory, reports, and menu management. Automated API/integration coverage and full frontend integration remain to be completed and verified.