import { useCallback, useEffect, useState } from 'react';
import { repositories } from '@/src/repositories';
import type { ReportPeriod } from '@/src/types/common';
import type { ReportSummary } from '@/src/features/reports/types/report.types';

export function useReports() {
  const [period, setPeriod] = useState<ReportPeriod>('DAY');
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (targetPeriod: ReportPeriod, silent = false) => {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const data = await repositories.report.getReportSummary(targetPeriod);
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải báo cáo thống kê.');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void fetchReport(period);
    return undefined;
  }, [period, fetchReport]);

  return {
    period,
    setPeriod,
    report,
    loading,
    error,
    reload: () => fetchReport(period, false),
  };
}
