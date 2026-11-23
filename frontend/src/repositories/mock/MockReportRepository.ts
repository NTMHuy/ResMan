import type { ReportRepository } from '@/src/repositories/interfaces/ReportRepository';
import type { ReportPeriod } from '@/src/types/common';
import type { ReportSummary, TopSellingDish } from '@/src/features/reports/types/report.types';
import { mockOrdersData } from '@/src/data/mock/mockOrders';
import { mockIngredientsData } from '@/src/data/mock/mockInventory';
import { mockMenuItemsData, mockCategoriesData } from '@/src/data/mock/mockMenu';
import { mockRevenueSeriesByPeriod } from '@/src/data/mock/mockReports';
import { simulateMockNetwork } from '@/src/data/mock/mockStore';

export class MockReportRepository implements ReportRepository {
  async getReportSummary(period: ReportPeriod): Promise<ReportSummary> {
    await simulateMockNetwork();

    const series = mockRevenueSeriesByPeriod[period];
    const baseRevenue = series.reduce((sum, pt) => sum + pt.revenue, 0);
    const liveOrdersRevenue = mockOrdersData
      .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalRevenue = baseRevenue + liveOrdersRevenue;
    const baseOrdersCount = series.reduce((sum, pt) => sum + pt.orders, 0);
    const totalOrders = baseOrdersCount + mockOrdersData.length;
    const cancelledOrders = mockOrdersData.filter(
      (o) => o.status === 'CANCELLED' || o.status === 'REJECTED'
    );
    const completedOrders = totalOrders - cancelledOrders.length;
    const averageOrderValue = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

    // Aggregate top dishes from live orders + baseline quantities
    const dishMap = new Map<string, TopSellingDish>();
    for (const dish of mockMenuItemsData) {
      dishMap.set(dish.id, {
        menuItemId: dish.id,
        sku: dish.sku,
        name: dish.name,
        station:
          dish.station === 'HOT_KITCHEN'
            ? 'Bếp Nóng'
            : dish.station === 'COLD_KITCHEN'
              ? 'Bếp Nguội'
              : 'Quầy Bar',
        quantitySold: period === 'DAY' ? 8 : period === 'WEEK' ? 42 : 175,
        revenue: (period === 'DAY' ? 8 : period === 'WEEK' ? 42 : 175) * dish.price,
        avgCookMinutes: dish.prepTimeMinutes,
      });
    }

    for (const order of mockOrdersData) {
      if (order.status === 'CANCELLED' || order.status === 'REJECTED') continue;
      for (const item of order.items) {
        if (item.kitchenStatus === 'VOIDED') continue;
        const existing = dishMap.get(item.menuItemId);
        if (existing) {
          existing.quantitySold += item.quantity;
          existing.revenue += item.unitPrice * item.quantity;
        }
      }
    }

    const topDishes = Array.from(dishMap.values())
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    const palette = ['#0f172a', '#0051d5', '#c76c00', '#15803d'];
    const categoryTotals = mockCategoriesData.map((cat, idx) => {
      const catItems = mockMenuItemsData.filter((m) => m.categoryId === cat.id);
      const rev = catItems.reduce((sum, m) => {
        const entry = dishMap.get(m.id);
        return sum + (entry ? entry.revenue : 0);
      }, 0);
      return { name: cat.name, revenue: rev, color: palette[idx % palette.length] };
    });

    const grandCatRev = categoryTotals.reduce((s, c) => s + c.revenue, 0) || 1;
    const categoryBreakdown = categoryTotals.map((c) => ({
      categoryName: c.name,
      revenue: c.revenue,
      percentage: Math.round((c.revenue / grandCatRev) * 100),
      color: c.color,
    }));

    const inventoryHealth = {
      totalIngredients: mockIngredientsData.length,
      inStockCount: mockIngredientsData.filter((i) => i.status === 'IN_STOCK').length,
      lowStockCount: mockIngredientsData.filter((i) => i.status === 'LOW_STOCK').length,
      outOfStockCount: mockIngredientsData.filter((i) => i.status === 'OUT_OF_STOCK').length,
    };

    const cancellationAudits = cancelledOrders.map((o) => ({
      orderNumber: o.orderNumber,
      tableNumber: o.tableNumber,
      amount: o.totalAmount,
      reason: o.cancelReason || 'Không có ghi chú lý do',
      cancelledAt: o.updatedAt,
    }));

    return {
      period,
      totalRevenue,
      revenueGrowthPercent: period === 'DAY' ? 12.4 : period === 'WEEK' ? 8.7 : 15.2,
      totalOrders,
      completedOrders,
      cancelledOrders: cancelledOrders.length,
      averageOrderValue,
      avgCookTimeMinutes: period === 'DAY' ? 11.5 : period === 'WEEK' ? 12.2 : 12.8,
      slaDelayRatePercent: 4.2,
      revenueSeries: series,
      topDishes,
      categoryBreakdown,
      inventoryHealth,
      cancellationAudits,
    };
  }
}
