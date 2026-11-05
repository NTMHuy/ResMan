# ResMan — Complete Backend Specification

> **Provenance**
> - **Source prompt:** Complete Backend Specification — API review by role, traceability to approved User Stories R2, and alignment with Confirmed Business Rules.
> - **Artifact status:** `Draft - Awaiting Review`
> - **Date:** 05/11/2026
> - **Repository target:** `backend/README.md`
> - **Branch:** `docs/complete-backend-specification`
> - **Base branch:** `main`
> - **Review status:** This document is submitted as a Draft Pull Request. Opening the PR is not approval or merge authorization.

## 1. Purpose and scope

This document defines the proposed backend contract for the ResMan MVP: responsibilities, role boundaries, resource model, API catalogue, request/response conventions, validation, business transitions, consistency requirements, security, and acceptance-test traceability.

It is a specification artifact, not an implementation. It does not create NestJS modules, Prisma migrations, controllers, services, or code. API paths and payloads below are proposals for review and are not approved contracts until the human review gate is passed.

### 1.1 In-scope roles

The system has exactly five business roles:

| Role | Backend responsibilities |
|---|---|
| Customer | Read menu and own table session/order; submit additional items; cancel eligible own items |
| Order Staff | View active tables/orders; open table sessions; add items; edit notes/cancel items within permission rules; record payment confirmation |
| Kitchen Staff | View kitchen queue; accept, start, complete, revert to accepted, and cancel items subject to unresolved cancellation rule |
| Inventory Staff | Manage ingredients, balances, stock movements, stocktakes, and low-stock alerts |
| Manager | All Order, Kitchen, and Inventory operations; manage menu, tables, staff; view reports |

Manager's expanded capabilities do not create a sixth role. Customer guest access is a usage mode, not a staff role.

### 1.2 Explicitly out of scope for MVP

AI meal recommendations, table reservations, software-based table transfer, modifiers, recipe/ingredient usage formulas, automatic stock deduction on sale, automatic menu availability changes due to stock threshold, split bills, multiple payments per order, supplier/purchase-order workflows, and advanced payment-gateway integration.

## 2. Sources, precedence, and decision classification

### 2.1 Source precedence

1. Human-confirmed business rules in `docs/11-confirmed-business-rules.md` (29/10/2026).
2. Approved User Stories & Acceptance Criteria R2 and `confirmed-rules-alignment.md`.
3. Current Feature Specifications for Order, Kitchen, and Payment, where not in conflict.
4. `docs/10-database-design.md` and `prisma/schema.prisma` as existing design context only.
5. This document's API proposals and technical recommendations.

When a lower-priority source conflicts with a higher-priority source, the higher-priority source wins and the discrepancy is recorded for cleanup. The current database design/schema contains older concepts such as `PENDING_CONFIRMATION`, `QUEUED`, `PREPARING`, `READY`, `SERVED`, and `REJECTED`; these must not be treated as current business decisions.

### 2.2 Facts, decisions, and assumptions

**Facts confirmed by project sources**
- One restaurant in MVP; clients communicate with backend APIs and do not connect directly to PostgreSQL.
- Target stack described by project database design: NestJS, PostgreSQL, Prisma.
- The repository's current Prisma schema is a design artifact and is not aligned fully with the latest business rules.
- No backend implementation directory was present on `main` when this specification was prepared.

**Confirmed business decisions**
- A table tablet is assigned to one table; active session/order data is server-side and reloaded after restart/reconnect.
- No software table transfer; at most one active session per table.
- Guest ordering is allowed; customer login is optional.
- One active table session has one order. Each additional call creates new order-item records; it does not mutate the quantity of an existing item.
- No modifiers; special requests use item notes.
- Item states are Chờ tiếp nhận, Đã tiếp nhận, Đang chế biến, Đã hoàn thành, Đã hủy. No “Bị từ chối”.
- Customer cancellation is allowed only before Kitchen accepts the item.
- Order Staff permissions follow the confirmed state matrix in §6.3.
- Kitchen can move an item from Đang chế biến back to Đã tiếp nhận.
- One order has at most one payment. No split or multiple payments.
- Staff receive the money and then confirm payment in the system. Payment request and payment confirmation are different actions.
- Cancelled items are excluded from payment. Payment confirmation stores actor/time, closes the session, and freezes the paid order.
- Inventory is manually maintained; sales do not deduct stock; no recipe/usage formula exists.
- Low-stock alert visibility is limited to Inventory Staff. Manager can manage inventory.
- Only Manager can view reports.

**Technical assumptions proposed for review**
- REST JSON API under `/api/v1`.
- Modular-monolith backend, with domain modules and a shared authentication/authorization layer.
- Staff authentication uses authenticated staff accounts; customer tablet access uses a table/device-scoped credential. Exact credential issuance/rotation is a security decision to confirm.
- IDs are opaque to clients; examples use strings even if PostgreSQL stores BIGINT.
- All timestamps are ISO 8601 with timezone; money is serialized as decimal strings to avoid floating-point loss.
- Mutating requests may support `Idempotency-Key`; exact coverage/retention needs approval.
- No WebSocket/push requirement is inferred. Clients refresh/poll API state unless a later decision adds realtime delivery.

## 3. Backend architecture boundary

### 3.1 Proposed logical modules

| Module | Owns |
|---|---|
| Auth & Access | Staff authentication, device/table access, role/permission checks |
| Staff | Employee account lifecycle and role assignment |
| Menu | Categories, menu items, prices, active/availability flags |
| Tables & Sessions | Dining tables, assigned devices, active sessions |
| Orders | Orders, order items, notes, cancellation, item status history |
| Kitchen | Kitchen queue and item workflow actions |
| Payments | Payment summary and one-time staff confirmation |
| Inventory | Ingredients, balances, movements, stocktake and alerts |
| Reports | Manager-only business reports |
| Audit | Actor/time/action history for sensitive state changes |

The modules are logical ownership boundaries, not a mandated folder layout. Cross-module writes must go through the owning application service/domain operation rather than directly changing another module's data.

### 3.2 Data ownership and core invariants

- An order item belongs to exactly one order and captures a name/price snapshot at creation.
- Each additional call creates a new item. Quantity is the count for that submitted line, not an aggregation key for future calls.
- Item state is authoritative at the order-item level. Do not impose one all-or-nothing order state machine over every item.
- An order is associated with one table session in the dine-in MVP.
- A table has no more than one OPEN session.
- An order has zero or one payment; enforce uniqueness at persistence level.
- Payment amount is calculated by the server from eligible, non-cancelled items. Never trust a client-submitted total.
- A paid order and its items are immutable through normal operational APIs.
- Inventory balances are changed only by explicit inventory operations; sales do not create stock movements.
- Historical records are append-only from the application perspective; do not hard-delete financial/order/stock history.

## 4. API conventions

### 4.1 Naming and versioning

- Base path: `/api/v1`.
- Resource names are plural; IDs are path parameters.
- Use `GET` for reads, `POST` for commands/creation, and `PATCH` for partial editable fields.
- State transitions use explicit command endpoints rather than allowing clients to patch arbitrary status values.
- The paths are proposed. Naming can be adjusted during review without changing the business rules.

### 4.2 Standard response shape

Successful resource read/create (illustrative):

```json
{
  "data": {
    "id": "ord_123",
    "status": "OPEN"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

Collection response (illustrative):

```json
{
  "data": [],
  "meta": {
    "requestId": "req_123",
    "page": 1,
    "pageSize": 20,
    "total": 0
  }
}
```

Error response (illustrative):

```json
{
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "The requested action is not allowed for the current item state.",
    "details": {
      "currentStatus": "IN_PREPARATION"
    },
    "requestId": "req_123"
  }
}
```

Do not expose stack traces, SQL, secrets, or internal implementation details.

### 4.3 Data formats

- IDs: opaque strings at API boundary.
- Timestamps: ISO 8601 with explicit timezone.
- Money: decimal string, e.g. `"125000.00"`; currency code is not yet specified by the business rules and must be confirmed before hard-coding.
- Inventory quantities: decimal strings with up to three fractional digits as a current database-design convention; unit conversion rules remain open.
- Text: UTF-8; trim/validate required strings; preserve meaningful note content.
- Pagination: proposed `page` and `pageSize`, bounded by server limits. Exact default/max values require review.

### 4.4 Common HTTP status mapping

| HTTP | Meaning |
|---|---|
| 200 | Read or successful update/command with response |
| 201 | Resource created |
| 204 | Successful operation with no response body, only where useful |
| 400 | Malformed request or validation failure |
| 401 | Missing/invalid authentication |
| 403 | Authenticated actor lacks permission |
| 404 | Resource not found or not visible to actor |
| 409 | Business conflict, duplicate active session/payment, stale state |
| 422 | Well-formed request violates a business invariant, if adopted consistently |
| 429 | Rate limit |
| 500 | Unexpected server failure |

The team should choose one consistent policy between 400 and 422 for semantic validation.

## 5. Authentication, authorization, and resource scope

### 5.1 Staff access

Staff endpoints require an authenticated staff identity. Every protected command must verify both:
1. Role/permission for the operation.
2. Resource scope and current business state.

Role checks alone are insufficient: for example, a Customer must not access another table's session by guessing an ID.

### 5.2 Customer/tablet access

Guest ordering is allowed. The tablet is assigned to one table and may use a device/table-scoped credential to access that table's current session. The backend must resolve the permitted table from trusted device/session context, not accept an arbitrary `tableId` as proof of access.

**Assumption requiring approval:** credential provisioning, revocation, rotation, and whether a guest can use a separate short-lived session token are not fully specified in the business rules.

### 5.3 Proposed role access matrix

| Capability | Customer | Order Staff | Kitchen Staff | Inventory Staff | Manager |
|---|---:|---:|---:|---:|---:|
| Read public menu | Yes | Yes | As needed | No | Yes |
| Read own table session/order | Yes | Yes | No | No | Yes |
| Submit order items | Yes | Yes | No | No | Yes |
| Cancel customer-eligible item | Own items | Yes, per matrix | Open | No | Yes |
| Edit item note | No | Per matrix | No | No | Yes |
| Kitchen workflow | No | Queue visibility/limited handoff only if approved | Yes | No | Yes |
| Inventory operations | No | No | No | Yes | Yes |
| Menu/table administration | No | No | No | No | Yes |
| Staff administration | No | No | No | No | Yes |
| Reports | No | No | No | No | Yes |
| Confirm payment | No | Yes | No | No | Yes |

“Queue visibility/limited handoff” is not an authorization for Order Staff to accept items on behalf of Kitchen. No mandatory Order Staff dispatch/acceptance workflow is assumed.

## 6. Business workflows and API catalogue

All endpoints in this section are **proposed**. Role labels are authorization expectations for review.

### 6.1 Customer APIs

| Method & path | Purpose | Access |
|---|---|---|
| `GET /api/v1/menu/items` | List active, customer-visible menu items and current price/availability | Customer/Staff/Manager |
| `GET /api/v1/tables/current/session` | Resolve current session for the authenticated table device | Table device |
| `GET /api/v1/sessions/{sessionId}/order` | Read the order and its item states for the authorized table session | Customer scoped to session; staff |
| `POST /api/v1/sessions/{sessionId}/order/items` | Submit one or more new item lines | Customer scoped to session; Order Staff; Manager |
| `POST /api/v1/orders/{orderId}/items/{itemId}/cancel` | Customer requests cancellation of own eligible item | Customer scoped to session |

**Submit item request (illustrative)**

```json
{
  "items": [
    {
      "menuItemId": "menu_12",
      "quantity": 2,
      "note": "Ít cay"
    }
  ]
}
```

Rules:
- Session must be OPEN and belong to the authenticated table device.
- Menu item must be active and orderable under the currently confirmed menu rules.
- Quantity must be a positive integer; maximum quantity is a validation/configuration decision.
- Server snapshots item name and unit price at creation and calculates line total.
- Every submitted line creates a new order item; it must not merge with or increase a prior item.
- Guest ordering does not require customer account credentials.
- Customer cancellation is allowed only while item status is `AWAITING_ACCEPTANCE` (Vietnamese: Chờ tiếp nhận).
- Cancellation retains the item in history as `CANCELLED`.

**Proposed item status codes for API** (mapping to confirmed Vietnamese labels):
- `AWAITING_ACCEPTANCE` — Chờ tiếp nhận
- `ACCEPTED` — Đã tiếp nhận
- `IN_PREPARATION` — Đang chế biến
- `COMPLETED` — Đã hoàn thành
- `CANCELLED` — Đã hủy

These codes are proposals and must be reconciled with the database schema before migration. Do not expose legacy `REJECTED`, `PENDING_CONFIRMATION`, `QUEUED`, `PREPARING`, `READY`, or `SERVED` as if they were confirmed current business states.

### 6.2 Order Staff APIs

| Method & path | Purpose |
|---|---|
| `GET /api/v1/tables` | List tables and operational state |
| `POST /api/v1/tables/{tableId}/sessions` | Open a table session |
| `GET /api/v1/orders?status=&tableId=&page=&pageSize=` | List active/relevant orders |
| `GET /api/v1/orders/{orderId}` | Read order details and item history |
| `POST /api/v1/orders/{orderId}/items` | Add new items to the existing order |
| `PATCH /api/v1/orders/{orderId}/items/{itemId}/note` | Edit note when allowed |
| `POST /api/v1/orders/{orderId}/items/{itemId}/cancel` | Cancel item when allowed |
| `GET /api/v1/orders/paid-history` | View paid-order history |
| `GET /api/v1/orders/{orderId}/payment-summary` | Read server-calculated payable summary |
| `POST /api/v1/orders/{orderId}/payments/confirm` | Record payment after money is received |

**Open table session request (illustrative)**

```json
{
  "guestCount": 3
}
```

Rules:
- Only Order Staff or Manager can open a session.
- Reject opening if the table already has an OPEN session (`409 ACTIVE_SESSION_EXISTS`).
- Session creation and initial order creation must be atomic if the approved data model requires one order per session.
- No software table-transfer endpoint is included.

**Order item note update request**

```json
{
  "note": "Không hành"
}
```

**Confirmed Order Staff item permissions**

| Current status | Cancel | Add another item | Edit note |
|---|---:|---:|---:|
| AWAITING_ACCEPTANCE | Yes | Yes | Yes |
| ACCEPTED | Yes | Yes | Yes |
| IN_PREPARATION | No | Yes | No |
| COMPLETED | No | Yes | No |
| CANCELLED | No | Yes | No |

The “add another item” action creates a new order item; it never edits an existing item's quantity. Manager inherits Order Staff capabilities.

### 6.3 Kitchen APIs

| Method & path | Purpose | Access |
|---|---|---|
| `GET /api/v1/kitchen/items?status=&stationId=&page=&pageSize=` | List kitchen work items | Kitchen Staff; Manager |
| `POST /api/v1/kitchen/items/{itemId}/accept` | Accept an item | Kitchen Staff; Manager |
| `POST /api/v1/kitchen/items/{itemId}/start` | Start preparation | Kitchen Staff; Manager |
| `POST /api/v1/kitchen/items/{itemId}/complete` | Mark preparation complete | Kitchen Staff; Manager |
| `POST /api/v1/kitchen/items/{itemId}/revert-to-accepted` | Revert IN_PREPARATION to ACCEPTED | Kitchen Staff; Manager |
| `POST /api/v1/kitchen/items/{itemId}/cancel` | Cancel an item | Kitchen Staff; Manager, subject to unresolved rule |

**Confirmed transition constraints**
- Normal flow: `AWAITING_ACCEPTANCE → ACCEPTED → IN_PREPARATION → COMPLETED`.
- Kitchen may transition `IN_PREPARATION → ACCEPTED`.
- Cancellation is a separate terminal branch.
- State is managed per item, not as a single order-level state machine.
- Do not create a “reject” endpoint or `REJECTED` state.
- No reason field is required by the confirmed business rule for Kitchen cancellation.
- Manager may perform Kitchen operations.

**Unresolved transition**
The exact states from which Kitchen may cancel are not confirmed. The cancellation endpoint is therefore a proposed route only; its allowed-state matrix and implementation must remain blocked pending a human decision. Do not silently assume “any state” or “before preparation only”.

### 6.4 Payment APIs

| Method & path | Purpose | Access |
|---|---|---|
| `GET /api/v1/orders/{orderId}/payment-summary` | Calculate payable items and total | Order Staff; Manager |
| `POST /api/v1/orders/{orderId}/payments/confirm` | Confirm one payment after staff receives money | Order Staff; Manager |
| `GET /api/v1/orders/{orderId}/payment` | Read recorded payment | Order Staff; Manager |
| `GET /api/v1/orders/paid-history` | Browse payment/order history | Order Staff; Manager |

**Payment confirmation request (illustrative)**

```json
{
  "confirmationNote": "Khách thanh toán tại quầy"
}
```

No amount or payment method is accepted as authoritative input in this proposal. If a payment method is later approved, its allowed values and validation will be added explicitly.

**Payment summary response (illustrative)**

```json
{
  "data": {
    "orderId": "ord_123",
    "items": [
      {
        "orderItemId": "item_1",
        "name": "Món A",
        "quantity": 2,
        "unitPrice": "50000.00",
        "lineTotal": "100000.00",
        "status": "COMPLETED",
        "included": true
      }
    ],
    "excludedItems": [
      {
        "orderItemId": "item_2",
        "status": "CANCELLED",
        "included": false
      }
    ],
    "total": "100000.00"
  }
}
```

Rules:
- One order may have at most one payment.
- Payment is not a customer self-service action on the tablet.
- The customer asks staff for payment; receiving the request is distinct from confirming payment. No endpoint for a digital payment-request signal is specified because the interaction mechanism is not decided.
- Confirmation is allowed only when every non-cancelled item has reached an eligible terminal state. “Completed” is confirmed; whether other terminal states qualify is tied to the unresolved workflow decisions and must not be invented.
- Server computes the amount; cancelled items are excluded.
- Payment creation, actor/time recording, order freeze, and session closure must succeed atomically.
- A second confirmation must fail safely with a conflict and must not create another payment.
- A paid order cannot be changed through ordinary order/item endpoints.

### 6.5 Inventory Staff APIs

| Method & path | Purpose | Access |
|---|---|---|
| `GET /api/v1/inventory/ingredients` | List ingredients and current balances | Inventory Staff; Manager |
| `POST /api/v1/inventory/ingredients` | Create ingredient | Inventory Staff; Manager |
| `PATCH /api/v1/inventory/ingredients/{ingredientId}` | Update ingredient metadata/unit/threshold | Inventory Staff; Manager |
| `GET /api/v1/inventory/ingredients/{ingredientId}/movements` | Read stock movement history | Inventory Staff; Manager |
| `POST /api/v1/inventory/ingredients/{ingredientId}/stock-ins` | Record stock-in | Inventory Staff; Manager |
| `POST /api/v1/inventory/ingredients/{ingredientId}/adjustments` | Record explicit adjustment | Inventory Staff; Manager |
| `POST /api/v1/inventory/stocktakes` | Record a flexible stocktake | Inventory Staff; Manager |
| `GET /api/v1/inventory/alerts/low-stock` | List low-stock alerts | Inventory Staff only |

**Stock-in request (illustrative)**

```json
{
  "quantity": "12.500",
  "unit": "kg",
  "note": "Nhập bổ sung"
}
```

Rules:
- Store the actor, timestamp, movement type, delta, and reason/note.
- Adjustment must create a movement/history record; never overwrite history.
- Stocktake records actual counted quantity and comparison with recorded balance.
- Low-stock threshold can be set by Inventory Staff or Manager.
- Low-stock alerts are visible only to Inventory Staff; Manager can manage thresholds and inventory but visibility of this specific alert feed should be confirmed if role inheritance is interpreted differently.
- Do not deduct stock when an order is placed or paid.
- Do not introduce recipes, per-menu-item ingredient quantities, supplier, purchase order, or automatic menu unavailability.
- Unit conversion between stock unit and entered unit is an open question; until decided, reject incompatible units rather than guessing conversion.

### 6.6 Manager APIs

| Method & path | Purpose |
|---|---|
| `GET/POST /api/v1/admin/menu/categories` | List/create categories |
| `PATCH/DELETE /api/v1/admin/menu/categories/{categoryId}` | Update/deactivate or remove category subject to history constraints |
| `GET/POST /api/v1/admin/menu/items` | List/create menu items |
| `GET/PATCH/DELETE /api/v1/admin/menu/items/{menuItemId}` | Read/update/deactivate item; price and availability controls |
| `GET/POST /api/v1/admin/tables` | List/create tables |
| `PATCH/DELETE /api/v1/admin/tables/{tableId}` | Update/deactivate table subject to active-session constraints |
| `GET/POST /api/v1/admin/staff` | List/create staff accounts |
| `GET/PATCH /api/v1/admin/staff/{userId}` | Read/update staff details |
| `POST /api/v1/admin/staff/{userId}/lock` | Lock staff account |
| `POST /api/v1/admin/staff/{userId}/unlock` | Unlock staff account |
| `POST /api/v1/admin/staff/{userId}/reset-password` | Initiate/reset staff password |
| `PATCH /api/v1/admin/staff/{userId}/role` | Change staff role |
| `GET /api/v1/admin/reports/revenue` | Revenue by day/month |
| `GET /api/v1/admin/reports/items-sold` | Quantity of items sold |
| `GET /api/v1/admin/reports/best-sellers` | Best-selling items |
| `GET /api/v1/admin/reports/orders` | Order history/report |
| `GET /api/v1/admin/reports/inventory` | Inventory status report |

Rules:
- All routes in this subsection are Manager-only.
- Manager can perform Order, Kitchen, and Inventory operations as stated in confirmed rules.
- Staff role changes and account lock/unlock must be audited.
- Password reset must not expose or return plaintext passwords in logs or API responses. Exact reset mechanism is a security design decision.
- Historical menu items/tables/staff referenced by transactions should be deactivated/soft-deleted rather than physically removed.
- Reports are Manager-only; no staff/customer report endpoints.

## 7. Validation and business error catalogue

| Error code | Expected condition |
|---|---|
| `VALIDATION_ERROR` | Invalid field, missing required field, invalid quantity/format |
| `UNAUTHENTICATED` | Missing/expired/invalid credential |
| `FORBIDDEN` | Role/permission does not allow action |
| `RESOURCE_NOT_FOUND` | Resource does not exist or is outside caller scope |
| `TABLE_SESSION_ALREADY_OPEN` | Table already has active session |
| `SESSION_NOT_OPEN` | Cannot add items to a closed session |
| `MENU_ITEM_UNAVAILABLE` | Item is inactive or not orderable under approved availability policy |
| `ITEM_STATE_CONFLICT` | Action not allowed for current item status |
| `ITEM_CANNOT_BE_CANCELLED` | Actor cannot cancel item in its current state |
| `ORDER_ALREADY_PAID` | Paid order is immutable |
| `PAYMENT_NOT_ALLOWED` | Order has unresolved/non-terminal items |
| `PAYMENT_ALREADY_CONFIRMED` | One payment already exists |
| `INSUFFICIENT_STOCK_BALANCE` | Proposed adjustment would violate an approved non-negative balance rule; confirm whether negative stock is prohibited |
| `CONCURRENT_UPDATE` | Resource changed since client read it |

Error responses should provide a stable machine code and safe user-facing message. Do not reveal whether a resource exists when doing so would disclose another table/session to a customer.

## 8. Transactionality, concurrency, and audit requirements

The following are proposed technical safeguards requiring engineering review:
- Opening a session: enforce one OPEN session per table at the database level where supported; create associated order atomically.
- Adding items: validate session and menu item, snapshot current name/price, create all submitted item rows atomically.
- State transition: read current state, authorize actor, validate transition, update item, append status history in one transaction.
- Payment confirmation: lock/serialize payment creation for the order; recalculate eligible lines and total on the server; create unique payment; record actor/time; close session; freeze order in one transaction.
- Inventory movement: update balance and append stock movement in one transaction.
- Concurrent edits: use optimistic versioning or row-level locking. Return `409 CONCURRENT_UPDATE` rather than silently overwriting.
- Idempotency: consider keys for order submission, stock-in/adjustment, and payment confirmation to prevent duplicate writes after network retries. Exact semantics/retention must be approved.
- Audit: record actor, action, resource, timestamp, and relevant before/after values for payment, item status, inventory, staff role/account, menu price/availability, and session lifecycle.
- Use database constraints for unique payment per order, unique active session per table, foreign-key integrity, and non-destructive historical references.

## 9. Security and operational requirements

- Hash passwords with a modern password-hashing algorithm; never store plaintext.
- Keep secrets and database credentials outside source control.
- Validate and normalize all inputs server-side.
- Enforce authorization on every protected endpoint and resource.
- Apply rate limits to authentication and public/tablet write endpoints.
- Use TLS in deployed environments.
- Avoid logging passwords, tokens, full credentials, or unnecessary customer data.
- Restrict customer credentials to the assigned table/session.
- Use least privilege for database/service credentials.
- Keep timestamps consistent and store timezone-aware instants.
- Provide request IDs for tracing and structured application logs.
- Backups, restore objectives, retention duration, and deployment monitoring remain operational decisions to confirm.

## 10. User Story and acceptance-criteria traceability

The following is a functional traceability map. Exact story IDs/AC numbering must be verified against the approved R2 files during review; this table intentionally maps by actor/capability rather than inventing IDs.

| Approved story group | Backend coverage | Key acceptance evidence |
|---|---|---|
| Customer | Menu read; current table session; order read; add item; cancel eligible item | Guest can order; tablet can reload server session; each add creates new item; customer cancellation blocked after Kitchen acceptance |
| Order Staff | Table/session management; order list/detail; add item; note edit; cancellation; paid history; payment summary/confirmation | Staff state matrix enforced; active table/order visibility; payment only confirmed after money received |
| Kitchen Staff | Queue; accept; start; complete; revert; cancel pending rule | Item-level status history; valid transitions only; no reject state |
| Inventory Staff | Ingredient CRUD; stock-in; adjustment; stocktake; movements; low-stock alerts | Actor/time/delta retained; no sale-based stock deduction; alerts scoped to Inventory Staff |
| Manager | Menu/table/staff management; all operational modules; reports | Role changes/account lock audited; reports Manager-only; inherited operational permissions |

**Traceability limitation:** User Story R2 includes some older or provisional wording. Where an AC conflicts with the 29/10/2026 Confirmed Business Rules, use the confirmed rule and record the story update as follow-up work. The payment story's earlier Proposal label must not override the later confirmed payment business rules; payment interaction details that remain open are still unresolved.

## 11. Minimum API acceptance test scenarios

1. Guest tablet can read only its assigned table's active session.
2. Tablet reconnect/restart can reload the active session and current order from server.
3. A second attempt to open a session for an already-open table returns conflict.
4. Customer submits the same menu item twice in separate calls; backend creates separate order items.
5. Customer can cancel an item in AWAITING_ACCEPTANCE and cannot cancel after ACCEPTED.
6. Order Staff can cancel/edit note in states allowed by the confirmed matrix and is blocked otherwise.
7. Order Staff cannot edit item name or quantity of an existing item.
8. Kitchen can perform confirmed transitions and revert IN_PREPARATION to ACCEPTED.
9. No endpoint or state permits REJECTED.
10. Kitchen cancellation follows the human-approved state matrix once decided; until then it is blocked from implementation.
11. A cancelled item remains in order history and is excluded from payment total.
12. Payment cannot be confirmed while any non-cancelled item is not in an eligible completed/terminal state.
13. Two concurrent payment confirmations produce at most one payment.
14. Successful payment records confirmer/time, closes session, and prevents further order mutation.
15. Sales do not change inventory balance or create stock movements.
16. Stock-in/adjustment/stocktake records actor, timestamp, and quantities.
17. Low-stock alert feed is inaccessible to roles other than Inventory Staff, subject to final confirmation of Manager visibility.
18. Only Manager can access reports and staff administration.
19. Inactive/deactivated historical menu items and tables do not erase transaction history.
20. Invalid role, resource scope, and state transitions return safe, consistent errors.

## 12. Open Questions — human decision required

These items are deliberately not resolved by this specification:

| ID | Question | Impact |
|---|---|---|
| OQ-01 | In which exact item states may Kitchen cancel? Is cancellation allowed after preparation starts? | Kitchen cancel endpoint validation and state machine |
| OQ-02 | Can COMPLETED ever return to a previous state? | Transition matrix and audit |
| OQ-03 | What is the payment output: on-screen summary, printed invoice, downloadable file, or more than one? | Payment/reporting APIs and UI |
| OQ-04 | Is stocktake represented as flexible independent records, or as opening/closing daily checks? | Inventory API and data model |
| OQ-05 | What unit conversion rules apply when entered unit differs from ingredient's base unit? | Inventory validation and quantities |
| OQ-06 | Which payment methods are accepted in MVP? | Payment payload and validation |
| OQ-07 | Is any adjustment/refund/correction allowed after an order is paid? | Paid-order immutability and financial audit |
| OQ-08 | How is a customer's request for payment signalled to staff (verbal-only, UI flag, or another workflow)? | Whether a payment-request endpoint is needed |
| OQ-09 | What are the exact staff permission codes/matrix beyond the confirmed Order Staff item matrix? | RBAC seed data and endpoint authorization |
| OQ-10 | How are tablet/device credentials provisioned, rotated, and revoked? | Customer/tablet authentication |
| OQ-11 | Can inventory balance become negative, and how are stocktake variances categorized? | Stock adjustment validation |
| OQ-12 | Which currency and decimal precision are used for customer-facing money values? | API money format and reports |
| OQ-13 | What pagination limits, idempotency-key scope/retention, and rate limits should be used? | API operational contract |
| OQ-14 | Should Manager see the Inventory Staff-only low-stock alert feed, or only manage stock/thresholds? | Role access matrix clarification |

## 13. Known source conflicts and migration warnings

Before implementation, reconcile at least the following:
- `prisma/schema.prisma` and `docs/10-database-design.md` contain legacy item states and concepts. Remove `REJECTED`; map old state names to the confirmed Vietnamese workflow only through a reviewed migration plan.
- The older schema/database design includes `menu_item_ingredients`, shortage reporting, automatic out-of-stock logic, and daily opening/closing inventory assumptions. Confirmed rules exclude recipe/usage calculations and automatic menu availability changes due to stock; inventory record shape still has an open question.
- Older workflow wording may require Order Staff to confirm/dispatch each order before Kitchen. Confirmed rules say that confirmation is not mandatory for every customer submission.
- The old schema's order-level confirmation/rejection fields may not represent the current item-level workflow.
- The one-kitchen-station-per-order assumption in the older database design must be checked against current approved User Stories and menu operations before retaining it.
- Existing Prisma schema is not proof of implemented backend behavior. This document does not claim the backend is implemented.

## 14. Review checklist

- [ ] Confirm source precedence and all business-rule mappings.
- [ ] Verify every approved User Story R2 ID and Acceptance Criterion against the traceability map.
- [ ] Approve API paths and naming.
- [ ] Approve customer/tablet credential model and resource scoping.
- [ ] Approve staff permission matrix and Manager inheritance.
- [ ] Decide Kitchen cancellation states and completed-state reversal.
- [ ] Decide payment request signal, payment methods, and invoice output.
- [ ] Decide inventory stocktake representation, units, conversion, and negative balance policy.
- [ ] Approve request/response fields, validation limits, pagination, and error conventions.
- [ ] Approve transaction, concurrency, idempotency, and audit requirements.
- [ ] Reconcile legacy Prisma schema/database design before implementation.
- [ ] Confirm this specification is ready to be marked Approved.

## 15. Review gate and status

**Current status: Draft - Awaiting Review.**

This document is submitted in a Draft Pull Request for review. Do not treat the PR as approval, do not merge it, and do not begin implementation of endpoints whose business rules remain open until the responsible human reviewer approves the relevant decisions.

### References
- `docs/11-confirmed-business-rules.md`
- `docs/supporting/user-stories/README.md`
- `docs/supporting/user-stories/confirmed-rules-alignment.md`
- `docs/supporting/user-stories/customer.md`
- `docs/supporting/user-stories/order-staff.md`
- `docs/supporting/user-stories/kitchen-staff.md`
- `docs/supporting/user-stories/inventory-staff.md`
- `docs/supporting/user-stories/manager.md`
- `docs/supporting/feature-specs/order-management.md`
- `docs/supporting/feature-specs/kitchen-management.md`
- `docs/supporting/feature-specs/payment.md`
- `docs/10-database-design.md`
- `prisma/schema.prisma`
