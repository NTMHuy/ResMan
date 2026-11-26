ALTER TABLE "table_devices"
ADD COLUMN "user_id" BIGINT;

CREATE UNIQUE INDEX "table_devices_user_id_key"
ON "table_devices"("user_id");

ALTER TABLE "table_devices"
ADD CONSTRAINT "table_devices_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
