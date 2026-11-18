import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type IngredientModel = runtime.Types.Result.DefaultSelection<Prisma.$IngredientPayload>;
export type AggregateIngredient = {
    _count: IngredientCountAggregateOutputType | null;
    _avg: IngredientAvgAggregateOutputType | null;
    _sum: IngredientSumAggregateOutputType | null;
    _min: IngredientMinAggregateOutputType | null;
    _max: IngredientMaxAggregateOutputType | null;
};
export type IngredientAvgAggregateOutputType = {
    id: number | null;
    lowStockThreshold: runtime.Decimal | null;
};
export type IngredientSumAggregateOutputType = {
    id: bigint | null;
    lowStockThreshold: runtime.Decimal | null;
};
export type IngredientMinAggregateOutputType = {
    id: bigint | null;
    code: string | null;
    name: string | null;
    category: string | null;
    unit: string | null;
    lowStockThreshold: runtime.Decimal | null;
    note: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IngredientMaxAggregateOutputType = {
    id: bigint | null;
    code: string | null;
    name: string | null;
    category: string | null;
    unit: string | null;
    lowStockThreshold: runtime.Decimal | null;
    note: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IngredientCountAggregateOutputType = {
    id: number;
    code: number;
    name: number;
    category: number;
    unit: number;
    lowStockThreshold: number;
    note: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type IngredientAvgAggregateInputType = {
    id?: true;
    lowStockThreshold?: true;
};
export type IngredientSumAggregateInputType = {
    id?: true;
    lowStockThreshold?: true;
};
export type IngredientMinAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    category?: true;
    unit?: true;
    lowStockThreshold?: true;
    note?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IngredientMaxAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    category?: true;
    unit?: true;
    lowStockThreshold?: true;
    note?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IngredientCountAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    category?: true;
    unit?: true;
    lowStockThreshold?: true;
    note?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type IngredientAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    cursor?: Prisma.IngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | IngredientCountAggregateInputType;
    _avg?: IngredientAvgAggregateInputType;
    _sum?: IngredientSumAggregateInputType;
    _min?: IngredientMinAggregateInputType;
    _max?: IngredientMaxAggregateInputType;
};
export type GetIngredientAggregateType<T extends IngredientAggregateArgs> = {
    [P in keyof T & keyof AggregateIngredient]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIngredient[P]> : Prisma.GetScalarType<T[P], AggregateIngredient[P]>;
};
export type IngredientGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithAggregationInput | Prisma.IngredientOrderByWithAggregationInput[];
    by: Prisma.IngredientScalarFieldEnum[] | Prisma.IngredientScalarFieldEnum;
    having?: Prisma.IngredientScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IngredientCountAggregateInputType | true;
    _avg?: IngredientAvgAggregateInputType;
    _sum?: IngredientSumAggregateInputType;
    _min?: IngredientMinAggregateInputType;
    _max?: IngredientMaxAggregateInputType;
};
export type IngredientGroupByOutputType = {
    id: bigint;
    code: string;
    name: string;
    category: string | null;
    unit: string;
    lowStockThreshold: runtime.Decimal | null;
    note: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: IngredientCountAggregateOutputType | null;
    _avg: IngredientAvgAggregateOutputType | null;
    _sum: IngredientSumAggregateOutputType | null;
    _min: IngredientMinAggregateOutputType | null;
    _max: IngredientMaxAggregateOutputType | null;
};
export type GetIngredientGroupByPayload<T extends IngredientGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<IngredientGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof IngredientGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], IngredientGroupByOutputType[P]> : Prisma.GetScalarType<T[P], IngredientGroupByOutputType[P]>;
}>>;
export type IngredientWhereInput = {
    AND?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    OR?: Prisma.IngredientWhereInput[];
    NOT?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    id?: Prisma.BigIntFilter<"Ingredient"> | bigint | number;
    code?: Prisma.StringFilter<"Ingredient"> | string;
    name?: Prisma.StringFilter<"Ingredient"> | string;
    category?: Prisma.StringNullableFilter<"Ingredient"> | string | null;
    unit?: Prisma.StringFilter<"Ingredient"> | string;
    lowStockThreshold?: Prisma.DecimalNullableFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.StringNullableFilter<"Ingredient"> | string | null;
    isActive?: Prisma.BoolFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    balance?: Prisma.XOR<Prisma.InventoryBalanceNullableScalarRelationFilter, Prisma.InventoryBalanceWhereInput> | null;
    movements?: Prisma.StockMovementListRelationFilter;
    countRecords?: Prisma.InventoryCountRecordListRelationFilter;
};
export type IngredientOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrderInput | Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    lowStockThreshold?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    balance?: Prisma.InventoryBalanceOrderByWithRelationInput;
    movements?: Prisma.StockMovementOrderByRelationAggregateInput;
    countRecords?: Prisma.InventoryCountRecordOrderByRelationAggregateInput;
};
export type IngredientWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    code?: string;
    AND?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    OR?: Prisma.IngredientWhereInput[];
    NOT?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    name?: Prisma.StringFilter<"Ingredient"> | string;
    category?: Prisma.StringNullableFilter<"Ingredient"> | string | null;
    unit?: Prisma.StringFilter<"Ingredient"> | string;
    lowStockThreshold?: Prisma.DecimalNullableFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.StringNullableFilter<"Ingredient"> | string | null;
    isActive?: Prisma.BoolFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    balance?: Prisma.XOR<Prisma.InventoryBalanceNullableScalarRelationFilter, Prisma.InventoryBalanceWhereInput> | null;
    movements?: Prisma.StockMovementListRelationFilter;
    countRecords?: Prisma.InventoryCountRecordListRelationFilter;
}, "id" | "code">;
export type IngredientOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrderInput | Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    lowStockThreshold?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.IngredientCountOrderByAggregateInput;
    _avg?: Prisma.IngredientAvgOrderByAggregateInput;
    _max?: Prisma.IngredientMaxOrderByAggregateInput;
    _min?: Prisma.IngredientMinOrderByAggregateInput;
    _sum?: Prisma.IngredientSumOrderByAggregateInput;
};
export type IngredientScalarWhereWithAggregatesInput = {
    AND?: Prisma.IngredientScalarWhereWithAggregatesInput | Prisma.IngredientScalarWhereWithAggregatesInput[];
    OR?: Prisma.IngredientScalarWhereWithAggregatesInput[];
    NOT?: Prisma.IngredientScalarWhereWithAggregatesInput | Prisma.IngredientScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"Ingredient"> | bigint | number;
    code?: Prisma.StringWithAggregatesFilter<"Ingredient"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Ingredient"> | string;
    category?: Prisma.StringNullableWithAggregatesFilter<"Ingredient"> | string | null;
    unit?: Prisma.StringWithAggregatesFilter<"Ingredient"> | string;
    lowStockThreshold?: Prisma.DecimalNullableWithAggregatesFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.StringNullableWithAggregatesFilter<"Ingredient"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Ingredient"> | Date | string;
};
export type IngredientCreateInput = {
    id?: bigint | number;
    code: string;
    name: string;
    category?: string | null;
    unit: string;
    lowStockThreshold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    balance?: Prisma.InventoryBalanceCreateNestedOneWithoutIngredientInput;
    movements?: Prisma.StockMovementCreateNestedManyWithoutIngredientInput;
    countRecords?: Prisma.InventoryCountRecordCreateNestedManyWithoutIngredientInput;
};
export type IngredientUncheckedCreateInput = {
    id?: bigint | number;
    code: string;
    name: string;
    category?: string | null;
    unit: string;
    lowStockThreshold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    balance?: Prisma.InventoryBalanceUncheckedCreateNestedOneWithoutIngredientInput;
    movements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutIngredientInput;
    countRecords?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutIngredientInput;
};
export type IngredientUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    balance?: Prisma.InventoryBalanceUpdateOneWithoutIngredientNestedInput;
    movements?: Prisma.StockMovementUpdateManyWithoutIngredientNestedInput;
    countRecords?: Prisma.InventoryCountRecordUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    balance?: Prisma.InventoryBalanceUncheckedUpdateOneWithoutIngredientNestedInput;
    movements?: Prisma.StockMovementUncheckedUpdateManyWithoutIngredientNestedInput;
    countRecords?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutIngredientNestedInput;
};
export type IngredientCreateManyInput = {
    id?: bigint | number;
    code: string;
    name: string;
    category?: string | null;
    unit: string;
    lowStockThreshold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IngredientUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IngredientUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IngredientCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    lowStockThreshold?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IngredientAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lowStockThreshold?: Prisma.SortOrder;
};
export type IngredientMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    lowStockThreshold?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IngredientMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    lowStockThreshold?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IngredientSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lowStockThreshold?: Prisma.SortOrder;
};
export type IngredientScalarRelationFilter = {
    is?: Prisma.IngredientWhereInput;
    isNot?: Prisma.IngredientWhereInput;
};
export type NullableDecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type IngredientCreateNestedOneWithoutBalanceInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutBalanceInput, Prisma.IngredientUncheckedCreateWithoutBalanceInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutBalanceInput;
    connect?: Prisma.IngredientWhereUniqueInput;
};
export type IngredientUpdateOneRequiredWithoutBalanceNestedInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutBalanceInput, Prisma.IngredientUncheckedCreateWithoutBalanceInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutBalanceInput;
    upsert?: Prisma.IngredientUpsertWithoutBalanceInput;
    connect?: Prisma.IngredientWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.IngredientUpdateToOneWithWhereWithoutBalanceInput, Prisma.IngredientUpdateWithoutBalanceInput>, Prisma.IngredientUncheckedUpdateWithoutBalanceInput>;
};
export type IngredientCreateNestedOneWithoutMovementsInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutMovementsInput, Prisma.IngredientUncheckedCreateWithoutMovementsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutMovementsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
};
export type IngredientUpdateOneRequiredWithoutMovementsNestedInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutMovementsInput, Prisma.IngredientUncheckedCreateWithoutMovementsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutMovementsInput;
    upsert?: Prisma.IngredientUpsertWithoutMovementsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.IngredientUpdateToOneWithWhereWithoutMovementsInput, Prisma.IngredientUpdateWithoutMovementsInput>, Prisma.IngredientUncheckedUpdateWithoutMovementsInput>;
};
export type IngredientCreateNestedOneWithoutCountRecordsInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutCountRecordsInput, Prisma.IngredientUncheckedCreateWithoutCountRecordsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutCountRecordsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
};
export type IngredientUpdateOneRequiredWithoutCountRecordsNestedInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutCountRecordsInput, Prisma.IngredientUncheckedCreateWithoutCountRecordsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutCountRecordsInput;
    upsert?: Prisma.IngredientUpsertWithoutCountRecordsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.IngredientUpdateToOneWithWhereWithoutCountRecordsInput, Prisma.IngredientUpdateWithoutCountRecordsInput>, Prisma.IngredientUncheckedUpdateWithoutCountRecordsInput>;
};
export type IngredientCreateWithoutBalanceInput = {
    id?: bigint | number;
    code: string;
    name: string;
    category?: string | null;
    unit: string;
    lowStockThreshold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movements?: Prisma.StockMovementCreateNestedManyWithoutIngredientInput;
    countRecords?: Prisma.InventoryCountRecordCreateNestedManyWithoutIngredientInput;
};
export type IngredientUncheckedCreateWithoutBalanceInput = {
    id?: bigint | number;
    code: string;
    name: string;
    category?: string | null;
    unit: string;
    lowStockThreshold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutIngredientInput;
    countRecords?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutIngredientInput;
};
export type IngredientCreateOrConnectWithoutBalanceInput = {
    where: Prisma.IngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutBalanceInput, Prisma.IngredientUncheckedCreateWithoutBalanceInput>;
};
export type IngredientUpsertWithoutBalanceInput = {
    update: Prisma.XOR<Prisma.IngredientUpdateWithoutBalanceInput, Prisma.IngredientUncheckedUpdateWithoutBalanceInput>;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutBalanceInput, Prisma.IngredientUncheckedCreateWithoutBalanceInput>;
    where?: Prisma.IngredientWhereInput;
};
export type IngredientUpdateToOneWithWhereWithoutBalanceInput = {
    where?: Prisma.IngredientWhereInput;
    data: Prisma.XOR<Prisma.IngredientUpdateWithoutBalanceInput, Prisma.IngredientUncheckedUpdateWithoutBalanceInput>;
};
export type IngredientUpdateWithoutBalanceInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movements?: Prisma.StockMovementUpdateManyWithoutIngredientNestedInput;
    countRecords?: Prisma.InventoryCountRecordUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateWithoutBalanceInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movements?: Prisma.StockMovementUncheckedUpdateManyWithoutIngredientNestedInput;
    countRecords?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutIngredientNestedInput;
};
export type IngredientCreateWithoutMovementsInput = {
    id?: bigint | number;
    code: string;
    name: string;
    category?: string | null;
    unit: string;
    lowStockThreshold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    balance?: Prisma.InventoryBalanceCreateNestedOneWithoutIngredientInput;
    countRecords?: Prisma.InventoryCountRecordCreateNestedManyWithoutIngredientInput;
};
export type IngredientUncheckedCreateWithoutMovementsInput = {
    id?: bigint | number;
    code: string;
    name: string;
    category?: string | null;
    unit: string;
    lowStockThreshold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    balance?: Prisma.InventoryBalanceUncheckedCreateNestedOneWithoutIngredientInput;
    countRecords?: Prisma.InventoryCountRecordUncheckedCreateNestedManyWithoutIngredientInput;
};
export type IngredientCreateOrConnectWithoutMovementsInput = {
    where: Prisma.IngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutMovementsInput, Prisma.IngredientUncheckedCreateWithoutMovementsInput>;
};
export type IngredientUpsertWithoutMovementsInput = {
    update: Prisma.XOR<Prisma.IngredientUpdateWithoutMovementsInput, Prisma.IngredientUncheckedUpdateWithoutMovementsInput>;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutMovementsInput, Prisma.IngredientUncheckedCreateWithoutMovementsInput>;
    where?: Prisma.IngredientWhereInput;
};
export type IngredientUpdateToOneWithWhereWithoutMovementsInput = {
    where?: Prisma.IngredientWhereInput;
    data: Prisma.XOR<Prisma.IngredientUpdateWithoutMovementsInput, Prisma.IngredientUncheckedUpdateWithoutMovementsInput>;
};
export type IngredientUpdateWithoutMovementsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    balance?: Prisma.InventoryBalanceUpdateOneWithoutIngredientNestedInput;
    countRecords?: Prisma.InventoryCountRecordUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateWithoutMovementsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    balance?: Prisma.InventoryBalanceUncheckedUpdateOneWithoutIngredientNestedInput;
    countRecords?: Prisma.InventoryCountRecordUncheckedUpdateManyWithoutIngredientNestedInput;
};
export type IngredientCreateWithoutCountRecordsInput = {
    id?: bigint | number;
    code: string;
    name: string;
    category?: string | null;
    unit: string;
    lowStockThreshold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    balance?: Prisma.InventoryBalanceCreateNestedOneWithoutIngredientInput;
    movements?: Prisma.StockMovementCreateNestedManyWithoutIngredientInput;
};
export type IngredientUncheckedCreateWithoutCountRecordsInput = {
    id?: bigint | number;
    code: string;
    name: string;
    category?: string | null;
    unit: string;
    lowStockThreshold?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    balance?: Prisma.InventoryBalanceUncheckedCreateNestedOneWithoutIngredientInput;
    movements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutIngredientInput;
};
export type IngredientCreateOrConnectWithoutCountRecordsInput = {
    where: Prisma.IngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutCountRecordsInput, Prisma.IngredientUncheckedCreateWithoutCountRecordsInput>;
};
export type IngredientUpsertWithoutCountRecordsInput = {
    update: Prisma.XOR<Prisma.IngredientUpdateWithoutCountRecordsInput, Prisma.IngredientUncheckedUpdateWithoutCountRecordsInput>;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutCountRecordsInput, Prisma.IngredientUncheckedCreateWithoutCountRecordsInput>;
    where?: Prisma.IngredientWhereInput;
};
export type IngredientUpdateToOneWithWhereWithoutCountRecordsInput = {
    where?: Prisma.IngredientWhereInput;
    data: Prisma.XOR<Prisma.IngredientUpdateWithoutCountRecordsInput, Prisma.IngredientUncheckedUpdateWithoutCountRecordsInput>;
};
export type IngredientUpdateWithoutCountRecordsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    balance?: Prisma.InventoryBalanceUpdateOneWithoutIngredientNestedInput;
    movements?: Prisma.StockMovementUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateWithoutCountRecordsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    lowStockThreshold?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    balance?: Prisma.InventoryBalanceUncheckedUpdateOneWithoutIngredientNestedInput;
    movements?: Prisma.StockMovementUncheckedUpdateManyWithoutIngredientNestedInput;
};
export type IngredientCountOutputType = {
    movements: number;
    countRecords: number;
};
export type IngredientCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    movements?: boolean | IngredientCountOutputTypeCountMovementsArgs;
    countRecords?: boolean | IngredientCountOutputTypeCountCountRecordsArgs;
};
export type IngredientCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientCountOutputTypeSelect<ExtArgs> | null;
};
export type IngredientCountOutputTypeCountMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
};
export type IngredientCountOutputTypeCountCountRecordsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryCountRecordWhereInput;
};
export type IngredientSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    category?: boolean;
    unit?: boolean;
    lowStockThreshold?: boolean;
    note?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    balance?: boolean | Prisma.Ingredient$balanceArgs<ExtArgs>;
    movements?: boolean | Prisma.Ingredient$movementsArgs<ExtArgs>;
    countRecords?: boolean | Prisma.Ingredient$countRecordsArgs<ExtArgs>;
    _count?: boolean | Prisma.IngredientCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ingredient"]>;
export type IngredientSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    category?: boolean;
    unit?: boolean;
    lowStockThreshold?: boolean;
    note?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ingredient"]>;
export type IngredientSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    category?: boolean;
    unit?: boolean;
    lowStockThreshold?: boolean;
    note?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ingredient"]>;
export type IngredientSelectScalar = {
    id?: boolean;
    code?: boolean;
    name?: boolean;
    category?: boolean;
    unit?: boolean;
    lowStockThreshold?: boolean;
    note?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type IngredientOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "name" | "category" | "unit" | "lowStockThreshold" | "note" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["ingredient"]>;
export type IngredientInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    balance?: boolean | Prisma.Ingredient$balanceArgs<ExtArgs>;
    movements?: boolean | Prisma.Ingredient$movementsArgs<ExtArgs>;
    countRecords?: boolean | Prisma.Ingredient$countRecordsArgs<ExtArgs>;
    _count?: boolean | Prisma.IngredientCountOutputTypeDefaultArgs<ExtArgs>;
};
export type IngredientIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type IngredientIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $IngredientPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Ingredient";
    objects: {
        balance: Prisma.$InventoryBalancePayload<ExtArgs> | null;
        movements: Prisma.$StockMovementPayload<ExtArgs>[];
        countRecords: Prisma.$InventoryCountRecordPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        code: string;
        name: string;
        category: string | null;
        unit: string;
        lowStockThreshold: runtime.Decimal | null;
        note: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["ingredient"]>;
    composites: {};
};
export type IngredientGetPayload<S extends boolean | null | undefined | IngredientDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$IngredientPayload, S>;
export type IngredientCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<IngredientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: IngredientCountAggregateInputType | true;
};
export interface IngredientDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Ingredient'];
        meta: {
            name: 'Ingredient';
        };
    };
    findUnique<T extends IngredientFindUniqueArgs>(args: Prisma.SelectSubset<T, IngredientFindUniqueArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends IngredientFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, IngredientFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends IngredientFindFirstArgs>(args?: Prisma.SelectSubset<T, IngredientFindFirstArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends IngredientFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, IngredientFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends IngredientFindManyArgs>(args?: Prisma.SelectSubset<T, IngredientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends IngredientCreateArgs>(args: Prisma.SelectSubset<T, IngredientCreateArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends IngredientCreateManyArgs>(args?: Prisma.SelectSubset<T, IngredientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends IngredientCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, IngredientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends IngredientDeleteArgs>(args: Prisma.SelectSubset<T, IngredientDeleteArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends IngredientUpdateArgs>(args: Prisma.SelectSubset<T, IngredientUpdateArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends IngredientDeleteManyArgs>(args?: Prisma.SelectSubset<T, IngredientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends IngredientUpdateManyArgs>(args: Prisma.SelectSubset<T, IngredientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends IngredientUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, IngredientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends IngredientUpsertArgs>(args: Prisma.SelectSubset<T, IngredientUpsertArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends IngredientCountArgs>(args?: Prisma.Subset<T, IngredientCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], IngredientCountAggregateOutputType> : number>;
    aggregate<T extends IngredientAggregateArgs>(args: Prisma.Subset<T, IngredientAggregateArgs>): Prisma.PrismaPromise<GetIngredientAggregateType<T>>;
    groupBy<T extends IngredientGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: IngredientGroupByArgs['orderBy'];
    } : {
        orderBy?: IngredientGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, IngredientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngredientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: IngredientFieldRefs;
}
export interface Prisma__IngredientClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    balance<T extends Prisma.Ingredient$balanceArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Ingredient$balanceArgs<ExtArgs>>): Prisma.Prisma__InventoryBalanceClient<runtime.Types.Result.GetResult<Prisma.$InventoryBalancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    movements<T extends Prisma.Ingredient$movementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Ingredient$movementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    countRecords<T extends Prisma.Ingredient$countRecordsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Ingredient$countRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryCountRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface IngredientFieldRefs {
    readonly id: Prisma.FieldRef<"Ingredient", 'BigInt'>;
    readonly code: Prisma.FieldRef<"Ingredient", 'String'>;
    readonly name: Prisma.FieldRef<"Ingredient", 'String'>;
    readonly category: Prisma.FieldRef<"Ingredient", 'String'>;
    readonly unit: Prisma.FieldRef<"Ingredient", 'String'>;
    readonly lowStockThreshold: Prisma.FieldRef<"Ingredient", 'Decimal'>;
    readonly note: Prisma.FieldRef<"Ingredient", 'String'>;
    readonly isActive: Prisma.FieldRef<"Ingredient", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Ingredient", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Ingredient", 'DateTime'>;
}
export type IngredientFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where: Prisma.IngredientWhereUniqueInput;
};
export type IngredientFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where: Prisma.IngredientWhereUniqueInput;
};
export type IngredientFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    cursor?: Prisma.IngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IngredientScalarFieldEnum | Prisma.IngredientScalarFieldEnum[];
};
export type IngredientFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    cursor?: Prisma.IngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IngredientScalarFieldEnum | Prisma.IngredientScalarFieldEnum[];
};
export type IngredientFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    cursor?: Prisma.IngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IngredientScalarFieldEnum | Prisma.IngredientScalarFieldEnum[];
};
export type IngredientCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IngredientCreateInput, Prisma.IngredientUncheckedCreateInput>;
};
export type IngredientCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.IngredientCreateManyInput | Prisma.IngredientCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IngredientCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    data: Prisma.IngredientCreateManyInput | Prisma.IngredientCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IngredientUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IngredientUpdateInput, Prisma.IngredientUncheckedUpdateInput>;
    where: Prisma.IngredientWhereUniqueInput;
};
export type IngredientUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.IngredientUpdateManyMutationInput, Prisma.IngredientUncheckedUpdateManyInput>;
    where?: Prisma.IngredientWhereInput;
    limit?: number;
};
export type IngredientUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IngredientUpdateManyMutationInput, Prisma.IngredientUncheckedUpdateManyInput>;
    where?: Prisma.IngredientWhereInput;
    limit?: number;
};
export type IngredientUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where: Prisma.IngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IngredientCreateInput, Prisma.IngredientUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.IngredientUpdateInput, Prisma.IngredientUncheckedUpdateInput>;
};
export type IngredientDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where: Prisma.IngredientWhereUniqueInput;
};
export type IngredientDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IngredientWhereInput;
    limit?: number;
};
export type Ingredient$balanceArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryBalanceSelect<ExtArgs> | null;
    omit?: Prisma.InventoryBalanceOmit<ExtArgs> | null;
    include?: Prisma.InventoryBalanceInclude<ExtArgs> | null;
    where?: Prisma.InventoryBalanceWhereInput;
};
export type Ingredient$movementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Ingredient$countRecordsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type IngredientDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
};
