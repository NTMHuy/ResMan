import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type OrderItemStatusHistoryModel = runtime.Types.Result.DefaultSelection<Prisma.$OrderItemStatusHistoryPayload>;
export type AggregateOrderItemStatusHistory = {
    _count: OrderItemStatusHistoryCountAggregateOutputType | null;
    _avg: OrderItemStatusHistoryAvgAggregateOutputType | null;
    _sum: OrderItemStatusHistorySumAggregateOutputType | null;
    _min: OrderItemStatusHistoryMinAggregateOutputType | null;
    _max: OrderItemStatusHistoryMaxAggregateOutputType | null;
};
export type OrderItemStatusHistoryAvgAggregateOutputType = {
    id: number | null;
    orderItemId: number | null;
    actorId: number | null;
};
export type OrderItemStatusHistorySumAggregateOutputType = {
    id: bigint | null;
    orderItemId: bigint | null;
    actorId: bigint | null;
};
export type OrderItemStatusHistoryMinAggregateOutputType = {
    id: bigint | null;
    orderItemId: bigint | null;
    fromStatus: string | null;
    toStatus: string | null;
    reason: string | null;
    actorId: bigint | null;
    changedAt: Date | null;
};
export type OrderItemStatusHistoryMaxAggregateOutputType = {
    id: bigint | null;
    orderItemId: bigint | null;
    fromStatus: string | null;
    toStatus: string | null;
    reason: string | null;
    actorId: bigint | null;
    changedAt: Date | null;
};
export type OrderItemStatusHistoryCountAggregateOutputType = {
    id: number;
    orderItemId: number;
    fromStatus: number;
    toStatus: number;
    reason: number;
    actorId: number;
    changedAt: number;
    _all: number;
};
export type OrderItemStatusHistoryAvgAggregateInputType = {
    id?: true;
    orderItemId?: true;
    actorId?: true;
};
export type OrderItemStatusHistorySumAggregateInputType = {
    id?: true;
    orderItemId?: true;
    actorId?: true;
};
export type OrderItemStatusHistoryMinAggregateInputType = {
    id?: true;
    orderItemId?: true;
    fromStatus?: true;
    toStatus?: true;
    reason?: true;
    actorId?: true;
    changedAt?: true;
};
export type OrderItemStatusHistoryMaxAggregateInputType = {
    id?: true;
    orderItemId?: true;
    fromStatus?: true;
    toStatus?: true;
    reason?: true;
    actorId?: true;
    changedAt?: true;
};
export type OrderItemStatusHistoryCountAggregateInputType = {
    id?: true;
    orderItemId?: true;
    fromStatus?: true;
    toStatus?: true;
    reason?: true;
    actorId?: true;
    changedAt?: true;
    _all?: true;
};
export type OrderItemStatusHistoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemStatusHistoryWhereInput;
    orderBy?: Prisma.OrderItemStatusHistoryOrderByWithRelationInput | Prisma.OrderItemStatusHistoryOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemStatusHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrderItemStatusHistoryCountAggregateInputType;
    _avg?: OrderItemStatusHistoryAvgAggregateInputType;
    _sum?: OrderItemStatusHistorySumAggregateInputType;
    _min?: OrderItemStatusHistoryMinAggregateInputType;
    _max?: OrderItemStatusHistoryMaxAggregateInputType;
};
export type GetOrderItemStatusHistoryAggregateType<T extends OrderItemStatusHistoryAggregateArgs> = {
    [P in keyof T & keyof AggregateOrderItemStatusHistory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrderItemStatusHistory[P]> : Prisma.GetScalarType<T[P], AggregateOrderItemStatusHistory[P]>;
};
export type OrderItemStatusHistoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemStatusHistoryWhereInput;
    orderBy?: Prisma.OrderItemStatusHistoryOrderByWithAggregationInput | Prisma.OrderItemStatusHistoryOrderByWithAggregationInput[];
    by: Prisma.OrderItemStatusHistoryScalarFieldEnum[] | Prisma.OrderItemStatusHistoryScalarFieldEnum;
    having?: Prisma.OrderItemStatusHistoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderItemStatusHistoryCountAggregateInputType | true;
    _avg?: OrderItemStatusHistoryAvgAggregateInputType;
    _sum?: OrderItemStatusHistorySumAggregateInputType;
    _min?: OrderItemStatusHistoryMinAggregateInputType;
    _max?: OrderItemStatusHistoryMaxAggregateInputType;
};
export type OrderItemStatusHistoryGroupByOutputType = {
    id: bigint;
    orderItemId: bigint;
    fromStatus: string | null;
    toStatus: string;
    reason: string | null;
    actorId: bigint | null;
    changedAt: Date;
    _count: OrderItemStatusHistoryCountAggregateOutputType | null;
    _avg: OrderItemStatusHistoryAvgAggregateOutputType | null;
    _sum: OrderItemStatusHistorySumAggregateOutputType | null;
    _min: OrderItemStatusHistoryMinAggregateOutputType | null;
    _max: OrderItemStatusHistoryMaxAggregateOutputType | null;
};
export type GetOrderItemStatusHistoryGroupByPayload<T extends OrderItemStatusHistoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrderItemStatusHistoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrderItemStatusHistoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrderItemStatusHistoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrderItemStatusHistoryGroupByOutputType[P]>;
}>>;
export type OrderItemStatusHistoryWhereInput = {
    AND?: Prisma.OrderItemStatusHistoryWhereInput | Prisma.OrderItemStatusHistoryWhereInput[];
    OR?: Prisma.OrderItemStatusHistoryWhereInput[];
    NOT?: Prisma.OrderItemStatusHistoryWhereInput | Prisma.OrderItemStatusHistoryWhereInput[];
    id?: Prisma.BigIntFilter<"OrderItemStatusHistory"> | bigint | number;
    orderItemId?: Prisma.BigIntFilter<"OrderItemStatusHistory"> | bigint | number;
    fromStatus?: Prisma.StringNullableFilter<"OrderItemStatusHistory"> | string | null;
    toStatus?: Prisma.StringFilter<"OrderItemStatusHistory"> | string;
    reason?: Prisma.StringNullableFilter<"OrderItemStatusHistory"> | string | null;
    actorId?: Prisma.BigIntNullableFilter<"OrderItemStatusHistory"> | bigint | number | null;
    changedAt?: Prisma.DateTimeFilter<"OrderItemStatusHistory"> | Date | string;
    orderItem?: Prisma.XOR<Prisma.OrderItemScalarRelationFilter, Prisma.OrderItemWhereInput>;
    actor?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type OrderItemStatusHistoryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orderItemId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrderInput | Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    actorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    changedAt?: Prisma.SortOrder;
    orderItem?: Prisma.OrderItemOrderByWithRelationInput;
    actor?: Prisma.UserOrderByWithRelationInput;
};
export type OrderItemStatusHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    AND?: Prisma.OrderItemStatusHistoryWhereInput | Prisma.OrderItemStatusHistoryWhereInput[];
    OR?: Prisma.OrderItemStatusHistoryWhereInput[];
    NOT?: Prisma.OrderItemStatusHistoryWhereInput | Prisma.OrderItemStatusHistoryWhereInput[];
    orderItemId?: Prisma.BigIntFilter<"OrderItemStatusHistory"> | bigint | number;
    fromStatus?: Prisma.StringNullableFilter<"OrderItemStatusHistory"> | string | null;
    toStatus?: Prisma.StringFilter<"OrderItemStatusHistory"> | string;
    reason?: Prisma.StringNullableFilter<"OrderItemStatusHistory"> | string | null;
    actorId?: Prisma.BigIntNullableFilter<"OrderItemStatusHistory"> | bigint | number | null;
    changedAt?: Prisma.DateTimeFilter<"OrderItemStatusHistory"> | Date | string;
    orderItem?: Prisma.XOR<Prisma.OrderItemScalarRelationFilter, Prisma.OrderItemWhereInput>;
    actor?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type OrderItemStatusHistoryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orderItemId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrderInput | Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    actorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    changedAt?: Prisma.SortOrder;
    _count?: Prisma.OrderItemStatusHistoryCountOrderByAggregateInput;
    _avg?: Prisma.OrderItemStatusHistoryAvgOrderByAggregateInput;
    _max?: Prisma.OrderItemStatusHistoryMaxOrderByAggregateInput;
    _min?: Prisma.OrderItemStatusHistoryMinOrderByAggregateInput;
    _sum?: Prisma.OrderItemStatusHistorySumOrderByAggregateInput;
};
export type OrderItemStatusHistoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrderItemStatusHistoryScalarWhereWithAggregatesInput | Prisma.OrderItemStatusHistoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrderItemStatusHistoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrderItemStatusHistoryScalarWhereWithAggregatesInput | Prisma.OrderItemStatusHistoryScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"OrderItemStatusHistory"> | bigint | number;
    orderItemId?: Prisma.BigIntWithAggregatesFilter<"OrderItemStatusHistory"> | bigint | number;
    fromStatus?: Prisma.StringNullableWithAggregatesFilter<"OrderItemStatusHistory"> | string | null;
    toStatus?: Prisma.StringWithAggregatesFilter<"OrderItemStatusHistory"> | string;
    reason?: Prisma.StringNullableWithAggregatesFilter<"OrderItemStatusHistory"> | string | null;
    actorId?: Prisma.BigIntNullableWithAggregatesFilter<"OrderItemStatusHistory"> | bigint | number | null;
    changedAt?: Prisma.DateTimeWithAggregatesFilter<"OrderItemStatusHistory"> | Date | string;
};
export type OrderItemStatusHistoryCreateInput = {
    id?: bigint | number;
    fromStatus?: string | null;
    toStatus: string;
    reason?: string | null;
    changedAt?: Date | string;
    orderItem: Prisma.OrderItemCreateNestedOneWithoutHistoryInput;
    actor?: Prisma.UserCreateNestedOneWithoutItemHistoryInput;
};
export type OrderItemStatusHistoryUncheckedCreateInput = {
    id?: bigint | number;
    orderItemId: bigint | number;
    fromStatus?: string | null;
    toStatus: string;
    reason?: string | null;
    actorId?: bigint | number | null;
    changedAt?: Date | string;
};
export type OrderItemStatusHistoryUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orderItem?: Prisma.OrderItemUpdateOneRequiredWithoutHistoryNestedInput;
    actor?: Prisma.UserUpdateOneWithoutItemHistoryNestedInput;
};
export type OrderItemStatusHistoryUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    orderItemId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actorId?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderItemStatusHistoryCreateManyInput = {
    id?: bigint | number;
    orderItemId: bigint | number;
    fromStatus?: string | null;
    toStatus: string;
    reason?: string | null;
    actorId?: bigint | number | null;
    changedAt?: Date | string;
};
export type OrderItemStatusHistoryUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderItemStatusHistoryUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    orderItemId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actorId?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderItemStatusHistoryListRelationFilter = {
    every?: Prisma.OrderItemStatusHistoryWhereInput;
    some?: Prisma.OrderItemStatusHistoryWhereInput;
    none?: Prisma.OrderItemStatusHistoryWhereInput;
};
export type OrderItemStatusHistoryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OrderItemStatusHistoryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderItemId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    changedAt?: Prisma.SortOrder;
};
export type OrderItemStatusHistoryAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderItemId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
};
export type OrderItemStatusHistoryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderItemId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    changedAt?: Prisma.SortOrder;
};
export type OrderItemStatusHistoryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderItemId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    changedAt?: Prisma.SortOrder;
};
export type OrderItemStatusHistorySumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderItemId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
};
export type OrderItemStatusHistoryCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutActorInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput> | Prisma.OrderItemStatusHistoryCreateWithoutActorInput[] | Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.OrderItemStatusHistoryCreateOrConnectWithoutActorInput | Prisma.OrderItemStatusHistoryCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.OrderItemStatusHistoryCreateManyActorInputEnvelope;
    connect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
};
export type OrderItemStatusHistoryUncheckedCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutActorInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput> | Prisma.OrderItemStatusHistoryCreateWithoutActorInput[] | Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.OrderItemStatusHistoryCreateOrConnectWithoutActorInput | Prisma.OrderItemStatusHistoryCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.OrderItemStatusHistoryCreateManyActorInputEnvelope;
    connect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
};
export type OrderItemStatusHistoryUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutActorInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput> | Prisma.OrderItemStatusHistoryCreateWithoutActorInput[] | Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.OrderItemStatusHistoryCreateOrConnectWithoutActorInput | Prisma.OrderItemStatusHistoryCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.OrderItemStatusHistoryUpsertWithWhereUniqueWithoutActorInput | Prisma.OrderItemStatusHistoryUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.OrderItemStatusHistoryCreateManyActorInputEnvelope;
    set?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    delete?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    connect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    update?: Prisma.OrderItemStatusHistoryUpdateWithWhereUniqueWithoutActorInput | Prisma.OrderItemStatusHistoryUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.OrderItemStatusHistoryUpdateManyWithWhereWithoutActorInput | Prisma.OrderItemStatusHistoryUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.OrderItemStatusHistoryScalarWhereInput | Prisma.OrderItemStatusHistoryScalarWhereInput[];
};
export type OrderItemStatusHistoryUncheckedUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutActorInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput> | Prisma.OrderItemStatusHistoryCreateWithoutActorInput[] | Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.OrderItemStatusHistoryCreateOrConnectWithoutActorInput | Prisma.OrderItemStatusHistoryCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.OrderItemStatusHistoryUpsertWithWhereUniqueWithoutActorInput | Prisma.OrderItemStatusHistoryUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.OrderItemStatusHistoryCreateManyActorInputEnvelope;
    set?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    delete?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    connect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    update?: Prisma.OrderItemStatusHistoryUpdateWithWhereUniqueWithoutActorInput | Prisma.OrderItemStatusHistoryUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.OrderItemStatusHistoryUpdateManyWithWhereWithoutActorInput | Prisma.OrderItemStatusHistoryUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.OrderItemStatusHistoryScalarWhereInput | Prisma.OrderItemStatusHistoryScalarWhereInput[];
};
export type OrderItemStatusHistoryCreateNestedManyWithoutOrderItemInput = {
    create?: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput> | Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput[] | Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput[];
    connectOrCreate?: Prisma.OrderItemStatusHistoryCreateOrConnectWithoutOrderItemInput | Prisma.OrderItemStatusHistoryCreateOrConnectWithoutOrderItemInput[];
    createMany?: Prisma.OrderItemStatusHistoryCreateManyOrderItemInputEnvelope;
    connect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
};
export type OrderItemStatusHistoryUncheckedCreateNestedManyWithoutOrderItemInput = {
    create?: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput> | Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput[] | Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput[];
    connectOrCreate?: Prisma.OrderItemStatusHistoryCreateOrConnectWithoutOrderItemInput | Prisma.OrderItemStatusHistoryCreateOrConnectWithoutOrderItemInput[];
    createMany?: Prisma.OrderItemStatusHistoryCreateManyOrderItemInputEnvelope;
    connect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
};
export type OrderItemStatusHistoryUpdateManyWithoutOrderItemNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput> | Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput[] | Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput[];
    connectOrCreate?: Prisma.OrderItemStatusHistoryCreateOrConnectWithoutOrderItemInput | Prisma.OrderItemStatusHistoryCreateOrConnectWithoutOrderItemInput[];
    upsert?: Prisma.OrderItemStatusHistoryUpsertWithWhereUniqueWithoutOrderItemInput | Prisma.OrderItemStatusHistoryUpsertWithWhereUniqueWithoutOrderItemInput[];
    createMany?: Prisma.OrderItemStatusHistoryCreateManyOrderItemInputEnvelope;
    set?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    delete?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    connect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    update?: Prisma.OrderItemStatusHistoryUpdateWithWhereUniqueWithoutOrderItemInput | Prisma.OrderItemStatusHistoryUpdateWithWhereUniqueWithoutOrderItemInput[];
    updateMany?: Prisma.OrderItemStatusHistoryUpdateManyWithWhereWithoutOrderItemInput | Prisma.OrderItemStatusHistoryUpdateManyWithWhereWithoutOrderItemInput[];
    deleteMany?: Prisma.OrderItemStatusHistoryScalarWhereInput | Prisma.OrderItemStatusHistoryScalarWhereInput[];
};
export type OrderItemStatusHistoryUncheckedUpdateManyWithoutOrderItemNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput> | Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput[] | Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput[];
    connectOrCreate?: Prisma.OrderItemStatusHistoryCreateOrConnectWithoutOrderItemInput | Prisma.OrderItemStatusHistoryCreateOrConnectWithoutOrderItemInput[];
    upsert?: Prisma.OrderItemStatusHistoryUpsertWithWhereUniqueWithoutOrderItemInput | Prisma.OrderItemStatusHistoryUpsertWithWhereUniqueWithoutOrderItemInput[];
    createMany?: Prisma.OrderItemStatusHistoryCreateManyOrderItemInputEnvelope;
    set?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    delete?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    connect?: Prisma.OrderItemStatusHistoryWhereUniqueInput | Prisma.OrderItemStatusHistoryWhereUniqueInput[];
    update?: Prisma.OrderItemStatusHistoryUpdateWithWhereUniqueWithoutOrderItemInput | Prisma.OrderItemStatusHistoryUpdateWithWhereUniqueWithoutOrderItemInput[];
    updateMany?: Prisma.OrderItemStatusHistoryUpdateManyWithWhereWithoutOrderItemInput | Prisma.OrderItemStatusHistoryUpdateManyWithWhereWithoutOrderItemInput[];
    deleteMany?: Prisma.OrderItemStatusHistoryScalarWhereInput | Prisma.OrderItemStatusHistoryScalarWhereInput[];
};
export type OrderItemStatusHistoryCreateWithoutActorInput = {
    id?: bigint | number;
    fromStatus?: string | null;
    toStatus: string;
    reason?: string | null;
    changedAt?: Date | string;
    orderItem: Prisma.OrderItemCreateNestedOneWithoutHistoryInput;
};
export type OrderItemStatusHistoryUncheckedCreateWithoutActorInput = {
    id?: bigint | number;
    orderItemId: bigint | number;
    fromStatus?: string | null;
    toStatus: string;
    reason?: string | null;
    changedAt?: Date | string;
};
export type OrderItemStatusHistoryCreateOrConnectWithoutActorInput = {
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutActorInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput>;
};
export type OrderItemStatusHistoryCreateManyActorInputEnvelope = {
    data: Prisma.OrderItemStatusHistoryCreateManyActorInput | Prisma.OrderItemStatusHistoryCreateManyActorInput[];
    skipDuplicates?: boolean;
};
export type OrderItemStatusHistoryUpsertWithWhereUniqueWithoutActorInput = {
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateWithoutActorInput, Prisma.OrderItemStatusHistoryUncheckedUpdateWithoutActorInput>;
    create: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutActorInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutActorInput>;
};
export type OrderItemStatusHistoryUpdateWithWhereUniqueWithoutActorInput = {
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateWithoutActorInput, Prisma.OrderItemStatusHistoryUncheckedUpdateWithoutActorInput>;
};
export type OrderItemStatusHistoryUpdateManyWithWhereWithoutActorInput = {
    where: Prisma.OrderItemStatusHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateManyMutationInput, Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutActorInput>;
};
export type OrderItemStatusHistoryScalarWhereInput = {
    AND?: Prisma.OrderItemStatusHistoryScalarWhereInput | Prisma.OrderItemStatusHistoryScalarWhereInput[];
    OR?: Prisma.OrderItemStatusHistoryScalarWhereInput[];
    NOT?: Prisma.OrderItemStatusHistoryScalarWhereInput | Prisma.OrderItemStatusHistoryScalarWhereInput[];
    id?: Prisma.BigIntFilter<"OrderItemStatusHistory"> | bigint | number;
    orderItemId?: Prisma.BigIntFilter<"OrderItemStatusHistory"> | bigint | number;
    fromStatus?: Prisma.StringNullableFilter<"OrderItemStatusHistory"> | string | null;
    toStatus?: Prisma.StringFilter<"OrderItemStatusHistory"> | string;
    reason?: Prisma.StringNullableFilter<"OrderItemStatusHistory"> | string | null;
    actorId?: Prisma.BigIntNullableFilter<"OrderItemStatusHistory"> | bigint | number | null;
    changedAt?: Prisma.DateTimeFilter<"OrderItemStatusHistory"> | Date | string;
};
export type OrderItemStatusHistoryCreateWithoutOrderItemInput = {
    id?: bigint | number;
    fromStatus?: string | null;
    toStatus: string;
    reason?: string | null;
    changedAt?: Date | string;
    actor?: Prisma.UserCreateNestedOneWithoutItemHistoryInput;
};
export type OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput = {
    id?: bigint | number;
    fromStatus?: string | null;
    toStatus: string;
    reason?: string | null;
    actorId?: bigint | number | null;
    changedAt?: Date | string;
};
export type OrderItemStatusHistoryCreateOrConnectWithoutOrderItemInput = {
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput>;
};
export type OrderItemStatusHistoryCreateManyOrderItemInputEnvelope = {
    data: Prisma.OrderItemStatusHistoryCreateManyOrderItemInput | Prisma.OrderItemStatusHistoryCreateManyOrderItemInput[];
    skipDuplicates?: boolean;
};
export type OrderItemStatusHistoryUpsertWithWhereUniqueWithoutOrderItemInput = {
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateWithoutOrderItemInput, Prisma.OrderItemStatusHistoryUncheckedUpdateWithoutOrderItemInput>;
    create: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateWithoutOrderItemInput, Prisma.OrderItemStatusHistoryUncheckedCreateWithoutOrderItemInput>;
};
export type OrderItemStatusHistoryUpdateWithWhereUniqueWithoutOrderItemInput = {
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateWithoutOrderItemInput, Prisma.OrderItemStatusHistoryUncheckedUpdateWithoutOrderItemInput>;
};
export type OrderItemStatusHistoryUpdateManyWithWhereWithoutOrderItemInput = {
    where: Prisma.OrderItemStatusHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateManyMutationInput, Prisma.OrderItemStatusHistoryUncheckedUpdateManyWithoutOrderItemInput>;
};
export type OrderItemStatusHistoryCreateManyActorInput = {
    id?: bigint | number;
    orderItemId: bigint | number;
    fromStatus?: string | null;
    toStatus: string;
    reason?: string | null;
    changedAt?: Date | string;
};
export type OrderItemStatusHistoryUpdateWithoutActorInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orderItem?: Prisma.OrderItemUpdateOneRequiredWithoutHistoryNestedInput;
};
export type OrderItemStatusHistoryUncheckedUpdateWithoutActorInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    orderItemId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderItemStatusHistoryUncheckedUpdateManyWithoutActorInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    orderItemId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderItemStatusHistoryCreateManyOrderItemInput = {
    id?: bigint | number;
    fromStatus?: string | null;
    toStatus: string;
    reason?: string | null;
    actorId?: bigint | number | null;
    changedAt?: Date | string;
};
export type OrderItemStatusHistoryUpdateWithoutOrderItemInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actor?: Prisma.UserUpdateOneWithoutItemHistoryNestedInput;
};
export type OrderItemStatusHistoryUncheckedUpdateWithoutOrderItemInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actorId?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderItemStatusHistoryUncheckedUpdateManyWithoutOrderItemInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    fromStatus?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    toStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actorId?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    changedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderItemStatusHistorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderItemId?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    reason?: boolean;
    actorId?: boolean;
    changedAt?: boolean;
    orderItem?: boolean | Prisma.OrderItemDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.OrderItemStatusHistory$actorArgs<ExtArgs>;
}, ExtArgs["result"]["orderItemStatusHistory"]>;
export type OrderItemStatusHistorySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderItemId?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    reason?: boolean;
    actorId?: boolean;
    changedAt?: boolean;
    orderItem?: boolean | Prisma.OrderItemDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.OrderItemStatusHistory$actorArgs<ExtArgs>;
}, ExtArgs["result"]["orderItemStatusHistory"]>;
export type OrderItemStatusHistorySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderItemId?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    reason?: boolean;
    actorId?: boolean;
    changedAt?: boolean;
    orderItem?: boolean | Prisma.OrderItemDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.OrderItemStatusHistory$actorArgs<ExtArgs>;
}, ExtArgs["result"]["orderItemStatusHistory"]>;
export type OrderItemStatusHistorySelectScalar = {
    id?: boolean;
    orderItemId?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    reason?: boolean;
    actorId?: boolean;
    changedAt?: boolean;
};
export type OrderItemStatusHistoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orderItemId" | "fromStatus" | "toStatus" | "reason" | "actorId" | "changedAt", ExtArgs["result"]["orderItemStatusHistory"]>;
export type OrderItemStatusHistoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orderItem?: boolean | Prisma.OrderItemDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.OrderItemStatusHistory$actorArgs<ExtArgs>;
};
export type OrderItemStatusHistoryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orderItem?: boolean | Prisma.OrderItemDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.OrderItemStatusHistory$actorArgs<ExtArgs>;
};
export type OrderItemStatusHistoryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orderItem?: boolean | Prisma.OrderItemDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.OrderItemStatusHistory$actorArgs<ExtArgs>;
};
export type $OrderItemStatusHistoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OrderItemStatusHistory";
    objects: {
        orderItem: Prisma.$OrderItemPayload<ExtArgs>;
        actor: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        orderItemId: bigint;
        fromStatus: string | null;
        toStatus: string;
        reason: string | null;
        actorId: bigint | null;
        changedAt: Date;
    }, ExtArgs["result"]["orderItemStatusHistory"]>;
    composites: {};
};
export type OrderItemStatusHistoryGetPayload<S extends boolean | null | undefined | OrderItemStatusHistoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload, S>;
export type OrderItemStatusHistoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrderItemStatusHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrderItemStatusHistoryCountAggregateInputType | true;
};
export interface OrderItemStatusHistoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OrderItemStatusHistory'];
        meta: {
            name: 'OrderItemStatusHistory';
        };
    };
    findUnique<T extends OrderItemStatusHistoryFindUniqueArgs>(args: Prisma.SelectSubset<T, OrderItemStatusHistoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrderItemStatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrderItemStatusHistoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrderItemStatusHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderItemStatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrderItemStatusHistoryFindFirstArgs>(args?: Prisma.SelectSubset<T, OrderItemStatusHistoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrderItemStatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrderItemStatusHistoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrderItemStatusHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderItemStatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrderItemStatusHistoryFindManyArgs>(args?: Prisma.SelectSubset<T, OrderItemStatusHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrderItemStatusHistoryCreateArgs>(args: Prisma.SelectSubset<T, OrderItemStatusHistoryCreateArgs<ExtArgs>>): Prisma.Prisma__OrderItemStatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrderItemStatusHistoryCreateManyArgs>(args?: Prisma.SelectSubset<T, OrderItemStatusHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OrderItemStatusHistoryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrderItemStatusHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OrderItemStatusHistoryDeleteArgs>(args: Prisma.SelectSubset<T, OrderItemStatusHistoryDeleteArgs<ExtArgs>>): Prisma.Prisma__OrderItemStatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrderItemStatusHistoryUpdateArgs>(args: Prisma.SelectSubset<T, OrderItemStatusHistoryUpdateArgs<ExtArgs>>): Prisma.Prisma__OrderItemStatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrderItemStatusHistoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrderItemStatusHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrderItemStatusHistoryUpdateManyArgs>(args: Prisma.SelectSubset<T, OrderItemStatusHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OrderItemStatusHistoryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrderItemStatusHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OrderItemStatusHistoryUpsertArgs>(args: Prisma.SelectSubset<T, OrderItemStatusHistoryUpsertArgs<ExtArgs>>): Prisma.Prisma__OrderItemStatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$OrderItemStatusHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrderItemStatusHistoryCountArgs>(args?: Prisma.Subset<T, OrderItemStatusHistoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrderItemStatusHistoryCountAggregateOutputType> : number>;
    aggregate<T extends OrderItemStatusHistoryAggregateArgs>(args: Prisma.Subset<T, OrderItemStatusHistoryAggregateArgs>): Prisma.PrismaPromise<GetOrderItemStatusHistoryAggregateType<T>>;
    groupBy<T extends OrderItemStatusHistoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrderItemStatusHistoryGroupByArgs['orderBy'];
    } : {
        orderBy?: OrderItemStatusHistoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrderItemStatusHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderItemStatusHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrderItemStatusHistoryFieldRefs;
}
export interface Prisma__OrderItemStatusHistoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    orderItem<T extends Prisma.OrderItemDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrderItemDefaultArgs<ExtArgs>>): Prisma.Prisma__OrderItemClient<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    actor<T extends Prisma.OrderItemStatusHistory$actorArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrderItemStatusHistory$actorArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrderItemStatusHistoryFieldRefs {
    readonly id: Prisma.FieldRef<"OrderItemStatusHistory", 'BigInt'>;
    readonly orderItemId: Prisma.FieldRef<"OrderItemStatusHistory", 'BigInt'>;
    readonly fromStatus: Prisma.FieldRef<"OrderItemStatusHistory", 'String'>;
    readonly toStatus: Prisma.FieldRef<"OrderItemStatusHistory", 'String'>;
    readonly reason: Prisma.FieldRef<"OrderItemStatusHistory", 'String'>;
    readonly actorId: Prisma.FieldRef<"OrderItemStatusHistory", 'BigInt'>;
    readonly changedAt: Prisma.FieldRef<"OrderItemStatusHistory", 'DateTime'>;
}
export type OrderItemStatusHistoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.OrderItemStatusHistoryInclude<ExtArgs> | null;
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
};
export type OrderItemStatusHistoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.OrderItemStatusHistoryInclude<ExtArgs> | null;
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
};
export type OrderItemStatusHistoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrderItemStatusHistoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrderItemStatusHistoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrderItemStatusHistoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.OrderItemStatusHistoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateInput, Prisma.OrderItemStatusHistoryUncheckedCreateInput>;
};
export type OrderItemStatusHistoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrderItemStatusHistoryCreateManyInput | Prisma.OrderItemStatusHistoryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrderItemStatusHistoryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    data: Prisma.OrderItemStatusHistoryCreateManyInput | Prisma.OrderItemStatusHistoryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.OrderItemStatusHistoryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type OrderItemStatusHistoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.OrderItemStatusHistoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateInput, Prisma.OrderItemStatusHistoryUncheckedUpdateInput>;
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
};
export type OrderItemStatusHistoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateManyMutationInput, Prisma.OrderItemStatusHistoryUncheckedUpdateManyInput>;
    where?: Prisma.OrderItemStatusHistoryWhereInput;
    limit?: number;
};
export type OrderItemStatusHistoryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateManyMutationInput, Prisma.OrderItemStatusHistoryUncheckedUpdateManyInput>;
    where?: Prisma.OrderItemStatusHistoryWhereInput;
    limit?: number;
    include?: Prisma.OrderItemStatusHistoryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type OrderItemStatusHistoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.OrderItemStatusHistoryInclude<ExtArgs> | null;
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderItemStatusHistoryCreateInput, Prisma.OrderItemStatusHistoryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrderItemStatusHistoryUpdateInput, Prisma.OrderItemStatusHistoryUncheckedUpdateInput>;
};
export type OrderItemStatusHistoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.OrderItemStatusHistoryInclude<ExtArgs> | null;
    where: Prisma.OrderItemStatusHistoryWhereUniqueInput;
};
export type OrderItemStatusHistoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemStatusHistoryWhereInput;
    limit?: number;
};
export type OrderItemStatusHistory$actorArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type OrderItemStatusHistoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemStatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.OrderItemStatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.OrderItemStatusHistoryInclude<ExtArgs> | null;
};
