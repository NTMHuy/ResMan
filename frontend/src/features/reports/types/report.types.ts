import type { ReportPeriod } from '@/src/types/common';

export interface RevenuePoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface TopSellingDish {
  menuItemId: string;
  sku: string;
  name: string;
  station: string;
  quantitySold: number;
  revenue: number;
  avgCookMinutes: number;
}

export interface CategoryRevenueSlice {
  categoryName: string;
  revenue: number;
  percentage: number;
  color: string;
}

export interface InventoryHealthSummary {
  totalIngredients: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface CancelledOrderAudit {
  orderNumber: string;
  tableNumber: string;
  amount: number;
  reason: string;
  cancelledAt: string;
}

export interface ReportSummary {
  period: ReportPeriod;
  totalRevenue: number;
  revenueGrowthPercent: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  avgCookTimeMinutes: number;
  slaDelayRatePercent: number;
  revenueSeries: RevenuePoint[];
  topDishes: TopSellingDish[];
  categoryBreakdown: CategoryRevenueSlice[];
  inventoryHealth: InventoryHealthSummary;
  cancellationAudits: CancelledOrderAudit[];
}
