import type { DashboardRepository } from '@/src/repositories/interfaces/DashboardRepository';
import type { DashboardSummary } from '@/src/features/dashboard/types/dashboard.types';
import type { ApiResponse } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';

export class ApiDashboardRepository implements DashboardRepository {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await apiClient.get<ApiResponse<DashboardSummary>>('/reports/dashboard');
    return data.data;
  }
}
