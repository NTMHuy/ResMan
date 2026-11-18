import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserAvgAggregateOutputType = {
    id: number | null;
    roleId: number | null;
};
export type UserSumAggregateOutputType = {
    id: bigint | null;
    roleId: bigint | null;
};
export type UserMinAggregateOutputType = {
    id: bigint | null;
    roleId: bigint | null;
    username: string | null;
    email: string | null;
    passwordHash: string | null;
    isActive: boolean | null;
    lastLoginAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: bigint | null;
    roleId: bigint | null;
    username: string | null;
    email: string | null;
    passwordHash: string | null;
    isActive: boolean | null;
    lastLoginAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    roleId: number;
    username: number;
    email: number;
    passwordHash: number;
    isActive: number;
    lastLoginAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserAvgAggregateInputType = {
    id?: true;
    roleId?: true;
};
export type UserSumAggregateInputType = {
    id?: true;
    roleId?: true;
};
export type UserMinAggregateInputType = {
    id?: true;
    roleId?: true;
    username?: true;
    email?: true;
    passwordHash?: true;
    isActive?: true;
    lastLoginAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    roleId?: true;
    username?: true;
    email?: true;
    passwordHash?: true;
    isActive?: true;
    lastLoginAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    roleId?: true;
    username?: true;
    email?: true;
    passwordHash?: true;
    isActive?: true;
    lastLoginAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _avg?: UserAvgAggregateInputType;
    _sum?: UserSumAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _avg?: UserAvgAggregateInputType;
    _sum?: UserSumAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: bigint;
    roleId: bigint;
    username: string;
    email: string | null;
    passwordHash: string;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.BigIntFilter<"User"> | bigint | number;
    roleId?: Prisma.BigIntFilter<"User"> | bigint | number;
    username?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringNullableFilter<"User"> | string | null;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    lastLoginAt?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
    employee?: Prisma.XOR<Prisma.EmployeeNullableScalarRelationFilter, Prisma.EmployeeWhereInput> | null;
    openedSessions?: Prisma.DiningSessionListRelationFilter;
    closedSessions?: Prisma.DiningSessionListRelationFilter;
    itemHistory?: Prisma.OrderItemStatusHistoryListRelationFilter;
    stockMovements?: Prisma.StockMovementListRelationFilter;
    inventoryCounts?: Prisma.InventoryCountRecordListRelationFilter;
    payments?: Prisma.PaymentListRelationFilter;
    auditLogs?: Prisma.AuditLogListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    role?: Prisma.RoleOrderByWithRelationInput;
    employee?: Prisma.EmployeeOrderByWithRelationInput;
    openedSessions?: Prisma.DiningSessionOrderByRelationAggregateInput;
    closedSessions?: Prisma.DiningSessionOrderByRelationAggregateInput;
    itemHistory?: Prisma.OrderItemStatusHistoryOrderByRelationAggregateInput;
    stockMovements?: Prisma.StockMovementOrderByRelationAggregateInput;
    inventoryCounts?: Prisma.InventoryCountRecordOrderByRelationAggregateInput;
    payments?: Prisma.PaymentOrderByRelationAggregateInput;
    auditLogs?: Prisma.AuditLogOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    username?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    roleId?: Prisma.BigIntFilter<"User"> | bigint | number;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    lastLoginAt?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
    employee?: Prisma.XOR<Prisma.EmployeeNullableScalarRelationFilter, Prisma.EmployeeWhereInput> | null;
    openedSessions?: Prisma.DiningSessionListRelationFilter;
    closedSessions?: Prisma.DiningSessionListRelationFilter;
    itemHistory?: Prisma.OrderItemStatusHistoryListRelationFilter;
    stockMovements?: Prisma.StockMovementListRelationFilter;
    inventoryCounts?: Prisma.InventoryCountRecordListRelationFilter;
    payments?: Prisma.PaymentListRelationFilter;
    auditLogs?: Prisma.AuditLogListRelationFilter;
}, "id" | "username" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _avg?: Prisma.UserAvgOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
    _sum?: Prisma.UserSumOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"User"> | bigint | number;
    roleId?: Prisma.BigIntWithAggregatesFilter<"User"> | bigint | number;
    username?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    isActive?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    lastLoginAt?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
    employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeUncheckedCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
    employee?: Prisma.EmployeeUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUncheckedUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateManyInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserListRelationFilter = {
    every?: Prisma.UserWhereInput;
    some?: Prisma.UserWhereInput;
    none?: Prisma.UserWhereInput;
};
export type UserOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    lastLoginAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type UserCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRoleInput, Prisma.UserUncheckedCreateWithoutRoleInput> | Prisma.UserCreateWithoutRoleInput[] | Prisma.UserUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoleInput | Prisma.UserCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.UserCreateManyRoleInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUncheckedCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRoleInput, Prisma.UserUncheckedCreateWithoutRoleInput> | Prisma.UserCreateWithoutRoleInput[] | Prisma.UserUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoleInput | Prisma.UserCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.UserCreateManyRoleInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRoleInput, Prisma.UserUncheckedCreateWithoutRoleInput> | Prisma.UserCreateWithoutRoleInput[] | Prisma.UserUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoleInput | Prisma.UserCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutRoleInput | Prisma.UserUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.UserCreateManyRoleInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutRoleInput | Prisma.UserUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutRoleInput | Prisma.UserUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRoleInput, Prisma.UserUncheckedCreateWithoutRoleInput> | Prisma.UserCreateWithoutRoleInput[] | Prisma.UserUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoleInput | Prisma.UserCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutRoleInput | Prisma.UserUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.UserCreateManyRoleInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutRoleInput | Prisma.UserUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutRoleInput | Prisma.UserUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type UserCreateNestedOneWithoutEmployeeInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutEmployeeInput, Prisma.UserUncheckedCreateWithoutEmployeeInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutEmployeeInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutEmployeeNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutEmployeeInput, Prisma.UserUncheckedCreateWithoutEmployeeInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutEmployeeInput;
    upsert?: Prisma.UserUpsertWithoutEmployeeInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutEmployeeInput, Prisma.UserUpdateWithoutEmployeeInput>, Prisma.UserUncheckedUpdateWithoutEmployeeInput>;
};
export type UserCreateNestedOneWithoutOpenedSessionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOpenedSessionsInput, Prisma.UserUncheckedCreateWithoutOpenedSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOpenedSessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserCreateNestedOneWithoutClosedSessionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutClosedSessionsInput, Prisma.UserUncheckedCreateWithoutClosedSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutClosedSessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutOpenedSessionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOpenedSessionsInput, Prisma.UserUncheckedCreateWithoutOpenedSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOpenedSessionsInput;
    upsert?: Prisma.UserUpsertWithoutOpenedSessionsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutOpenedSessionsInput, Prisma.UserUpdateWithoutOpenedSessionsInput>, Prisma.UserUncheckedUpdateWithoutOpenedSessionsInput>;
};
export type UserUpdateOneWithoutClosedSessionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutClosedSessionsInput, Prisma.UserUncheckedCreateWithoutClosedSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutClosedSessionsInput;
    upsert?: Prisma.UserUpsertWithoutClosedSessionsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutClosedSessionsInput, Prisma.UserUpdateWithoutClosedSessionsInput>, Prisma.UserUncheckedUpdateWithoutClosedSessionsInput>;
};
export type UserCreateNestedOneWithoutItemHistoryInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutItemHistoryInput, Prisma.UserUncheckedCreateWithoutItemHistoryInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutItemHistoryInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutItemHistoryNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutItemHistoryInput, Prisma.UserUncheckedCreateWithoutItemHistoryInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutItemHistoryInput;
    upsert?: Prisma.UserUpsertWithoutItemHistoryInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutItemHistoryInput, Prisma.UserUpdateWithoutItemHistoryInput>, Prisma.UserUncheckedUpdateWithoutItemHistoryInput>;
};
export type UserCreateNestedOneWithoutStockMovementsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutStockMovementsInput, Prisma.UserUncheckedCreateWithoutStockMovementsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutStockMovementsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutStockMovementsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutStockMovementsInput, Prisma.UserUncheckedCreateWithoutStockMovementsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutStockMovementsInput;
    upsert?: Prisma.UserUpsertWithoutStockMovementsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutStockMovementsInput, Prisma.UserUpdateWithoutStockMovementsInput>, Prisma.UserUncheckedUpdateWithoutStockMovementsInput>;
};
export type UserCreateNestedOneWithoutInventoryCountsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInventoryCountsInput, Prisma.UserUncheckedCreateWithoutInventoryCountsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInventoryCountsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutInventoryCountsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInventoryCountsInput, Prisma.UserUncheckedCreateWithoutInventoryCountsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInventoryCountsInput;
    upsert?: Prisma.UserUpsertWithoutInventoryCountsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutInventoryCountsInput, Prisma.UserUpdateWithoutInventoryCountsInput>, Prisma.UserUncheckedUpdateWithoutInventoryCountsInput>;
};
export type UserCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPaymentsInput, Prisma.UserUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPaymentsInput, Prisma.UserUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.UserUpsertWithoutPaymentsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPaymentsInput, Prisma.UserUpdateWithoutPaymentsInput>, Prisma.UserUncheckedUpdateWithoutPaymentsInput>;
};
export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuditLogsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuditLogsInput;
    upsert?: Prisma.UserUpsertWithoutAuditLogsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAuditLogsInput, Prisma.UserUpdateWithoutAuditLogsInput>, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
};
export type UserCreateWithoutRoleInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutRoleInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeUncheckedCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutRoleInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutRoleInput, Prisma.UserUncheckedCreateWithoutRoleInput>;
};
export type UserCreateManyRoleInputEnvelope = {
    data: Prisma.UserCreateManyRoleInput | Prisma.UserCreateManyRoleInput[];
    skipDuplicates?: boolean;
};
export type UserUpsertWithWhereUniqueWithoutRoleInput = {
    where: Prisma.UserWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserUpdateWithoutRoleInput, Prisma.UserUncheckedUpdateWithoutRoleInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutRoleInput, Prisma.UserUncheckedCreateWithoutRoleInput>;
};
export type UserUpdateWithWhereUniqueWithoutRoleInput = {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutRoleInput, Prisma.UserUncheckedUpdateWithoutRoleInput>;
};
export type UserUpdateManyWithWhereWithoutRoleInput = {
    where: Prisma.UserScalarWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyWithoutRoleInput>;
};
export type UserScalarWhereInput = {
    AND?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    OR?: Prisma.UserScalarWhereInput[];
    NOT?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    id?: Prisma.BigIntFilter<"User"> | bigint | number;
    roleId?: Prisma.BigIntFilter<"User"> | bigint | number;
    username?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringNullableFilter<"User"> | string | null;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    lastLoginAt?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
};
export type UserCreateWithoutEmployeeInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
    openedSessions?: Prisma.DiningSessionCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutEmployeeInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    openedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutEmployeeInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutEmployeeInput, Prisma.UserUncheckedCreateWithoutEmployeeInput>;
};
export type UserUpsertWithoutEmployeeInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutEmployeeInput, Prisma.UserUncheckedUpdateWithoutEmployeeInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutEmployeeInput, Prisma.UserUncheckedCreateWithoutEmployeeInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutEmployeeInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutEmployeeInput, Prisma.UserUncheckedUpdateWithoutEmployeeInput>;
};
export type UserUpdateWithoutEmployeeInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
    openedSessions?: Prisma.DiningSessionUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutEmployeeInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    openedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutOpenedSessionsInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
    employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput;
    closedSessions?: Prisma.DiningSessionCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutOpenedSessionsInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeUncheckedCreateNestedOneWithoutUserInput;
    closedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutOpenedSessionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutOpenedSessionsInput, Prisma.UserUncheckedCreateWithoutOpenedSessionsInput>;
};
export type UserCreateWithoutClosedSessionsInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
    employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionCreateNestedManyWithoutOpenerInput;
    itemHistory?: Prisma.OrderItemStatusHistoryCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutClosedSessionsInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeUncheckedCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutOpenerInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutClosedSessionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutClosedSessionsInput, Prisma.UserUncheckedCreateWithoutClosedSessionsInput>;
};
export type UserUpsertWithoutOpenedSessionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutOpenedSessionsInput, Prisma.UserUncheckedUpdateWithoutOpenedSessionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutOpenedSessionsInput, Prisma.UserUncheckedCreateWithoutOpenedSessionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutOpenedSessionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutOpenedSessionsInput, Prisma.UserUncheckedUpdateWithoutOpenedSessionsInput>;
};
export type UserUpdateWithoutOpenedSessionsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
    employee?: Prisma.EmployeeUpdateOneWithoutUserNestedInput;
    closedSessions?: Prisma.DiningSessionUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutOpenedSessionsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUncheckedUpdateOneWithoutUserNestedInput;
    closedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserUpsertWithoutClosedSessionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutClosedSessionsInput, Prisma.UserUncheckedUpdateWithoutClosedSessionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutClosedSessionsInput, Prisma.UserUncheckedCreateWithoutClosedSessionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutClosedSessionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutClosedSessionsInput, Prisma.UserUncheckedUpdateWithoutClosedSessionsInput>;
};
export type UserUpdateWithoutClosedSessionsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
    employee?: Prisma.EmployeeUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUpdateManyWithoutOpenerNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutClosedSessionsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUncheckedUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutOpenerNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutItemHistoryInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
    employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionCreateNestedManyWithoutCloserInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutItemHistoryInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeUncheckedCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutCloserInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutItemHistoryInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutItemHistoryInput, Prisma.UserUncheckedCreateWithoutItemHistoryInput>;
};
export type UserUpsertWithoutItemHistoryInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutItemHistoryInput, Prisma.UserUncheckedUpdateWithoutItemHistoryInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutItemHistoryInput, Prisma.UserUncheckedCreateWithoutItemHistoryInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutItemHistoryInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutItemHistoryInput, Prisma.UserUncheckedUpdateWithoutItemHistoryInput>;
};
export type UserUpdateWithoutItemHistoryInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
    employee?: Prisma.EmployeeUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUpdateManyWithoutCloserNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutItemHistoryInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUncheckedUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutCloserNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutStockMovementsInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
    employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutStockMovementsInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeUncheckedCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutStockMovementsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutStockMovementsInput, Prisma.UserUncheckedCreateWithoutStockMovementsInput>;
};
export type UserUpsertWithoutStockMovementsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutStockMovementsInput, Prisma.UserUncheckedUpdateWithoutStockMovementsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutStockMovementsInput, Prisma.UserUncheckedCreateWithoutStockMovementsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutStockMovementsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutStockMovementsInput, Prisma.UserUncheckedUpdateWithoutStockMovementsInput>;
};
export type UserUpdateWithoutStockMovementsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
    employee?: Prisma.EmployeeUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutStockMovementsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUncheckedUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutInventoryCountsInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
    employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutInventoryCountsInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeUncheckedCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutInventoryCountsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutInventoryCountsInput, Prisma.UserUncheckedCreateWithoutInventoryCountsInput>;
};
export type UserUpsertWithoutInventoryCountsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutInventoryCountsInput, Prisma.UserUncheckedUpdateWithoutInventoryCountsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutInventoryCountsInput, Prisma.UserUncheckedCreateWithoutInventoryCountsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutInventoryCountsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutInventoryCountsInput, Prisma.UserUncheckedUpdateWithoutInventoryCountsInput>;
};
export type UserUpdateWithoutInventoryCountsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
    employee?: Prisma.EmployeeUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutInventoryCountsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUncheckedUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutPaymentsInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
    employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutPaymentsInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeUncheckedCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPaymentsInput, Prisma.UserUncheckedCreateWithoutPaymentsInput>;
};
export type UserUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPaymentsInput, Prisma.UserUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPaymentsInput, Prisma.UserUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPaymentsInput, Prisma.UserUncheckedUpdateWithoutPaymentsInput>;
};
export type UserUpdateWithoutPaymentsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
    employee?: Prisma.EmployeeUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUncheckedUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateWithoutAuditLogsInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
    employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: bigint | number;
    roleId: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    employee?: Prisma.EmployeeUncheckedCreateNestedOneWithoutUserInput;
    openedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutOpenerInput;
    closedSessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutCloserInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput;
    stockMovements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutActorInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
};
export type UserUpsertWithoutAuditLogsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAuditLogsInput, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAuditLogsInput, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
};
export type UserUpdateWithoutAuditLogsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
    employee?: Prisma.EmployeeUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    roleId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUncheckedUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateManyRoleInput = {
    id?: bigint | number;
    username: string;
    email?: string | null;
    passwordHash: string;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateWithoutRoleInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutRoleInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    employee?: Prisma.EmployeeUncheckedUpdateOneWithoutUserNestedInput;
    openedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutOpenerNestedInput;
    closedSessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutCloserNestedInput;
    itemHistory?: Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput;
    stockMovements?: Prisma.StockMovementUncheckedUpdateManyWithoutActorNestedInput;
    inventoryCounts?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutActorNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateManyWithoutRoleInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOutputType = {
    openedSessions: number;
    closedSessions: number;
    itemHistory: number;
    stockMovements: number;
    inventoryCounts: number;
    payments: number;
    auditLogs: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    openedSessions?: boolean | UserCountOutputTypeCountOpenedSessionsArgs;
    closedSessions?: boolean | UserCountOutputTypeCountClosedSessionsArgs;
    itemHistory?: boolean | UserCountOutputTypeCountItemHistoryArgs;
    stockMovements?: boolean | UserCountOutputTypeCountStockMovementsArgs;
    inventoryCounts?: boolean | UserCountOutputTypeCountInventoryCountsArgs;
    payments?: boolean | UserCountOutputTypeCountPaymentsArgs;
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountOpenedSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DiningSessionWhereInput;
};
export type UserCountOutputTypeCountClosedSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DiningSessionWhereInput;
};
export type UserCountOutputTypeCountItemHistoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemStatusHistoryWhereInput;
};
export type UserCountOutputTypeCountStockMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
};
export type UserCountOutputTypeCountInventoryCountsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryCountRecordWhereInput;
};
export type UserCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentWhereInput;
};
export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuditLogWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    roleId?: boolean;
    username?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    isActive?: boolean;
    lastLoginAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
    employee?: boolean | Prisma.User$employeeArgs<ExtArgs>;
    openedSessions?: boolean | Prisma.User$openedSessionsArgs<ExtArgs>;
    closedSessions?: boolean | Prisma.User$closedSessionsArgs<ExtArgs>;
    itemHistory?: boolean | Prisma.User$itemHistoryArgs<ExtArgs>;
    stockMovements?: boolean | Prisma.User$stockMovementsArgs<ExtArgs>;
    inventoryCounts?: boolean | Prisma.User$inventoryCountsArgs<ExtArgs>;
    payments?: boolean | Prisma.User$paymentsArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.User$auditLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    roleId?: boolean;
    username?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    isActive?: boolean;
    lastLoginAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    roleId?: boolean;
    username?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    isActive?: boolean;
    lastLoginAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    roleId?: boolean;
    username?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    isActive?: boolean;
    lastLoginAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "roleId" | "username" | "email" | "passwordHash" | "isActive" | "lastLoginAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
    employee?: boolean | Prisma.User$employeeArgs<ExtArgs>;
    openedSessions?: boolean | Prisma.User$openedSessionsArgs<ExtArgs>;
    closedSessions?: boolean | Prisma.User$closedSessionsArgs<ExtArgs>;
    itemHistory?: boolean | Prisma.User$itemHistoryArgs<ExtArgs>;
    stockMovements?: boolean | Prisma.User$stockMovementsArgs<ExtArgs>;
    inventoryCounts?: boolean | Prisma.User$inventoryCountsArgs<ExtArgs>;
    payments?: boolean | Prisma.User$paymentsArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.User$auditLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        role: Prisma.$RolePayload<ExtArgs>;
        employee: Prisma.$EmployeePayload<ExtArgs> | null;
        openedSessions: Prisma.$DiningSessionPayload<ExtArgs>[];
        closedSessions: Prisma.$DiningSessionPayload<ExtArgs>[];
        itemHistory: Prisma.$OrderItemStatusHistoryPayload<ExtArgs>[];
        stockMovements: Prisma.$StockMovementPayload<ExtArgs>[];
        inventoryCounts: Prisma.$InventoryCountRecordPayload<ExtArgs>[];
        payments: Prisma.$PaymentPayload<ExtArgs>[];
        auditLogs: Prisma.$AuditLogPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        roleId: bigint;
        username: string;
        email: string | null;
        passwordHash: string;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    role<T extends Prisma.RoleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RoleDefaultArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    employee<T extends Prisma.User$employeeArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$employeeArgs<ExtArgs>>): Prisma.Prisma__EmployeeClient<runtime.Types.Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    openedSessions<T extends Prisma.User$openedSessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$openedSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DiningSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    closedSessions<T extends Prisma.User$closedSessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$closedSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DiningSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    itemHistory<T extends Prisma.User$itemHistoryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$itemHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    stockMovements<T extends Prisma.User$stockMovementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$stockMovementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    inventoryCounts<T extends Prisma.User$inventoryCountsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$inventoryCountsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    payments<T extends Prisma.User$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    auditLogs<T extends Prisma.User$auditLogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'BigInt'>;
    readonly roleId: Prisma.FieldRef<"User", 'BigInt'>;
    readonly username: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly isActive: Prisma.FieldRef<"User", 'Boolean'>;
    readonly lastLoginAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
    include?: Prisma.UserIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$employeeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmployeeSelect<ExtArgs> | null;
    omit?: Prisma.EmployeeOmit<ExtArgs> | null;
    include?: Prisma.EmployeeInclude<ExtArgs> | null;
    where?: Prisma.EmployeeWhereInput;
};
export type User$openedSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningSessionSelect<ExtArgs> | null;
    omit?: Prisma.DiningSessionOmit<ExtArgs> | null;
    include?: Prisma.DiningSessionInclude<ExtArgs> | null;
    where?: Prisma.DiningSessionWhereInput;
    orderBy?: Prisma.DiningSessionOrderByWithRelationInput | Prisma.DiningSessionOrderByWithRelationInput[];
    cursor?: Prisma.DiningSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DiningSessionScalarFieldEnum | Prisma.DiningSessionScalarFieldEnum[];
};
export type User$closedSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningSessionSelect<ExtArgs> | null;
    omit?: Prisma.DiningSessionOmit<ExtArgs> | null;
    include?: Prisma.DiningSessionInclude<ExtArgs> | null;
    where?: Prisma.DiningSessionWhereInput;
    orderBy?: Prisma.DiningSessionOrderByWithRelationInput | Prisma.DiningSessionOrderByWithRelationInput[];
    cursor?: Prisma.DiningSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DiningSessionScalarFieldEnum | Prisma.DiningSessionScalarFieldEnum[];
};
export type User$itemHistoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.OrderItemStatusHistoryInclude<ExtArgs> | null;
    where?: Prisma.OrderItemStatusHistoryWhereInput;
    orderBy?: Prisma.OrderItemStatusHistoryOrderByWithRelationInput | Prisma.OrderItemStatusHistoryOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemStatusHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderItemStatusHistoryScalarFieldEnum | Prisma.OrderItemStatusHistoryScalarFieldEnum[];
};
export type User$stockMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockMovementScalarFieldEnum | Prisma.StockMovementScalarFieldEnum[];
};
export type User$inventoryCountsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelect<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    include?: Prisma.InventoryCountRecordInclude<ExtArgs> | null;
    where?: Prisma.InventoryCountRecordWhereInput;
    orderBy?: Prisma.InventoryCountRecordOrderByWithRelationInput | Prisma.InventoryCountRecordOrderByWithRelationInput[];
    cursor?: Prisma.InventoryCountRecordWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InventoryCountRecordScalarFieldEnum | Prisma.InventoryCountRecordScalarFieldEnum[];
};
export type User$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentSelect<ExtArgs> | null;
    omit?: Prisma.PaymentOmit<ExtArgs> | null;
    include?: Prisma.PaymentInclude<ExtArgs> | null;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput | Prisma.PaymentOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentScalarFieldEnum | Prisma.PaymentScalarFieldEnum[];
};
export type User$auditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput | Prisma.AuditLogOrderByWithRelationInput[];
    cursor?: Prisma.AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuditLogScalarFieldEnum | Prisma.AuditLogScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
