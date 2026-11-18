import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type StockMovementModel = runtime.Types.Result.DefaultSelection<Prisma.$StockMovementPayload>;
export type AggregateStockMovement = {
    _count: StockMovementCountAggregateOutputType | null;
    _avg: StockMovementAvgAggregateOutputType | null;
    _sum: StockMovementSumAggregateOutputType | null;
    _min: StockMovementMinAggregateOutputType | null;
    _max: StockMovementMaxAggregateOutputType | null;
};
export type StockMovementAvgAggregateOutputType = {
    id: number | null;
    ingredientId: number | null;
    quantityDelta: runtime.Decimal | null;
    createdBy: number | null;
};
export type StockMovementSumAggregateOutputType = {
    id: bigint | null;
    ingredientId: bigint | null;
    quantityDelta: runtime.Decimal | null;
    createdBy: bigint | null;
};
export type StockMovementMinAggregateOutputType = {
    id: bigint | null;
    ingredientId: bigint | null;
    movementType: string | null;
    quantityDelta: runtime.Decimal | null;
    reason: string | null;
    referenceCode: string | null;
    createdBy: bigint | null;
    createdAt: Date | null;
};
export type StockMovementMaxAggregateOutputType = {
    id: bigint | null;
    ingredientId: bigint | null;
    movementType: string | null;
    quantityDelta: runtime.Decimal | null;
    reason: string | null;
    referenceCode: string | null;
    createdBy: bigint | null;
    createdAt: Date | null;
};
export type StockMovementCountAggregateOutputType = {
    id: number;
    ingredientId: number;
    movementType: number;
    quantityDelta: number;
    reason: number;
    referenceCode: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type StockMovementAvgAggregateInputType = {
    id?: true;
    ingredientId?: true;
    quantityDelta?: true;
    createdBy?: true;
};
export type StockMovementSumAggregateInputType = {
    id?: true;
    ingredientId?: true;
    quantityDelta?: true;
    createdBy?: true;
};
export type StockMovementMinAggregateInputType = {
    id?: true;
    ingredientId?: true;
    movementType?: true;
    quantityDelta?: true;
    reason?: true;
    referenceCode?: true;
    createdBy?: true;
    createdAt?: true;
};
export type StockMovementMaxAggregateInputType = {
    id?: true;
    ingredientId?: true;
    movementType?: true;
    quantityDelta?: true;
    reason?: true;
    referenceCode?: true;
    createdBy?: true;
    createdAt?: true;
};
export type StockMovementCountAggregateInputType = {
    id?: true;
    ingredientId?: true;
    movementType?: true;
    quantityDelta?: true;
    reason?: true;
    referenceCode?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type StockMovementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StockMovementCountAggregateInputType;
    _avg?: StockMovementAvgAggregateInputType;
    _sum?: StockMovementSumAggregateInputType;
    _min?: StockMovementMinAggregateInputType;
    _max?: StockMovementMaxAggregateInputType;
};
export type GetStockMovementAggregateType<T extends StockMovementAggregateArgs> = {
    [P in keyof T & keyof AggregateStockMovement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStockMovement[P]> : Prisma.GetScalarType<T[P], AggregateStockMovement[P]>;
};
export type StockMovementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithAggregationInput | Prisma.StockMovementOrderByWithAggregationInput[];
    by: Prisma.StockMovementScalarFieldEnum[] | Prisma.StockMovementScalarFieldEnum;
    having?: Prisma.StockMovementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StockMovementCountAggregateInputType | true;
    _avg?: StockMovementAvgAggregateInputType;
    _sum?: StockMovementSumAggregateInputType;
    _min?: StockMovementMinAggregateInputType;
    _max?: StockMovementMaxAggregateInputType;
};
export type StockMovementGroupByOutputType = {
    id: bigint;
    ingredientId: bigint;
    movementType: string;
    quantityDelta: runtime.Decimal;
    reason: string;
    referenceCode: string | null;
    createdBy: bigint;
    createdAt: Date;
    _count: StockMovementCountAggregateOutputType | null;
    _avg: StockMovementAvgAggregateOutputType | null;
    _sum: StockMovementSumAggregateOutputType | null;
    _min: StockMovementMinAggregateOutputType | null;
    _max: StockMovementMaxAggregateOutputType | null;
};
export type GetStockMovementGroupByPayload<T extends StockMovementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StockMovementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StockMovementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StockMovementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StockMovementGroupByOutputType[P]>;
}>>;
export type StockMovementWhereInput = {
    AND?: Prisma.StockMovementWhereInput | Prisma.StockMovementWhereInput[];
    OR?: Prisma.StockMovementWhereInput[];
    NOT?: Prisma.StockMovementWhereInput | Prisma.StockMovementWhereInput[];
    id?: Prisma.BigIntFilter<"StockMovement"> | bigint | number;
    ingredientId?: Prisma.BigIntFilter<"StockMovement"> | bigint | number;
    movementType?: Prisma.StringFilter<"StockMovement"> | string;
    quantityDelta?: Prisma.DecimalFilter<"StockMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"StockMovement"> | string;
    referenceCode?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    createdBy?: Prisma.BigIntFilter<"StockMovement"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"StockMovement"> | Date | string;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type StockMovementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    movementType?: Prisma.SortOrder;
    quantityDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    referenceCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    ingredient?: Prisma.IngredientOrderByWithRelationInput;
    actor?: Prisma.UserOrderByWithRelationInput;
};
export type StockMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    AND?: Prisma.StockMovementWhereInput | Prisma.StockMovementWhereInput[];
    OR?: Prisma.StockMovementWhereInput[];
    NOT?: Prisma.StockMovementWhereInput | Prisma.StockMovementWhereInput[];
    ingredientId?: Prisma.BigIntFilter<"StockMovement"> | bigint | number;
    movementType?: Prisma.StringFilter<"StockMovement"> | string;
    quantityDelta?: Prisma.DecimalFilter<"StockMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"StockMovement"> | string;
    referenceCode?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    createdBy?: Prisma.BigIntFilter<"StockMovement"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"StockMovement"> | Date | string;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type StockMovementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    movementType?: Prisma.SortOrder;
    quantityDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    referenceCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.StockMovementCountOrderByAggregateInput;
    _avg?: Prisma.StockMovementAvgOrderByAggregateInput;
    _max?: Prisma.StockMovementMaxOrderByAggregateInput;
    _min?: Prisma.StockMovementMinOrderByAggregateInput;
    _sum?: Prisma.StockMovementSumOrderByAggregateInput;
};
export type StockMovementScalarWhereWithAggregatesInput = {
    AND?: Prisma.StockMovementScalarWhereWithAggregatesInput | Prisma.StockMovementScalarWhereWithAggregatesInput[];
    OR?: Prisma.StockMovementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StockMovementScalarWhereWithAggregatesInput | Prisma.StockMovementScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"StockMovement"> | bigint | number;
    ingredientId?: Prisma.BigIntWithAggregatesFilter<"StockMovement"> | bigint | number;
    movementType?: Prisma.StringWithAggregatesFilter<"StockMovement"> | string;
    quantityDelta?: Prisma.DecimalWithAggregatesFilter<"StockMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringWithAggregatesFilter<"StockMovement"> | string;
    referenceCode?: Prisma.StringNullableWithAggregatesFilter<"StockMovement"> | string | null;
    createdBy?: Prisma.BigIntWithAggregatesFilter<"StockMovement"> | bigint | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"StockMovement"> | Date | string;
};
export type StockMovementCreateInput = {
    id?: bigint | number;
    movementType: string;
    quantityDelta: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    referenceCode?: string | null;
    createdAt?: Date | string;
    ingredient: Prisma.IngredientCreateNestedOneWithoutMovementsInput;
    actor: Prisma.UserCreateNestedOneWithoutStockMovementsInput;
};
export type StockMovementUncheckedCreateInput = {
    id?: bigint | number;
    ingredientId: bigint | number;
    movementType: string;
    quantityDelta: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    referenceCode?: string | null;
    createdBy: bigint | number;
    createdAt?: Date | string;
};
export type StockMovementUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutMovementsNestedInput;
    actor?: Prisma.UserUpdateOneRequiredWithoutStockMovementsNestedInput;
};
export type StockMovementUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ingredientId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementCreateManyInput = {
    id?: bigint | number;
    ingredientId: bigint | number;
    movementType: string;
    quantityDelta: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    referenceCode?: string | null;
    createdBy: bigint | number;
    createdAt?: Date | string;
};
export type StockMovementUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ingredientId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementListRelationFilter = {
    every?: Prisma.StockMovementWhereInput;
    some?: Prisma.StockMovementWhereInput;
    none?: Prisma.StockMovementWhereInput;
};
export type StockMovementOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StockMovementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    movementType?: Prisma.SortOrder;
    quantityDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    referenceCode?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StockMovementAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantityDelta?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
};
export type StockMovementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    movementType?: Prisma.SortOrder;
    quantityDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    referenceCode?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StockMovementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    movementType?: Prisma.SortOrder;
    quantityDelta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    referenceCode?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StockMovementSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantityDelta?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
};
export type StockMovementCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutActorInput, Prisma.StockMovementUncheckedCreateWithoutActorInput> | Prisma.StockMovementCreateWithoutActorInput[] | Prisma.StockMovementUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutActorInput | Prisma.StockMovementCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.StockMovementCreateManyActorInputEnvelope;
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
};
export type StockMovementUncheckedCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutActorInput, Prisma.StockMovementUncheckedCreateWithoutActorInput> | Prisma.StockMovementCreateWithoutActorInput[] | Prisma.StockMovementUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutActorInput | Prisma.StockMovementCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.StockMovementCreateManyActorInputEnvelope;
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
};
export type StockMovementUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutActorInput, Prisma.StockMovementUncheckedCreateWithoutActorInput> | Prisma.StockMovementCreateWithoutActorInput[] | Prisma.StockMovementUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutActorInput | Prisma.StockMovementCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.StockMovementUpsertWithWhereUniqueWithoutActorInput | Prisma.StockMovementUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.StockMovementCreateManyActorInputEnvelope;
    set?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    disconnect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    delete?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    update?: Prisma.StockMovementUpdateWithWhereUniqueWithoutActorInput | Prisma.StockMovementUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.StockMovementUpdateManyWithWhereWithoutActorInput | Prisma.StockMovementUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
};
export type StockMovementUncheckedUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutActorInput, Prisma.StockMovementUncheckedCreateWithoutActorInput> | Prisma.StockMovementCreateWithoutActorInput[] | Prisma.StockMovementUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutActorInput | Prisma.StockMovementCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.StockMovementUpsertWithWhereUniqueWithoutActorInput | Prisma.StockMovementUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.StockMovementCreateManyActorInputEnvelope;
    set?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    disconnect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    delete?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    update?: Prisma.StockMovementUpdateWithWhereUniqueWithoutActorInput | Prisma.StockMovementUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.StockMovementUpdateManyWithWhereWithoutActorInput | Prisma.StockMovementUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
};
export type StockMovementCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutIngredientInput, Prisma.StockMovementUncheckedCreateWithoutIngredientInput> | Prisma.StockMovementCreateWithoutIngredientInput[] | Prisma.StockMovementUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutIngredientInput | Prisma.StockMovementCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.StockMovementCreateManyIngredientInputEnvelope;
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
};
export type StockMovementUncheckedCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutIngredientInput, Prisma.StockMovementUncheckedCreateWithoutIngredientInput> | Prisma.StockMovementCreateWithoutIngredientInput[] | Prisma.StockMovementUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutIngredientInput | Prisma.StockMovementCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.StockMovementCreateManyIngredientInputEnvelope;
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
};
export type StockMovementUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutIngredientInput, Prisma.StockMovementUncheckedCreateWithoutIngredientInput> | Prisma.StockMovementCreateWithoutIngredientInput[] | Prisma.StockMovementUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutIngredientInput | Prisma.StockMovementCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.StockMovementUpsertWithWhereUniqueWithoutIngredientInput | Prisma.StockMovementUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.StockMovementCreateManyIngredientInputEnvelope;
    set?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    disconnect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    delete?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    update?: Prisma.StockMovementUpdateWithWhereUniqueWithoutIngredientInput | Prisma.StockMovementUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.StockMovementUpdateManyWithWhereWithoutIngredientInput | Prisma.StockMovementUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
};
export type StockMovementUncheckedUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.StockMovementCreateWithoutIngredientInput, Prisma.StockMovementUncheckedCreateWithoutIngredientInput> | Prisma.StockMovementCreateWithoutIngredientInput[] | Prisma.StockMovementUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.StockMovementCreateOrConnectWithoutIngredientInput | Prisma.StockMovementCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.StockMovementUpsertWithWhereUniqueWithoutIngredientInput | Prisma.StockMovementUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.StockMovementCreateManyIngredientInputEnvelope;
    set?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    disconnect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    delete?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    connect?: Prisma.StockMovementWhereUniqueInput | Prisma.StockMovementWhereUniqueInput[];
    update?: Prisma.StockMovementUpdateWithWhereUniqueWithoutIngredientInput | Prisma.StockMovementUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.StockMovementUpdateManyWithWhereWithoutIngredientInput | Prisma.StockMovementUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
};
export type StockMovementCreateWithoutActorInput = {
    id?: bigint | number;
    movementType: string;
    quantityDelta: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    referenceCode?: string | null;
    createdAt?: Date | string;
    ingredient: Prisma.IngredientCreateNestedOneWithoutMovementsInput;
};
export type StockMovementUncheckedCreateWithoutActorInput = {
    id?: bigint | number;
    ingredientId: bigint | number;
    movementType: string;
    quantityDelta: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    referenceCode?: string | null;
    createdAt?: Date | string;
};
export type StockMovementCreateOrConnectWithoutActorInput = {
    where: Prisma.StockMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockMovementCreateWithoutActorInput, Prisma.StockMovementUncheckedCreateWithoutActorInput>;
};
export type StockMovementCreateManyActorInputEnvelope = {
    data: Prisma.StockMovementCreateManyActorInput | Prisma.StockMovementCreateManyActorInput[];
    skipDuplicates?: boolean;
};
export type StockMovementUpsertWithWhereUniqueWithoutActorInput = {
    where: Prisma.StockMovementWhereUniqueInput;
    update: Prisma.XOR<Prisma.StockMovementUpdateWithoutActorInput, Prisma.StockMovementUncheckedUpdateWithoutActorInput>;
    create: Prisma.XOR<Prisma.StockMovementCreateWithoutActorInput, Prisma.StockMovementUncheckedCreateWithoutActorInput>;
};
export type StockMovementUpdateWithWhereUniqueWithoutActorInput = {
    where: Prisma.StockMovementWhereUniqueInput;
    data: Prisma.XOR<Prisma.StockMovementUpdateWithoutActorInput, Prisma.StockMovementUncheckedUpdateWithoutActorInput>;
};
export type StockMovementUpdateManyWithWhereWithoutActorInput = {
    where: Prisma.StockMovementScalarWhereInput;
    data: Prisma.XOR<Prisma.StockMovementUpdateManyMutationInput, Prisma.StockMovementUncheckedUpdateManyWithoutActorInput>;
};
export type StockMovementScalarWhereInput = {
    AND?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
    OR?: Prisma.StockMovementScalarWhereInput[];
    NOT?: Prisma.StockMovementScalarWhereInput | Prisma.StockMovementScalarWhereInput[];
    id?: Prisma.BigIntFilter<"StockMovement"> | bigint | number;
    ingredientId?: Prisma.BigIntFilter<"StockMovement"> | bigint | number;
    movementType?: Prisma.StringFilter<"StockMovement"> | string;
    quantityDelta?: Prisma.DecimalFilter<"StockMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFilter<"StockMovement"> | string;
    referenceCode?: Prisma.StringNullableFilter<"StockMovement"> | string | null;
    createdBy?: Prisma.BigIntFilter<"StockMovement"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"StockMovement"> | Date | string;
};
export type StockMovementCreateWithoutIngredientInput = {
    id?: bigint | number;
    movementType: string;
    quantityDelta: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    referenceCode?: string | null;
    createdAt?: Date | string;
    actor: Prisma.UserCreateNestedOneWithoutStockMovementsInput;
};
export type StockMovementUncheckedCreateWithoutIngredientInput = {
    id?: bigint | number;
    movementType: string;
    quantityDelta: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    referenceCode?: string | null;
    createdBy: bigint | number;
    createdAt?: Date | string;
};
export type StockMovementCreateOrConnectWithoutIngredientInput = {
    where: Prisma.StockMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockMovementCreateWithoutIngredientInput, Prisma.StockMovementUncheckedCreateWithoutIngredientInput>;
};
export type StockMovementCreateManyIngredientInputEnvelope = {
    data: Prisma.StockMovementCreateManyIngredientInput | Prisma.StockMovementCreateManyIngredientInput[];
    skipDuplicates?: boolean;
};
export type StockMovementUpsertWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.StockMovementWhereUniqueInput;
    update: Prisma.XOR<Prisma.StockMovementUpdateWithoutIngredientInput, Prisma.StockMovementUncheckedUpdateWithoutIngredientInput>;
    create: Prisma.XOR<Prisma.StockMovementCreateWithoutIngredientInput, Prisma.StockMovementUncheckedCreateWithoutIngredientInput>;
};
export type StockMovementUpdateWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.StockMovementWhereUniqueInput;
    data: Prisma.XOR<Prisma.StockMovementUpdateWithoutIngredientInput, Prisma.StockMovementUncheckedUpdateWithoutIngredientInput>;
};
export type StockMovementUpdateManyWithWhereWithoutIngredientInput = {
    where: Prisma.StockMovementScalarWhereInput;
    data: Prisma.XOR<Prisma.StockMovementUpdateManyMutationInput, Prisma.StockMovementUncheckedUpdateManyWithoutIngredientInput>;
};
export type StockMovementCreateManyActorInput = {
    id?: bigint | number;
    ingredientId: bigint | number;
    movementType: string;
    quantityDelta: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    referenceCode?: string | null;
    createdAt?: Date | string;
};
export type StockMovementUpdateWithoutActorInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutMovementsNestedInput;
};
export type StockMovementUncheckedUpdateWithoutActorInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ingredientId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementUncheckedUpdateManyWithoutActorInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ingredientId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementCreateManyIngredientInput = {
    id?: bigint | number;
    movementType: string;
    quantityDelta: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason: string;
    referenceCode?: string | null;
    createdBy: bigint | number;
    createdAt?: Date | string;
};
export type StockMovementUpdateWithoutIngredientInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actor?: Prisma.UserUpdateOneRequiredWithoutStockMovementsNestedInput;
};
export type StockMovementUncheckedUpdateWithoutIngredientInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementUncheckedUpdateManyWithoutIngredientInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    movementType?: Prisma.StringFieldUpdateOperationsInput | string;
    quantityDelta?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdBy?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StockMovementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ingredientId?: boolean;
    movementType?: boolean;
    quantityDelta?: boolean;
    reason?: boolean;
    referenceCode?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockMovement"]>;
export type StockMovementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ingredientId?: boolean;
    movementType?: boolean;
    quantityDelta?: boolean;
    reason?: boolean;
    referenceCode?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockMovement"]>;
export type StockMovementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ingredientId?: boolean;
    movementType?: boolean;
    quantityDelta?: boolean;
    reason?: boolean;
    referenceCode?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stockMovement"]>;
export type StockMovementSelectScalar = {
    id?: boolean;
    ingredientId?: boolean;
    movementType?: boolean;
    quantityDelta?: boolean;
    reason?: boolean;
    referenceCode?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type StockMovementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "ingredientId" | "movementType" | "quantityDelta" | "reason" | "referenceCode" | "createdBy" | "createdAt", ExtArgs["result"]["stockMovement"]>;
export type StockMovementInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type StockMovementIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type StockMovementIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $StockMovementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StockMovement";
    objects: {
        ingredient: Prisma.$IngredientPayload<ExtArgs>;
        actor: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        ingredientId: bigint;
        movementType: string;
        quantityDelta: runtime.Decimal;
        reason: string;
        referenceCode: string | null;
        createdBy: bigint;
        createdAt: Date;
    }, ExtArgs["result"]["stockMovement"]>;
    composites: {};
};
export type StockMovementGetPayload<S extends boolean | null | undefined | StockMovementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StockMovementPayload, S>;
export type StockMovementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StockMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StockMovementCountAggregateInputType | true;
};
export interface StockMovementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StockMovement'];
        meta: {
            name: 'StockMovement';
        };
    };
    findUnique<T extends StockMovementFindUniqueArgs>(args: Prisma.SelectSubset<T, StockMovementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StockMovementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StockMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StockMovementFindFirstArgs>(args?: Prisma.SelectSubset<T, StockMovementFindFirstArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StockMovementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StockMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StockMovementFindManyArgs>(args?: Prisma.SelectSubset<T, StockMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StockMovementCreateArgs>(args: Prisma.SelectSubset<T, StockMovementCreateArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StockMovementCreateManyArgs>(args?: Prisma.SelectSubset<T, StockMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StockMovementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StockMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StockMovementDeleteArgs>(args: Prisma.SelectSubset<T, StockMovementDeleteArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StockMovementUpdateArgs>(args: Prisma.SelectSubset<T, StockMovementUpdateArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StockMovementDeleteManyArgs>(args?: Prisma.SelectSubset<T, StockMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StockMovementUpdateManyArgs>(args: Prisma.SelectSubset<T, StockMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StockMovementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StockMovementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StockMovementUpsertArgs>(args: Prisma.SelectSubset<T, StockMovementUpsertArgs<ExtArgs>>): Prisma.Prisma__StockMovementClient<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StockMovementCountArgs>(args?: Prisma.Subset<T, StockMovementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StockMovementCountAggregateOutputType> : number>;
    aggregate<T extends StockMovementAggregateArgs>(args: Prisma.Subset<T, StockMovementAggregateArgs>): Prisma.PrismaPromise<GetStockMovementAggregateType<T>>;
    groupBy<T extends StockMovementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StockMovementGroupByArgs['orderBy'];
    } : {
        orderBy?: StockMovementGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StockMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StockMovementFieldRefs;
}
export interface Prisma__StockMovementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    ingredient<T extends Prisma.IngredientDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.IngredientDefaultArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    actor<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StockMovementFieldRefs {
    readonly id: Prisma.FieldRef<"StockMovement", 'BigInt'>;
    readonly ingredientId: Prisma.FieldRef<"StockMovement", 'BigInt'>;
    readonly movementType: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly quantityDelta: Prisma.FieldRef<"StockMovement", 'Decimal'>;
    readonly reason: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly referenceCode: Prisma.FieldRef<"StockMovement", 'String'>;
    readonly createdBy: Prisma.FieldRef<"StockMovement", 'BigInt'>;
    readonly createdAt: Prisma.FieldRef<"StockMovement", 'DateTime'>;
}
export type StockMovementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where: Prisma.StockMovementWhereUniqueInput;
};
export type StockMovementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where: Prisma.StockMovementWhereUniqueInput;
};
export type StockMovementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StockMovementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StockMovementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StockMovementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockMovementCreateInput, Prisma.StockMovementUncheckedCreateInput>;
};
export type StockMovementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StockMovementCreateManyInput | Prisma.StockMovementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StockMovementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    data: Prisma.StockMovementCreateManyInput | Prisma.StockMovementCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StockMovementIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StockMovementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockMovementUpdateInput, Prisma.StockMovementUncheckedUpdateInput>;
    where: Prisma.StockMovementWhereUniqueInput;
};
export type StockMovementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StockMovementUpdateManyMutationInput, Prisma.StockMovementUncheckedUpdateManyInput>;
    where?: Prisma.StockMovementWhereInput;
    limit?: number;
};
export type StockMovementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StockMovementUpdateManyMutationInput, Prisma.StockMovementUncheckedUpdateManyInput>;
    where?: Prisma.StockMovementWhereInput;
    limit?: number;
    include?: Prisma.StockMovementIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StockMovementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where: Prisma.StockMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.StockMovementCreateInput, Prisma.StockMovementUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StockMovementUpdateInput, Prisma.StockMovementUncheckedUpdateInput>;
};
export type StockMovementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where: Prisma.StockMovementWhereUniqueInput;
};
export type StockMovementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
    limit?: number;
};
export type StockMovementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
};
