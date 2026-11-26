import type { DashboardRepository } from '@/src/repositories/interfaces/DashboardRepository';
import type { DashboardSummary } from '@/src/features/dashboard/types/dashboard.types';
import { mockOrdersData } from '@/src/data/mock/mockOrders';
import { mockKdsItemsData } from '@/src/data/mock/mockKDS';
import { mockIngredientsData } from '@/src/data/mock/mockInventory';
import { mockEmployeesData } from '@/src/data/mock/mockEmployees';
import { MockReportRepository } from '@/src/repositories/mock/MockReportRepository';
import { simulateMockNetwork } from '@/src/data/mock/mockStore';

export class MockDashboardRepository implements DashboardRepository {
  private reportRepo = new MockReportRepository();

  async getSummary(): Promise<DashboardSummary> {
    await simulateMockNetwork();
    const report = await this.reportRepo.getReportSummary('DAY');

    const activeOrders = mockOrdersData.filter(
      (o) =>
        o.status === 'PENDING' ||
        o.status === 'CONFIRMED' ||
        o.status === 'COOKING' ||
        o.status === 'READY'
    );

    const lowStockIngredients = mockIngredientsData.filter(
      (i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK'
    );

    return {
      todayRevenue: report.totalRevenue,
      todayOrderCount: report.totalOrders,
      activeOrderCount: activeOrders.length,
      pendingOrderCount: mockOrdersData.filter((o) => o.status === 'PENDING').length,
      kdsQueueCount: mockKdsItemsData.filter(
        (k) => k.status === 'QUEUED' || k.status === 'ACCEPTED' || k.status === 'COOKING'
      ).length,
      lowStockAlertsCount: mockIngredientsData.filter((i) => i.status === 'LOW_STOCK').length,
      outOfStockCount: mockIngredientsData.filter((i) => i.status === 'OUT_OF_STOCK').length,
      activeStaffCount: mockEmployeesData.filter((e) => e.role !== 'GUEST' && e.isActive).length,
      recentOrders: mockOrdersData.slice(0, 5).map((o) => ({ ...o })),
      lowStockIngredients: lowStockIngredients.map((i) => ({ ...i })),
      topDishes: report.topDishes,
    };
  }
}
