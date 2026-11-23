import { useCallback, useEffect, useMemo, useState } from 'react';
import { repositories } from '@/src/repositories';
import { mockStoreEvents } from '@/src/data/mock/mockStore';
import { getElapsedMinutes } from '@/src/utils/formatters';
import type { KitchenStation } from '@/src/types/common';
import type { KdsItem, KdsItemStatus, KdsTicket } from '@/src/features/kds/types/kds.types';

export function useKds() {
  const [items, setItems] = useState<KdsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stationFilter, setStationFilter] = useState<KitchenStation | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<KdsItemStatus | 'ALL'>('ALL');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const fetchQueue = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const list = await repositories.kds.getKitchenQueue();
      setItems(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải hàng đợi bếp KDS.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // 1s live timer for SLA elapsed clocks
  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Subscribe to store updates + optional realtime polling
  useEffect(() => {
    void fetchQueue();
    const unsubscribe = mockStoreEvents.subscribe(() => {
      void fetchQueue(true);
    });
    return unsubscribe;
  }, [fetchQueue]);

  useEffect(() => {
    if (!autoRefresh) return;
    const poller = setInterval(() => {
      void fetchQueue(true);
    }, 8000);
    return () => clearInterval(poller);
  }, [autoRefresh, fetchQueue]);

  const counts = useMemo(() => {
    const active = items.filter((i) => i.status !== 'VOIDED' && i.status !== 'COMPLETED');
    const overdue = active.filter((i) => getElapsedMinutes(i.createdAt, nowMs) >= i.slaMinutes);
    return {
      ALL: active.length,
      HOT_KITCHEN: active.filter((i) => i.station === 'HOT_KITCHEN').length,
      COLD_KITCHEN: active.filter((i) => i.station === 'COLD_KITCHEN').length,
      BAR: active.filter((i) => i.station === 'BAR').length,
      QUEUED: items.filter((i) => i.status === 'QUEUED').length,
      ACCEPTED: items.filter((i) => i.status === 'ACCEPTED').length,
      COOKING: items.filter((i) => i.status === 'COOKING').length,
      COMPLETED: items.filter((i) => i.status === 'COMPLETED').length,
      OVERDUE: overdue.length,
    };
  }, [items, nowMs]);

  const tickets = useMemo<KdsTicket[]>(() => {
    const filtered = items.filter((item) => {
      if (item.status === 'VOIDED') return false;
      if (statusFilter === 'ALL' && item.status === 'COMPLETED') return false;
      const matchStation = stationFilter === 'ALL' || item.station === stationFilter;
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const isUrgent = getElapsedMinutes(item.createdAt, nowMs) >= item.slaMinutes;
      const matchUrgent = !urgentOnly || isUrgent;
      return matchStation && matchStatus && matchUrgent;
    });

    const ticketMap = new Map<string, KdsTicket>();
    for (const item of filtered) {
      const existing = ticketMap.get(item.orderId);
      if (existing) {
        existing.items.push(item);
        if (item.slaMinutes < existing.slaMinutes) {
          existing.slaMinutes = item.slaMinutes;
        }
      } else {
        ticketMap.set(item.orderId, {
          orderId: item.orderId,
          orderNumber: item.orderNumber,
          tableNumber: item.tableNumber,
          orderType: item.orderType,
          createdAt: item.createdAt,
          slaMinutes: item.slaMinutes,
          items: [item],
        });
      }
    }

    return Array.from(ticketMap.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [items, stationFilter, statusFilter, urgentOnly, nowMs]);

  const updateItemStatus = useCallback(
    async (itemId: string, nextStatus: KdsItemStatus) => {
      setMutating(true);
      try {
        await repositories.kds.updateItemStatus(itemId, nextStatus);
        await fetchQueue(true);
      } finally {
        setMutating(false);
      }
    },
    [fetchQueue]
  );

  const bumpTicket = useCallback(
    async (orderId: string) => {
      setMutating(true);
      try {
        await repositories.kds.bumpOrderTicket(orderId);
        await fetchQueue(true);
      } finally {
        setMutating(false);
      }
    },
    [fetchQueue]
  );

  const recallLast = useCallback(async () => {
    setMutating(true);
    try {
      const recalled = await repositories.kds.recallLastBumpedItem();
      await fetchQueue(true);
      return recalled;
    } finally {
      setMutating(false);
    }
  }, [fetchQueue]);

  return {
    tickets,
    counts,
    nowMs,
    loading,
    mutating,
    error,
    stationFilter,
    setStationFilter,
    statusFilter,
    setStatusFilter,
    urgentOnly,
    setUrgentOnly,
    autoRefresh,
    setAutoRefresh,
    reload: () => fetchQueue(false),
    updateItemStatus,
    bumpTicket,
    recallLast,
  };
}
