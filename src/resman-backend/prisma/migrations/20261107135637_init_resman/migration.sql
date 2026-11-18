/*
  Warnings:

  - You are about to drop the column `token_hash` on the `dining_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `kitchen_station_id` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `kitchen_station_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `terminal_reason` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `confirmed_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `confirmed_by` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `dining_table_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `dispatched_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guest_count` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `kitchen_station_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_type` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `rejection_reason` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `last_seen_at` on the `table_devices` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `table_devices` table. All the data in the column will be lost.
  - You are about to drop the column `token_hash` on the `table_devices` table. All the data in the column will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `daily_inventory_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kitchen_stations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kitchen_tickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu_item_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_status_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shortage_reports` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dining_session_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Made the column `dining_session_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `table_devices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "daily_inventory_records" DROP CONSTRAINT "daily_inventory_records_closing_checked_by_fkey";

-- DropForeignKey
ALTER TABLE "daily_inventory_records" DROP CONSTRAINT "daily_inventory_records_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "daily_inventory_records" DROP CONSTRAINT "daily_inventory_records_opening_checked_by_fkey";

-- DropForeignKey
ALTER TABLE "dining_sessions" DROP CONSTRAINT "dining_sessions_closed_by_fkey";

-- DropForeignKey
ALTER TABLE "dining_sessions" DROP CONSTRAINT "dining_sessions_opened_by_fkey";

-- DropForeignKey
ALTER TABLE "dining_sessions" DROP CONSTRAINT "dining_sessions_table_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_user_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_balances" DROP CONSTRAINT "inventory_balances_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "kitchen_tickets" DROP CONSTRAINT "kitchen_tickets_order_station_fk";

-- DropForeignKey
ALTER TABLE "menu_item_ingredients" DROP CONSTRAINT "menu_item_ingredients_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "menu_item_ingredients" DROP CONSTRAINT "menu_item_ingredients_menu_item_id_fkey";

-- DropForeignKey
ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_category_id_fkey";

-- DropForeignKey
ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_kitchen_station_id_fkey";

-- DropForeignKey
ALTER TABLE "order_item_status_history" DROP CONSTRAINT "order_item_status_history_actor_id_fkey";

-- DropForeignKey
ALTER TABLE "order_item_status_history" DROP CONSTRAINT "order_item_status_history_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_menu_station_fk";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_station_fk";

-- DropForeignKey
ALTER TABLE "order_status_history" DROP CONSTRAINT "order_status_history_actor_id_fkey";

-- DropForeignKey
ALTER TABLE "order_status_history" DROP CONSTRAINT "order_status_history_order_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_confirmed_by_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_created_by_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_dining_session_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_dining_table_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_kitchen_station_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_recorded_by_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_id_fkey";

-- DropForeignKey
ALTER TABLE "shortage_reports" DROP CONSTRAINT "shortage_reports_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "shortage_reports" DROP CONSTRAINT "shortage_reports_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "shortage_reports" DROP CONSTRAINT "shortage_reports_reported_by_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_created_by_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "table_devices" DROP CONSTRAINT "table_devices_dining_table_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- DropIndex
ALTER TABLE "menu_items"
DROP CONSTRAINT IF EXISTS "menu_items_id_station_uq";

-- DropIndex
-- DropIndex / DropConstraint

-- Remove legacy unique constraint.
ALTER TABLE "menu_items"
DROP CONSTRAINT IF EXISTS "menu_items_id_station_uq";

-- Remove legacy indexes.
DROP INDEX IF EXISTS "menu_items_station_idx";
DROP INDEX IF EXISTS "orders_customer_created_idx";

-- Remove legacy unique constraint.
ALTER TABLE "orders"
DROP CONSTRAINT IF EXISTS "orders_id_station_uq";

-- Remove legacy indexes.
DROP INDEX IF EXISTS "orders_status_created_idx";
DROP INDEX IF EXISTS "orders_table_created_idx";
DROP INDEX IF EXISTS "table_devices_table_status_idx";

-- AlterTable
ALTER TABLE "dining_sessions" DROP COLUMN "token_hash";

-- AlterTable
ALTER TABLE "dining_tables" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "category" VARCHAR(80),
ADD COLUMN     "note" TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "inventory_balances" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "menu_categories" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "menu_items" DROP COLUMN "kitchen_station_id",
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "kitchen_station_id",
DROP COLUMN "terminal_reason",
ALTER COLUMN "status" SET DEFAULT 'AWAITING_ACCEPTANCE',
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "confirmed_at",
DROP COLUMN "confirmed_by",
DROP COLUMN "created_by",
DROP COLUMN "customer_id",
DROP COLUMN "dining_table_id",
DROP COLUMN "dispatched_at",
DROP COLUMN "guest_count",
DROP COLUMN "kitchen_station_id",
DROP COLUMN "order_type",
DROP COLUMN "rejection_reason",
DROP COLUMN "status",
ALTER COLUMN "dining_session_id" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "payment_method" DROP NOT NULL;

-- AlterTable
ALTER TABLE "table_devices" DROP COLUMN "last_seen_at",
DROP COLUMN "status",
DROP COLUMN "token_hash",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropTable
DROP TABLE "customers";

-- DropTable
DROP TABLE "daily_inventory_records";

-- DropTable
DROP TABLE "kitchen_stations";

-- DropTable
DROP TABLE "kitchen_tickets";

-- DropTable
DROP TABLE "menu_item_ingredients";

-- DropTable
DROP TABLE "order_status_history";

-- DropTable
DROP TABLE "shortage_reports";

-- CreateTable
CREATE TABLE "inventory_count_records" (
    "id" BIGSERIAL NOT NULL,
    "ingredient_id" BIGINT NOT NULL,
    "actual_quantity" DECIMAL(14,3) NOT NULL,
    "counted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "counted_by" BIGINT NOT NULL,
    "note" TEXT,

    CONSTRAINT "inventory_count_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "actor_id" BIGINT,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(80) NOT NULL,
    "entity_id" VARCHAR(100) NOT NULL,
    "metadata" JSONB,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_count_records_ingredient_id_counted_at_idx" ON "inventory_count_records"("ingredient_id", "counted_at" DESC);

-- CreateIndex
CREATE INDEX "inventory_count_records_counted_at_idx" ON "inventory_count_records"("counted_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_occurred_at_idx" ON "audit_logs"("entity_type", "entity_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_occurred_at_idx" ON "audit_logs"("actor_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "menu_items_is_active_category_id_idx" ON "menu_items"("is_active", "category_id");

-- CreateIndex
CREATE INDEX "order_items_status_created_at_idx" ON "order_items"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "orders_dining_session_id_key" ON "orders"("dining_session_id");

-- CreateIndex
CREATE INDEX "table_devices_dining_table_id_is_active_idx" ON "table_devices"("dining_table_id", "is_active");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "menu_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dining_sessions" ADD CONSTRAINT "dining_sessions_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "dining_tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dining_sessions" ADD CONSTRAINT "dining_sessions_opened_by_fkey" FOREIGN KEY ("opened_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dining_sessions" ADD CONSTRAINT "dining_sessions_closed_by_fkey" FOREIGN KEY ("closed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_devices" ADD CONSTRAINT "table_devices_dining_table_id_fkey" FOREIGN KEY ("dining_table_id") REFERENCES "dining_tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_dining_session_id_fkey" FOREIGN KEY ("dining_session_id") REFERENCES "dining_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_status_history" ADD CONSTRAINT "order_item_status_history_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_status_history" ADD CONSTRAINT "order_item_status_history_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_count_records" ADD CONSTRAINT "inventory_count_records_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_count_records" ADD CONSTRAINT "inventory_count_records_counted_by_fkey" FOREIGN KEY ("counted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "dining_sessions_table_status_idx" RENAME TO "dining_sessions_table_id_status_idx";

-- RenameIndex
ALTER INDEX "menu_items_availability_category_idx" RENAME TO "menu_items_availability_status_category_id_idx";

-- RenameIndex
ALTER INDEX "order_item_status_history_item_changed_idx" RENAME TO "order_item_status_history_order_item_id_changed_at_idx";

-- RenameIndex
ALTER INDEX "order_items_order_status_idx" RENAME TO "order_items_order_id_status_idx";

-- RenameIndex
ALTER INDEX "stock_movements_ingredient_created_idx" RENAME TO "stock_movements_ingredient_id_created_at_idx";

-- RenameIndex
ALTER INDEX "users_email_uq" RENAME TO "users_email_key";

-- Remove legacy checks that conflict with the confirmed MVP rules.
ALTER TABLE "order_items"
  DROP CONSTRAINT IF EXISTS "order_items_status_check";

ALTER TABLE "payments"
  DROP CONSTRAINT IF EXISTS "payments_amount_check";

-- Dining table states.
ALTER TABLE "dining_tables"
  ADD CONSTRAINT "ck_dining_tables_status"
  CHECK ("status" IN ('AVAILABLE', 'OCCUPIED'));

-- Dining session states and closure consistency.
ALTER TABLE "dining_sessions"
  ADD CONSTRAINT "ck_dining_sessions_status"
  CHECK ("status" IN ('OPEN', 'CLOSED')),
  ADD CONSTRAINT "ck_dining_sessions_closed_fields"
  CHECK (
    (
      "status" = 'OPEN'
      AND "closed_at" IS NULL
      AND "closed_by" IS NULL
    )
    OR
    (
      "status" = 'CLOSED'
      AND "closed_at" IS NOT NULL
      AND "closed_by" IS NOT NULL
    )
  );

-- Menu item availability and price.
ALTER TABLE "menu_items"
  ADD CONSTRAINT "ck_menu_items_availability"
  CHECK ("availability_status" IN ('AVAILABLE', 'MANUAL_UNAVAILABLE')),
  ADD CONSTRAINT "ck_menu_items_price_nonnegative"
  CHECK ("price" >= 0);

-- Order item states and monetary values.
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

-- Order item status history.
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

-- Inventory constraints.
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

-- Payment: zero-value payment is valid in the MVP.
ALTER TABLE "payments"
  ADD CONSTRAINT "ck_payments_amount_nonnegative"
  CHECK ("amount" >= 0),
  ADD CONSTRAINT "ck_payments_status_paid"
  CHECK ("status" = 'PAID');