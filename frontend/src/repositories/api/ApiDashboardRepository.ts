import type { DashboardRepository } from "@/src/repositories/interfaces/DashboardRepository";
import type { DashboardSummary } from "@/src/features/dashboard/types/dashboard.types";
import type { ApiResponse } from "@/src/types/common";
import { apiClient } from "@/src/services/api/apiClient";
import { ApiInventoryRepository } from "@/src/repositories/api/ApiInventoryRepository";
import { ApiKDSRepository } from "@/src/repositories/api/ApiKDSRepository";
import { ApiOrderRepository } from "@/src/repositories/api/ApiOrderRepository";

type OverviewApi = { revenue: string; paidOrderCount: number; itemsSold: number };
type BestSellerApi = Array<{ itemName: string; quantitySold: number; revenue: string }>;
type UsersApi = { data: Array<{ isActive: boolean }> };
type OrdersApi = { total: number };

function unwrap<T>(value: unknown): T {
  if (value && typeof value === "object" && "success" in value && "data" in value) {
    return (value as ApiResponse<T>).data;
  }
  return value as T;
}

function localDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export class ApiDashboardRepository implements DashboardRepository {
  async getSummary(): Promise<DashboardSummary> {
    const today = localDate(new Date());
    const [overviewResponse, ordersResponse, bestSellersResponse, usersResponse, ingredients, kitchenQueue, activeOrders] =
      await Promise.all([
        apiClient.get("/reports/overview", { params: { from: today, to: today } }),
        apiClient.get("/reports/orders", { params: { from: today, to: today, page: 1, limit: 1 } }),
        apiClient.get("/reports/best-sellers", { params: { from: today, to: today, limit: 5 } }),
        apiClient.get("/users", { params: { page: 1, limit: 100 } }),
        new ApiInventoryRepository().getIngredients(),
        new ApiKDSRepository().getKitchenQueue(),
        new ApiOrderRepository().getOrders(),
      ]);

    const overview = unwrap<OverviewApi>(overviewResponse.data);
    const orders = unwrap<OrdersApi>(ordersResponse.data);
    const bestSellers = unwrap<BestSellerApi>(bestSellersResponse.data);
    const users = unwrap<UsersApi>(usersResponse.data);
    const outOfStock = ingredients.filter((item) => item.currentStock <= 0);
    const lowStock = ingredients.filter((item) => item.status === "LOW_STOCK" && item.currentStock > 0);
    const recentOrders = [...activeOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      todayRevenue: Number(overview.revenue),
      todayOrderCount: orders.total,
      activeOrderCount: activeOrders.length,
      pendingOrderCount: activeOrders.filter((order) => order.status === "PENDING").length,
      kdsQueueCount: kitchenQueue.filter((item) => item.status === "QUEUED").length,
      lowStockAlertsCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      activeStaffCount: users.data.filter((user) => user.isActive).length,
      recentOrders,
      lowStockIngredients: [...outOfStock, ...lowStock].slice(0, 6),
      topDishes: bestSellers.map((item) => ({
        name: item.itemName,
        quantitySold: item.quantitySold,
        revenue: Number(item.revenue),
      })),
    };
  }
}
