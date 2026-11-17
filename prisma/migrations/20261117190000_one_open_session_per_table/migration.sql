-- A table must never have more than one active dining session.
-- The first guest order will create the session; subsequent orders reuse it.
CREATE UNIQUE INDEX "uq_dining_sessions_one_open_per_table"
ON "dining_sessions" ("table_id")
WHERE "status" = 'OPEN';
