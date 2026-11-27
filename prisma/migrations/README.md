# ResMan database migration runbook

## Source of truth
- Prisma schema: \`prisma/schema.prisma\`
- Migration files: \`prisma/migrations/\`
- Prisma 7 config: \`backend/prisma.config.ts\`
- Run all commands from \`backend/\`.

The repository contains versioned PostgreSQL migrations, including the initial ResMan schema and the one-open-session-per-table constraint. Do not treat this database as an empty schema and do not reset it as a routine troubleshooting step.

## Validate and generate

\`\`\`powershell
npm run prisma:validate
npm run prisma:generate
\`\`\`

## Apply existing migrations

For a local database:

\`\`\`powershell
npm run prisma:migrate:deploy
\`\`\`

Inspect migration state:

\`\`\`powershell
npx prisma migrate status --config ./prisma.config.ts
\`\`\`

For production/shared environments, review the SQL in Git before deploying. Never use \`prisma db push\` as a substitute for versioned migrations.

## Create a new migration

After updating \`../prisma/schema.prisma\`:

\`\`\`powershell
npx prisma migrate dev --create-only --name <descriptive_name> --config ./prisma.config.ts
\`\`\`

Review the generated SQL, especially destructive operations, indexes, CHECK constraints, and data backfills. Apply only after review:

\`\`\`powershell
npm run prisma:migrate
npm run prisma:generate
\`\`\`

## Business constraints to preserve

- At most one OPEN dining session per table (PostgreSQL partial unique index).
- Table states: \`AVAILABLE\`, \`OCCUPIED\`.
- Session states: \`OPEN\`, \`CLOSED\`; a closed session has \`closed_at\` and \`closed_by\`.
- Menu activation and availability are separate: \`is_active\` and \`availability_status\`.
- Order item states: \`AWAITING_ACCEPTANCE\`, \`ACCEPTED\`, \`IN_PREPARATION\`, \`COMPLETED\`, \`CANCELLED\`.
- Inventory movements: \`IN\`, \`OUT\`, \`ADJUSTMENT\`, \`WASTE\`; manual stock operations only.
- Payment amount is nonnegative; a zero-value payment is valid in the MVP.

Payment gate option B is enforced by the payment service transaction: no non-cancelled item may remain \`AWAITING_ACCEPTANCE\`; amount is calculated only from \`ACCEPTED\`, \`IN_PREPARATION\`, and \`COMPLETED\` items. Payment creation, session closure, and table release happen atomically.

Never delete menu items that may be referenced by order history; deactivate them instead.