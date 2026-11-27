import type { ReportRepository } from '@/src/repositories/interfaces/ReportRepository';
import type { ReportPeriod } from '@/src/types/common';
import type { ReportSummary } from '@/src/features/reports/types/report.types';
import { mockOrdersData } from '@/src/data/mock/mockOrders';
import { mockIngredientsData } from '@/src/data/mock/mockInventory';
import { mockMenuItemsData } from '@/src/data/mock/mockMenu';
import { mockRevenueSeriesByPeriod } from '@/src/data/mock/mockReports';
import { simulateMockNetwork } from '@/src/data/mock/mockStore';

function dateText(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export class MockReportRepository implements ReportRepository {
  async getReportSummary(period: ReportPeriod): Promise<ReportSummary> {
    await simulateMockNetwork();
    const series = mockRevenueSeriesByPeriod[period];
    const revenue = series.reduce((sum, point) => sum + point.revenue, 0);
    const paidOrderCount = series.reduce((sum, point) => sum + point.orders, 0);
    const today = new Date();
    const fromDate = new Date(today);
    if (period === 'WEEK') fromDate.setDate(today.getDate() - 6);
    if (period === 'MONTH') fromDate.setDate(1);

    const topDishes = mockMenuItemsData.map((dish) => {
      const quantitySold = period === 'DAY' ? 8 : period === 'WEEK' ? 42 : 175;
      return {
        name: dish.name,
        quantitySold,
        revenue: quantitySold * dish.price,
      };
    }).sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 5);

    const lowStockItems = mockIngredientsData
      .filter((item) => item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK')
      .map((item) => ({
        id: item.id,
        code: item.sku,
        name: item.name,
        quantityOnHand: String(item.currentStock),
        lowStockThreshold: String(item.minThreshold),
      }));

    return {
      period,
      from: dateText(fromDate),
      to: dateText(today),
      revenue,
      paidOrderCount,
      itemsSold: mockOrdersData
        .filter((order) => order.status !== 'CANCELLED' && order.status !== 'REJECTED')
        .reduce((sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0), 0),
      averagePaidOrderValue: paidOrderCount > 0 ? revenue / paidOrderCount : 0,
      revenueSeries: series,
      topDishes,
      inventory: {
        ingredientCount: mockIngredientsData.length,
        lowStockCount: lowStockItems.length,
        lowStockItems,
      },
      orderHistory: [],
    };
  }
}
