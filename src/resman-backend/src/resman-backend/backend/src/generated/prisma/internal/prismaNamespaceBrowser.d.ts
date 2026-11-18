import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Role: "Role";
    readonly Permission: "Permission";
    readonly RolePermission: "RolePermission";
    readonly User: "User";
    readonly Employee: "Employee";
    readonly MenuCategory: "MenuCategory";
    readonly MenuItem: "MenuItem";
    readonly DiningTable: "DiningTable";
    readonly DiningSession: "DiningSession";
    readonly TableDevice: "TableDevice";
    readonly Order: "Order";
    readonly OrderItem: "OrderItem";
    readonly OrderItemStatusHistory: "OrderItemStatusHistory";
    readonly Ingredient: "Ingredient";
    readonly InventoryBalance: "InventoryBalance";
    readonly StockMovement: "StockMovement";
    readonly InventoryCountRecord: "InventoryCountRecord";
    readonly Payment: "Payment";
    readonly AuditLog: "AuditLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const RoleScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly description: "description";
    readonly createdAt: "createdAt";
};
export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum];
export declare const PermissionScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly module: "module";
    readonly description: "description";
};
export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum];
export declare const RolePermissionScalarFieldEnum: {
    readonly roleId: "roleId";
    readonly permissionId: "permissionId";
};
export type RolePermissionScalarFieldEnum = (typeof RolePermissionScalarFieldEnum)[keyof typeof RolePermissionScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly roleId: "roleId";
    readonly username: "username";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly isActive: "isActive";
    readonly lastLoginAt: "lastLoginAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const EmployeeScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly employeeCode: "employeeCode";
    readonly fullName: "fullName";
    readonly phone: "phone";
    readonly employmentStatus: "employmentStatus";
    readonly hiredAt: "hiredAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EmployeeScalarFieldEnum = (typeof EmployeeScalarFieldEnum)[keyof typeof EmployeeScalarFieldEnum];
export declare const MenuCategoryScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly description: "description";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MenuCategoryScalarFieldEnum = (typeof MenuCategoryScalarFieldEnum)[keyof typeof MenuCategoryScalarFieldEnum];
export declare const MenuItemScalarFieldEnum: {
    readonly id: "id";
    readonly categoryId: "categoryId";
    readonly code: "code";
    readonly name: "name";
    readonly description: "description";
    readonly price: "price";
    readonly imageUrl: "imageUrl";
    readonly availabilityStatus: "availabilityStatus";
    readonly availabilityReason: "availabilityReason";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MenuItemScalarFieldEnum = (typeof MenuItemScalarFieldEnum)[keyof typeof MenuItemScalarFieldEnum];
export declare const DiningTableScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly capacity: "capacity";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type DiningTableScalarFieldEnum = (typeof DiningTableScalarFieldEnum)[keyof typeof DiningTableScalarFieldEnum];
export declare const DiningSessionScalarFieldEnum: {
    readonly id: "id";
    readonly tableId: "tableId";
    readonly sessionCode: "sessionCode";
    readonly status: "status";
    readonly openedBy: "openedBy";
    readonly closedBy: "closedBy";
    readonly openedAt: "openedAt";
    readonly closedAt: "closedAt";
};
export type DiningSessionScalarFieldEnum = (typeof DiningSessionScalarFieldEnum)[keyof typeof DiningSessionScalarFieldEnum];
export declare const TableDeviceScalarFieldEnum: {
    readonly id: "id";
    readonly diningTableId: "diningTableId";
    readonly deviceCode: "deviceCode";
    readonly deviceName: "deviceName";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TableDeviceScalarFieldEnum = (typeof TableDeviceScalarFieldEnum)[keyof typeof TableDeviceScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id: "id";
    readonly orderCode: "orderCode";
    readonly diningSessionId: "diningSessionId";
    readonly note: "note";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const OrderItemScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly menuItemId: "menuItemId";
    readonly itemNameSnapshot: "itemNameSnapshot";
    readonly quantity: "quantity";
    readonly unitPrice: "unitPrice";
    readonly lineTotal: "lineTotal";
    readonly note: "note";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum];
export declare const OrderItemStatusHistoryScalarFieldEnum: {
    readonly id: "id";
    readonly orderItemId: "orderItemId";
    readonly fromStatus: "fromStatus";
    readonly toStatus: "toStatus";
    readonly reason: "reason";
    readonly actorId: "actorId";
    readonly changedAt: "changedAt";
};
export type OrderItemStatusHistoryScalarFieldEnum = (typeof OrderItemStatusHistoryScalarFieldEnum)[keyof typeof OrderItemStatusHistoryScalarFieldEnum];
export declare const IngredientScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly category: "category";
    readonly unit: "unit";
    readonly lowStockThreshold: "lowStockThreshold";
    readonly note: "note";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type IngredientScalarFieldEnum = (typeof IngredientScalarFieldEnum)[keyof typeof IngredientScalarFieldEnum];
export declare const InventoryBalanceScalarFieldEnum: {
    readonly ingredientId: "ingredientId";
    readonly quantityOnHand: "quantityOnHand";
    readonly updatedAt: "updatedAt";
};
export type InventoryBalanceScalarFieldEnum = (typeof InventoryBalanceScalarFieldEnum)[keyof typeof InventoryBalanceScalarFieldEnum];
export declare const StockMovementScalarFieldEnum: {
    readonly id: "id";
    readonly ingredientId: "ingredientId";
    readonly movementType: "movementType";
    readonly quantityDelta: "quantityDelta";
    readonly reason: "reason";
    readonly referenceCode: "referenceCode";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type StockMovementScalarFieldEnum = (typeof StockMovementScalarFieldEnum)[keyof typeof StockMovementScalarFieldEnum];
export declare const InventoryCountRecordScalarFieldEnum: {
    readonly id: "id";
    readonly ingredientId: "ingredientId";
    readonly actualQuantity: "actualQuantity";
    readonly countedAt: "countedAt";
    readonly countedBy: "countedBy";
    readonly note: "note";
};
export type InventoryCountRecordScalarFieldEnum = (typeof InventoryCountRecordScalarFieldEnum)[keyof typeof InventoryCountRecordScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly amount: "amount";
    readonly paymentMethod: "paymentMethod";
    readonly status: "status";
    readonly transactionRef: "transactionRef";
    readonly paidAt: "paidAt";
    readonly recordedBy: "recordedBy";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly actorId: "actorId";
    readonly action: "action";
    readonly entityType: "entityType";
    readonly entityId: "entityId";
    readonly metadata: "metadata";
    readonly occurredAt: "occurredAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
