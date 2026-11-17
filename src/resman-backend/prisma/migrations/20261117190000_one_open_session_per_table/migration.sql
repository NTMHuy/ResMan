-- A table may have at most one active dining session.
CREATE UNIQUE INDEX "uq_dining_sessions_one_open_per_table"
ON "dining_sessions" ("table_id")
WHERE "status" = 'OPEN';
