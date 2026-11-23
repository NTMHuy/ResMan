import type { ReportRepository } from '@/src/repositories/interfaces/ReportRepository';
import type { ApiResponse, ReportPeriod } from '@/src/types/common';
import type { ReportSummary } from '@/src/features/reports/types/report.types';
import { apiClient } from '@/src/services/api/apiClient';

export class ApiReportRepository implements ReportRepository {
  async getReportSummary(period: ReportPeriod): Promise<ReportSummary> {
    const { data } = await apiClient.get<ApiResponse<ReportSummary>>('/reports/summary', {
      params: { period },
    });
    return data.data;
  }
}
