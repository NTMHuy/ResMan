import { useCallback, useEffect, useMemo, useState } from 'react';
import { repositories } from '@/src/repositories';
import { storageService } from '@/src/services/storage/storageService';
import type { MenuCategory, MenuItem } from '@/src/features/menu/types/menu.types';
import { mealRecommendationService } from '@/src/features/customer-order/services/mealRecommendationService';
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

export function useCustomerOrder() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState(USE_MOCK_CUSTOMER_ORDER ? 'Bàn 04' : 'Chưa kết nối');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [tableOrders, setTableOrders] = useState<CustomerOrderTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startingSession, setStartingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [mealSuggestions, setMealSuggestions] = useState<MenuItem[]>([]);
  const [suggestionMessage, setSuggestionMessage] = useState('Gợi ý AI sẽ xuất hiện sau khi bàn có món đã gọi.');
  const [recommendationAvailable, setRecommendationAvailable] = useState(false);

  const loadCustomerData = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const menu = await repositories.customerOrder.getCustomerMenu();
        setCategories(menu.categories);
        setItems(menu.items);

        try {
          const recentOrders = await repositories.customerOrder.getRecentTableOrders('');
          setTableOrders(recentOrders);
          if (recentOrders[0]) setTableNumber(recentOrders[0].tableNumber);
        } catch {
          setTableOrders([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thực đơn.');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let mounted = true;
    const restoreCustomerSession = async () => {
      try {
        let session: { id: string; tableNumber: string } | null = null;
        if (!USE_MOCK_CUSTOMER_ORDER) {
          session = await repositories.customerOrder.getActiveSession();
        }
        if (!mounted) return;
        setActiveSessionId(session?.id ?? null);
        if (session) setTableNumber(session.tableNumber);

        const savedCart = await storageService.getJson<{
          sessionId: string;
          items: CartItem[];
        }>(storageService.KEYS.CUSTOMER_CART);
        if (!mounted) return;
        if (Array.isArray(savedCart?.items) &&
          (!session || savedCart.sessionId === session.id || savedCart.sessionId == null)) {
          setCart(savedCart.items);
          if (session && savedCart.sessionId !== session.id) {
            await storageService.setJson(storageService.KEYS.CUSTOMER_CART, {
              sessionId: session.id,
              items: savedCart.items,
            });
          }
        } else {
          setCart([]);
          await storageService.setJson(storageService.KEYS.CUSTOMER_CART, {
            sessionId: session?.id ?? null,
            items: [],
          });
        }
        if (mounted) await loadCustomerData(false);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Không thể khôi phục phiên bàn.');
          setLoading(false);
        }
      }
    };
    void restoreCustomerSession();
    return () => { mounted = false; };
  }, [loadCustomerData]);

  const startCustomerSession = useCallback(async () => {
    if (activeSessionId) return activeSessionId;
    setStartingSession(true);
    setError(null);
    try {
      const sessionId = USE_MOCK_CUSTOMER_ORDER
        ? 'mock-session'
        : await repositories.customerOrder.startSession();
      if (!USE_MOCK_CUSTOMER_ORDER) {
        const session = await repositories.customerOrder.getActiveSession();
        if (!session || session.id !== sessionId) {
          throw new Error('Không thể xác nhận phiên gọi món vừa mở. Vui lòng tải lại.');
        }
        setTableNumber(session.tableNumber);
      }
      setActiveSessionId(sessionId);
      await storageService.setJson(storageService.KEYS.CUSTOMER_CART, {
        sessionId,
        items: cart,
      });
      await loadCustomerData(false);
      return sessionId;
    } finally {
      setStartingSession(false);
    }
  }, [activeSessionId, cart, loadCustomerData]);

  useEffect(() => {
    if (USE_MOCK_CUSTOMER_ORDER) return;
    const interval = setInterval(() => {
      void loadCustomerData(true);
      void (async () => {
        try {
          const session = await repositories.customerOrder.getActiveSession();
          if (session?.id === activeSessionId) return;
          setActiveSessionId(session?.id ?? null);
          if (session) {
            setTableNumber(session.tableNumber);
            const savedCart = await storageService.getJson<{ sessionId: string; items: CartItem[] }>(
              storageService.KEYS.CUSTOMER_CART,
            );
            const restored = Array.isArray(savedCart?.items) &&
              (savedCart.sessionId === session.id || savedCart.sessionId == null)
              ? savedCart.items
              : [];
            setCart(restored);
            await storageService.setJson(storageService.KEYS.CUSTOMER_CART, {
              sessionId: session.id,
              items: restored,
            });
          }
        } catch {
          // Keep the currently restored session during temporary network failures.
        }
      })();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSessionId, loadCustomerData]);

  useEffect(() => {
    let active = true;
    const hasOrderedItems = tableOrders.some((order) =>
      order.items.some((item) => item.kitchenStatus !== 'VOIDED'),
    );
    if (!activeSessionId || !hasOrderedItems) {
      setMealSuggestions([]);
      setRecommendationAvailable(false);
      setSuggestionMessage('Gợi ý AI sẽ xuất hiện sau khi bàn có món đã gọi.');
      return () => { active = false; };
    }

    void mealRecommendationService.getRecommendations({ k: 6 }).then((result) => {
      if (!active) return;
      setMealSuggestions(result.items.filter((item) =>
        item.price > 0 &&
        item.pricingType !== 'MARKET_PRICE' &&
        item.pricingType !== 'UNSET'
      ));
      setSuggestionMessage(result.message);
      setRecommendationAvailable(result.available);
    }).catch(() => {
      if (!active) return;
      setMealSuggestions([]);
      setSuggestionMessage('Chưa thể tải gợi ý AI. Bạn vẫn có thể chọn món trong thực đơn.');
      setRecommendationAvailable(false);
    });
    return () => { active = false; };
  }, [activeSessionId, tableOrders]);

  const changeTable = useCallback(
    (nextTable: string) => {
      if (!USE_MOCK_CUSTOMER_ORDER) return;
      setTableNumber(nextTable);
      void storageService.setJson(storageService.KEYS.CUSTOMER_TABLE, nextTable);
      void loadCustomerData(true);
    },
    [loadCustomerData],
  );

  const persistCart = useCallback((nextCart: CartItem[]) => {
    setCart(nextCart);
    void storageService.setJson(storageService.KEYS.CUSTOMER_CART, {
      sessionId: activeSessionId,
      items: nextCart,
    });
  }, [activeSessionId]);

  const addToCart = useCallback(
    (menuItem: MenuItem, quantity: number, selectedModifiers: string[], note: string) => {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return;
      if (
        menuItem.price <= 0 ||
        menuItem.pricingType === 'MARKET_PRICE' ||
        menuItem.pricingType === 'UNSET'
      ) return;
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
    [cart, persistCart, activeSessionId],
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

  const requestPayment = useCallback(async () => {
    if (!activeSessionId) throw new Error('Chưa có phiên gọi món đang hoạt động.');
    await repositories.customerOrder.requestPayment();
  }, [activeSessionId]);

  const submitOrder = useCallback(
    async (orderNote?: string) => {
      if (cart.length === 0) throw new Error('Giỏ hàng đang trống.');
      if (cart.length > 30) throw new Error('Mỗi lần gửi không được vượt quá 30 loại món.');
      setSubmitting(true);
      try {
        if (!USE_MOCK_CUSTOMER_ORDER && !activeSessionId) {
          await startCustomerSession();
        }
        const created = await repositories.customerOrder.submitOrder({
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
    [cart, tableNumber, guestName, guestCount, persistCart, activeSessionId, startCustomerSession],
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
    guestName,
    setGuestName,
    guestCount,
    setGuestCount,
    tableOrders,
    loading,
    submitting,
    startingSession,
    activeSessionId,
    startCustomerSession,
    error,
    search,
    setSearch,
    selectedCategoryId,
    setSelectedCategoryId,
    mealSuggestions,
    suggestionMessage,
    recommendationAvailable,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    submitOrder,
    requestPayment,
    cancelGuestItem,
    reload: () => loadCustomerData(false),
  };
}
