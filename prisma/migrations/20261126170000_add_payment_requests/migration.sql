CREATE TABLE "payment_requests" (
    "id" BIGSERIAL NOT NULL,
    "dining_session_id" BIGINT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),
    CONSTRAINT "payment_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payment_requests_dining_session_id_key"
ON "payment_requests"("dining_session_id");

CREATE INDEX "payment_requests_status_requested_at_idx"
ON "payment_requests"("status", "requested_at");

ALTER TABLE "payment_requests"
ADD CONSTRAINT "payment_requests_dining_session_id_fkey"
FOREIGN KEY ("dining_session_id") REFERENCES "dining_sessions"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
