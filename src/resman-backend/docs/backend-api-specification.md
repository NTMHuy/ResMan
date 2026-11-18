# ResMan — Backend API Specification

> Trạng thái: Đề xuất API contract để review, chưa phải API đã triển khai.
> Base path: /api/v1
> Phạm vi: MVP một nhà hàng, guest ordering qua tablet, một hàng đợi bếp chung.
> Nguồn nghiệp vụ ưu tiên: docs/11-confirmed-business-rules.md.

## 1. Quy ước chung

### 1.1 Version và dữ liệu
- Base URL local: http://localhost:<port>/api/v1.
- JSON UTF-8, camelCase.
- Timestamp ISO-8601 UTC; frontend hiển thị Asia/Ho_Chi_Minh.
- BigInt ID trả dạng string.
- Decimal trả dạng string, ví dụ "85000.00".
- Không trả password hash, JWT secret hoặc device credential.

### 1.2 Success response

Single resource:

~~~json
{
  "success": true,
  "message": "Lấy dữ liệu thành công",
  "data": { "id": "101" }
}
~~~

Collection:

~~~json
{
  "success": true,
  "message": "Lấy danh sách thành công",
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
~~~

### 1.3 Error response

~~~json
{
  "success": false,
  "message": "Không thể thực hiện thao tác",
  "error": {
    "code": "ORDER_ITEM_INVALID_TRANSITION",
    "details": {
      "currentStatus": "COMPLETED",
      "requestedStatus": "IN_PREPARATION"
    }
  }
}
~~~

Frontend xử lý theo error.code, không phân tích message.

### 1.4 Pagination và filters
- page mặc định 1; limit mặc định 20, tối đa 100.
- q tìm kiếm; from/to ISO-8601.
- Quy ước khoảng thời gian: from <= timestamp < to.
- Sort whitelist theo từng endpoint; không truyền raw SQL sort field.

### 1.5 Authentication
- Nhân viên dùng Authorization: Bearer <accessToken>.
- Tablet dùng device credential riêng, tách khỏi JWT nhân viên.
- Device credential được provision bởi nhân viên có quyền, lưu an toàn trên tablet, có thể revoke/rotate.
- Không chấp nhận tableId từ client làm bằng chứng tablet được phép truy cập bàn đó.

CẦN DUYỆT: access token expiry, refresh strategy/cookie, device provisioning và secret rotation trước khi triển khai auth.

## 2. Actors, roles và permissions

| Actor | Code | Quyền |
|---|---|---|
| Quản lý | MANAGER | Toàn bộ nghiệp vụ nội bộ |
| Nhân viên Order | ORDER_STAFF | Bàn, phiên, đơn, thanh toán |
| Nhân viên Bếp | KITCHEN_STAFF | Queue và trạng thái món |
| Nhân viên Kho | INVENTORY_STAFF | Nguyên liệu, tồn, kiểm kê |
| Khách hàng | GUEST device context | Guest tablet, không có User account |

Permission codes đề xuất:
- auth:me
- users:read, users:create, users:update, users:manage-role
- menu:read, menu:manage
- tables:read, tables:manage, sessions:open, sessions:close
- orders:read, orders:create-item, orders:manage-item
- kitchen:read, kitchen:update-item
- inventory:read, inventory:manage, inventory:count
- payments:read, payments:confirm
- reports:read
- audit:read

Manager có toàn bộ quyền nghiệp vụ Order, Kitchen và Inventory. Quyền phải được kiểm tra ở backend; không tin role từ frontend.

## 3. Auth và Users/Employees

| Method | Endpoint | Quyền |
|---|---|---|
| POST | /auth/login | Public |
| POST | /auth/logout | Authenticated |
| GET | /auth/me | Authenticated |
| GET | /users | MANAGER |
| GET | /users/:id | MANAGER |
| POST | /users | MANAGER |
| PATCH | /users/:id | MANAGER |
| PATCH | /users/:id/status | MANAGER |
| PATCH | /users/:id/role | MANAGER |
| POST | /users/:id/reset-password | MANAGER |

### POST /auth/login

Request:

~~~json
{
  "username": "manager",
  "password": "user-entered-password"
}
~~~

Response data:

~~~json
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "1",
    "username": "manager",
    "email": null,
    "role": { "code": "MANAGER", "name": "Quản lý" },
    "employee": {
      "id": "1",
      "employeeCode": "EMP001",
      "fullName": "Nguyễn Văn A"
    },
    "permissions": ["menu:manage", "reports:read"]
  }
}
~~~

- Không trả passwordHash.
- User isActive=false không được đăng nhập.
- /auth/me trả principal hiện tại, role và permissions; không nhận userId từ client.

### POST /users

~~~json
{
  "username": "order01",
  "email": "order01@example.com",
  "password": "initial-password",
  "roleCode": "ORDER_STAFF",
  "employee": {
    "employeeCode": "EMP002",
    "fullName": "Trần Văn B",
    "phone": "0900000000",
    "hiredAt": "2026-11-01"
  }
}
~~~

Hash mật khẩu server-side. Không nhận passwordHash, actor ID hoặc quyền tự chọn ngoài roleCode hợp lệ. Khóa user bằng endpoint status; không xóa user có lịch sử.

## 4. Menu

| Method | Endpoint | Quyền |
|---|---|---|
| GET | /menu/categories | Authenticated, TABLE_DEVICE |
| POST | /menu/categories | MANAGER |
| PATCH | /menu/categories/:id | MANAGER |
| DELETE | /menu/categories/:id | MANAGER, chỉ khi không bị tham chiếu |
| GET | /menu/items | Authenticated |
| GET | /menu/items/:id | Authenticated |
| POST | /menu/items | MANAGER |
| PATCH | /menu/items/:id | MANAGER |
| PATCH | /menu/items/:id/availability | MANAGER |
| DELETE | /menu/items/:id | MANAGER, chỉ khi không có lịch sử; ưu tiên deactivate |

List filters: page, limit, q, categoryId, availabilityStatus, isActive.

POST /menu/items:

~~~json
{
  "categoryId": "10",
  "code": "PHO-BO",
  "name": "Phở bò",
  "description": "Phở bò truyền thống",
  "price": "65000.00",
  "imageUrl": null
}
~~~

PATCH availability:

~~~json
{
  "availabilityStatus": "OUT_OF_STOCK",
  "availabilityReason": "Tạm hết nguyên liệu"
}
~~~

Không nhận station/modifier/recipe. Low stock không tự thay đổi availability. Customer menu dùng GET /customer/menu để chỉ trả món active và available.

## 5. Tables, sessions và devices

### 5.1 Tables

| Method | Endpoint | Quyền |
|---|---|---|
| GET | /tables | MANAGER, ORDER_STAFF |
| GET | /tables/:id | MANAGER, ORDER_STAFF |
| POST | /tables | MANAGER |
| PATCH | /tables/:id | MANAGER |
| DELETE | /tables/:id | MANAGER, chỉ khi chưa có lịch sử |

Không xóa bàn có session/order history; ưu tiên deactivate. Table status đồng bộ với session trong transaction.

### 5.2 Sessions

| Method | Endpoint | Quyền |
|---|---|---|
| POST | /tables/:tableId/sessions | MANAGER, ORDER_STAFF |
| GET | /tables/:tableId/sessions/current | MANAGER, ORDER_STAFF |
| GET | /sessions/:id | MANAGER, ORDER_STAFF |
| GET | /sessions/active | MANAGER, ORDER_STAFF |

Open session request:

~~~json
{
  "note": "Optional internal note"
}
~~~

Server transaction:
1. Lock/validate table.
2. Reject nếu đã có session OPEN.
3. Create DiningSession.
4. Create single Order.
5. Update table status.
6. Return session, order và table summary.

### 5.3 Device provisioning

| Method | Endpoint | Quyền |
|---|---|---|
| POST | /tables/:tableId/devices | MANAGER |
| GET | /tables/:tableId/devices | MANAGER |
| PATCH | /devices/:deviceId/status | MANAGER |

Credential chỉ hiển thị một lần khi provision; DB chỉ lưu hash nếu dùng secret. Không có endpoint cho tablet tự đổi bàn.

CẦN DUYỆT: quy trình provision, rotate và revoke credential.

## 6. Customer guest ordering

Các endpoint yêu cầu TABLE_DEVICE authentication; không cần customer account.

| Method | Endpoint | Quyền |
|---|---|---|
| GET | /customer/session | TABLE_DEVICE |
| GET | /customer/menu | TABLE_DEVICE |
| GET | /customer/orders/current | TABLE_DEVICE |
| GET | /customer/orders/items | TABLE_DEVICE |
| POST | /customer/orders/items | TABLE_DEVICE |
| PATCH | /customer/orders/items/:itemId/cancel | TABLE_DEVICE |

### POST /customer/orders/items

~~~json
{
  "items": [
    { "menuItemId": "200", "quantity": 2, "note": "Ít hành" },
    { "menuItemId": "201", "quantity": 1, "note": null }
  ],
  "idempotencyKey": "tablet-unique-request-key"
}
~~~

Response data:

~~~json
{
  "createdItems": [
    {
      "id": "9001",
      "menuItemId": "200",
      "itemName": "Phở bò",
      "quantity": 2,
      "unitPrice": "65000.00",
      "lineTotal": "130000.00",
      "note": "Ít hành",
      "status": "AWAITING_ACCEPTANCE",
      "createdAt": "2026-11-09T10:00:00.000Z"
    }
  ]
}
~~~

Server rules:
- Device identity xác định table/session; không nhận tableId từ payload.
- Chỉ cho thao tác khi session OPEN.
- Validate menu item active và AVAILABLE.
- Lấy giá từ DB, tự tính lineTotal.
- Mỗi lần gọi thêm insert OrderItem mới.
- Tạo initial status history.
- Idempotency key chống duplicate khi retry.
- Không modifier.
- Đề xuất batch atomic all-or-nothing nếu một item invalid để tránh tạo đơn một phần ngoài ý muốn.

### PATCH cancel

~~~json
{
  "reason": "Customer requested cancellation"
}
~~~

Khách chỉ hủy item AWAITING_ACCEPTANCE. Server xác minh item thuộc session của device; chuyển CANCELLED và lưu history. Không xóa item.

## 7. Live Orders / Order Staff

| Method | Endpoint | Quyền |
|---|---|---|
| GET | /orders | MANAGER, ORDER_STAFF |
| GET | /orders/:id | MANAGER, ORDER_STAFF |
| GET | /orders/:id/items | MANAGER, ORDER_STAFF |
| POST | /orders/:id/items | MANAGER, ORDER_STAFF |
| PATCH | /orders/:orderId/items/:itemId/note | MANAGER, ORDER_STAFF |
| PATCH | /orders/:orderId/items/:itemId/cancel | MANAGER, ORDER_STAFF |
| GET | /orders/:id/history | MANAGER, ORDER_STAFF |

Filters: status (derived), tableId, from, to, page, limit. Order status là trạng thái tổng hợp từ items/payment/session, không phải nguồn workflow độc lập.

POST /orders/:id/items dùng cùng item payload như customer ordering; actor lấy từ JWT.

PATCH note:

~~~json
{
  "note": "Không hành"
}
~~~

Order Staff chỉ sửa note khi item AWAITING_ACCEPTANCE hoặc ACCEPTED. Không sửa tên món, số lượng, giá. Không sửa note ở IN_PREPARATION, COMPLETED hoặc CANCELLED.

Order Staff cancel:
- Cho phép AWAITING_ACCEPTANCE và ACCEPTED.
- Không cho phép IN_PREPARATION, COMPLETED, CANCELLED.
- Cancelled item vẫn được lưu và không tính tiền.

## 8. Kitchen Display System

Một hàng đợi chung; không station, kitchen ticket hoặc routing.

| Method | Endpoint | Quyền |
|---|---|---|
| GET | /kitchen/queue | MANAGER, KITCHEN_STAFF |
| GET | /kitchen/items/:itemId | MANAGER, KITCHEN_STAFF |
| PATCH | /kitchen/items/:itemId/accept | MANAGER, KITCHEN_STAFF |
| PATCH | /kitchen/items/:itemId/start | MANAGER, KITCHEN_STAFF |
| PATCH | /kitchen/items/:itemId/complete | MANAGER, KITCHEN_STAFF |
| PATCH | /kitchen/items/:itemId/return-to-accepted | MANAGER, KITCHEN_STAFF |
| PATCH | /kitchen/items/:itemId/cancel | MANAGER, KITCHEN_STAFF |

Queue filters: status, from, to, page, limit. Default queue gồm item chưa terminal; completed/cancelled có thể lấy bằng filter/history.

Transition request:

~~~json
{
  "reason": "Optional reason"
}
~~~

Transitions:
- AWAITING_ACCEPTANCE -> ACCEPTED
- ACCEPTED -> IN_PREPARATION
- IN_PREPARATION -> COMPLETED
- IN_PREPARATION -> ACCEPTED
- Cancel được hỗ trợ nhưng source states của Kitchen phải theo policy được duyệt; không tự suy diễn.
- COMPLETED và CANCELLED là terminal trong MVP.
- Update item và insert history trong một transaction.
- Dùng conditional update/optimistic concurrency để tránh thiết bị cập nhật stale state.
- KDS hiển thị tên món, số lượng, giá, note, trạng thái, thời gian tạo và bàn/đơn.
- MVP không yêu cầu push notification; client có thể polling.

## 9. Inventory

| Method | Endpoint | Quyền |
|---|---|---|
| GET | /inventory/ingredients | MANAGER, INVENTORY_STAFF |
| GET | /inventory/ingredients/:id | MANAGER, INVENTORY_STAFF |
| POST | /inventory/ingredients | MANAGER, INVENTORY_STAFF |
| PATCH | /inventory/ingredients/:id | MANAGER, INVENTORY_STAFF |
| PATCH | /inventory/ingredients/:id/threshold | MANAGER, INVENTORY_STAFF |
| GET | /inventory/ingredients/:id/movements | MANAGER, INVENTORY_STAFF |
| POST | /inventory/stock-in | MANAGER, INVENTORY_STAFF |
| POST | /inventory/adjustments | MANAGER, INVENTORY_STAFF |
| POST | /inventory/counts | MANAGER, INVENTORY_STAFF |
| GET | /inventory/alerts | MANAGER, INVENTORY_STAFF |

Create ingredient:

~~~json
{
  "code": "BEEF",
  "name": "Thịt bò",
  "category": "Meat",
  "unit": "kg",
  "lowStockThreshold": "5.000",
  "note": null
}
~~~

Stock-in:

~~~json
{
  "ingredientId": "501",
  "quantity": "10.000",
  "reason": "Nhập kho",
  "referenceCode": "GRN-001"
}
~~~

Adjustment:

~~~json
{
  "ingredientId": "501",
  "quantityDelta": "-1.500",
  "reason": "Điều chỉnh sau kiểm tra",
  "referenceCode": null
}
~~~

Inventory count:

~~~json
{
  "ingredientId": "501",
  "actualQuantity": "8.500",
  "note": "Kiểm kê thực tế"
}
~~~

Rules:
- Balance update + StockMovement insert atomically.
- Không để balance âm.
- Count record là lịch sử bất biến.
- CẦN DUYỆT: count chỉ ghi nhận hay áp dụng adjustment. Không tự âm thầm điều chỉnh.
- Low-stock alert hiển thị cho Inventory Staff; không đổi menu availability.
- Không tự trừ kho theo order.

## 10. Payment

| Method | Endpoint | Quyền |
|---|---|---|
| POST | /orders/:orderId/payment/confirm | MANAGER, ORDER_STAFF |
| GET | /orders/:orderId/payment | MANAGER, ORDER_STAFF |
| GET | /payments | MANAGER, ORDER_STAFF |
| GET | /payments/:id | MANAGER, ORDER_STAFF |

Khách yêu cầu thanh toán với nhân viên; không có customer self-payment endpoint trong MVP.

### POST /orders/:orderId/payment/confirm

Request:

~~~json
{
  "paymentMethod": null,
  "transactionRef": null,
  "idempotencyKey": "payment-confirm-unique-key"
}
~~~

Response data:

~~~json
{
  "payment": {
    "id": "7001",
    "orderId": "3001",
    "amount": "260000.00",
    "paymentMethod": null,
    "status": "PAID",
    "paidAt": "2026-11-09T10:30:00.000Z",
    "recordedBy": "1"
  },
  "session": {
    "id": "2001",
    "status": "CLOSED",
    "closedAt": "2026-11-09T10:30:00.000Z"
  },
  "table": {
    "id": "10",
    "status": "AVAILABLE"
  },
  "summary": {
    "billableItems": [],
    "excludedItems": [],
    "total": "260000.00"
  }
}
~~~

Payment gate đã xác nhận:
- Reject nếu còn bất kỳ item AWAITING_ACCEPTANCE.
- Tính tiền ACCEPTED, IN_PREPARATION, COMPLETED.
- Loại AWAITING_ACCEPTANCE và CANCELLED.
- Chỉ xác nhận sau khi nhân viên đã nhận đủ tiền.
- Một payment/order; không split/multiple payments.
- Insert payment, close session, update table và audit trong một transaction.
- Order đã paid không được chỉnh sửa.
- Actor lấy từ JWT; không nhận recordedBy từ client.
- Idempotency key ngăn tạo payment lặp.

## 11. Reports và Audit

| Method | Endpoint | Quyền |
|---|---|---|
| GET | /reports/overview | MANAGER |
| GET | /reports/revenue | MANAGER |
| GET | /reports/top-selling-items | MANAGER |
| GET | /reports/orders | MANAGER |
| GET | /reports/inventory | MANAGER |
| GET | /reports/void-history | MANAGER |
| GET | /audit-logs | MANAGER |

Query: from, to, groupBy=day|month; pagination khi cần.

Definitions:
- Revenue: tổng payment PAID theo paidAt.
- Sold quantity: tổng quantity của item được tính tiền; loại CANCELLED và AWAITING_ACCEPTANCE.
- Top selling: group billable quantity theo snapshot name/menu item.
- Order history: đơn đã thanh toán và đang hoạt động theo filter.
- Inventory report: InventoryBalance và lowStockThreshold hiện tại.
- Void history: OrderItemStatusHistory chuyển sang CANCELLED và AuditLog liên quan.
- Chỉ Manager được xem báo cáo.
- Không trả SLA/customer-count metrics khi chưa có định nghĩa và nguồn dữ liệu được duyệt.

## 12. Error catalog

| HTTP | Error code | Điều kiện |
|---|---|---|
| 400 | VALIDATION_ERROR | DTO/query không hợp lệ |
| 400 | INVALID_STATUS_TRANSITION | Transition không được phép |
| 401 | AUTH_REQUIRED | Thiếu/sai token |
| 401 | INVALID_CREDENTIALS | Sai thông tin đăng nhập |
| 401 | DEVICE_AUTH_INVALID | Device credential sai/thu hồi |
| 403 | FORBIDDEN | Không đủ permission |
| 404 | RESOURCE_NOT_FOUND | Không tìm thấy tài nguyên |
| 404 | ACTIVE_SESSION_NOT_FOUND | Không có phiên OPEN |
| 409 | USERNAME_ALREADY_EXISTS | Username trùng |
| 409 | TABLE_SESSION_ALREADY_OPEN | Bàn đã có session OPEN |
| 409 | SESSION_ALREADY_CLOSED | Phiên đã đóng |
| 409 | ORDER_ALREADY_PAID | Đơn đã thanh toán |
| 409 | PAYMENT_ALREADY_EXISTS | Payment đã tồn tại |
| 409 | PAYMENT_HAS_PENDING_ITEMS | Còn AWAITING_ACCEPTANCE |
| 409 | ORDER_ITEM_INVALID_TRANSITION | Transition không hợp lệ |
| 409 | ORDER_ITEM_CANNOT_BE_CANCELLED | Không được hủy ở trạng thái hiện tại |
| 409 | MENU_ITEM_UNAVAILABLE | Món không được phép bán |
| 409 | INVENTORY_INSUFFICIENT_STOCK | Điều chỉnh làm tồn âm |
| 409 | IDEMPOTENCY_KEY_REUSED | Key dùng với payload khác |
| 422 | BUSINESS_RULE_VIOLATION | Đúng format nhưng vi phạm nghiệp vụ |
| 500 | INTERNAL_SERVER_ERROR | Lỗi không dự kiến |

Không trả stack trace hoặc chi tiết database trong production.

## 13. Mapping frontend → API

| Frontend view | Endpoint chính |
|---|---|
| Header / Sidebar | /auth/me |
| MenuCatalogView | /menu/categories, /menu/items |
| CustomerOrderView | /customer/menu, /customer/session, /customer/orders/* |
| LiveOrdersView | /orders, /orders/:id, /orders/:id/items, payment |
| KDSView | /kitchen/queue, /kitchen/items/:id/* |
| InventoryAuditView | /inventory/ingredients, stock-in, adjustments, counts, alerts |
| StaffShiftsView | /users và employee profile; shift scheduling ngoài MVP |
| ReportsTelemetryView | /reports/* |

Frontend-only fields như màu sắc, badge label, station tab, mock SLA, shift countdown không tự động trở thành database fields.

## 14. Realtime và đồng bộ

- MVP có thể polling /kitchen/queue, active orders và customer order status.
- Polling interval là cấu hình vận hành frontend, chưa phải business rule.
- Không yêu cầu push notification cho tablet trong MVP.
- Khi reconnect, tablet tải lại /customer/session và current order.
- WebSocket/SSE có thể bổ sung sau mà không đổi nguồn dữ liệu trạng thái.

## 15. Security và consistency

- Validate DTO, whitelist field, reject unknown fields.
- Actor ID lấy từ principal; không nhận actorId/recordedBy/createdBy từ client.
- Không tin role, price, lineTotal, payment amount, status, table ownership hoặc inventory balance do client gửi.
- Authorization bắt buộc ở backend service/guard.
- Rate-limit login và device authentication.
- Chỉ lưu password hash và device credential hash.
- Transaction cho nghiệp vụ nhiều bảng.
- Idempotency cho order creation và payment confirmation.
- Optimistic concurrency/conditional update cho state transition.
- Audit thao tác nhạy cảm nhưng không lưu secret.
- CORS allowlist đúng frontend origins; không dùng wildcard kèm credentials.

## 16. Open decisions — chưa tự triển khai

| ID | Cần quyết định | Safe stance |
|---|---|---|
| API-Q01 | Device provisioning/secret lifecycle | Chưa mở customer endpoints cho đến khi duyệt |
| API-Q02 | Kitchen cancel source states | Chỉ implement transitions đã duyệt |
| API-Q03 | Reopen item COMPLETED? | Không trong MVP |
| API-Q04 | Payment method values | Nullable/chưa giới hạn |
| API-Q05 | Inventory count auto-adjust? | Cần explicit confirmation |
| API-Q06 | Invoice output format | Trả payment summary; print/export sau |
| API-Q07 | Response envelope tương thích frontend | Chốt trước frontend integration |
| API-Q08 | Polling interval/realtime | Polling cho MVP |

## 17. Acceptance criteria

- [ ] Mỗi endpoint có request/response DTO và quyền.
- [ ] Status transition validate server-side.
- [ ] Guest device không truy cập bàn/session khác.
- [ ] Gọi thêm luôn tạo OrderItem mới.
- [ ] Client không tự set price/total/actor/status.
- [ ] Payment gate đúng confirmed rules.
- [ ] Một payment/order; payment + close session atomic.
- [ ] Inventory ledger-backed, balance không âm.
- [ ] Reports dùng dữ liệu đã lưu và định nghĩa rõ.
- [ ] Error response có code ổn định.
- [ ] Open decisions được duyệt hoặc hoãn rõ ràng trước khi triển khai.
