import { useCallback, useEffect, useState } from 'react';
import { repositories } from '@/src/repositories';
import { mockStoreEvents } from '@/src/data/mock/mockStore';
import type { DashboardSummary } from '@/src/features/dashboard/types/dashboard.types';

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await repositories.dashboard.getSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu tổng quan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const unsub = mockStoreEvents.subscribe(() => {
      void load(true);
    });
    return unsub;
  }, [load]);

  return {
    summary,
    loading,
    error,
    reload: () => load(false),
  };
}
