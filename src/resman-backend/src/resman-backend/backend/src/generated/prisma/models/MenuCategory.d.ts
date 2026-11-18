import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type MenuCategoryModel = runtime.Types.Result.DefaultSelection<Prisma.$MenuCategoryPayload>;
export type AggregateMenuCategory = {
    _count: MenuCategoryCountAggregateOutputType | null;
    _avg: MenuCategoryAvgAggregateOutputType | null;
    _sum: MenuCategorySumAggregateOutputType | null;
    _min: MenuCategoryMinAggregateOutputType | null;
    _max: MenuCategoryMaxAggregateOutputType | null;
};
export type MenuCategoryAvgAggregateOutputType = {
    id: number | null;
};
export type MenuCategorySumAggregateOutputType = {
    id: bigint | null;
};
export type MenuCategoryMinAggregateOutputType = {
    id: bigint | null;
    code: string | null;
    name: string | null;
    description: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MenuCategoryMaxAggregateOutputType = {
    id: bigint | null;
    code: string | null;
    name: string | null;
    description: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MenuCategoryCountAggregateOutputType = {
    id: number;
    code: number;
    name: number;
    description: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type MenuCategoryAvgAggregateInputType = {
    id?: true;
};
export type MenuCategorySumAggregateInputType = {
    id?: true;
};
export type MenuCategoryMinAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    description?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MenuCategoryMaxAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    description?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MenuCategoryCountAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    description?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type MenuCategoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuCategoryWhereInput;
    orderBy?: Prisma.MenuCategoryOrderByWithRelationInput | Prisma.MenuCategoryOrderByWithRelationInput[];
    cursor?: Prisma.MenuCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MenuCategoryCountAggregateInputType;
    _avg?: MenuCategoryAvgAggregateInputType;
    _sum?: MenuCategorySumAggregateInputType;
    _min?: MenuCategoryMinAggregateInputType;
    _max?: MenuCategoryMaxAggregateInputType;
};
export type GetMenuCategoryAggregateType<T extends MenuCategoryAggregateArgs> = {
    [P in keyof T & keyof AggregateMenuCategory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMenuCategory[P]> : Prisma.GetScalarType<T[P], AggregateMenuCategory[P]>;
};
export type MenuCategoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuCategoryWhereInput;
    orderBy?: Prisma.MenuCategoryOrderByWithAggregationInput | Prisma.MenuCategoryOrderByWithAggregationInput[];
    by: Prisma.MenuCategoryScalarFieldEnum[] | Prisma.MenuCategoryScalarFieldEnum;
    having?: Prisma.MenuCategoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MenuCategoryCountAggregateInputType | true;
    _avg?: MenuCategoryAvgAggregateInputType;
    _sum?: MenuCategorySumAggregateInputType;
    _min?: MenuCategoryMinAggregateInputType;
    _max?: MenuCategoryMaxAggregateInputType;
};
export type MenuCategoryGroupByOutputType = {
    id: bigint;
    code: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: MenuCategoryCountAggregateOutputType | null;
    _avg: MenuCategoryAvgAggregateOutputType | null;
    _sum: MenuCategorySumAggregateOutputType | null;
    _min: MenuCategoryMinAggregateOutputType | null;
    _max: MenuCategoryMaxAggregateOutputType | null;
};
export type GetMenuCategoryGroupByPayload<T extends MenuCategoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MenuCategoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MenuCategoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MenuCategoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MenuCategoryGroupByOutputType[P]>;
}>>;
export type MenuCategoryWhereInput = {
    AND?: Prisma.MenuCategoryWhereInput | Prisma.MenuCategoryWhereInput[];
    OR?: Prisma.MenuCategoryWhereInput[];
    NOT?: Prisma.MenuCategoryWhereInput | Prisma.MenuCategoryWhereInput[];
    id?: Prisma.BigIntFilter<"MenuCategory"> | bigint | number;
    code?: Prisma.StringFilter<"MenuCategory"> | string;
    name?: Prisma.StringFilter<"MenuCategory"> | string;
    description?: Prisma.StringNullableFilter<"MenuCategory"> | string | null;
    isActive?: Prisma.BoolFilter<"MenuCategory"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"MenuCategory"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MenuCategory"> | Date | string;
    items?: Prisma.MenuItemListRelationFilter;
};
export type MenuCategoryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    items?: Prisma.MenuItemOrderByRelationAggregateInput;
};
export type MenuCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    code?: string;
    AND?: Prisma.MenuCategoryWhereInput | Prisma.MenuCategoryWhereInput[];
    OR?: Prisma.MenuCategoryWhereInput[];
    NOT?: Prisma.MenuCategoryWhereInput | Prisma.MenuCategoryWhereInput[];
    name?: Prisma.StringFilter<"MenuCategory"> | string;
    description?: Prisma.StringNullableFilter<"MenuCategory"> | string | null;
    isActive?: Prisma.BoolFilter<"MenuCategory"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"MenuCategory"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MenuCategory"> | Date | string;
    items?: Prisma.MenuItemListRelationFilter;
}, "id" | "code">;
export type MenuCategoryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MenuCategoryCountOrderByAggregateInput;
    _avg?: Prisma.MenuCategoryAvgOrderByAggregateInput;
    _max?: Prisma.MenuCategoryMaxOrderByAggregateInput;
    _min?: Prisma.MenuCategoryMinOrderByAggregateInput;
    _sum?: Prisma.MenuCategorySumOrderByAggregateInput;
};
export type MenuCategoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.MenuCategoryScalarWhereWithAggregatesInput | Prisma.MenuCategoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.MenuCategoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MenuCategoryScalarWhereWithAggregatesInput | Prisma.MenuCategoryScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"MenuCategory"> | bigint | number;
    code?: Prisma.StringWithAggregatesFilter<"MenuCategory"> | string;
    name?: Prisma.StringWithAggregatesFilter<"MenuCategory"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"MenuCategory"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"MenuCategory"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MenuCategory"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"MenuCategory"> | Date | string;
};
export type MenuCategoryCreateInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.MenuItemCreateNestedManyWithoutCategoryInput;
};
export type MenuCategoryUncheckedCreateInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.MenuItemUncheckedCreateNestedManyWithoutCategoryInput;
};
export type MenuCategoryUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.MenuItemUpdateManyWithoutCategoryNestedInput;
};
export type MenuCategoryUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.MenuItemUncheckedUpdateManyWithoutCategoryNestedInput;
};
export type MenuCategoryCreateManyInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MenuCategoryUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuCategoryUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuCategoryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MenuCategoryAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type MenuCategoryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MenuCategoryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MenuCategorySumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type MenuCategoryScalarRelationFilter = {
    is?: Prisma.MenuCategoryWhereInput;
    isNot?: Prisma.MenuCategoryWhereInput;
};
export type MenuCategoryCreateNestedOneWithoutItemsInput = {
    create?: Prisma.XOR<Prisma.MenuCategoryCreateWithoutItemsInput, Prisma.MenuCategoryUncheckedCreateWithoutItemsInput>;
    connectOrCreate?: Prisma.MenuCategoryCreateOrConnectWithoutItemsInput;
    connect?: Prisma.MenuCategoryWhereUniqueInput;
};
export type MenuCategoryUpdateOneRequiredWithoutItemsNestedInput = {
    create?: Prisma.XOR<Prisma.MenuCategoryCreateWithoutItemsInput, Prisma.MenuCategoryUncheckedCreateWithoutItemsInput>;
    connectOrCreate?: Prisma.MenuCategoryCreateOrConnectWithoutItemsInput;
    upsert?: Prisma.MenuCategoryUpsertWithoutItemsInput;
    connect?: Prisma.MenuCategoryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MenuCategoryUpdateToOneWithWhereWithoutItemsInput, Prisma.MenuCategoryUpdateWithoutItemsInput>, Prisma.MenuCategoryUncheckedUpdateWithoutItemsInput>;
};
export type MenuCategoryCreateWithoutItemsInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MenuCategoryUncheckedCreateWithoutItemsInput = {
    id?: bigint | number;
    code: string;
    name: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MenuCategoryCreateOrConnectWithoutItemsInput = {
    where: Prisma.MenuCategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.MenuCategoryCreateWithoutItemsInput, Prisma.MenuCategoryUncheckedCreateWithoutItemsInput>;
};
export type MenuCategoryUpsertWithoutItemsInput = {
    update: Prisma.XOR<Prisma.MenuCategoryUpdateWithoutItemsInput, Prisma.MenuCategoryUncheckedUpdateWithoutItemsInput>;
    create: Prisma.XOR<Prisma.MenuCategoryCreateWithoutItemsInput, Prisma.MenuCategoryUncheckedCreateWithoutItemsInput>;
    where?: Prisma.MenuCategoryWhereInput;
};
export type MenuCategoryUpdateToOneWithWhereWithoutItemsInput = {
    where?: Prisma.MenuCategoryWhereInput;
    data: Prisma.XOR<Prisma.MenuCategoryUpdateWithoutItemsInput, Prisma.MenuCategoryUncheckedUpdateWithoutItemsInput>;
};
export type MenuCategoryUpdateWithoutItemsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuCategoryUncheckedUpdateWithoutItemsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MenuCategoryCountOutputType = {
    items: number;
};
export type MenuCategoryCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    items?: boolean | MenuCategoryCountOutputTypeCountItemsArgs;
};
export type MenuCategoryCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategoryCountOutputTypeSelect<ExtArgs> | null;
};
export type MenuCategoryCountOutputTypeCountItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuItemWhereInput;
};
export type MenuCategorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    description?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    items?: boolean | Prisma.MenuCategory$itemsArgs<ExtArgs>;
    _count?: boolean | Prisma.MenuCategoryCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["menuCategory"]>;
export type MenuCategorySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    description?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["menuCategory"]>;
export type MenuCategorySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    description?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["menuCategory"]>;
export type MenuCategorySelectScalar = {
    id?: boolean;
    code?: boolean;
    name?: boolean;
    description?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type MenuCategoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "name" | "description" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["menuCategory"]>;
export type MenuCategoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    items?: boolean | Prisma.MenuCategory$itemsArgs<ExtArgs>;
    _count?: boolean | Prisma.MenuCategoryCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MenuCategoryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type MenuCategoryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $MenuCategoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MenuCategory";
    objects: {
        items: Prisma.$MenuItemPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["menuCategory"]>;
    composites: {};
};
export type MenuCategoryGetPayload<S extends boolean | null | undefined | MenuCategoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload, S>;
export type MenuCategoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MenuCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MenuCategoryCountAggregateInputType | true;
};
export interface MenuCategoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MenuCategory'];
        meta: {
            name: 'MenuCategory';
        };
    };
    findUnique<T extends MenuCategoryFindUniqueArgs>(args: Prisma.SelectSubset<T, MenuCategoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MenuCategoryClient<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MenuCategoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MenuCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MenuCategoryClient<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MenuCategoryFindFirstArgs>(args?: Prisma.SelectSubset<T, MenuCategoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__MenuCategoryClient<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MenuCategoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MenuCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MenuCategoryClient<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MenuCategoryFindManyArgs>(args?: Prisma.SelectSubset<T, MenuCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MenuCategoryCreateArgs>(args: Prisma.SelectSubset<T, MenuCategoryCreateArgs<ExtArgs>>): Prisma.Prisma__MenuCategoryClient<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MenuCategoryCreateManyArgs>(args?: Prisma.SelectSubset<T, MenuCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MenuCategoryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MenuCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MenuCategoryDeleteArgs>(args: Prisma.SelectSubset<T, MenuCategoryDeleteArgs<ExtArgs>>): Prisma.Prisma__MenuCategoryClient<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MenuCategoryUpdateArgs>(args: Prisma.SelectSubset<T, MenuCategoryUpdateArgs<ExtArgs>>): Prisma.Prisma__MenuCategoryClient<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MenuCategoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, MenuCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MenuCategoryUpdateManyArgs>(args: Prisma.SelectSubset<T, MenuCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MenuCategoryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MenuCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MenuCategoryUpsertArgs>(args: Prisma.SelectSubset<T, MenuCategoryUpsertArgs<ExtArgs>>): Prisma.Prisma__MenuCategoryClient<runtime.Types.Result.GetResult<Prisma.$MenuCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MenuCategoryCountArgs>(args?: Prisma.Subset<T, MenuCategoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MenuCategoryCountAggregateOutputType> : number>;
    aggregate<T extends MenuCategoryAggregateArgs>(args: Prisma.Subset<T, MenuCategoryAggregateArgs>): Prisma.PrismaPromise<GetMenuCategoryAggregateType<T>>;
    groupBy<T extends MenuCategoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MenuCategoryGroupByArgs['orderBy'];
    } : {
        orderBy?: MenuCategoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MenuCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMenuCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MenuCategoryFieldRefs;
}
export interface Prisma__MenuCategoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    items<T extends Prisma.MenuCategory$itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MenuCategory$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MenuItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MenuCategoryFieldRefs {
    readonly id: Prisma.FieldRef<"MenuCategory", 'BigInt'>;
    readonly code: Prisma.FieldRef<"MenuCategory", 'String'>;
    readonly name: Prisma.FieldRef<"MenuCategory", 'String'>;
    readonly description: Prisma.FieldRef<"MenuCategory", 'String'>;
    readonly isActive: Prisma.FieldRef<"MenuCategory", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"MenuCategory", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"MenuCategory", 'DateTime'>;
}
export type MenuCategoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
    where: Prisma.MenuCategoryWhereUniqueInput;
};
export type MenuCategoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
    where: Prisma.MenuCategoryWhereUniqueInput;
};
export type MenuCategoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
    where?: Prisma.MenuCategoryWhereInput;
    orderBy?: Prisma.MenuCategoryOrderByWithRelationInput | Prisma.MenuCategoryOrderByWithRelationInput[];
    cursor?: Prisma.MenuCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MenuCategoryScalarFieldEnum | Prisma.MenuCategoryScalarFieldEnum[];
};
export type MenuCategoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
    where?: Prisma.MenuCategoryWhereInput;
    orderBy?: Prisma.MenuCategoryOrderByWithRelationInput | Prisma.MenuCategoryOrderByWithRelationInput[];
    cursor?: Prisma.MenuCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MenuCategoryScalarFieldEnum | Prisma.MenuCategoryScalarFieldEnum[];
};
export type MenuCategoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
    where?: Prisma.MenuCategoryWhereInput;
    orderBy?: Prisma.MenuCategoryOrderByWithRelationInput | Prisma.MenuCategoryOrderByWithRelationInput[];
    cursor?: Prisma.MenuCategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MenuCategoryScalarFieldEnum | Prisma.MenuCategoryScalarFieldEnum[];
};
export type MenuCategoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MenuCategoryCreateInput, Prisma.MenuCategoryUncheckedCreateInput>;
};
export type MenuCategoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MenuCategoryCreateManyInput | Prisma.MenuCategoryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MenuCategoryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    data: Prisma.MenuCategoryCreateManyInput | Prisma.MenuCategoryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MenuCategoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MenuCategoryUpdateInput, Prisma.MenuCategoryUncheckedUpdateInput>;
    where: Prisma.MenuCategoryWhereUniqueInput;
};
export type MenuCategoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MenuCategoryUpdateManyMutationInput, Prisma.MenuCategoryUncheckedUpdateManyInput>;
    where?: Prisma.MenuCategoryWhereInput;
    limit?: number;
};
export type MenuCategoryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MenuCategoryUpdateManyMutationInput, Prisma.MenuCategoryUncheckedUpdateManyInput>;
    where?: Prisma.MenuCategoryWhereInput;
    limit?: number;
};
export type MenuCategoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
    where: Prisma.MenuCategoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.MenuCategoryCreateInput, Prisma.MenuCategoryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MenuCategoryUpdateInput, Prisma.MenuCategoryUncheckedUpdateInput>;
};
export type MenuCategoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
    where: Prisma.MenuCategoryWhereUniqueInput;
};
export type MenuCategoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MenuCategoryWhereInput;
    limit?: number;
};
export type MenuCategory$itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MenuCategoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MenuCategorySelect<ExtArgs> | null;
    omit?: Prisma.MenuCategoryOmit<ExtArgs> | null;
    include?: Prisma.MenuCategoryInclude<ExtArgs> | null;
};
