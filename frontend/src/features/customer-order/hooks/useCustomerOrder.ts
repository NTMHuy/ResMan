import { useCallback, useEffect, useMemo, useState } from 'react';
import { repositories } from '@/src/repositories';
import { storageService } from '@/src/services/storage/storageService';
import { mockStoreEvents } from '@/src/data/mock/mockStore';
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

export function useCustomerOrder() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState('Bàn 04');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [tableOrders, setTableOrders] = useState<CustomerOrderTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');

  const loadCustomerData = useCallback(
    async (targetTable: string, silent = false) => {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const [{ categories: cats, items: menuItems }, recentOrders] = await Promise.all([
          repositories.customerOrder.getCustomerMenu(),
          repositories.customerOrder.getRecentTableOrders(targetTable),
        ]);
        setCategories(cats);
        setItems(menuItems);
        setTableOrders(recentOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thực đơn.');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    []
  );

  // Restore saved table & cart on mount
  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      const [savedTable, savedCart] = await Promise.all([
        storageService.getJson<string>(storageService.KEYS.CUSTOMER_TABLE),
        storageService.getJson<CartItem[]>(storageService.KEYS.CUSTOMER_CART),
      ]);
      if (!mounted) return;
      const initialTable = savedTable || 'Bàn 04';
      setTableNumber(initialTable);
      if (Array.isArray(savedCart)) setCart(savedCart);
      void loadCustomerData(initialTable);
    };
    void restore();

    return () => {
      mounted = false;
    };
  }, [loadCustomerData]);

  // Subscribe to mock store updates so order tracking updates live when KDS/POS updates
  useEffect(() => {
    const unsubscribe = mockStoreEvents.subscribe(() => {
      void loadCustomerData(tableNumber, true);
    });
    return unsubscribe;
  }, [loadCustomerData, tableNumber]);

  const changeTable = useCallback(
    (nextTable: string) => {
      setTableNumber(nextTable);
      void storageService.setJson(storageService.KEYS.CUSTOMER_TABLE, nextTable);
      void loadCustomerData(nextTable, true);
    },
    [loadCustomerData]
  );

  const persistCart = useCallback((nextCart: CartItem[]) => {
    setCart(nextCart);
    void storageService.setJson(storageService.KEYS.CUSTOMER_CART, nextCart);
  }, []);

  const addToCart = useCallback(
    (menuItem: MenuItem, quantity: number, selectedModifiers: string[], note: string) => {
      const extraPrice = menuItem.modifiers
        .filter((m) => selectedModifiers.includes(m.label))
        .reduce((sum, m) => sum + m.extraPrice, 0);

      const modKey = [...selectedModifiers].sort().join('|');
      const normalizedNote = note.trim();

      const existingIdx = cart.findIndex(
        (c) =>
          c.menuItem.id === menuItem.id &&
          [...c.selectedModifiers].sort().join('|') === modKey &&
          c.note === normalizedNote
      );

      if (existingIdx >= 0) {
        const next = cart.map((c, idx) =>
          idx === existingIdx ? { ...c, quantity: c.quantity + quantity } : c
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
    [cart, persistCart]
  );

  const updateCartQuantity = useCallback(
    (cartItemId: string, delta: number) => {
      const next = cart
        .map((c) => (c.cartItemId === cartItemId ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0);
      persistCart(next);
    },
    [cart, persistCart]
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      persistCart(cart.filter((c) => c.cartItemId !== cartItemId));
    },
    [cart, persistCart]
  );

  const clearCart = useCallback(() => {
    persistCart([]);
  }, [persistCart]);

  const submitOrder = useCallback(
    async (orderNote?: string) => {
      if (cart.length === 0) {
        throw new Error('Giỏ hàng đang trống.');
      }
      setSubmitting(true);
      try {
        const created = await repositories.customerOrder.submitOrder({
          tableNumber,
          guestName: guestName.trim() || undefined,
          guestCount,
          note: orderNote?.trim() || undefined,
          items: cart.map((c) => ({
            menuItemId: c.menuItem.id,
            quantity: c.quantity,
            modifiers: c.selectedModifiers,
            note: c.note,
          })),
        });
        persistCart([]);
        await loadCustomerData(tableNumber, true);
        return created;
      } finally {
        setSubmitting(false);
      }
    },
    [cart, tableNumber, guestName, guestCount, persistCart, loadCustomerData]
  );

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      const matchCat = selectedCategoryId === 'ALL' || item.categoryId === selectedCategoryId;
      return matchSearch && matchCat;
    });
  }, [items, search, selectedCategoryId]);

  const cartSummary = useMemo(() => {
    const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
    const subtotal = cart.reduce(
      (sum, c) => sum + (c.menuItem.price + c.extraPrice) * c.quantity,
      0
    );
    const serviceFee = Math.round(subtotal * 0.05);
    const taxAmount = Math.round((subtotal + serviceFee) * 0.08);
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
    reload: () => loadCustomerData(tableNumber, false),
  };
}
