import { useCallback, useEffect, useMemo, useState } from 'react';
import { repositories } from '@/src/repositories';
import { mockStoreEvents } from '@/src/data/mock/mockStore';
import { useAuth } from '@/src/contexts/AuthContext';
import type {
  AddOrderItemInput,
  CreateOrderInput,
  Order,
  OrderStatus,
  PaymentMethod,
} from '@/src/features/orders/types/order.types';
import type { MenuItem } from '@/src/features/menu/types/menu.types';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [availableMenuItems, setAvailableMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const actorName = user?.fullName || 'Nhân viên hệ thống';
  const actorRole = user?.role || 'ORDER_STAFF';

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    // Load the order queue independently: a menu endpoint failure must not
    // hide orders that have already been persisted by the backend.
    try {
      const orderList = await repositories.order.getOrders();
      setOrders(orderList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách đơn hàng.');
    }

    try {
      const menuList = await repositories.menu.getMenuItems({ status: 'AVAILABLE' });
      setAvailableMenuItems(menuList);
    } catch {
      // Menu data is only needed by the optional POS add-item dialog.
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();

    // API mode has no push channel yet; poll so orders placed from a customer
    // QR session appear on the staff screen without requiring a manual reload.
    const refreshId = setInterval(() => {
      void fetchOrders(true);
    }, 5000);

    const unsubscribe = mockStoreEvents.subscribe(() => {
      void fetchOrders(true);
    });

    return () => {
      clearInterval(refreshId);
      unsubscribe();
    };
  }, [fetchOrders]);

  const counts = useMemo(() => ({
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === 'PENDING').length,
    ACTIVE: orders.filter((o) =>
      o.status === 'CONFIRMED' || o.status === 'COOKING' || o.status === 'READY'
    ).length,
    COMPLETED: orders.filter((o) => o.status === 'COMPLETED').length,
    STOPPED: orders.filter((o) => o.status === 'CANCELLED' || o.status === 'REJECTED').length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.tableNumber.toLowerCase().includes(q) ||
        o.guestName.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  const acceptOrder = useCallback(async (id: string) => {
    setMutating(true);
    try {
      const updated = await repositories.order.acceptOrder(id, actorName, actorRole);
      await fetchOrders(true);
      return updated;
    } finally {
      setMutating(false);
    }
  }, [actorName, actorRole, fetchOrders]);

  const rejectOrder = useCallback(async (id: string, reason: string) => {
    setMutating(true);
    try {
      const updated = await repositories.order.rejectOrder(id, reason, actorName, actorRole);
      await fetchOrders(true);
      return updated;
    } finally {
      setMutating(false);
    }
  }, [actorName, actorRole, fetchOrders]);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus, note: string) => {
    setMutating(true);
    try {
      const updated = await repositories.order.updateOrderStatus(id, status, note, actorName, actorRole);
      await fetchOrders(true);
      return updated;
    } finally {
      setMutating(false);
    }
  }, [actorName, actorRole, fetchOrders]);

  const addOrderItem = useCallback(async (orderId: string, input: AddOrderItemInput) => {
    setMutating(true);
    try {
      const updated = await repositories.order.addOrderItem(orderId, input, actorName, actorRole);
      await fetchOrders(true);
      return updated;
    } finally {
      setMutating(false);
    }
  }, [actorName, actorRole, fetchOrders]);

  const cancelOrder = useCallback(async (id: string, reason: string) => {
    setMutating(true);
    try {
      const updated = await repositories.order.cancelOrder(id, reason, actorName, actorRole);
      await fetchOrders(true);
      return updated;
    } finally {
      setMutating(false);
    }
  }, [actorName, actorRole, fetchOrders]);

  const recordPayment = useCallback(async (id: string, method: PaymentMethod) => {
    setMutating(true);
    try {
      const updated = await repositories.order.recordPayment(id, method, actorName, actorRole);
      await fetchOrders(true);
      return updated;
    } finally {
      setMutating(false);
    }
  }, [actorName, actorRole, fetchOrders]);

  const createOrder = useCallback(async (input: Omit<CreateOrderInput, 'staffName'>) => {
    setMutating(true);
    try {
      const created = await repositories.order.createOrder({ ...input, staffName: actorName });
      await fetchOrders(true);
      return created;
    } finally {
      setMutating(false);
    }
  }, [actorName, fetchOrders]);

  return {
    orders: filteredOrders,
    availableMenuItems,
    counts,
    loading,
    mutating,
    error,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    reload: () => fetchOrders(false),
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    addOrderItem,
    cancelOrder,
    recordPayment,
    createOrder,
  };
}
