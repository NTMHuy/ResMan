import type { DashboardSummary } from '@/src/features/dashboard/types/dashboard.types';

export interface DashboardRepository {
  getSummary(): Promise<DashboardSummary>;
}
