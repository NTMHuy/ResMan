import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type MenuItemModel = runtime.Types.Result.DefaultSelection<Prisma.$MenuItemPayload>;
export type AggregateMenuItem = {
    _count: MenuItemCountAggregateOutputType | null;
    _avg: MenuItemAvgAggregateOutputType | null;
    _sum: MenuItemSumAggregateOutputType | null;
    _min: MenuItemMinAggregateOutputType | null;
    _max: MenuItemMaxAggregateOutputType | null;
};
export type MenuItemAvgAggregateOutputType = {
    id: number | null;
    categoryId: number | null;
    price: runtime.Decimal | null;
};
export type MenuItemSumAggregateOutputType = {
    id: bigint | null;
    categoryId: bigint | null;
    price: runtime.Decimal | null;
};
export type MenuItemMinAggregateOutputType = {
    id: bigint | null;
    categoryId: bigint | null;
    code: string | null;
    name: string | null;
    description: string | null;
    price: runtime.Decimal | null;
    imageUrl: string | null;
    availabilityStatus: string | null;
    availabilityReason: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MenuItemMaxAggregateOutputType = {
    id: bigint | null;
    categoryId: bigint | null;
    code: string | null;
    name: string | null;
    description: string | null;
    price: runtime.Decimal | null;
    imageUrl: string | null;
    availabilityStatus: string | null;
    availabilityReason: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MenuItemCountAggregateOutputType = {
    id: number;
    categoryId: number;
    code: number;
    name: number;
    description: number;
    price: number;
    imageUrl: number;
    availabilityStatus: number;
    availabilityReason: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type MenuItemAvgAggregateInputType = {
    id?: true;
    categoryId?: true;
    price?: true;
};
export type MenuItemSumAggregateInputType = {
    id?: true;
    categoryId?: true;
    price?: true;
};
export type MenuItemMinAggregateInputType = {
    id?: true;
    categoryId?: true;
    code?: true;
    name?: true;
    description?: true;
    price?: true;
    imageUrl?: true;
    availabilityStatus?: true;
    availabilityReason?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MenuItemMaxAggregateInputType = {
    id?: true;
    categoryId?: true;
    code?: true;
    name?: true;
    description?: true;
    price?: true;
    imageUrl?: true;
    availabilityStatus?: true;
    availabilityReason?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MenuItemCountAggregateInputType = {
    id?: true;
    categoryId?: true;
    code?: true;
    name?: true;
    description?: true;
    price?: true;
    imageUrl?: true;
    availabilityStatus?: true;
    availabilityReason?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type MenuItemAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuItemWhereInput;
    orderBy?: Prisma.MenuItemOrderByWithRelationInput | Prisma.MenuItemOrderByWithRelationInput[];
    cursor?: Prisma.MenuItemWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MenuItemCountAggregateInputType;
    _avg?: MenuItemAvgAggregateInputType;
    _sum?: MenuItemSumAggregateInputType;
    _min?: MenuItemMinAggregateInputType;
    _max?: MenuItemMaxAggregateInputType;
};
export type GetMenuItemAggregateType<T extends MenuItemAggregateArgs> = {
    [P in keyof T & keyof AggregateMenuItem]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMenuItem[P]> : Prisma.GetScalarType<T[P], AggregateMenuItem[P]>;
};
export type MenuItemGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuItemWhereInput;
    orderBy?: Prisma.MenuItemOrderByWithAggregationInput | Prisma.MenuItemOrderByWithAggregationInput[];
    by: Prisma.MenuItemScalarFieldEnum[] | Prisma.MenuItemScalarFieldEnum;
    having?: Prisma.MenuItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MenuItemCountAggregateInputType | true;
    _avg?: MenuItemAvgAggregateInputType;
    _sum?: MenuItemSumAggregateInputType;
    _min?: MenuItemMinAggregateInputType;
    _max?: MenuItemMaxAggregateInputType;
};
export type MenuItemGroupByOutputType = {
    id: bigint;
    categoryId: bigint;
    code: string;
    name: string;
    description: string | null;
    price: runtime.Decimal;
    imageUrl: string | null;
    availabilityStatus: string;
    availabilityReason: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: MenuItemCountAggregateOutputType | null;
    _avg: MenuItemAvgAggregateOutputType | null;
    _sum: MenuItemSumAggregateOutputType | null;
    _min: MenuItemMinAggregateOutputType | null;
    _max: MenuItemMaxAggregateOutputType | null;
};
export type GetMenuItemGroupByPayload<T extends MenuItemGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MenuItemGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MenuItemGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MenuItemGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MenuItemGroupByOutputType[P]>;
}>>;
export type MenuItemWhereInput = {
    AND?: Prisma.MenuItemWhereInput | Prisma.MenuItemWhereInput[];
    OR?: Prisma.MenuItemWhereInput[];
    NOT?: Prisma.MenuItemWhereInput | Prisma.MenuItemWhereInput[];
    id?: Prisma.BigIntFilter<"MenuItem"> | bigint | number;
    categoryId?: Prisma.BigIntFilter<"MenuItem"> | bigint | number;
    code?: Prisma.StringFilter<"MenuItem"> | string;
    name?: Prisma.StringFilter<"MenuItem"> | string;
    description?: Prisma.StringNullableFilter<"MenuItem"> | string | null;
    price?: Prisma.DecimalFilter<"MenuItem"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.StringNullableFilter<"MenuItem"> | string | null;
    availabilityStatus?: Prisma.StringFilter<"MenuItem"> | string;
    availabilityReason?: Prisma.StringNullableFilter<"MenuItem"> | string | null;
    isActive?: Prisma.BoolFilter<"MenuItem"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"MenuItem"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MenuItem"> | Date | string;
    category?: Prisma.XOR<Prisma.MenuCategoryScalarRelationFilter, Prisma.MenuCategoryWhereInput>;
    orderItems?: Prisma.OrderItemListRelationFilter;
};
export type MenuItemOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    price?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    availabilityStatus?: Prisma.SortOrder;
    availabilityReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    category?: Prisma.MenuCategoryOrderByWithRelationInput;
    orderItems?: Prisma.OrderItemOrderByRelationAggregateInput;
};
export type MenuItemWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    code?: string;
    AND?: Prisma.MenuItemWhereInput | Prisma.MenuItemWhereInput[];
    OR?: Prisma.MenuItemWhereInput[];
    NOT?: Prisma.MenuItemWhereInput | Prisma.MenuItemWhereInput[];
    categoryId?: Prisma.BigIntFilter<"MenuItem"> | bigint | number;
    name?: Prisma.StringFilter<"MenuItem"> | string;
    description?: Prisma.StringNullableFilter<"MenuItem"> | string | null;
    price?: Prisma.DecimalFilter<"MenuItem"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.StringNullableFilter<"MenuItem"> | string | null;
    availabilityStatus?: Prisma.StringFilter<"MenuItem"> | string;
    availabilityReason?: Prisma.StringNullableFilter<"MenuItem"> | string | null;
    isActive?: Prisma.BoolFilter<"MenuItem"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"MenuItem"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MenuItem"> | Date | string;
    category?: Prisma.XOR<Prisma.MenuCategoryScalarRelationFilter, Prisma.MenuCategoryWhereInput>;
    orderItems?: Prisma.OrderItemListRelationFilter;
}, "id" | "code">;
export type MenuItemOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    price?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    availabilityStatus?: Prisma.SortOrder;
    availabilityReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MenuItemCountOrderByAggregateInput;
    _avg?: Prisma.MenuItemAvgOrderByAggregateInput;
    _max?: Prisma.MenuItemMaxOrderByAggregateInput;
    _min?: Prisma.MenuItemMinOrderByAggregateInput;
    _sum?: Prisma.MenuItemSumOrderByAggregateInput;
};
export type MenuItemScalarWhereWithAggregatesInput = {
    AND?: Prisma.MenuItemScalarWhereWithAggregatesInput | Prisma.MenuItemScalarWhereWithAggregatesInput[];
    OR?: Prisma.MenuItemScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MenuItemScalarWhereWithAggregatesInput | Prisma.MenuItemScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"MenuItem"> | bigint | number;
    categoryId?: Prisma.BigIntWithAggregatesFilter<"MenuItem"> | bigint | number;
    code?: Prisma.StringWithAggregatesFilter<"MenuItem"> | string;
    name?: Prisma.StringWithAggregatesFilter<"MenuItem"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"MenuItem"> | string | null;
    price?: Prisma.DecimalWithAggregatesFilter<"MenuItem"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.StringNullableWithAggregatesFilter<"MenuItem"> | string | null;
    availabilityStatus?: Prisma.StringWithAggregatesFilter<"MenuItem"> | string;
    availabilityReason?: Prisma.StringNullableWithAggregatesFilter<"MenuItem"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"MenuItem"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MenuItem"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"MenuItem"> | Date | string;
};
export type MenuItemCreateInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: string | null;
    availabilityStatus?: string;
    availabilityReason?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    category: Prisma.MenuCategoryCreateNestedOneWithoutItemsInput;
    orderItems?: Prisma.OrderItemCreateNestedManyWithoutMenuItemInput;
};
export type MenuItemUncheckedCreateInput = {
    id?: bigint | number;
    categoryId: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: string | null;
    availabilityStatus?: string;
    availabilityReason?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    orderItems?: Prisma.OrderItemUncheckedCreateNestedManyWithoutMenuItemInput;
};
export type MenuItemUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    availabilityStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    availabilityReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.MenuCategoryUpdateOneRequiredWithoutItemsNestedInput;
    orderItems?: Prisma.OrderItemUpdateManyWithoutMenuItemNestedInput;
};
export type MenuItemUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    categoryId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    availabilityStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    availabilityReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orderItems?: Prisma.OrderItemUncheckedUpdateManyWithoutMenuItemNestedInput;
};
export type MenuItemCreateManyInput = {
    id?: bigint | number;
    categoryId: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: string | null;
    availabilityStatus?: string;
    availabilityReason?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MenuItemUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    availabilityStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    availabilityReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuItemUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    categoryId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    availabilityStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    availabilityReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuItemListRelationFilter = {
    every?: Prisma.MenuItemWhereInput;
    some?: Prisma.MenuItemWhereInput;
    none?: Prisma.MenuItemWhereInput;
};
export type MenuItemOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MenuItemCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    availabilityStatus?: Prisma.SortOrder;
    availabilityReason?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MenuItemAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type MenuItemMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    availabilityStatus?: Prisma.SortOrder;
    availabilityReason?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MenuItemMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    imageUrl?: Prisma.SortOrder;
    availabilityStatus?: Prisma.SortOrder;
    availabilityReason?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MenuItemSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type MenuItemScalarRelationFilter = {
    is?: Prisma.MenuItemWhereInput;
    isNot?: Prisma.MenuItemWhereInput;
};
export type MenuItemCreateNestedManyWithoutCategoryInput = {
    create?: Prisma.XOR<Prisma.MenuItemCreateWithoutCategoryInput, Prisma.MenuItemUncheckedCreateWithoutCategoryInput> | Prisma.MenuItemCreateWithoutCategoryInput[] | Prisma.MenuItemUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.MenuItemCreateOrConnectWithoutCategoryInput | Prisma.MenuItemCreateOrConnectWithoutCategoryInput[];
    createMany?: Prisma.MenuItemCreateManyCategoryInputEnvelope;
    connect?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
};
export type MenuItemUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: Prisma.XOR<Prisma.MenuItemCreateWithoutCategoryInput, Prisma.MenuItemUncheckedCreateWithoutCategoryInput> | Prisma.MenuItemCreateWithoutCategoryInput[] | Prisma.MenuItemUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.MenuItemCreateOrConnectWithoutCategoryInput | Prisma.MenuItemCreateOrConnectWithoutCategoryInput[];
    createMany?: Prisma.MenuItemCreateManyCategoryInputEnvelope;
    connect?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
};
export type MenuItemUpdateManyWithoutCategoryNestedInput = {
    create?: Prisma.XOR<Prisma.MenuItemCreateWithoutCategoryInput, Prisma.MenuItemUncheckedCreateWithoutCategoryInput> | Prisma.MenuItemCreateWithoutCategoryInput[] | Prisma.MenuItemUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.MenuItemCreateOrConnectWithoutCategoryInput | Prisma.MenuItemCreateOrConnectWithoutCategoryInput[];
    upsert?: Prisma.MenuItemUpsertWithWhereUniqueWithoutCategoryInput | Prisma.MenuItemUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: Prisma.MenuItemCreateManyCategoryInputEnvelope;
    set?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
    disconnect?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
    delete?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
    connect?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
    update?: Prisma.MenuItemUpdateWithWhereUniqueWithoutCategoryInput | Prisma.MenuItemUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?: Prisma.MenuItemUpdateManyWithWhereWithoutCategoryInput | Prisma.MenuItemUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: Prisma.MenuItemScalarWhereInput | Prisma.MenuItemScalarWhereInput[];
};
export type MenuItemUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: Prisma.XOR<Prisma.MenuItemCreateWithoutCategoryInput, Prisma.MenuItemUncheckedCreateWithoutCategoryInput> | Prisma.MenuItemCreateWithoutCategoryInput[] | Prisma.MenuItemUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.MenuItemCreateOrConnectWithoutCategoryInput | Prisma.MenuItemCreateOrConnectWithoutCategoryInput[];
    upsert?: Prisma.MenuItemUpsertWithWhereUniqueWithoutCategoryInput | Prisma.MenuItemUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: Prisma.MenuItemCreateManyCategoryInputEnvelope;
    set?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
    disconnect?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
    delete?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
    connect?: Prisma.MenuItemWhereUniqueInput | Prisma.MenuItemWhereUniqueInput[];
    update?: Prisma.MenuItemUpdateWithWhereUniqueWithoutCategoryInput | Prisma.MenuItemUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?: Prisma.MenuItemUpdateManyWithWhereWithoutCategoryInput | Prisma.MenuItemUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: Prisma.MenuItemScalarWhereInput | Prisma.MenuItemScalarWhereInput[];
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type MenuItemCreateNestedOneWithoutOrderItemsInput = {
    create?: Prisma.XOR<Prisma.MenuItemCreateWithoutOrderItemsInput, Prisma.MenuItemUncheckedCreateWithoutOrderItemsInput>;
    connectOrCreate?: Prisma.MenuItemCreateOrConnectWithoutOrderItemsInput;
    connect?: Prisma.MenuItemWhereUniqueInput;
};
export type MenuItemUpdateOneRequiredWithoutOrderItemsNestedInput = {
    create?: Prisma.XOR<Prisma.MenuItemCreateWithoutOrderItemsInput, Prisma.MenuItemUncheckedCreateWithoutOrderItemsInput>;
    connectOrCreate?: Prisma.MenuItemCreateOrConnectWithoutOrderItemsInput;
    upsert?: Prisma.MenuItemUpsertWithoutOrderItemsInput;
    connect?: Prisma.MenuItemWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MenuItemUpdateToOneWithWhereWithoutOrderItemsInput, Prisma.MenuItemUpdateWithoutOrderItemsInput>, Prisma.MenuItemUncheckedUpdateWithoutOrderItemsInput>;
};
export type MenuItemCreateWithoutCategoryInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: string | null;
    availabilityStatus?: string;
    availabilityReason?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    orderItems?: Prisma.OrderItemCreateNestedManyWithoutMenuItemInput;
};
export type MenuItemUncheckedCreateWithoutCategoryInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: string | null;
    availabilityStatus?: string;
    availabilityReason?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    orderItems?: Prisma.OrderItemUncheckedCreateNestedManyWithoutMenuItemInput;
};
export type MenuItemCreateOrConnectWithoutCategoryInput = {
    where: Prisma.MenuItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.MenuItemCreateWithoutCategoryInput, Prisma.MenuItemUncheckedCreateWithoutCategoryInput>;
};
export type MenuItemCreateManyCategoryInputEnvelope = {
    data: Prisma.MenuItemCreateManyCategoryInput | Prisma.MenuItemCreateManyCategoryInput[];
    skipDuplicates?: boolean;
};
export type MenuItemUpsertWithWhereUniqueWithoutCategoryInput = {
    where: Prisma.MenuItemWhereUniqueInput;
    update: Prisma.XOR<Prisma.MenuItemUpdateWithoutCategoryInput, Prisma.MenuItemUncheckedUpdateWithoutCategoryInput>;
    create: Prisma.XOR<Prisma.MenuItemCreateWithoutCategoryInput, Prisma.MenuItemUncheckedCreateWithoutCategoryInput>;
};
export type MenuItemUpdateWithWhereUniqueWithoutCategoryInput = {
    where: Prisma.MenuItemWhereUniqueInput;
    data: Prisma.XOR<Prisma.MenuItemUpdateWithoutCategoryInput, Prisma.MenuItemUncheckedUpdateWithoutCategoryInput>;
};
export type MenuItemUpdateManyWithWhereWithoutCategoryInput = {
    where: Prisma.MenuItemScalarWhereInput;
    data: Prisma.XOR<Prisma.MenuItemUpdateManyMutationInput, Prisma.MenuItemUncheckedUpdateManyWithoutCategoryInput>;
};
export type MenuItemScalarWhereInput = {
    AND?: Prisma.MenuItemScalarWhereInput | Prisma.MenuItemScalarWhereInput[];
    OR?: Prisma.MenuItemScalarWhereInput[];
    NOT?: Prisma.MenuItemScalarWhereInput | Prisma.MenuItemScalarWhereInput[];
    id?: Prisma.BigIntFilter<"MenuItem"> | bigint | number;
    categoryId?: Prisma.BigIntFilter<"MenuItem"> | bigint | number;
    code?: Prisma.StringFilter<"MenuItem"> | string;
    name?: Prisma.StringFilter<"MenuItem"> | string;
    description?: Prisma.StringNullableFilter<"MenuItem"> | string | null;
    price?: Prisma.DecimalFilter<"MenuItem"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.StringNullableFilter<"MenuItem"> | string | null;
    availabilityStatus?: Prisma.StringFilter<"MenuItem"> | string;
    availabilityReason?: Prisma.StringNullableFilter<"MenuItem"> | string | null;
    isActive?: Prisma.BoolFilter<"MenuItem"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"MenuItem"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MenuItem"> | Date | string;
};
export type MenuItemCreateWithoutOrderItemsInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: string | null;
    availabilityStatus?: string;
    availabilityReason?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    category: Prisma.MenuCategoryCreateNestedOneWithoutItemsInput;
};
export type MenuItemUncheckedCreateWithoutOrderItemsInput = {
    id?: bigint | number;
    categoryId: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: string | null;
    availabilityStatus?: string;
    availabilityReason?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MenuItemCreateOrConnectWithoutOrderItemsInput = {
    where: Prisma.MenuItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.MenuItemCreateWithoutOrderItemsInput, Prisma.MenuItemUncheckedCreateWithoutOrderItemsInput>;
};
export type MenuItemUpsertWithoutOrderItemsInput = {
    update: Prisma.XOR<Prisma.MenuItemUpdateWithoutOrderItemsInput, Prisma.MenuItemUncheckedUpdateWithoutOrderItemsInput>;
    create: Prisma.XOR<Prisma.MenuItemCreateWithoutOrderItemsInput, Prisma.MenuItemUncheckedCreateWithoutOrderItemsInput>;
    where?: Prisma.MenuItemWhereInput;
};
export type MenuItemUpdateToOneWithWhereWithoutOrderItemsInput = {
    where?: Prisma.MenuItemWhereInput;
    data: Prisma.XOR<Prisma.MenuItemUpdateWithoutOrderItemsInput, Prisma.MenuItemUncheckedUpdateWithoutOrderItemsInput>;
};
export type MenuItemUpdateWithoutOrderItemsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    availabilityStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    availabilityReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    category?: Prisma.MenuCategoryUpdateOneRequiredWithoutItemsNestedInput;
};
export type MenuItemUncheckedUpdateWithoutOrderItemsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    categoryId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    availabilityStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    availabilityReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuItemCreateManyCategoryInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: string | null;
    availabilityStatus?: string;
    availabilityReason?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MenuItemUpdateWithoutCategoryInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    availabilityStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    availabilityReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orderItems?: Prisma.OrderItemUpdateManyWithoutMenuItemNestedInput;
};
export type MenuItemUncheckedUpdateWithoutCategoryInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    availabilityStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    availabilityReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orderItems?: Prisma.OrderItemUncheckedUpdateManyWithoutMenuItemNestedInput;
};
export type MenuItemUncheckedUpdateManyWithoutCategoryInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    imageUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    availabilityStatus?: Prisma.StringFieldUpdateOperationsInput | string;
    availabilityReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuItemCountOutputType = {
    orderItems: number;
};
export type MenuItemCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orderItems?: boolean | MenuItemCountOutputTypeCountOrderItemsArgs;
};
export type MenuItemCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemCountOutputTypeSelect<ExtArgs> | null;
};
export type MenuItemCountOutputTypeCountOrderItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemWhereInput;
};
export type MenuItemSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    categoryId?: boolean;
    code?: boolean;
    name?: boolean;
    description?: boolean;
    price?: boolean;
    imageUrl?: boolean;
    availabilityStatus?: boolean;
    availabilityReason?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    category?: boolean | Prisma.MenuCategoryDefaultArgs<ExtArgs>;
    orderItems?: boolean | Prisma.MenuItem$orderItemsArgs<ExtArgs>;
    _count?: boolean | Prisma.MenuItemCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["menuItem"]>;
export type MenuItemSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    categoryId?: boolean;
    code?: boolean;
    name?: boolean;
    description?: boolean;
    price?: boolean;
    imageUrl?: boolean;
    availabilityStatus?: boolean;
    availabilityReason?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    category?: boolean | Prisma.MenuCategoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["menuItem"]>;
export type MenuItemSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    categoryId?: boolean;
    code?: boolean;
    name?: boolean;
    description?: boolean;
    price?: boolean;
    imageUrl?: boolean;
    availabilityStatus?: boolean;
    availabilityReason?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    category?: boolean | Prisma.MenuCategoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["menuItem"]>;
export type MenuItemSelectScalar = {
    id?: boolean;
    categoryId?: boolean;
    code?: boolean;
    name?: boolean;
    description?: boolean;
    price?: boolean;
    imageUrl?: boolean;
    availabilityStatus?: boolean;
    availabilityReason?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type MenuItemOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "categoryId" | "code" | "name" | "description" | "price" | "imageUrl" | "availabilityStatus" | "availabilityReason" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["menuItem"]>;
export type MenuItemInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    category?: boolean | Prisma.MenuCategoryDefaultArgs<ExtArgs>;
    orderItems?: boolean | Prisma.MenuItem$orderItemsArgs<ExtArgs>;
    _count?: boolean | Prisma.MenuItemCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MenuItemIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    category?: boolean | Prisma.MenuCategoryDefaultArgs<ExtArgs>;
};
export type MenuItemIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    category?: boolean | Prisma.MenuCategoryDefaultArgs<ExtArgs>;
};
export type $MenuItemPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MenuItem";
    objects: {
        category: Prisma.$MenuCategoryPayload<ExtArgs>;
        orderItems: Prisma.$OrderItemPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        categoryId: bigint;
        code: string;
        name: string;
        description: string | null;
        price: runtime.Decimal;
        imageUrl: string | null;
        availabilityStatus: string;
        availabilityReason: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["menuItem"]>;
    composites: {};
};
export type MenuItemGetPayload<S extends boolean | null | undefined | MenuItemDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MenuItemPayload, S>;
export type MenuItemCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MenuItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MenuItemCountAggregateInputType | true;
};
export interface MenuItemDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MenuItem'];
        meta: {
            name: 'MenuItem';
        };
    };
    findUnique<T extends MenuItemFindUniqueArgs>(args: Prisma.SelectSubset<T, MenuItemFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MenuItemClient<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MenuItemFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MenuItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MenuItemClient<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MenuItemFindFirstArgs>(args?: Prisma.SelectSubset<T, MenuItemFindFirstArgs<ExtArgs>>): Prisma.Prisma__MenuItemClient<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MenuItemFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MenuItemFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MenuItemClient<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MenuItemFindManyArgs>(args?: Prisma.SelectSubset<T, MenuItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MenuItemCreateArgs>(args: Prisma.SelectSubset<T, MenuItemCreateArgs<ExtArgs>>): Prisma.Prisma__MenuItemClient<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MenuItemCreateManyArgs>(args?: Prisma.SelectSubset<T, MenuItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MenuItemCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MenuItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MenuItemDeleteArgs>(args: Prisma.SelectSubset<T, MenuItemDeleteArgs<ExtArgs>>): Prisma.Prisma__MenuItemClient<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MenuItemUpdateArgs>(args: Prisma.SelectSubset<T, MenuItemUpdateArgs<ExtArgs>>): Prisma.Prisma__MenuItemClient<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MenuItemDeleteManyArgs>(args?: Prisma.SelectSubset<T, MenuItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MenuItemUpdateManyArgs>(args: Prisma.SelectSubset<T, MenuItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MenuItemUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MenuItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MenuItemUpsertArgs>(args: Prisma.SelectSubset<T, MenuItemUpsertArgs<ExtArgs>>): Prisma.Prisma__MenuItemClient<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MenuItemCountArgs>(args?: Prisma.Subset<T, MenuItemCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MenuItemCountAggregateOutputType> : number>;
    aggregate<T extends MenuItemAggregateArgs>(args: Prisma.Subset<T, MenuItemAggregateArgs>): Prisma.PrismaPromise<GetMenuItemAggregateType<T>>;
    groupBy<T extends MenuItemGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MenuItemGroupByArgs['orderBy'];
    } : {
        orderBy?: MenuItemGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MenuItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMenuItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MenuItemFieldRefs;
}
export interface Prisma__MenuItemClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    category<T extends Prisma.MenuCategoryDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MenuCategoryDefaultArgs<ExtArgs>>): Prisma.Prisma__MenuCategoryClient<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    orderItems<T extends Prisma.MenuItem$orderItemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MenuItem$orderItemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MenuItemFieldRefs {
    readonly id: Prisma.FieldRef<"MenuItem", 'BigInt'>;
    readonly categoryId: Prisma.FieldRef<"MenuItem", 'BigInt'>;
    readonly code: Prisma.FieldRef<"MenuItem", 'String'>;
    readonly name: Prisma.FieldRef<"MenuItem", 'String'>;
    readonly description: Prisma.FieldRef<"MenuItem", 'String'>;
    readonly price: Prisma.FieldRef<"MenuItem", 'Decimal'>;
    readonly imageUrl: Prisma.FieldRef<"MenuItem", 'String'>;
    readonly availabilityStatus: Prisma.FieldRef<"MenuItem", 'String'>;
    readonly availabilityReason: Prisma.FieldRef<"MenuItem", 'String'>;
    readonly isActive: Prisma.FieldRef<"MenuItem", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"MenuItem", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"MenuItem", 'DateTime'>;
}
export type MenuItemFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
    where: Prisma.MenuItemWhereUniqueInput;
};
export type MenuItemFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
    where: Prisma.MenuItemWhereUniqueInput;
};
export type MenuItemFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
    where?: Prisma.MenuItemWhereInput;
    orderBy?: Prisma.MenuItemOrderByWithRelationInput | Prisma.MenuItemOrderByWithRelationInput[];
    cursor?: Prisma.MenuItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MenuItemScalarFieldEnum | Prisma.MenuItemScalarFieldEnum[];
};
export type MenuItemFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
    where?: Prisma.MenuItemWhereInput;
    orderBy?: Prisma.MenuItemOrderByWithRelationInput | Prisma.MenuItemOrderByWithRelationInput[];
    cursor?: Prisma.MenuItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MenuItemScalarFieldEnum | Prisma.MenuItemScalarFieldEnum[];
};
export type MenuItemFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
    where?: Prisma.MenuItemWhereInput;
    orderBy?: Prisma.MenuItemOrderByWithRelationInput | Prisma.MenuItemOrderByWithRelationInput[];
    cursor?: Prisma.MenuItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MenuItemScalarFieldEnum | Prisma.MenuItemScalarFieldEnum[];
};
export type MenuItemCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MenuItemCreateInput, Prisma.MenuItemUncheckedCreateInput>;
};
export type MenuItemCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MenuItemCreateManyInput | Prisma.MenuItemCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MenuItemCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    data: Prisma.MenuItemCreateManyInput | Prisma.MenuItemCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MenuItemIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MenuItemUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MenuItemUpdateInput, Prisma.MenuItemUncheckedUpdateInput>;
    where: Prisma.MenuItemWhereUniqueInput;
};
export type MenuItemUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MenuItemUpdateManyMutationInput, Prisma.MenuItemUncheckedUpdateManyInput>;
    where?: Prisma.MenuItemWhereInput;
    limit?: number;
};
export type MenuItemUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MenuItemUpdateManyMutationInput, Prisma.MenuItemUncheckedUpdateManyInput>;
    where?: Prisma.MenuItemWhereInput;
    limit?: number;
    include?: Prisma.MenuItemIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MenuItemUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
    where: Prisma.MenuItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.MenuItemCreateInput, Prisma.MenuItemUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MenuItemUpdateInput, Prisma.MenuItemUncheckedUpdateInput>;
};
export type MenuItemDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
    where: Prisma.MenuItemWhereUniqueInput;
};
export type MenuItemDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuItemWhereInput;
    limit?: number;
};
export type MenuItem$orderItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    where?: Prisma.OrderItemWhereInput;
    orderBy?: Prisma.OrderItemOrderByWithRelationInput | Prisma.OrderItemOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderItemScalarFieldEnum | Prisma.OrderItemScalarFieldEnum[];
};
export type MenuItemDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuItemSelect<ExtArgs> | null;
    omit?: Prisma.MenuItemOmit<ExtArgs> | null;
    include?: Prisma.MenuItemInclude<ExtArgs> | null;
};
