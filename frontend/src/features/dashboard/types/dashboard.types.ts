import type { Ingredient } from '@/src/features/inventory/types/inventory.types';
import type { Order } from '@/src/features/orders/types/order.types';
import type { TopSellingDish } from '@/src/features/reports/types/report.types';

export interface DashboardSummary {
  todayRevenue: number;
  todayOrderCount: number;
  activeOrderCount: number;
  pendingOrderCount: number;
  kdsQueueCount: number;
  lowStockAlertsCount: number;
  outOfStockCount: number;
  activeStaffCount: number;
  recentOrders: Order[];
  lowStockIngredients: Ingredient[];
  topDishes: TopSellingDish[];
}
