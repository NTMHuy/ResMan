import type { ReportPeriod } from '@/src/types/common';
import type { RevenuePoint } from '@/src/features/reports/types/report.types';

export const mockRevenueSeriesByPeriod: Record<ReportPeriod, RevenuePoint[]> = {
  DAY: [
    { label: '08h', revenue: 1850000, orders: 6 },
    { label: '10h', revenue: 3200000, orders: 10 },
    { label: '12h', revenue: 6450000, orders: 18 },
    { label: '14h', revenue: 2950000, orders: 8 },
    { label: '16h', revenue: 1900000, orders: 5 },
    { label: '18h', revenue: 4820000, orders: 13 },
  ],
  WEEK: [
    { label: 'T2', revenue: 14200000, orders: 38 },
    { label: 'T3', revenue: 15800000, orders: 42 },
    { label: 'T4', revenue: 16400000, orders: 44 },
    { label: 'T5', revenue: 18100000, orders: 49 },
    { label: 'T6', revenue: 24500000, orders: 63 },
    { label: 'T7', revenue: 29800000, orders: 76 },
    { label: 'CN', revenue: 27400000, orders: 70 },
  ],
  MONTH: [
    { label: 'Tuần 1', revenue: 118500000, orders: 310 },
    { label: 'Tuần 2', revenue: 132400000, orders: 348 },
    { label: 'Tuần 3', revenue: 145200000, orders: 382 },
    { label: 'Tuần 4', revenue: 158900000, orders: 416 },
  ],
};
