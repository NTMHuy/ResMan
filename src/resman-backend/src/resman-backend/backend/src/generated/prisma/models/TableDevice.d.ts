import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type TableDeviceModel = runtime.Types.Result.DefaultSelection<Prisma.$TableDevicePayload>;
export type AggregateTableDevice = {
    _count: TableDeviceCountAggregateOutputType | null;
    _avg: TableDeviceAvgAggregateOutputType | null;
    _sum: TableDeviceSumAggregateOutputType | null;
    _min: TableDeviceMinAggregateOutputType | null;
    _max: TableDeviceMaxAggregateOutputType | null;
};
export type TableDeviceAvgAggregateOutputType = {
    id: number | null;
    diningTableId: number | null;
};
export type TableDeviceSumAggregateOutputType = {
    id: bigint | null;
    diningTableId: bigint | null;
};
export type TableDeviceMinAggregateOutputType = {
    id: bigint | null;
    diningTableId: bigint | null;
    deviceCode: string | null;
    deviceName: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TableDeviceMaxAggregateOutputType = {
    id: bigint | null;
    diningTableId: bigint | null;
    deviceCode: string | null;
    deviceName: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TableDeviceCountAggregateOutputType = {
    id: number;
    diningTableId: number;
    deviceCode: number;
    deviceName: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TableDeviceAvgAggregateInputType = {
    id?: true;
    diningTableId?: true;
};
export type TableDeviceSumAggregateInputType = {
    id?: true;
    diningTableId?: true;
};
export type TableDeviceMinAggregateInputType = {
    id?: true;
    diningTableId?: true;
    deviceCode?: true;
    deviceName?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TableDeviceMaxAggregateInputType = {
    id?: true;
    diningTableId?: true;
    deviceCode?: true;
    deviceName?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TableDeviceCountAggregateInputType = {
    id?: true;
    diningTableId?: true;
    deviceCode?: true;
    deviceName?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TableDeviceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TableDeviceWhereInput;
    orderBy?: Prisma.TableDeviceOrderByWithRelationInput | Prisma.TableDeviceOrderByWithRelationInput[];
    cursor?: Prisma.TableDeviceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TableDeviceCountAggregateInputType;
    _avg?: TableDeviceAvgAggregateInputType;
    _sum?: TableDeviceSumAggregateInputType;
    _min?: TableDeviceMinAggregateInputType;
    _max?: TableDeviceMaxAggregateInputType;
};
export type GetTableDeviceAggregateType<T extends TableDeviceAggregateArgs> = {
    [P in keyof T & keyof AggregateTableDevice]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTableDevice[P]> : Prisma.GetScalarType<T[P], AggregateTableDevice[P]>;
};
export type TableDeviceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TableDeviceWhereInput;
    orderBy?: Prisma.TableDeviceOrderByWithAggregationInput | Prisma.TableDeviceOrderByWithAggregationInput[];
    by: Prisma.TableDeviceScalarFieldEnum[] | Prisma.TableDeviceScalarFieldEnum;
    having?: Prisma.TableDeviceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TableDeviceCountAggregateInputType | true;
    _avg?: TableDeviceAvgAggregateInputType;
    _sum?: TableDeviceSumAggregateInputType;
    _min?: TableDeviceMinAggregateInputType;
    _max?: TableDeviceMaxAggregateInputType;
};
export type TableDeviceGroupByOutputType = {
    id: bigint;
    diningTableId: bigint;
    deviceCode: string;
    deviceName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: TableDeviceCountAggregateOutputType | null;
    _avg: TableDeviceAvgAggregateOutputType | null;
    _sum: TableDeviceSumAggregateOutputType | null;
    _min: TableDeviceMinAggregateOutputType | null;
    _max: TableDeviceMaxAggregateOutputType | null;
};
export type GetTableDeviceGroupByPayload<T extends TableDeviceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TableDeviceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TableDeviceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TableDeviceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TableDeviceGroupByOutputType[P]>;
}>>;
export type TableDeviceWhereInput = {
    AND?: Prisma.TableDeviceWhereInput | Prisma.TableDeviceWhereInput[];
    OR?: Prisma.TableDeviceWhereInput[];
    NOT?: Prisma.TableDeviceWhereInput | Prisma.TableDeviceWhereInput[];
    id?: Prisma.BigIntFilter<"TableDevice"> | bigint | number;
    diningTableId?: Prisma.BigIntFilter<"TableDevice"> | bigint | number;
    deviceCode?: Prisma.StringFilter<"TableDevice"> | string;
    deviceName?: Prisma.StringFilter<"TableDevice"> | string;
    isActive?: Prisma.BoolFilter<"TableDevice"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TableDevice"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TableDevice"> | Date | string;
    table?: Prisma.XOR<Prisma.DiningTableScalarRelationFilter, Prisma.DiningTableWhereInput>;
};
export type TableDeviceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    diningTableId?: Prisma.SortOrder;
    deviceCode?: Prisma.SortOrder;
    deviceName?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    table?: Prisma.DiningTableOrderByWithRelationInput;
};
export type TableDeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    deviceCode?: string;
    AND?: Prisma.TableDeviceWhereInput | Prisma.TableDeviceWhereInput[];
    OR?: Prisma.TableDeviceWhereInput[];
    NOT?: Prisma.TableDeviceWhereInput | Prisma.TableDeviceWhereInput[];
    diningTableId?: Prisma.BigIntFilter<"TableDevice"> | bigint | number;
    deviceName?: Prisma.StringFilter<"TableDevice"> | string;
    isActive?: Prisma.BoolFilter<"TableDevice"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TableDevice"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TableDevice"> | Date | string;
    table?: Prisma.XOR<Prisma.DiningTableScalarRelationFilter, Prisma.DiningTableWhereInput>;
}, "id" | "deviceCode">;
export type TableDeviceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    diningTableId?: Prisma.SortOrder;
    deviceCode?: Prisma.SortOrder;
    deviceName?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TableDeviceCountOrderByAggregateInput;
    _avg?: Prisma.TableDeviceAvgOrderByAggregateInput;
    _max?: Prisma.TableDeviceMaxOrderByAggregateInput;
    _min?: Prisma.TableDeviceMinOrderByAggregateInput;
    _sum?: Prisma.TableDeviceSumOrderByAggregateInput;
};
export type TableDeviceScalarWhereWithAggregatesInput = {
    AND?: Prisma.TableDeviceScalarWhereWithAggregatesInput | Prisma.TableDeviceScalarWhereWithAggregatesInput[];
    OR?: Prisma.TableDeviceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TableDeviceScalarWhereWithAggregatesInput | Prisma.TableDeviceScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"TableDevice"> | bigint | number;
    diningTableId?: Prisma.BigIntWithAggregatesFilter<"TableDevice"> | bigint | number;
    deviceCode?: Prisma.StringWithAggregatesFilter<"TableDevice"> | string;
    deviceName?: Prisma.StringWithAggregatesFilter<"TableDevice"> | string;
    isActive?: Prisma.BoolWithAggregatesFilter<"TableDevice"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TableDevice"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"TableDevice"> | Date | string;
};
export type TableDeviceCreateInput = {
    id?: bigint | number;
    deviceCode: string;
    deviceName: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    table: Prisma.DiningTableCreateNestedOneWithoutDevicesInput;
};
export type TableDeviceUncheckedCreateInput = {
    id?: bigint | number;
    diningTableId: bigint | number;
    deviceCode: string;
    deviceName: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TableDeviceUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    deviceCode?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceName?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    table?: Prisma.DiningTableUpdateOneRequiredWithoutDevicesNestedInput;
};
export type TableDeviceUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    diningTableId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    deviceCode?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceName?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TableDeviceCreateManyInput = {
    id?: bigint | number;
    diningTableId: bigint | number;
    deviceCode: string;
    deviceName: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TableDeviceUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    deviceCode?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceName?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TableDeviceUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    diningTableId?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    deviceCode?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceName?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TableDeviceListRelationFilter = {
    every?: Prisma.TableDeviceWhereInput;
    some?: Prisma.TableDeviceWhereInput;
    none?: Prisma.TableDeviceWhereInput;
};
export type TableDeviceOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TableDeviceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    diningTableId?: Prisma.SortOrder;
    deviceCode?: Prisma.SortOrder;
    deviceName?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TableDeviceAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    diningTableId?: Prisma.SortOrder;
};
export type TableDeviceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    diningTableId?: Prisma.SortOrder;
    deviceCode?: Prisma.SortOrder;
    deviceName?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TableDeviceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    diningTableId?: Prisma.SortOrder;
    deviceCode?: Prisma.SortOrder;
    deviceName?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TableDeviceSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    diningTableId?: Prisma.SortOrder;
};
export type TableDeviceCreateNestedManyWithoutTableInput = {
    create?: Prisma.XOR<Prisma.TableDeviceCreateWithoutTableInput, Prisma.TableDeviceUncheckedCreateWithoutTableInput> | Prisma.TableDeviceCreateWithoutTableInput[] | Prisma.TableDeviceUncheckedCreateWithoutTableInput[];
    connectOrCreate?: Prisma.TableDeviceCreateOrConnectWithoutTableInput | Prisma.TableDeviceCreateOrConnectWithoutTableInput[];
    createMany?: Prisma.TableDeviceCreateManyTableInputEnvelope;
    connect?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
};
export type TableDeviceUncheckedCreateNestedManyWithoutTableInput = {
    create?: Prisma.XOR<Prisma.TableDeviceCreateWithoutTableInput, Prisma.TableDeviceUncheckedCreateWithoutTableInput> | Prisma.TableDeviceCreateWithoutTableInput[] | Prisma.TableDeviceUncheckedCreateWithoutTableInput[];
    connectOrCreate?: Prisma.TableDeviceCreateOrConnectWithoutTableInput | Prisma.TableDeviceCreateOrConnectWithoutTableInput[];
    createMany?: Prisma.TableDeviceCreateManyTableInputEnvelope;
    connect?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
};
export type TableDeviceUpdateManyWithoutTableNestedInput = {
    create?: Prisma.XOR<Prisma.TableDeviceCreateWithoutTableInput, Prisma.TableDeviceUncheckedCreateWithoutTableInput> | Prisma.TableDeviceCreateWithoutTableInput[] | Prisma.TableDeviceUncheckedCreateWithoutTableInput[];
    connectOrCreate?: Prisma.TableDeviceCreateOrConnectWithoutTableInput | Prisma.TableDeviceCreateOrConnectWithoutTableInput[];
    upsert?: Prisma.TableDeviceUpsertWithWhereUniqueWithoutTableInput | Prisma.TableDeviceUpsertWithWhereUniqueWithoutTableInput[];
    createMany?: Prisma.TableDeviceCreateManyTableInputEnvelope;
    set?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
    disconnect?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
    delete?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
    connect?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
    update?: Prisma.TableDeviceUpdateWithWhereUniqueWithoutTableInput | Prisma.TableDeviceUpdateWithWhereUniqueWithoutTableInput[];
    updateMany?: Prisma.TableDeviceUpdateManyWithWhereWithoutTableInput | Prisma.TableDeviceUpdateManyWithWhereWithoutTableInput[];
    deleteMany?: Prisma.TableDeviceScalarWhereInput | Prisma.TableDeviceScalarWhereInput[];
};
export type TableDeviceUncheckedUpdateManyWithoutTableNestedInput = {
    create?: Prisma.XOR<Prisma.TableDeviceCreateWithoutTableInput, Prisma.TableDeviceUncheckedCreateWithoutTableInput> | Prisma.TableDeviceCreateWithoutTableInput[] | Prisma.TableDeviceUncheckedCreateWithoutTableInput[];
    connectOrCreate?: Prisma.TableDeviceCreateOrConnectWithoutTableInput | Prisma.TableDeviceCreateOrConnectWithoutTableInput[];
    upsert?: Prisma.TableDeviceUpsertWithWhereUniqueWithoutTableInput | Prisma.TableDeviceUpsertWithWhereUniqueWithoutTableInput[];
    createMany?: Prisma.TableDeviceCreateManyTableInputEnvelope;
    set?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
    disconnect?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
    delete?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
    connect?: Prisma.TableDeviceWhereUniqueInput | Prisma.TableDeviceWhereUniqueInput[];
    update?: Prisma.TableDeviceUpdateWithWhereUniqueWithoutTableInput | Prisma.TableDeviceUpdateWithWhereUniqueWithoutTableInput[];
    updateMany?: Prisma.TableDeviceUpdateManyWithWhereWithoutTableInput | Prisma.TableDeviceUpdateManyWithWhereWithoutTableInput[];
    deleteMany?: Prisma.TableDeviceScalarWhereInput | Prisma.TableDeviceScalarWhereInput[];
};
export type TableDeviceCreateWithoutTableInput = {
    id?: bigint | number;
    deviceCode: string;
    deviceName: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TableDeviceUncheckedCreateWithoutTableInput = {
    id?: bigint | number;
    deviceCode: string;
    deviceName: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TableDeviceCreateOrConnectWithoutTableInput = {
    where: Prisma.TableDeviceWhereUniqueInput;
    create: Prisma.XOR<Prisma.TableDeviceCreateWithoutTableInput, Prisma.TableDeviceUncheckedCreateWithoutTableInput>;
};
export type TableDeviceCreateManyTableInputEnvelope = {
    data: Prisma.TableDeviceCreateManyTableInput | Prisma.TableDeviceCreateManyTableInput[];
    skipDuplicates?: boolean;
};
export type TableDeviceUpsertWithWhereUniqueWithoutTableInput = {
    where: Prisma.TableDeviceWhereUniqueInput;
    update: Prisma.XOR<Prisma.TableDeviceUpdateWithoutTableInput, Prisma.TableDeviceUncheckedUpdateWithoutTableInput>;
    create: Prisma.XOR<Prisma.TableDeviceCreateWithoutTableInput, Prisma.TableDeviceUncheckedCreateWithoutTableInput>;
};
export type TableDeviceUpdateWithWhereUniqueWithoutTableInput = {
    where: Prisma.TableDeviceWhereUniqueInput;
    data: Prisma.XOR<Prisma.TableDeviceUpdateWithoutTableInput, Prisma.TableDeviceUncheckedUpdateWithoutTableInput>;
};
export type TableDeviceUpdateManyWithWhereWithoutTableInput = {
    where: Prisma.TableDeviceScalarWhereInput;
    data: Prisma.XOR<Prisma.TableDeviceUpdateManyMutationInput, Prisma.TableDeviceUncheckedUpdateManyWithoutTableInput>;
};
export type TableDeviceScalarWhereInput = {
    AND?: Prisma.TableDeviceScalarWhereInput | Prisma.TableDeviceScalarWhereInput[];
    OR?: Prisma.TableDeviceScalarWhereInput[];
    NOT?: Prisma.TableDeviceScalarWhereInput | Prisma.TableDeviceScalarWhereInput[];
    id?: Prisma.BigIntFilter<"TableDevice"> | bigint | number;
    diningTableId?: Prisma.BigIntFilter<"TableDevice"> | bigint | number;
    deviceCode?: Prisma.StringFilter<"TableDevice"> | string;
    deviceName?: Prisma.StringFilter<"TableDevice"> | string;
    isActive?: Prisma.BoolFilter<"TableDevice"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TableDevice"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TableDevice"> | Date | string;
};
export type TableDeviceCreateManyTableInput = {
    id?: bigint | number;
    deviceCode: string;
    deviceName: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TableDeviceUpdateWithoutTableInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    deviceCode?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceName?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TableDeviceUncheckedUpdateWithoutTableInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    deviceCode?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceName?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TableDeviceUncheckedUpdateManyWithoutTableInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    deviceCode?: Prisma.StringFieldUpdateOperationsInput | string;
    deviceName?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TableDeviceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    diningTableId?: boolean;
    deviceCode?: boolean;
    deviceName?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    table?: boolean | Prisma.DiningTableDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tableDevice"]>;
export type TableDeviceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    diningTableId?: boolean;
    deviceCode?: boolean;
    deviceName?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    table?: boolean | Prisma.DiningTableDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tableDevice"]>;
export type TableDeviceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    diningTableId?: boolean;
    deviceCode?: boolean;
    deviceName?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    table?: boolean | Prisma.DiningTableDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tableDevice"]>;
export type TableDeviceSelectScalar = {
    id?: boolean;
    diningTableId?: boolean;
    deviceCode?: boolean;
    deviceName?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TableDeviceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "diningTableId" | "deviceCode" | "deviceName" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["tableDevice"]>;
export type TableDeviceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    table?: boolean | Prisma.DiningTableDefaultArgs<ExtArgs>;
};
export type TableDeviceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    table?: boolean | Prisma.DiningTableDefaultArgs<ExtArgs>;
};
export type TableDeviceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    table?: boolean | Prisma.DiningTableDefaultArgs<ExtArgs>;
};
export type $TableDevicePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TableDevice";
    objects: {
        table: Prisma.$DiningTablePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        diningTableId: bigint;
        deviceCode: string;
        deviceName: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["tableDevice"]>;
    composites: {};
};
export type TableDeviceGetPayload<S extends boolean | null | undefined | TableDeviceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TableDevicePayload, S>;
export type TableDeviceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TableDeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TableDeviceCountAggregateInputType | true;
};
export interface TableDeviceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TableDevice'];
        meta: {
            name: 'TableDevice';
        };
    };
    findUnique<T extends TableDeviceFindUniqueArgs>(args: Prisma.SelectSubset<T, TableDeviceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TableDeviceClient<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TableDeviceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TableDeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TableDeviceClient<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TableDeviceFindFirstArgs>(args?: Prisma.SelectSubset<T, TableDeviceFindFirstArgs<ExtArgs>>): Prisma.Prisma__TableDeviceClient<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TableDeviceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TableDeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TableDeviceClient<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TableDeviceFindManyArgs>(args?: Prisma.SelectSubset<T, TableDeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TableDeviceCreateArgs>(args: Prisma.SelectSubset<T, TableDeviceCreateArgs<ExtArgs>>): Prisma.Prisma__TableDeviceClient<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TableDeviceCreateManyArgs>(args?: Prisma.SelectSubset<T, TableDeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TableDeviceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TableDeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TableDeviceDeleteArgs>(args: Prisma.SelectSubset<T, TableDeviceDeleteArgs<ExtArgs>>): Prisma.Prisma__TableDeviceClient<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TableDeviceUpdateArgs>(args: Prisma.SelectSubset<T, TableDeviceUpdateArgs<ExtArgs>>): Prisma.Prisma__TableDeviceClient<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TableDeviceDeleteManyArgs>(args?: Prisma.SelectSubset<T, TableDeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TableDeviceUpdateManyArgs>(args: Prisma.SelectSubset<T, TableDeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TableDeviceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TableDeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TableDeviceUpsertArgs>(args: Prisma.SelectSubset<T, TableDeviceUpsertArgs<ExtArgs>>): Prisma.Prisma__TableDeviceClient<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TableDeviceCountArgs>(args?: Prisma.Subset<T, TableDeviceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TableDeviceCountAggregateOutputType> : number>;
    aggregate<T extends TableDeviceAggregateArgs>(args: Prisma.Subset<T, TableDeviceAggregateArgs>): Prisma.PrismaPromise<GetTableDeviceAggregateType<T>>;
    groupBy<T extends TableDeviceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TableDeviceGroupByArgs['orderBy'];
    } : {
        orderBy?: TableDeviceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TableDeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTableDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TableDeviceFieldRefs;
}
export interface Prisma__TableDeviceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    table<T extends Prisma.DiningTableDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DiningTableDefaultArgs<ExtArgs>>): Prisma.Prisma__DiningTableClient<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TableDeviceFieldRefs {
    readonly id: Prisma.FieldRef<"TableDevice", 'BigInt'>;
    readonly diningTableId: Prisma.FieldRef<"TableDevice", 'BigInt'>;
    readonly deviceCode: Prisma.FieldRef<"TableDevice", 'String'>;
    readonly deviceName: Prisma.FieldRef<"TableDevice", 'String'>;
    readonly isActive: Prisma.FieldRef<"TableDevice", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"TableDevice", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"TableDevice", 'DateTime'>;
}
export type TableDeviceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
    where: Prisma.TableDeviceWhereUniqueInput;
};
export type TableDeviceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
    where: Prisma.TableDeviceWhereUniqueInput;
};
export type TableDeviceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
    where?: Prisma.TableDeviceWhereInput;
    orderBy?: Prisma.TableDeviceOrderByWithRelationInput | Prisma.TableDeviceOrderByWithRelationInput[];
    cursor?: Prisma.TableDeviceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TableDeviceScalarFieldEnum | Prisma.TableDeviceScalarFieldEnum[];
};
export type TableDeviceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
    where?: Prisma.TableDeviceWhereInput;
    orderBy?: Prisma.TableDeviceOrderByWithRelationInput | Prisma.TableDeviceOrderByWithRelationInput[];
    cursor?: Prisma.TableDeviceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TableDeviceScalarFieldEnum | Prisma.TableDeviceScalarFieldEnum[];
};
export type TableDeviceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
    where?: Prisma.TableDeviceWhereInput;
    orderBy?: Prisma.TableDeviceOrderByWithRelationInput | Prisma.TableDeviceOrderByWithRelationInput[];
    cursor?: Prisma.TableDeviceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TableDeviceScalarFieldEnum | Prisma.TableDeviceScalarFieldEnum[];
};
export type TableDeviceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TableDeviceCreateInput, Prisma.TableDeviceUncheckedCreateInput>;
};
export type TableDeviceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TableDeviceCreateManyInput | Prisma.TableDeviceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TableDeviceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    data: Prisma.TableDeviceCreateManyInput | Prisma.TableDeviceCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TableDeviceIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TableDeviceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TableDeviceUpdateInput, Prisma.TableDeviceUncheckedUpdateInput>;
    where: Prisma.TableDeviceWhereUniqueInput;
};
export type TableDeviceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TableDeviceUpdateManyMutationInput, Prisma.TableDeviceUncheckedUpdateManyInput>;
    where?: Prisma.TableDeviceWhereInput;
    limit?: number;
};
export type TableDeviceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TableDeviceUpdateManyMutationInput, Prisma.TableDeviceUncheckedUpdateManyInput>;
    where?: Prisma.TableDeviceWhereInput;
    limit?: number;
    include?: Prisma.TableDeviceIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TableDeviceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
    where: Prisma.TableDeviceWhereUniqueInput;
    create: Prisma.XOR<Prisma.TableDeviceCreateInput, Prisma.TableDeviceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TableDeviceUpdateInput, Prisma.TableDeviceUncheckedUpdateInput>;
};
export type TableDeviceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
    where: Prisma.TableDeviceWhereUniqueInput;
};
export type TableDeviceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TableDeviceWhereInput;
    limit?: number;
};
export type TableDeviceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TableDeviceSelect<ExtArgs> | null;
    omit?: Prisma.TableDeviceOmit<ExtArgs> | null;
    include?: Prisma.TableDeviceInclude<ExtArgs> | null;
};
