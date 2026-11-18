import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type DiningTableModel = runtime.Types.Result.DefaultSelection<Prisma.$DiningTablePayload>;
export type AggregateDiningTable = {
    _count: DiningTableCountAggregateOutputType | null;
    _avg: DiningTableAvgAggregateOutputType | null;
    _sum: DiningTableSumAggregateOutputType | null;
    _min: DiningTableMinAggregateOutputType | null;
    _max: DiningTableMaxAggregateOutputType | null;
};
export type DiningTableAvgAggregateOutputType = {
    id: number | null;
    capacity: number | null;
};
export type DiningTableSumAggregateOutputType = {
    id: bigint | null;
    capacity: number | null;
};
export type DiningTableMinAggregateOutputType = {
    id: bigint | null;
    code: string | null;
    name: string | null;
    capacity: number | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DiningTableMaxAggregateOutputType = {
    id: bigint | null;
    code: string | null;
    name: string | null;
    capacity: number | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DiningTableCountAggregateOutputType = {
    id: number;
    code: number;
    name: number;
    capacity: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DiningTableAvgAggregateInputType = {
    id?: true;
    capacity?: true;
};
export type DiningTableSumAggregateInputType = {
    id?: true;
    capacity?: true;
};
export type DiningTableMinAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    capacity?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DiningTableMaxAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    capacity?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DiningTableCountAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    capacity?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DiningTableAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DiningTableWhereInput;
    orderBy?: Prisma.DiningTableOrderByWithRelationInput | Prisma.DiningTableOrderByWithRelationInput[];
    cursor?: Prisma.DiningTableWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DiningTableCountAggregateInputType;
    _avg?: DiningTableAvgAggregateInputType;
    _sum?: DiningTableSumAggregateInputType;
    _min?: DiningTableMinAggregateInputType;
    _max?: DiningTableMaxAggregateInputType;
};
export type GetDiningTableAggregateType<T extends DiningTableAggregateArgs> = {
    [P in keyof T & keyof AggregateDiningTable]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDiningTable[P]> : Prisma.GetScalarType<T[P], AggregateDiningTable[P]>;
};
export type DiningTableGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DiningTableWhereInput;
    orderBy?: Prisma.DiningTableOrderByWithAggregationInput | Prisma.DiningTableOrderByWithAggregationInput[];
    by: Prisma.DiningTableScalarFieldEnum[] | Prisma.DiningTableScalarFieldEnum;
    having?: Prisma.DiningTableScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DiningTableCountAggregateInputType | true;
    _avg?: DiningTableAvgAggregateInputType;
    _sum?: DiningTableSumAggregateInputType;
    _min?: DiningTableMinAggregateInputType;
    _max?: DiningTableMaxAggregateInputType;
};
export type DiningTableGroupByOutputType = {
    id: bigint;
    code: string;
    name: string;
    capacity: number | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    _count: DiningTableCountAggregateOutputType | null;
    _avg: DiningTableAvgAggregateOutputType | null;
    _sum: DiningTableSumAggregateOutputType | null;
    _min: DiningTableMinAggregateOutputType | null;
    _max: DiningTableMaxAggregateOutputType | null;
};
export type GetDiningTableGroupByPayload<T extends DiningTableGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DiningTableGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DiningTableGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DiningTableGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DiningTableGroupByOutputType[P]>;
}>>;
export type DiningTableWhereInput = {
    AND?: Prisma.DiningTableWhereInput | Prisma.DiningTableWhereInput[];
    OR?: Prisma.DiningTableWhereInput[];
    NOT?: Prisma.DiningTableWhereInput | Prisma.DiningTableWhereInput[];
    id?: Prisma.BigIntFilter<"DiningTable"> | bigint | number;
    code?: Prisma.StringFilter<"DiningTable"> | string;
    name?: Prisma.StringFilter<"DiningTable"> | string;
    capacity?: Prisma.IntNullableFilter<"DiningTable"> | number | null;
    status?: Prisma.StringFilter<"DiningTable"> | string;
    createdAt?: Prisma.DateTimeFilter<"DiningTable"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DiningTable"> | Date | string;
    sessions?: Prisma.DiningSessionListRelationFilter;
    devices?: Prisma.TableDeviceListRelationFilter;
};
export type DiningTableOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    capacity?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    sessions?: Prisma.DiningSessionOrderByRelationAggregateInput;
    devices?: Prisma.TableDeviceOrderByRelationAggregateInput;
};
export type DiningTableWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number;
    code?: string;
    AND?: Prisma.DiningTableWhereInput | Prisma.DiningTableWhereInput[];
    OR?: Prisma.DiningTableWhereInput[];
    NOT?: Prisma.DiningTableWhereInput | Prisma.DiningTableWhereInput[];
    name?: Prisma.StringFilter<"DiningTable"> | string;
    capacity?: Prisma.IntNullableFilter<"DiningTable"> | number | null;
    status?: Prisma.StringFilter<"DiningTable"> | string;
    createdAt?: Prisma.DateTimeFilter<"DiningTable"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DiningTable"> | Date | string;
    sessions?: Prisma.DiningSessionListRelationFilter;
    devices?: Prisma.TableDeviceListRelationFilter;
}, "id" | "code">;
export type DiningTableOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    capacity?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DiningTableCountOrderByAggregateInput;
    _avg?: Prisma.DiningTableAvgOrderByAggregateInput;
    _max?: Prisma.DiningTableMaxOrderByAggregateInput;
    _min?: Prisma.DiningTableMinOrderByAggregateInput;
    _sum?: Prisma.DiningTableSumOrderByAggregateInput;
};
export type DiningTableScalarWhereWithAggregatesInput = {
    AND?: Prisma.DiningTableScalarWhereWithAggregatesInput | Prisma.DiningTableScalarWhereWithAggregatesInput[];
    OR?: Prisma.DiningTableScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DiningTableScalarWhereWithAggregatesInput | Prisma.DiningTableScalarWhereWithAggregatesInput[];
    id?: Prisma.BigIntWithAggregatesFilter<"DiningTable"> | bigint | number;
    code?: Prisma.StringWithAggregatesFilter<"DiningTable"> | string;
    name?: Prisma.StringWithAggregatesFilter<"DiningTable"> | string;
    capacity?: Prisma.IntNullableWithAggregatesFilter<"DiningTable"> | number | null;
    status?: Prisma.StringWithAggregatesFilter<"DiningTable"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DiningTable"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"DiningTable"> | Date | string;
};
export type DiningTableCreateInput = {
    id?: bigint | number;
    code: string;
    name: string;
    capacity?: number | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.DiningSessionCreateNestedManyWithoutTableInput;
    devices?: Prisma.TableDeviceCreateNestedManyWithoutTableInput;
};
export type DiningTableUncheckedCreateInput = {
    id?: bigint | number;
    code: string;
    name: string;
    capacity?: number | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutTableInput;
    devices?: Prisma.TableDeviceUncheckedCreateNestedManyWithoutTableInput;
};
export type DiningTableUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.DiningSessionUpdateManyWithoutTableNestedInput;
    devices?: Prisma.TableDeviceUpdateManyWithoutTableNestedInput;
};
export type DiningTableUncheckedUpdateInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutTableNestedInput;
    devices?: Prisma.TableDeviceUncheckedUpdateManyWithoutTableNestedInput;
};
export type DiningTableCreateManyInput = {
    id?: bigint | number;
    code: string;
    name: string;
    capacity?: number | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DiningTableUpdateManyMutationInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DiningTableUncheckedUpdateManyInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DiningTableCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DiningTableAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
};
export type DiningTableMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DiningTableMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DiningTableSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
};
export type DiningTableScalarRelationFilter = {
    is?: Prisma.DiningTableWhereInput;
    isNot?: Prisma.DiningTableWhereInput;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type DiningTableCreateNestedOneWithoutSessionsInput = {
    create?: Prisma.XOR<Prisma.DiningTableCreateWithoutSessionsInput, Prisma.DiningTableUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: Prisma.DiningTableCreateOrConnectWithoutSessionsInput;
    connect?: Prisma.DiningTableWhereUniqueInput;
};
export type DiningTableUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: Prisma.XOR<Prisma.DiningTableCreateWithoutSessionsInput, Prisma.DiningTableUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: Prisma.DiningTableCreateOrConnectWithoutSessionsInput;
    upsert?: Prisma.DiningTableUpsertWithoutSessionsInput;
    connect?: Prisma.DiningTableWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DiningTableUpdateToOneWithWhereWithoutSessionsInput, Prisma.DiningTableUpdateWithoutSessionsInput>, Prisma.DiningTableUncheckedUpdateWithoutSessionsInput>;
};
export type DiningTableCreateNestedOneWithoutDevicesInput = {
    create?: Prisma.XOR<Prisma.DiningTableCreateWithoutDevicesInput, Prisma.DiningTableUncheckedCreateWithoutDevicesInput>;
    connectOrCreate?: Prisma.DiningTableCreateOrConnectWithoutDevicesInput;
    connect?: Prisma.DiningTableWhereUniqueInput;
};
export type DiningTableUpdateOneRequiredWithoutDevicesNestedInput = {
    create?: Prisma.XOR<Prisma.DiningTableCreateWithoutDevicesInput, Prisma.DiningTableUncheckedCreateWithoutDevicesInput>;
    connectOrCreate?: Prisma.DiningTableCreateOrConnectWithoutDevicesInput;
    upsert?: Prisma.DiningTableUpsertWithoutDevicesInput;
    connect?: Prisma.DiningTableWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DiningTableUpdateToOneWithWhereWithoutDevicesInput, Prisma.DiningTableUpdateWithoutDevicesInput>, Prisma.DiningTableUncheckedUpdateWithoutDevicesInput>;
};
export type DiningTableCreateWithoutSessionsInput = {
    id?: bigint | number;
    code: string;
    name: string;
    capacity?: number | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    devices?: Prisma.TableDeviceCreateNestedManyWithoutTableInput;
};
export type DiningTableUncheckedCreateWithoutSessionsInput = {
    id?: bigint | number;
    code: string;
    name: string;
    capacity?: number | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    devices?: Prisma.TableDeviceUncheckedCreateNestedManyWithoutTableInput;
};
export type DiningTableCreateOrConnectWithoutSessionsInput = {
    where: Prisma.DiningTableWhereUniqueInput;
    create: Prisma.XOR<Prisma.DiningTableCreateWithoutSessionsInput, Prisma.DiningTableUncheckedCreateWithoutSessionsInput>;
};
export type DiningTableUpsertWithoutSessionsInput = {
    update: Prisma.XOR<Prisma.DiningTableUpdateWithoutSessionsInput, Prisma.DiningTableUncheckedUpdateWithoutSessionsInput>;
    create: Prisma.XOR<Prisma.DiningTableCreateWithoutSessionsInput, Prisma.DiningTableUncheckedCreateWithoutSessionsInput>;
    where?: Prisma.DiningTableWhereInput;
};
export type DiningTableUpdateToOneWithWhereWithoutSessionsInput = {
    where?: Prisma.DiningTableWhereInput;
    data: Prisma.XOR<Prisma.DiningTableUpdateWithoutSessionsInput, Prisma.DiningTableUncheckedUpdateWithoutSessionsInput>;
};
export type DiningTableUpdateWithoutSessionsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    devices?: Prisma.TableDeviceUpdateManyWithoutTableNestedInput;
};
export type DiningTableUncheckedUpdateWithoutSessionsInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    devices?: Prisma.TableDeviceUncheckedUpdateManyWithoutTableNestedInput;
};
export type DiningTableCreateWithoutDevicesInput = {
    id?: bigint | number;
    code: string;
    name: string;
    capacity?: number | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.DiningSessionCreateNestedManyWithoutTableInput;
};
export type DiningTableUncheckedCreateWithoutDevicesInput = {
    id?: bigint | number;
    code: string;
    name: string;
    capacity?: number | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.DiningSessionUncheckedCreateNestedManyWithoutTableInput;
};
export type DiningTableCreateOrConnectWithoutDevicesInput = {
    where: Prisma.DiningTableWhereUniqueInput;
    create: Prisma.XOR<Prisma.DiningTableCreateWithoutDevicesInput, Prisma.DiningTableUncheckedCreateWithoutDevicesInput>;
};
export type DiningTableUpsertWithoutDevicesInput = {
    update: Prisma.XOR<Prisma.DiningTableUpdateWithoutDevicesInput, Prisma.DiningTableUncheckedUpdateWithoutDevicesInput>;
    create: Prisma.XOR<Prisma.DiningTableCreateWithoutDevicesInput, Prisma.DiningTableUncheckedCreateWithoutDevicesInput>;
    where?: Prisma.DiningTableWhereInput;
};
export type DiningTableUpdateToOneWithWhereWithoutDevicesInput = {
    where?: Prisma.DiningTableWhereInput;
    data: Prisma.XOR<Prisma.DiningTableUpdateWithoutDevicesInput, Prisma.DiningTableUncheckedUpdateWithoutDevicesInput>;
};
export type DiningTableUpdateWithoutDevicesInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.DiningSessionUpdateManyWithoutTableNestedInput;
};
export type DiningTableUncheckedUpdateWithoutDevicesInput = {
    id?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.DiningSessionUncheckedUpdateManyWithoutTableNestedInput;
};
export type DiningTableCountOutputType = {
    sessions: number;
    devices: number;
};
export type DiningTableCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sessions?: boolean | DiningTableCountOutputTypeCountSessionsArgs;
    devices?: boolean | DiningTableCountOutputTypeCountDevicesArgs;
};
export type DiningTableCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableCountOutputTypeSelect<ExtArgs> | null;
};
export type DiningTableCountOutputTypeCountSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DiningSessionWhereInput;
};
export type DiningTableCountOutputTypeCountDevicesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TableDeviceWhereInput;
};
export type DiningTableSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    capacity?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    sessions?: boolean | Prisma.DiningTable$sessionsArgs<ExtArgs>;
    devices?: boolean | Prisma.DiningTable$devicesArgs<ExtArgs>;
    _count?: boolean | Prisma.DiningTableCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["diningTable"]>;
export type DiningTableSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    capacity?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["diningTable"]>;
export type DiningTableSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    capacity?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["diningTable"]>;
export type DiningTableSelectScalar = {
    id?: boolean;
    code?: boolean;
    name?: boolean;
    capacity?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DiningTableOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "name" | "capacity" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["diningTable"]>;
export type DiningTableInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sessions?: boolean | Prisma.DiningTable$sessionsArgs<ExtArgs>;
    devices?: boolean | Prisma.DiningTable$devicesArgs<ExtArgs>;
    _count?: boolean | Prisma.DiningTableCountOutputTypeDefaultArgs<ExtArgs>;
};
export type DiningTableIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type DiningTableIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $DiningTablePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DiningTable";
    objects: {
        sessions: Prisma.$DiningSessionPayload<ExtArgs>[];
        devices: Prisma.$TableDevicePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: bigint;
        code: string;
        name: string;
        capacity: number | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["diningTable"]>;
    composites: {};
};
export type DiningTableGetPayload<S extends boolean | null | undefined | DiningTableDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DiningTablePayload, S>;
export type DiningTableCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DiningTableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DiningTableCountAggregateInputType | true;
};
export interface DiningTableDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DiningTable'];
        meta: {
            name: 'DiningTable';
        };
    };
    findUnique<T extends DiningTableFindUniqueArgs>(args: Prisma.SelectSubset<T, DiningTableFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DiningTableClient<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DiningTableFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DiningTableFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DiningTableClient<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DiningTableFindFirstArgs>(args?: Prisma.SelectSubset<T, DiningTableFindFirstArgs<ExtArgs>>): Prisma.Prisma__DiningTableClient<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DiningTableFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DiningTableFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DiningTableClient<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DiningTableFindManyArgs>(args?: Prisma.SelectSubset<T, DiningTableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DiningTableCreateArgs>(args: Prisma.SelectSubset<T, DiningTableCreateArgs<ExtArgs>>): Prisma.Prisma__DiningTableClient<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DiningTableCreateManyArgs>(args?: Prisma.SelectSubset<T, DiningTableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DiningTableCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DiningTableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DiningTableDeleteArgs>(args: Prisma.SelectSubset<T, DiningTableDeleteArgs<ExtArgs>>): Prisma.Prisma__DiningTableClient<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DiningTableUpdateArgs>(args: Prisma.SelectSubset<T, DiningTableUpdateArgs<ExtArgs>>): Prisma.Prisma__DiningTableClient<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DiningTableDeleteManyArgs>(args?: Prisma.SelectSubset<T, DiningTableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DiningTableUpdateManyArgs>(args: Prisma.SelectSubset<T, DiningTableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DiningTableUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DiningTableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DiningTableUpsertArgs>(args: Prisma.SelectSubset<T, DiningTableUpsertArgs<ExtArgs>>): Prisma.Prisma__DiningTableClient<runtime.Types.Result.GetResult<Prisma.$DiningTablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DiningTableCountArgs>(args?: Prisma.Subset<T, DiningTableCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DiningTableCountAggregateOutputType> : number>;
    aggregate<T extends DiningTableAggregateArgs>(args: Prisma.Subset<T, DiningTableAggregateArgs>): Prisma.PrismaPromise<GetDiningTableAggregateType<T>>;
    groupBy<T extends DiningTableGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DiningTableGroupByArgs['orderBy'];
    } : {
        orderBy?: DiningTableGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DiningTableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiningTableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DiningTableFieldRefs;
}
export interface Prisma__DiningTableClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    sessions<T extends Prisma.DiningTable$sessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DiningTable$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DiningSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    devices<T extends Prisma.DiningTable$devicesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DiningTable$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TableDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DiningTableFieldRefs {
    readonly id: Prisma.FieldRef<"DiningTable", 'BigInt'>;
    readonly code: Prisma.FieldRef<"DiningTable", 'String'>;
    readonly name: Prisma.FieldRef<"DiningTable", 'String'>;
    readonly capacity: Prisma.FieldRef<"DiningTable", 'Int'>;
    readonly status: Prisma.FieldRef<"DiningTable", 'String'>;
    readonly createdAt: Prisma.FieldRef<"DiningTable", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"DiningTable", 'DateTime'>;
}
export type DiningTableFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
    where: Prisma.DiningTableWhereUniqueInput;
};
export type DiningTableFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
    where: Prisma.DiningTableWhereUniqueInput;
};
export type DiningTableFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
    where?: Prisma.DiningTableWhereInput;
    orderBy?: Prisma.DiningTableOrderByWithRelationInput | Prisma.DiningTableOrderByWithRelationInput[];
    cursor?: Prisma.DiningTableWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DiningTableScalarFieldEnum | Prisma.DiningTableScalarFieldEnum[];
};
export type DiningTableFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
    where?: Prisma.DiningTableWhereInput;
    orderBy?: Prisma.DiningTableOrderByWithRelationInput | Prisma.DiningTableOrderByWithRelationInput[];
    cursor?: Prisma.DiningTableWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DiningTableScalarFieldEnum | Prisma.DiningTableScalarFieldEnum[];
};
export type DiningTableFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
    where?: Prisma.DiningTableWhereInput;
    orderBy?: Prisma.DiningTableOrderByWithRelationInput | Prisma.DiningTableOrderByWithRelationInput[];
    cursor?: Prisma.DiningTableWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DiningTableScalarFieldEnum | Prisma.DiningTableScalarFieldEnum[];
};
export type DiningTableCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DiningTableCreateInput, Prisma.DiningTableUncheckedCreateInput>;
};
export type DiningTableCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DiningTableCreateManyInput | Prisma.DiningTableCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DiningTableCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    data: Prisma.DiningTableCreateManyInput | Prisma.DiningTableCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DiningTableUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DiningTableUpdateInput, Prisma.DiningTableUncheckedUpdateInput>;
    where: Prisma.DiningTableWhereUniqueInput;
};
export type DiningTableUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DiningTableUpdateManyMutationInput, Prisma.DiningTableUncheckedUpdateManyInput>;
    where?: Prisma.DiningTableWhereInput;
    limit?: number;
};
export type DiningTableUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DiningTableUpdateManyMutationInput, Prisma.DiningTableUncheckedUpdateManyInput>;
    where?: Prisma.DiningTableWhereInput;
    limit?: number;
};
export type DiningTableUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
    where: Prisma.DiningTableWhereUniqueInput;
    create: Prisma.XOR<Prisma.DiningTableCreateInput, Prisma.DiningTableUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DiningTableUpdateInput, Prisma.DiningTableUncheckedUpdateInput>;
};
export type DiningTableDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
    where: Prisma.DiningTableWhereUniqueInput;
};
export type DiningTableDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DiningTableWhereInput;
    limit?: number;
};
export type DiningTable$sessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DiningTable$devicesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DiningTableDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DiningTableSelect<ExtArgs> | null;
    omit?: Prisma.DiningTableOmit<ExtArgs> | null;
    include?: Prisma.DiningTableInclude<ExtArgs> | null;
};
