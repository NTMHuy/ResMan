import type { ReportRepository } from '@/src/repositories/interfaces/ReportRepository';
import type { ApiResponse, ReportPeriod } from '@/src/types/common';
import type { ReportSummary } from '@/src/features/reports/types/report.types';
import { apiClient } from '@/src/services/api/apiClient';

type OverviewApi = { from: string | null; to: string | null; revenue: string; paidOrderCount: number; itemsSold: number };
type RevenueApi = { period: 'day' | 'month'; data: Array<{ date: string; revenue: string; paymentCount: number }> };
type BestSellerApi = Array<{ itemName: string; quantitySold: number; revenue: string }>;
type InventoryApi = { ingredientCount: number; lowStockCount: number; lowStockItems: Array<{ id: string; code: string; name: string; quantityOnHand: string; lowStockThreshold: string | null }> };

function unwrap<T>(value: ApiResponse<T> | T): T {
  if (
    value &&
    typeof value === 'object' &&
    'success' in value &&
    'data' in value
  ) {
    return (value as ApiResponse<T>).data;
  }
  // ReportsService.revenue returns { period, from, to, data: [...] }.
  // Do not mistake that business field for the HTTP response envelope.
  return value as T;
}

function localDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class ApiReportRepository implements ReportRepository {
  async getReportSummary(period: ReportPeriod): Promise<ReportSummary> {
    const today = new Date();
    const fromDate = new Date(today);
    if (period === 'WEEK') fromDate.setDate(today.getDate() - 6);
    if (period === 'MONTH') fromDate.setDate(1);
    const from = localDate(fromDate);
    const to = localDate(today);
    const grouping = period === 'MONTH' ? 'month' : 'day';

    const [overviewResponse, revenueResponse, bestSellersResponse, inventoryResponse] = await Promise.all([
      apiClient.get<ApiResponse<OverviewApi> | OverviewApi>('/reports/overview', { params: { from, to } }),
      apiClient.get<ApiResponse<RevenueApi> | RevenueApi>('/reports/revenue', { params: { from, to, period: grouping } }),
      apiClient.get<ApiResponse<BestSellerApi> | BestSellerApi>('/reports/best-sellers', { params: { from, to, limit: 10 } }),
      apiClient.get<ApiResponse<InventoryApi> | InventoryApi>('/reports/inventory'),
    ]);

    const overview = unwrap(overviewResponse.data);
    const revenue = unwrap(revenueResponse.data);
    const bestSellers = unwrap(bestSellersResponse.data);
    const inventory = unwrap(inventoryResponse.data);

    return {
      period,
      from,
      to,
      revenue: Number(overview.revenue),
      paidOrderCount: overview.paidOrderCount,
      itemsSold: overview.itemsSold,
      averagePaidOrderValue: overview.paidOrderCount > 0
        ? Number(overview.revenue) / overview.paidOrderCount
        : 0,
      revenueSeries: revenue.data.map((point) => ({
        label: point.date,
        revenue: Number(point.revenue),
        orders: point.paymentCount,
      })),
      topDishes: bestSellers.map((item) => ({
        name: item.itemName,
        quantitySold: item.quantitySold,
        revenue: Number(item.revenue),
      })),
      inventory: {
        ingredientCount: inventory.ingredientCount,
        lowStockCount: inventory.lowStockCount,
        lowStockItems: inventory.lowStockItems,
      },
    };
  }
}
