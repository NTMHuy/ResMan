import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type InventoryCountRecordModel = runtime.Types.Result.DefaultSelection<Prisma.$InventoryCountRecordPayload>;
export type AggregateInventoryCountRecord = {
    _count: InventoryCountRecordCountAggregateOutputType | null;
    _avg: InventoryCountRecordAvgAggregateOutputType | null;
    _sum: InventoryCountRecordSumAggregateOutputType | null;
    _min: InventoryCountRecordMinAggregateOutputType | null;
    _max: InventoryCountRecordMaxAggregateOutputType | null;
};
export type InventoryCountRecordAvgAggregateOutputType = {
    id: number | null;
    ingredientId: number | null;
    actualQuantity: runtime.Decimal | null;
    countedBy: number | null;
};
export type InventoryCountRecordSumAggregateOutputType = {
    id: bigint | null;
    ingredientId: bigint | null;
    actualQuantity: runtime.Decimal | null;
    countedBy: bigint | null;
};
export type InventoryCountRecordMinAggregateOutputType = {
    id: bigint | null;
    ingredientId: bigint | null;
    actualQuantity: runtime.Decimal | null;
    countedAt: Date | null;
    countedBy: bigint | null;
    note: string | null;
};
export type InventoryCountRecordMaxAggregateOutputType = {
    id: bigint | null;
    ingredientId: bigint | null;
    actualQuantity: runtime.Decimal | null;
    countedAt: Date | null;
    countedBy: bigint | null;
    note: string | null;
};
export type InventoryCountRecordCountAggregateOutputType = {
    id: number;
    ingredientId: number;
    actualQuantity: number;
    countedAt: number;
    countedBy: number;
    note: number;
    _all: number;
};
export type InventoryCountRecordAvgAggregateInputType = {
    id?: true;
    ingredientId?: true;
    actualQuantity?: true;
    countedBy?: true;
};
export type InventoryCountRecordSumAggregateInputType = {
    id?: true;
    ingredientId?: true;
    actualQuantity?: true;
    countedBy?: true;
};
export type InventoryCountRecordMinAggregateInputType = {
    id?: true;
    ingredientId?: true;
    actualQuantity?: true;
    countedAt?: true;
    countedBy?: true;
    note?: true;
};
export type InventoryCountRecordMaxAggregateInputType = {
    id?: true;
    ingredientId?: true;
    actualQuantity?: true;
    countedAt?: true;
    countedBy?: true;
    note?: true;
};
export type InventoryCountRecordCountAggregateInputType = {
    id?: true;
    ingredientId?: true;
    actualQuantity?: true;
    countedAt?: true;
    countedBy?: true;
    note?: true;
    _all?: true;
};
export type InventoryCountRecordAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryCountRecordWhereInput;
    orderBy?: Prisma.InventoryCountRecordOrderByWithRelationInput | Prisma.InventoryCountRecordOrderByWithRelationInput[];
    cursor?: Prisma.InventoryCountRecordWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | InventoryCountRecordCountAggregateInputType;
    _avg?: InventoryCountRecordAvgAggregateInputType;
    _sum?: InventoryCountRecordSumAggregateInputType;
    _min?: InventoryCountRecordMinAggregateInputType;
    _max?: InventoryCountRecordMaxAggregateInputType;
};
export type GetInventoryCountRecordAggregateType<T extends InventoryCountRecordAggregateArgs> = {
    [P in keyof T & keyof AggregateInventoryCountRecord]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInventoryCountRecord[P]> : Prisma.GetScalarType<T[P], AggregateInventoryCountRecord[P]>;
};
export type InventoryCountRecordGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryCountRecordWhereInput;
    orderBy?: Prisma.InventoryCountRecordOrderByWithAggregationInput | Prisma.InventoryCountRecordOrderByWithAggregationInput[];
    by: Prisma.InventoryCountRecordScalarFieldEnum[] | Prisma.InventoryCountRecordScalarFieldEnum;
    having?: Prisma.InventoryCountRecordScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InventoryCountRecordCountAggregateInputType | true;
    _avg?: InventoryCountRecordAvgAggregateInputType;
    _sum?: InventoryCountRecordSumAggregateInputType;
    _min?: InventoryCountRecordMinAggregateInputType;
    _max?: InventoryCountRecordMaxAggregateInputType;
};
export type InventoryCountRecordGroupByOutputType = {
    id: bigint;
    ingredientId: bigint;
    actualQuantity: runtime.Decimal;
    countedAt: Date;
    countedBy: bigint;
    note: string | null;
    _count: InventoryCountRecordCountAggregateOutputType | null;
    _avg: InventoryCountRecordAvgAggregateOutputType | null;
    _sum: InventoryCountRecordSumAggregateOutputType | null;
    _min: InventoryCountRecordMinAggregateOutputType | null;
    _max: InventoryCountRecordMaxAggregateOutputType | null;
};
export type GetInventoryCountRecordGroupByPayload<T extends InventoryCountRecordGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InventoryCountRecordGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InventoryCountRecordGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InventoryCountRecordGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InventoryCountRecordGroupByOutputType[P]>;
}>>;
export type InventoryCountRecordWhereInput = {
    AND?: Prisma.InventoryCountRecordWhereInput | Prisma.InventoryCountRecordWhereInput[];
    OR?: Prisma.InventoryCountRecordWhereInput[];
    NOT?: Prisma.InventoryCountRecordWhereInput | Prisma.InventoryCountRecordWhereInput[];
    id?: Prisma.BigIntFilter<"InventoryCountRecord"> | bigint | number;
    ingredientId?: Prisma.BigIntFilter<"InventoryCountRecord"> | bigint | number;
    actualQuantity?: Prisma.DecimalFilter<"InventoryCountRecord"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFilter<"InventoryCountRecord"> | Date | string;
    countedBy?: Prisma.BigIntFilter<"InventoryCountRecord"> | bigint | number;
    note?: Prisma.StringNullableFilter<"InventoryCountRecord"> | string | null;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type InventoryCountRecordOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    actualQuantity?: Prisma.SortOrder;
    countedAt?: Prisma.SortOrder;
    countedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    ingredient?: Prisma.IngredientOrderByWithRelationInput;
    actor?: Prisma.UserOrderByWithRelationInput;
};
export type InventoryCountRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    AND?: Prisma.InventoryCountRecordWhereInput | Prisma.InventoryCountRecordWhereInput[];
    OR?: Prisma.InventoryCountRecordWhereInput[];
    NOT?: Prisma.InventoryCountRecordWhereInput | Prisma.InventoryCountRecordWhereInput[];
    ingredientId?: Prisma.BigIntFilter<"InventoryCountRecord"> | bigint | number;
    actualQuantity?: Prisma.DecimalFilter<"InventoryCountRecord"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFilter<"InventoryCountRecord"> | Date | string;
    countedBy?: Prisma.BigIntFilter<"InventoryCountRecord"> | bigint | number;
    note?: Prisma.StringNullableFilter<"InventoryCountRecord"> | string | null;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type InventoryCountRecordOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    actualQuantity?: Prisma.SortOrder;
    countedAt?: Prisma.SortOrder;
    countedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.InventoryCountRecordCountOrderByAggregateInput;
    _avg?: Prisma.InventoryCountRecordAvgOrderByAggregateInput;
    _max?: Prisma.InventoryCountRecordMaxOrderByAggregateInput;
    _min?: Prisma.InventoryCountRecordMinOrderByAggregateInput;
    _sum?: Prisma.InventoryCountRecordSumOrderByAggregateInput;
};
export type InventoryCountRecordScalarWhereWithAggregatesInput = {
    AND?: Prisma.InventoryCountRecordScalarWhereWithAggregatesInput | Prisma.InventoryCountRecordScalarWhereWithAggregatesInput[];
    OR?: Prisma.InventoryCountRecordScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InventoryCountRecordScalarWhereWithAggregatesInput | Prisma.InventoryCountRecordScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"InventoryCountRecord"> | bigint | number;
    ingredientId?: Prisma.BigIntWithAggregatesFilter<"InventoryCountRecord"> | bigint | number;
    actualQuantity?: Prisma.DecimalWithAggregatesFilter<"InventoryCountRecord"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeWithAggregatesFilter<"InventoryCountRecord"> | Date | string;
    countedBy?: Prisma.BigIntWithAggregatesFilter<"InventoryCountRecord"> | bigint | number;
    note?: Prisma.StringNullableWithAggregatesFilter<"InventoryCountRecord"> | string | null;
};
export type InventoryCountRecordCreateInput = {
    id?: bigint | number;
    actualQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Date | string;
    note?: string | null;
    ingredient: Prisma.IngredientCreateNestedOneWithoutCountRecordsInput;
    actor: Prisma.UserCreateNestedOneWithoutInventoryCountsInput;
};
export type InventoryCountRecordUncheckedCreateInput = {
    id?: bigint | number;
    ingredientId: bigint | number;
    actualQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Date | string;
    countedBy: bigint | number;
    note?: string | null;
};
export type InventoryCountRecordUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutCountRecordsNestedInput;
    actor?: Prisma.UserUpdateOneRequiredWithoutInventoryCountsNestedInput;
};
export type InventoryCountRecordUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ingredientId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    countedBy?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InventoryCountRecordCreateManyInput = {
    id?: bigint | number;
    ingredientId: bigint | number;
    actualQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Date | string;
    countedBy: bigint | number;
    note?: string | null;
};
export type InventoryCountRecordUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InventoryCountRecordUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ingredientId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    countedBy?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InventoryCountRecordListRelationFilter = {
    every?: Prisma.InventoryCountRecordWhereInput;
    some?: Prisma.InventoryCountRecordWhereInput;
    none?: Prisma.InventoryCountRecordWhereInput;
};
export type InventoryCountRecordOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type InventoryCountRecordCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    actualQuantity?: Prisma.SortOrder;
    countedAt?: Prisma.SortOrder;
    countedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
};
export type InventoryCountRecordAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    actualQuantity?: Prisma.SortOrder;
    countedBy?: Prisma.SortOrder;
};
export type InventoryCountRecordMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    actualQuantity?: Prisma.SortOrder;
    countedAt?: Prisma.SortOrder;
    countedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
};
export type InventoryCountRecordMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    actualQuantity?: Prisma.SortOrder;
    countedAt?: Prisma.SortOrder;
    countedBy?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
};
export type InventoryCountRecordSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    actualQuantity?: Prisma.SortOrder;
    countedBy?: Prisma.SortOrder;
};
export type InventoryCountRecordCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutActorInput, Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput> | Prisma.InventoryCountRecordCreateWithoutActorInput[] | Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.InventoryCountRecordCreateOrConnectWithoutActorInput | Prisma.InventoryCountRecordCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.InventoryCountRecordCreateManyActorInputEnvelope;
    connect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
};
export type InventoryCountRecordUncheckedCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutActorInput, Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput> | Prisma.InventoryCountRecordCreateWithoutActorInput[] | Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.InventoryCountRecordCreateOrConnectWithoutActorInput | Prisma.InventoryCountRecordCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.InventoryCountRecordCreateManyActorInputEnvelope;
    connect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
};
export type InventoryCountRecordUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutActorInput, Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput> | Prisma.InventoryCountRecordCreateWithoutActorInput[] | Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.InventoryCountRecordCreateOrConnectWithoutActorInput | Prisma.InventoryCountRecordCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.InventoryCountRecordUpsertWithWhereUniqueWithoutActorInput | Prisma.InventoryCountRecordUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.InventoryCountRecordCreateManyActorInputEnvelope;
    set?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    disconnect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    delete?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    connect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    update?: Prisma.InventoryCountRecordUpdateWithWhereUniqueWithoutActorInput | Prisma.InventoryCountRecordUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.InventoryCountRecordUpdateManyWithWhereWithoutActorInput | Prisma.InventoryCountRecordUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.InventoryCountRecordScalarWhereInput | Prisma.InventoryCountRecordScalarWhereInput[];
};
export type InventoryCountRecordUncheckedUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutActorInput, Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput> | Prisma.InventoryCountRecordCreateWithoutActorInput[] | Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.InventoryCountRecordCreateOrConnectWithoutActorInput | Prisma.InventoryCountRecordCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.InventoryCountRecordUpsertWithWhereUniqueWithoutActorInput | Prisma.InventoryCountRecordUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.InventoryCountRecordCreateManyActorInputEnvelope;
    set?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    disconnect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    delete?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    connect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    update?: Prisma.InventoryCountRecordUpdateWithWhereUniqueWithoutActorInput | Prisma.InventoryCountRecordUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.InventoryCountRecordUpdateManyWithWhereWithoutActorInput | Prisma.InventoryCountRecordUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.InventoryCountRecordScalarWhereInput | Prisma.InventoryCountRecordScalarWhereInput[];
};
export type InventoryCountRecordCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutIngredientInput, Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput> | Prisma.InventoryCountRecordCreateWithoutIngredientInput[] | Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.InventoryCountRecordCreateOrConnectWithoutIngredientInput | Prisma.InventoryCountRecordCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.InventoryCountRecordCreateManyIngredientInputEnvelope;
    connect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
};
export type InventoryCountRecordUncheckedCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutIngredientInput, Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput> | Prisma.InventoryCountRecordCreateWithoutIngredientInput[] | Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.InventoryCountRecordCreateOrConnectWithoutIngredientInput | Prisma.InventoryCountRecordCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.InventoryCountRecordCreateManyIngredientInputEnvelope;
    connect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
};
export type InventoryCountRecordUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutIngredientInput, Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput> | Prisma.InventoryCountRecordCreateWithoutIngredientInput[] | Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.InventoryCountRecordCreateOrConnectWithoutIngredientInput | Prisma.InventoryCountRecordCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.InventoryCountRecordUpsertWithWhereUniqueWithoutIngredientInput | Prisma.InventoryCountRecordUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.InventoryCountRecordCreateManyIngredientInputEnvelope;
    set?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    disconnect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    delete?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    connect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    update?: Prisma.InventoryCountRecordUpdateWithWhereUniqueWithoutIngredientInput | Prisma.InventoryCountRecordUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.InventoryCountRecordUpdateManyWithWhereWithoutIngredientInput | Prisma.InventoryCountRecordUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.InventoryCountRecordScalarWhereInput | Prisma.InventoryCountRecordScalarWhereInput[];
};
export type InventoryCountRecordUncheckedUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutIngredientInput, Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput> | Prisma.InventoryCountRecordCreateWithoutIngredientInput[] | Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.InventoryCountRecordCreateOrConnectWithoutIngredientInput | Prisma.InventoryCountRecordCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.InventoryCountRecordUpsertWithWhereUniqueWithoutIngredientInput | Prisma.InventoryCountRecordUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.InventoryCountRecordCreateManyIngredientInputEnvelope;
    set?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    disconnect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    delete?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    connect?: Prisma.InventoryCountRecordWhereUniqueInput | Prisma.InventoryCountRecordWhereUniqueInput[];
    update?: Prisma.InventoryCountRecordUpdateWithWhereUniqueWithoutIngredientInput | Prisma.InventoryCountRecordUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.InventoryCountRecordUpdateManyWithWhereWithoutIngredientInput | Prisma.InventoryCountRecordUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.InventoryCountRecordScalarWhereInput | Prisma.InventoryCountRecordScalarWhereInput[];
};
export type InventoryCountRecordCreateWithoutActorInput = {
    id?: bigint | number;
    actualQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Date | string;
    note?: string | null;
    ingredient: Prisma.IngredientCreateNestedOneWithoutCountRecordsInput;
};
export type InventoryCountRecordUncheckedCreateWithoutActorInput = {
    id?: bigint | number;
    ingredientId: bigint | number;
    actualQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Date | string;
    note?: string | null;
};
export type InventoryCountRecordCreateOrConnectWithoutActorInput = {
    where: Prisma.InventoryCountRecordWhereUniqueInput;
    create: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutActorInput, Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput>;
};
export type InventoryCountRecordCreateManyActorInputEnvelope = {
    data: Prisma.InventoryCountRecordCreateManyActorInput | Prisma.InventoryCountRecordCreateManyActorInput[];
    skipDuplicates?: boolean;
};
export type InventoryCountRecordUpsertWithWhereUniqueWithoutActorInput = {
    where: Prisma.InventoryCountRecordWhereUniqueInput;
    update: Prisma.XOR<Prisma.InventoryCountRecordUpdateWithoutActorInput, Prisma.InventoryCountRecordUncheckedUpdateWithoutActorInput>;
    create: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutActorInput, Prisma.InventoryCountRecordUncheckedCreateWithoutActorInput>;
};
export type InventoryCountRecordUpdateWithWhereUniqueWithoutActorInput = {
    where: Prisma.InventoryCountRecordWhereUniqueInput;
    data: Prisma.XOR<Prisma.InventoryCountRecordUpdateWithoutActorInput, Prisma.InventoryCountRecordUncheckedUpdateWithoutActorInput>;
};
export type InventoryCountRecordUpdateManyWithWhereWithoutActorInput = {
    where: Prisma.InventoryCountRecordScalarWhereInput;
    data: Prisma.XOR<Prisma.InventoryCountRecordUpdateManyMutationInput, Prisma.InventoryCountRecordUncheckedUpdateManyWithoutActorInput>;
};
export type InventoryCountRecordScalarWhereInput = {
    AND?: Prisma.InventoryCountRecordScalarWhereInput | Prisma.InventoryCountRecordScalarWhereInput[];
    OR?: Prisma.InventoryCountRecordScalarWhereInput[];
    NOT?: Prisma.InventoryCountRecordScalarWhereInput | Prisma.InventoryCountRecordScalarWhereInput[];
    id?: Prisma.BigIntFilter<"InventoryCountRecord"> | bigint | number;
    ingredientId?: Prisma.BigIntFilter<"InventoryCountRecord"> | bigint | number;
    actualQuantity?: Prisma.DecimalFilter<"InventoryCountRecord"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFilter<"InventoryCountRecord"> | Date | string;
    countedBy?: Prisma.BigIntFilter<"InventoryCountRecord"> | bigint | number;
    note?: Prisma.StringNullableFilter<"InventoryCountRecord"> | string | null;
};
export type InventoryCountRecordCreateWithoutIngredientInput = {
    id?: bigint | number;
    actualQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Date | string;
    note?: string | null;
    actor: Prisma.UserCreateNestedOneWithoutInventoryCountsInput;
};
export type InventoryCountRecordUncheckedCreateWithoutIngredientInput = {
    id?: bigint | number;
    actualQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Date | string;
    countedBy: bigint | number;
    note?: string | null;
};
export type InventoryCountRecordCreateOrConnectWithoutIngredientInput = {
    where: Prisma.InventoryCountRecordWhereUniqueInput;
    create: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutIngredientInput, Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput>;
};
export type InventoryCountRecordCreateManyIngredientInputEnvelope = {
    data: Prisma.InventoryCountRecordCreateManyIngredientInput | Prisma.InventoryCountRecordCreateManyIngredientInput[];
    skipDuplicates?: boolean;
};
export type InventoryCountRecordUpsertWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.InventoryCountRecordWhereUniqueInput;
    update: Prisma.XOR<Prisma.InventoryCountRecordUpdateWithoutIngredientInput, Prisma.InventoryCountRecordUncheckedUpdateWithoutIngredientInput>;
    create: Prisma.XOR<Prisma.InventoryCountRecordCreateWithoutIngredientInput, Prisma.InventoryCountRecordUncheckedCreateWithoutIngredientInput>;
};
export type InventoryCountRecordUpdateWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.InventoryCountRecordWhereUniqueInput;
    data: Prisma.XOR<Prisma.InventoryCountRecordUpdateWithoutIngredientInput, Prisma.InventoryCountRecordUncheckedUpdateWithoutIngredientInput>;
};
export type InventoryCountRecordUpdateManyWithWhereWithoutIngredientInput = {
    where: Prisma.InventoryCountRecordScalarWhereInput;
    data: Prisma.XOR<Prisma.InventoryCountRecordUpdateManyMutationInput, Prisma.InventoryCountRecordUncheckedUpdateManyWithoutIngredientInput>;
};
export type InventoryCountRecordCreateManyActorInput = {
    id?: bigint | number;
    ingredientId: bigint | number;
    actualQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Date | string;
    note?: string | null;
};
export type InventoryCountRecordUpdateWithoutActorInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutCountRecordsNestedInput;
};
export type InventoryCountRecordUncheckedUpdateWithoutActorInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ingredientId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InventoryCountRecordUncheckedUpdateManyWithoutActorInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    ingredientId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InventoryCountRecordCreateManyIngredientInput = {
    id?: bigint | number;
    actualQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Date | string;
    countedBy: bigint | number;
    note?: string | null;
};
export type InventoryCountRecordUpdateWithoutIngredientInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actor?: Prisma.UserUpdateOneRequiredWithoutInventoryCountsNestedInput;
};
export type InventoryCountRecordUncheckedUpdateWithoutIngredientInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    countedBy?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InventoryCountRecordUncheckedUpdateManyWithoutIngredientInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    actualQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    countedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    countedBy?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InventoryCountRecordSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ingredientId?: boolean;
    actualQuantity?: boolean;
    countedAt?: boolean;
    countedBy?: boolean;
    note?: boolean;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryCountRecord"]>;
export type InventoryCountRecordSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ingredientId?: boolean;
    actualQuantity?: boolean;
    countedAt?: boolean;
    countedBy?: boolean;
    note?: boolean;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryCountRecord"]>;
export type InventoryCountRecordSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ingredientId?: boolean;
    actualQuantity?: boolean;
    countedAt?: boolean;
    countedBy?: boolean;
    note?: boolean;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryCountRecord"]>;
export type InventoryCountRecordSelectScalar = {
    id?: boolean;
    ingredientId?: boolean;
    actualQuantity?: boolean;
    countedAt?: boolean;
    countedBy?: boolean;
    note?: boolean;
};
export type InventoryCountRecordOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "ingredientId" | "actualQuantity" | "countedAt" | "countedBy" | "note", ExtArgs["result"]["inventoryCountRecord"]>;
export type InventoryCountRecordInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type InventoryCountRecordIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type InventoryCountRecordIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $InventoryCountRecordPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "InventoryCountRecord";
    objects: {
        ingredient: Prisma.$IngredientPayload<ExtArgs>;
        actor: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        ingredientId: bigint;
        actualQuantity: runtime.Decimal;
        countedAt: Date;
        countedBy: bigint;
        note: string | null;
    }, ExtArgs["result"]["inventoryCountRecord"]>;
    composites: {};
};
export type InventoryCountRecordGetPayload<S extends boolean | null | undefined | InventoryCountRecordDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload, S>;
export type InventoryCountRecordCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InventoryCountRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InventoryCountRecordCountAggregateInputType | true;
};
export interface InventoryCountRecordDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['InventoryCountRecord'];
        meta: {
            name: 'InventoryCountRecord';
        };
    };
    findUnique<T extends InventoryCountRecordFindUniqueArgs>(args: Prisma.SelectSubset<T, InventoryCountRecordFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InventoryCountRecordClient<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends InventoryCountRecordFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InventoryCountRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryCountRecordClient<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends InventoryCountRecordFindFirstArgs>(args?: Prisma.SelectSubset<T, InventoryCountRecordFindFirstArgs<ExtArgs>>): Prisma.Prisma__InventoryCountRecordClient<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends InventoryCountRecordFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InventoryCountRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryCountRecordClient<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends InventoryCountRecordFindManyArgs>(args?: Prisma.SelectSubset<T, InventoryCountRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends InventoryCountRecordCreateArgs>(args: Prisma.SelectSubset<T, InventoryCountRecordCreateArgs<ExtArgs>>): Prisma.Prisma__InventoryCountRecordClient<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends InventoryCountRecordCreateManyArgs>(args?: Prisma.SelectSubset<T, InventoryCountRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends InventoryCountRecordCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InventoryCountRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends InventoryCountRecordDeleteArgs>(args: Prisma.SelectSubset<T, InventoryCountRecordDeleteArgs<ExtArgs>>): Prisma.Prisma__InventoryCountRecordClient<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends InventoryCountRecordUpdateArgs>(args: Prisma.SelectSubset<T, InventoryCountRecordUpdateArgs<ExtArgs>>): Prisma.Prisma__InventoryCountRecordClient<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends InventoryCountRecordDeleteManyArgs>(args?: Prisma.SelectSubset<T, InventoryCountRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends InventoryCountRecordUpdateManyArgs>(args: Prisma.SelectSubset<T, InventoryCountRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends InventoryCountRecordUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InventoryCountRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends InventoryCountRecordUpsertArgs>(args: Prisma.SelectSubset<T, InventoryCountRecordUpsertArgs<ExtArgs>>): Prisma.Prisma__InventoryCountRecordClient<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends InventoryCountRecordCountArgs>(args?: Prisma.Subset<T, InventoryCountRecordCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InventoryCountRecordCountAggregateOutputType> : number>;
    aggregate<T extends InventoryCountRecordAggregateArgs>(args: Prisma.Subset<T, InventoryCountRecordAggregateArgs>): Prisma.PrismaPromise<GetInventoryCountRecordAggregateType<T>>;
    groupBy<T extends InventoryCountRecordGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InventoryCountRecordGroupByArgs['orderBy'];
    } : {
        orderBy?: InventoryCountRecordGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InventoryCountRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryCountRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: InventoryCountRecordFieldRefs;
}
export interface Prisma__InventoryCountRecordClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    ingredient<T extends Prisma.IngredientDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.IngredientDefaultArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    actor<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface InventoryCountRecordFieldRefs {
    readonly id: Prisma.FieldRef<"InventoryCountRecord", 'BigInt'>;
    readonly ingredientId: Prisma.FieldRef<"InventoryCountRecord", 'BigInt'>;
    readonly actualQuantity: Prisma.FieldRef<"InventoryCountRecord", 'Decimal'>;
    readonly countedAt: Prisma.FieldRef<"InventoryCountRecord", 'DateTime'>;
    readonly countedBy: Prisma.FieldRef<"InventoryCountRecord", 'BigInt'>;
    readonly note: Prisma.FieldRef<"InventoryCountRecord", 'String'>;
}
export type InventoryCountRecordFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelect<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    include?: Prisma.InventoryCountRecordInclude<ExtArgs> | null;
    where: Prisma.InventoryCountRecordWhereUniqueInput;
};
export type InventoryCountRecordFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelect<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    include?: Prisma.InventoryCountRecordInclude<ExtArgs> | null;
    where: Prisma.InventoryCountRecordWhereUniqueInput;
};
export type InventoryCountRecordFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InventoryCountRecordFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InventoryCountRecordFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InventoryCountRecordCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelect<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    include?: Prisma.InventoryCountRecordInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InventoryCountRecordCreateInput, Prisma.InventoryCountRecordUncheckedCreateInput>;
};
export type InventoryCountRecordCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.InventoryCountRecordCreateManyInput | Prisma.InventoryCountRecordCreateManyInput[];
    skipDuplicates?: boolean;
};
export type InventoryCountRecordCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    data: Prisma.InventoryCountRecordCreateManyInput | Prisma.InventoryCountRecordCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.InventoryCountRecordIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type InventoryCountRecordUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelect<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    include?: Prisma.InventoryCountRecordInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InventoryCountRecordUpdateInput, Prisma.InventoryCountRecordUncheckedUpdateInput>;
    where: Prisma.InventoryCountRecordWhereUniqueInput;
};
export type InventoryCountRecordUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.InventoryCountRecordUpdateManyMutationInput, Prisma.InventoryCountRecordUncheckedUpdateManyInput>;
    where?: Prisma.InventoryCountRecordWhereInput;
    limit?: number;
};
export type InventoryCountRecordUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InventoryCountRecordUpdateManyMutationInput, Prisma.InventoryCountRecordUncheckedUpdateManyInput>;
    where?: Prisma.InventoryCountRecordWhereInput;
    limit?: number;
    include?: Prisma.InventoryCountRecordIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type InventoryCountRecordUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelect<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    include?: Prisma.InventoryCountRecordInclude<ExtArgs> | null;
    where: Prisma.InventoryCountRecordWhereUniqueInput;
    create: Prisma.XOR<Prisma.InventoryCountRecordCreateInput, Prisma.InventoryCountRecordUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.InventoryCountRecordUpdateInput, Prisma.InventoryCountRecordUncheckedUpdateInput>;
};
export type InventoryCountRecordDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelect<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    include?: Prisma.InventoryCountRecordInclude<ExtArgs> | null;
    where: Prisma.InventoryCountRecordWhereUniqueInput;
};
export type InventoryCountRecordDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryCountRecordWhereInput;
    limit?: number;
};
export type InventoryCountRecordDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryCountRecordSelect<ExtArgs> | null;
    omit?: Prisma.InventoryCountRecordOmit<ExtArgs> | null;
    include?: Prisma.InventoryCountRecordInclude<ExtArgs> | null;
};
