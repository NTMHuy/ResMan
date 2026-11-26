import type { ReportPeriod } from '@/src/types/common';
import type { ReportSummary } from '@/src/features/reports/types/report.types';

export interface ReportRepository {
  getReportSummary(period: ReportPeriod): Promise<ReportSummary>;
}
