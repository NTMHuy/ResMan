CREATE TYPE "MenuPricingType" AS ENUM ('FIXED', 'PER_UNIT', 'MARKET_PRICE', 'UNSET');

ALTER TABLE "menu_items"
  ALTER COLUMN "price" DROP NOT NULL,
  ADD COLUMN "pricing_type" "MenuPricingType" NOT NULL DEFAULT 'FIXED',
  ADD COLUMN "price_unit" VARCHAR(30);

CREATE INDEX "menu_items_pricing_type_category_id_idx"
  ON "menu_items"("pricing_type", "category_id");

ALTER TABLE "menu_items"
  ADD CONSTRAINT "menu_items_pricing_consistency_check"
  CHECK (
    ("pricing_type" IN ('FIXED', 'PER_UNIT') AND "price" IS NOT NULL)
    OR ("pricing_type" IN ('MARKET_PRICE', 'UNSET') AND "price" IS NULL)
  );

ALTER TABLE "menu_items"
  ADD CONSTRAINT "menu_items_per_unit_requires_unit_check"
  CHECK ("pricing_type" <> 'PER_UNIT' OR "price_unit" IS NOT NULL);
