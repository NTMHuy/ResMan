# ResMan database migration runbook

Branch: `member/minhhuy`  
Schema source: `prisma/schema.prisma`

## Current status

The Prisma data model is prepared, including the confirmed payment gate (option B) and `AuditLog`. No migration has been generated or applied yet. The backend workspace uses Prisma ORM 7. The datasource URL is configured in `backend/prisma.config.ts`; create `backend/.env` from `.env.example` before running validation or migration commands.

## Prisma ORM 7 setup

Run commands from `backend/`. Prisma 7 keeps the datasource provider in `schema.prisma` and reads the connection URL from `backend/prisma.config.ts`. The generated client is written to `backend/src/generated/prisma/` and is ignored by Git.

```powershell
Copy-Item .env.example .env
npm install
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
```

Do not create a migration until `prisma validate` succeeds and a disposable PostgreSQL database is available.

## Generate the initial migration

Run from the repository root after the backend workspace and Prisma CLI are initialized:

```powershell
npm run prisma:format
npm run prisma:validate
npm run prisma:migrate:create
```

Review the generated file under `prisma/migrations/<timestamp>_init_resman/migration.sql`. Append the PostgreSQL constraints below to that generated initial migration before applying it. Do not create a second migration containing the same constraints.

## PostgreSQL constraints to append to the generated initial migration

```sql
-- One open dining session per table.
CREATE UNIQUE INDEX "uq_one_open_session_per_table"
  ON "dining_sessions" ("table_id")
  WHERE "status" = 'OPEN';

-- Enumerated states and non-negative/positive values.
ALTER TABLE "dining_tables"
  ADD CONSTRAINT "ck_dining_tables_status"
  CHECK ("status" IN ('AVAILABLE', 'OCCUPIED'));

ALTER TABLE "dining_sessions"
  ADD CONSTRAINT "ck_dining_sessions_status"
  CHECK ("status" IN ('OPEN', 'CLOSED')),
  ADD CONSTRAINT "ck_dining_sessions_closed_fields"
  CHECK (
    ("status" = 'OPEN' AND "closed_at" IS NULL AND "closed_by" IS NULL)
    OR
    ("status" = 'CLOSED' AND "closed_at" IS NOT NULL)
  );

ALTER TABLE "menu_items"
  ADD CONSTRAINT "ck_menu_items_availability"
  CHECK ("availability_status" IN ('AVAILABLE', 'MANUAL_UNAVAILABLE')),
  ADD CONSTRAINT "ck_menu_items_price_nonnegative"
  CHECK ("price" >= 0);

ALTER TABLE "order_items"
  ADD CONSTRAINT "ck_order_items_status"
  CHECK ("status" IN (
    'AWAITING_ACCEPTANCE', 'ACCEPTED', 'IN_PREPARATION',
    'COMPLETED', 'CANCELLED'
  )),
  ADD CONSTRAINT "ck_order_items_quantity_positive"
  CHECK ("quantity" > 0),
  ADD CONSTRAINT "ck_order_items_prices_nonnegative"
  CHECK ("unit_price" >= 0 AND "line_total" >= 0),
  ADD CONSTRAINT "ck_order_items_line_total"
  CHECK ("line_total" = "unit_price" * "quantity");

ALTER TABLE "order_item_status_history"
  ADD CONSTRAINT "ck_order_item_history_to_status"
  CHECK ("to_status" IN (
    'AWAITING_ACCEPTANCE', 'ACCEPTED', 'IN_PREPARATION',
    'COMPLETED', 'CANCELLED'
  )),
  ADD CONSTRAINT "ck_order_item_history_from_status"
  CHECK (
    "from_status" IS NULL OR "from_status" IN (
      'AWAITING_ACCEPTANCE', 'ACCEPTED', 'IN_PREPARATION',
      'COMPLETED', 'CANCELLED'
    )
  );

ALTER TABLE "inventory_balances"
  ADD CONSTRAINT "ck_inventory_balances_nonnegative"
  CHECK ("quantity_on_hand" >= 0);

ALTER TABLE "ingredients"
  ADD CONSTRAINT "ck_ingredients_threshold_nonnegative"
  CHECK ("low_stock_threshold" IS NULL OR "low_stock_threshold" >= 0);

ALTER TABLE "stock_movements"
  ADD CONSTRAINT "ck_stock_movements_type"
  CHECK ("movement_type" IN ('IN', 'OUT', 'ADJUSTMENT', 'WASTE')),
  ADD CONSTRAINT "ck_stock_movements_delta"
  CHECK (
    ("movement_type" = 'IN' AND "quantity_delta" > 0)
    OR ("movement_type" IN ('OUT', 'WASTE') AND "quantity_delta" < 0)
    OR ("movement_type" = 'ADJUSTMENT' AND "quantity_delta" <> 0)
  );

ALTER TABLE "inventory_count_records"
  ADD CONSTRAINT "ck_inventory_count_actual_nonnegative"
  CHECK ("actual_quantity" >= 0);

ALTER TABLE "payments"
  ADD CONSTRAINT "ck_payments_amount_nonnegative"
  CHECK ("amount" >= 0),
  ADD CONSTRAINT "ck_payments_status_paid"
  CHECK ("status" = 'PAID');
```

## Payment gate — option B

The gate is cross-table business logic and must be enforced in the payment-confirmation transaction, not by a row CHECK constraint:

- Lock the order/session for the confirmation operation.
- Check that no item belonging to the order has status `AWAITING_ACCEPTANCE`.
- Permit items in `ACCEPTED`, `IN_PREPARATION`, `COMPLETED`, and `CANCELLED`.
- Calculate amount only from `ACCEPTED`, `IN_PREPARATION`, and `COMPLETED`, using stored unit-price snapshots and quantities.
- Create the single payment, close the session, and set the table to `AVAILABLE` in the same database transaction.
- A unique `payments.order_id` plus transaction/locking protects against duplicate confirmations.

## Validate and apply

After reviewing the generated SQL:

```powershell
npm run prisma:migrate
npm run prisma:generate
```

For a shared/production database, deploy reviewed migrations with `npm run prisma:migrate:deploy`; never use `prisma db push` as a substitute for versioned migrations.

## Important implementation notes

- The partial unique index and CHECK constraints are PostgreSQL-specific additions not represented by the Prisma schema.
- The database cannot enforce the payment gate with a normal CHECK constraint because it depends on rows in `order_items`; enforce it inside one transaction.
- Keep `order_item_status_history`, `stock_movements`, and `audit_logs` as separate records with distinct purposes.
- Before first application, review whether the team wants to store the order total snapshot on `payments` (current design stores the confirmed amount only) and whether zero-value payments are valid in the MVP.
- Do not apply this initial migration to a database that already contains ResMan tables without first inspecting and reconciling that database.
