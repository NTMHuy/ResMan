import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/src/services/api/apiClient';
import { repositories } from '@/src/repositories';
import { storageService } from '@/src/services/storage/storageService';
import type { MenuCategory, MenuItem } from '@/src/features/menu/types/menu.types';
import type {
  CartItem,
  CustomerOrderTracking,
} from '@/src/features/customer-order/types/customerOrder.types';

export const TABLE_OPTIONS = [
  'Bàn 01',
  'Bàn 02',
  'Bàn 03',
  'Bàn 04',
  'Bàn 05',
  'Bàn 06',
  'Bàn 08',
  'Bàn VIP-1',
  'Bàn VIP-2',
];

const USE_MOCK_CUSTOMER_ORDER = false;

type OpenGuestTable = { id: string; code: string; name: string; status: string };

export function useCustomerOrder() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState(USE_MOCK_CUSTOMER_ORDER ? 'Bàn 04' : 'Chưa kết nối');
  const [sessionCode, setSessionCode] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [tableOrders, setTableOrders] = useState<CustomerOrderTracking[]>([]);
  const [openTables, setOpenTables] = useState<OpenGuestTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');

  const loadCustomerData = useCallback(
    async (code?: string, silent = false, targetTable?: string) => {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const menu = await repositories.customerOrder.getCustomerMenu();
        setCategories(menu.categories);
        setItems(menu.items);

        if (!USE_MOCK_CUSTOMER_ORDER) {
          const response = await apiClient.get('/guest/session/tables');
          const payload = response.data && typeof response.data === 'object' && 'data' in response.data
            ? (response.data as { data: OpenGuestTable[] }).data
            : response.data as OpenGuestTable[];
          setOpenTables(Array.isArray(payload) ? payload : []);
        }

        if (USE_MOCK_CUSTOMER_ORDER) {
          const recentOrders = await repositories.customerOrder.getRecentTableOrders(
            targetTable ?? tableNumber,
          );
          setTableOrders(recentOrders);
        } else if (code) {
          try {
            const recentOrders = await repositories.customerOrder.getRecentTableOrders('');
            setTableOrders(recentOrders);
            if (recentOrders[0]) setTableNumber(recentOrders[0].tableNumber);
          } catch (sessionError) {
            const statusCode = sessionError && typeof sessionError === 'object' && 'statusCode' in sessionError
              ? Number((sessionError as { statusCode?: number }).statusCode)
              : 0;
            setTableOrders([]);
            setTableNumber('Chưa kết nối');

            // A closed/deleted session code is no longer usable. Remove it so the
            // customer screen does not keep retrying /guest/session with a stale code.
            if (statusCode === 401 || statusCode === 404) {
              await storageService.removeCustomerSessionCode();
              setSessionCode('');
            }
          }
        } else {
          setTableOrders([]);
          setTableNumber('Chưa kết nối');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thực đơn.');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [tableNumber],
  );

  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      try {
        const [savedTable, savedCart, savedCode] = await Promise.all([
          storageService.getJson<string>(storageService.KEYS.CUSTOMER_TABLE),
          storageService.getJson<CartItem[]>(storageService.KEYS.CUSTOMER_CART),
          storageService.getCustomerSessionCode(),
        ]);
        if (!mounted) return;
        if (Array.isArray(savedCart)) setCart(savedCart);
        if (savedCode) setSessionCode(savedCode);
        if (USE_MOCK_CUSTOMER_ORDER && savedTable) setTableNumber(savedTable);
        await loadCustomerData(savedCode ?? undefined, false, savedTable ?? undefined);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Không thể khôi phục dữ liệu gọi món.');
          setLoading(false);
        }
      }
    };
    void restore();
    return () => {
      mounted = false;
    };
  }, [loadCustomerData]);

  useEffect(() => {
    if (USE_MOCK_CUSTOMER_ORDER || sessionCode) return;
    const interval = setInterval(() => {
      void loadCustomerData(undefined, true);
    }, 5000);
    return () => clearInterval(interval);
  }, [loadCustomerData, sessionCode]);

  const connectTable = useCallback(async (tableId: string) => {
    const table = openTables.find((item) => item.id === tableId);
    if (!table || table.status !== 'OPEN') {
      throw new Error('Bàn này chưa được nhân viên mở phiên. Vui lòng chọn bàn đang mở.');
    }
    const response = await apiClient.post('/guest/session/connect', { tableId: Number(table.id) });
    const payload = response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data: { sessionCode: string; table: { name: string; code: string } } }).data
      : response.data as { sessionCode: string; table: { name: string; code: string } };
    const code = payload.sessionCode;
    await storageService.setCustomerSessionCode(code);
    setSessionCode(code);
    setTableNumber(payload.table.name || payload.table.code);
    const orders = await repositories.customerOrder.getRecentTableOrders('');
    setTableOrders(orders);
  }, [openTables]);

  const disconnectSession = useCallback(async () => {
    await storageService.removeCustomerSessionCode();
    setSessionCode('');
    setTableNumber('Chưa kết nối');
    setTableOrders([]);
  }, []);

  const changeTable = useCallback(
    (nextTable: string) => {
      if (!USE_MOCK_CUSTOMER_ORDER) return;
      setTableNumber(nextTable);
      void storageService.setJson(storageService.KEYS.CUSTOMER_TABLE, nextTable);
      void loadCustomerData(undefined, true, nextTable);
    },
    [loadCustomerData],
  );

  const persistCart = useCallback((nextCart: CartItem[]) => {
    setCart(nextCart);
    void storageService.setJson(storageService.KEYS.CUSTOMER_CART, nextCart);
  }, []);

  const addToCart = useCallback(
    (menuItem: MenuItem, quantity: number, selectedModifiers: string[], note: string) => {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return;
      const extraPrice = menuItem.modifiers
        .filter((modifier) => selectedModifiers.includes(modifier.label))
        .reduce((sum, modifier) => sum + modifier.extraPrice, 0);
      const modifierKey = [...selectedModifiers].sort().join('|');
      const normalizedNote = note.trim();
      const existingIndex = cart.findIndex(
        (entry) =>
          entry.menuItem.id === menuItem.id &&
          [...entry.selectedModifiers].sort().join('|') === modifierKey &&
          entry.note === normalizedNote,
      );

      if (existingIndex >= 0) {
        const next = cart.map((entry, index) =>
          index === existingIndex
            ? { ...entry, quantity: Math.min(99, entry.quantity + quantity) }
            : entry,
        );
        persistCart(next);
      } else {
        const newEntry: CartItem = {
          cartItemId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          menuItem,
          quantity,
          selectedModifiers,
          extraPrice,
          note: normalizedNote,
        };
        persistCart([...cart, newEntry]);
      }
    },
    [cart, persistCart],
  );

  const updateCartQuantity = useCallback(
    (cartItemId: string, delta: number) => {
      const next = cart
        .map((entry) =>
          entry.cartItemId === cartItemId
            ? { ...entry, quantity: Math.min(99, entry.quantity + delta) }
            : entry,
        )
        .filter((entry) => entry.quantity > 0);
      persistCart(next);
    },
    [cart, persistCart],
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      persistCart(cart.filter((entry) => entry.cartItemId !== cartItemId));
    },
    [cart, persistCart],
  );

  const clearCart = useCallback(() => persistCart([]), [persistCart]);

  const cancelGuestItem = useCallback(
    async (itemId: string) => {
      if (!repositories.customerOrder.cancelGuestItem) {
        throw new Error('Chức năng hủy món không khả dụng trong chế độ hiện tại.');
      }
      await repositories.customerOrder.cancelGuestItem(itemId);
      const updatedOrders = await repositories.customerOrder.getRecentTableOrders(tableNumber);
      setTableOrders(updatedOrders);
    },
    [tableNumber],
  );

  const submitOrder = useCallback(
    async (orderNote?: string) => {
      if (cart.length === 0) throw new Error('Giỏ hàng đang trống.');
      if (cart.length > 30) throw new Error('Mỗi lần gửi không được vượt quá 30 loại món.');
      if (!USE_MOCK_CUSTOMER_ORDER && !sessionCode.trim()) {
        throw new Error('Vui lòng kết nối phiên bàn trước khi gửi món.');
      }
      setSubmitting(true);
      try {
        const created = await repositories.customerOrder.submitOrder({
          sessionCode: sessionCode || undefined,
          tableNumber,
          guestName: guestName.trim() || undefined,
          guestCount,
          note: orderNote?.trim() || undefined,
          items: cart.map((entry) => ({
            menuItemId: entry.menuItem.id,
            quantity: entry.quantity,
            modifiers: entry.selectedModifiers,
            note: entry.note,
          })),
        });
        persistCart([]);
        const updatedOrders = await repositories.customerOrder.getRecentTableOrders(tableNumber);
        setTableOrders(updatedOrders);
        return created;
      } finally {
        setSubmitting(false);
      }
    },
    [cart, sessionCode, tableNumber, guestName, guestCount, persistCart],
  );

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);
      const matchesCategory =
        selectedCategoryId === 'ALL' || item.categoryId === selectedCategoryId;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, selectedCategoryId]);

  const cartSummary = useMemo(() => {
    const totalItems = cart.reduce((sum, entry) => sum + entry.quantity, 0);
    const subtotal = cart.reduce(
      (sum, entry) => sum + entry.menuItem.price * entry.quantity +
        (USE_MOCK_CUSTOMER_ORDER ? entry.extraPrice * entry.quantity : 0),
      0,
    );
    const serviceFee = USE_MOCK_CUSTOMER_ORDER ? Math.round(subtotal * 0.05) : 0;
    const taxAmount = USE_MOCK_CUSTOMER_ORDER ? Math.round((subtotal + serviceFee) * 0.08) : 0;
    return {
      totalItems,
      subtotal,
      serviceFee,
      taxAmount,
      totalAmount: subtotal + serviceFee + taxAmount,
    };
  }, [cart]);

  return {
    categories,
    items: filteredItems,
    cart,
    cartSummary,
    tableNumber,
    changeTable,
    sessionCode,
    setSessionCode,
    openTables,
    connectTable,
    disconnectSession,
    guestName,
    setGuestName,
    guestCount,
    setGuestCount,
    tableOrders,
    loading,
    submitting,
    error,
    search,
    setSearch,
    selectedCategoryId,
    setSelectedCategoryId,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    submitOrder,
    cancelGuestItem,
    reload: () => loadCustomerData(sessionCode || undefined, false),
  };
}
