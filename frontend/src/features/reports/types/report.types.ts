import type { ReportPeriod } from '@/src/types/common';

export interface RevenuePoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface TopSellingDish {
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface InventoryHealthSummary {
  ingredientCount: number;
  lowStockCount: number;
  lowStockItems: Array<{
    id: string;
    code: string;
    name: string;
    quantityOnHand: string;
    lowStockThreshold: string | null;
  }>;
}

export interface ReportSummary {
  period: ReportPeriod;
  from: string;
  to: string;
  revenue: number;
  paidOrderCount: number;
  itemsSold: number;
  averagePaidOrderValue: number;
  revenueSeries: RevenuePoint[];
  topDishes: TopSellingDish[];
  inventory: InventoryHealthSummary;
}
