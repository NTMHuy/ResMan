ALTER TABLE "inventory_count_records"
ADD COLUMN "count_type" VARCHAR(20) NOT NULL DEFAULT 'GENERAL';

ALTER TABLE "inventory_count_records"
ADD CONSTRAINT "inventory_count_records_count_type_check"
CHECK ("count_type" IN ('OPENING', 'CLOSING', 'GENERAL'));
