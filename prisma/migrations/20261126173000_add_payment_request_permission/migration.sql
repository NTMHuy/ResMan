INSERT INTO "permissions" ("code", "name", "module")
VALUES ('payments:request', 'Yêu cầu thanh toán', 'payments')
ON CONFLICT ("code") DO UPDATE
SET "name" = EXCLUDED."name", "module" = EXCLUDED."module";

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT role_record."id", permission_record."id"
FROM "roles" AS role_record
CROSS JOIN "permissions" AS permission_record
WHERE role_record."code" IN ('CUSTOMER', 'MANAGER')
  AND permission_record."code" = 'payments:request'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
