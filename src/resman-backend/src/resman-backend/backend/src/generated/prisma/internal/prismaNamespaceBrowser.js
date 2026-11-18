import * as runtime from "@prisma/client/runtime/index-browser";
export const Decimal = runtime.Decimal;
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    Role: 'Role',
    Permission: 'Permission',
    RolePermission: 'RolePermission',
    User: 'User',
    Employee: 'Employee',
    MenuCategory: 'MenuCategory',
    MenuItem: 'MenuItem',
    DiningTable: 'DiningTable',
    DiningSession: 'DiningSession',
    TableDevice: 'TableDevice',
    Order: 'Order',
    OrderItem: 'OrderItem',
    OrderItemStatusHistory: 'OrderItemStatusHistory',
    Ingredient: 'Ingredient',
    InventoryBalance: 'InventoryBalance',
    StockMovement: 'StockMovement',
    InventoryCountRecord: 'InventoryCountRecord',
    Payment: 'Payment',
    AuditLog: 'AuditLog'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const RoleScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt'
};
export const PermissionScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    module: 'module',
    description: 'description'
};
export const RolePermissionScalarFieldEnum = {
    roleId: 'roleId',
    permissionId: 'permissionId'
};
export const UserScalarFieldEnum = {
    id: 'id',
    roleId: 'roleId',
    username: 'username',
    email: 'email',
    passwordHash: 'passwordHash',
    isActive: 'isActive',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const EmployeeScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    employeeCode: 'employeeCode',
    fullName: 'fullName',
    phone: 'phone',
    employmentStatus: 'employmentStatus',
    hiredAt: 'hiredAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const MenuCategoryScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const MenuItemScalarFieldEnum = {
    id: 'id',
    categoryId: 'categoryId',
    code: 'code',
    name: 'name',
    description: 'description',
    price: 'price',
    imageUrl: 'imageUrl',
    availabilityStatus: 'availabilityStatus',
    availabilityReason: 'availabilityReason',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const DiningTableScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    capacity: 'capacity',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const DiningSessionScalarFieldEnum = {
    id: 'id',
    tableId: 'tableId',
    sessionCode: 'sessionCode',
    status: 'status',
    openedBy: 'openedBy',
    closedBy: 'closedBy',
    openedAt: 'openedAt',
    closedAt: 'closedAt'
};
export const TableDeviceScalarFieldEnum = {
    id: 'id',
    diningTableId: 'diningTableId',
    deviceCode: 'deviceCode',
    deviceName: 'deviceName',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const OrderScalarFieldEnum = {
    id: 'id',
    orderCode: 'orderCode',
    diningSessionId: 'diningSessionId',
    note: 'note',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const OrderItemScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    menuItemId: 'menuItemId',
    itemNameSnapshot: 'itemNameSnapshot',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    lineTotal: 'lineTotal',
    note: 'note',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const OrderItemStatusHistoryScalarFieldEnum = {
    id: 'id',
    orderItemId: 'orderItemId',
    fromStatus: 'fromStatus',
    toStatus: 'toStatus',
    reason: 'reason',
    actorId: 'actorId',
    changedAt: 'changedAt'
};
export const IngredientScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    category: 'category',
    unit: 'unit',
    lowStockThreshold: 'lowStockThreshold',
    note: 'note',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const InventoryBalanceScalarFieldEnum = {
    ingredientId: 'ingredientId',
    quantityOnHand: 'quantityOnHand',
    updatedAt: 'updatedAt'
};
export const StockMovementScalarFieldEnum = {
    id: 'id',
    ingredientId: 'ingredientId',
    movementType: 'movementType',
    quantityDelta: 'quantityDelta',
    reason: 'reason',
    referenceCode: 'referenceCode',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
export const InventoryCountRecordScalarFieldEnum = {
    id: 'id',
    ingredientId: 'ingredientId',
    actualQuantity: 'actualQuantity',
    countedAt: 'countedAt',
    countedBy: 'countedBy',
    note: 'note'
};
export const PaymentScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    amount: 'amount',
    paymentMethod: 'paymentMethod',
    status: 'status',
    transactionRef: 'transactionRef',
    paidAt: 'paidAt',
    recordedBy: 'recordedBy'
};
export const AuditLogScalarFieldEnum = {
    id: 'id',
    actorId: 'actorId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    metadata: 'metadata',
    occurredAt: 'occurredAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const NullableJsonNullValueInput = {
    DbNull: DbNull,
    JsonNull: JsonNull
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
export const JsonNullValueFilter = {
    DbNull: DbNull,
    JsonNull: JsonNull,
    AnyNull: AnyNull
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map