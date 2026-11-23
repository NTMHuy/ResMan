import { APP_CONFIG } from '@/src/constants/config';
import { mockMenuItemsData } from '@/src/data/mock/mockMenu';
import { mockOrdersData } from '@/src/data/mock/mockOrders';
import { mockKdsItemsData } from '@/src/data/mock/mockKDS';
import { mockIngredientsData } from '@/src/data/mock/mockInventory';
import type { Order, OrderStatus } from '@/src/features/orders/types/order.types';
import type { KdsItemStatus } from '@/src/features/kds/types/kds.types';
import type { StockStatus } from '@/src/features/inventory/types/inventory.types';

type Listener = () => void;

const listeners = new Set<Listener>();

export const mockStoreEvents = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  emit(): void {
    listeners.forEach((listener) => {
      listener();
    });
  },
};

export async function simulateMockNetwork(shouldFail = false): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, APP_CONFIG.MOCK_LATENCY_MS);
  });
  if (shouldFail) {
    throw new Error('Mô phỏng lỗi kết nối máy chủ từ Mock Store.');
  }
}

export function computeStockStatus(currentStock: number, minThreshold: number): StockStatus {
  if (currentStock <= 0) return 'OUT_OF_STOCK';
  if (currentStock <= minThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
}

export function syncMenuAvailabilityFromInventory(ingredientId: string): void {
  const ingredient = mockIngredientsData.find((i) => i.id === ingredientId);
  if (!ingredient) return;

  for (const item of mockMenuItemsData) {
    if (!item.linkedIngredientIds.includes(ingredientId)) continue;
    if (ingredient.currentStock <= 0) {
      if (item.status === 'AVAILABLE') {
        item.status = 'OUT_OF_STOCK';
        item.updatedAt = new Date().toISOString();
      }
    } else if (item.status === 'OUT_OF_STOCK') {
      const hasAnyOutIngredient = item.linkedIngredientIds.some((id) => {
        const ing = mockIngredientsData.find((x) => x.id === id);
        return ing ? ing.currentStock <= 0 : false;
      });
      if (!hasAnyOutIngredient) {
        item.status = 'AVAILABLE';
        item.updatedAt = new Date().toISOString();
      }
    }
  }
}

export function syncOrderItemsToKds(order: Order): void {
  for (const item of order.items) {
    if (item.kitchenStatus === 'VOIDED') continue;
    const existing = mockKdsItemsData.find((k) => k.id === `kds-${item.id}`);
    if (!existing) {
      const menuItem = mockMenuItemsData.find((m) => m.id === item.menuItemId);
      mockKdsItemsData.unshift({
        id: `kds-${item.id}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.tableNumber,
        orderType: order.orderType,
        menuItemId: item.menuItemId,
        menuItemName: item.menuItemName,
        station: item.station,
        quantity: item.quantity,
        modifiers: item.modifiers,
        note: item.note,
        status: item.kitchenStatus,
        slaMinutes: menuItem?.prepTimeMinutes ?? 12,
        createdAt: order.createdAt,
      });
    }
  }
}

export function syncKdsStatusToOrder(orderId: string, itemId: string, nextStatus: KdsItemStatus): void {
  const order = mockOrdersData.find((o) => o.id === orderId);
  if (!order) return;

  const cleanItemId = itemId.startsWith('kds-') ? itemId.slice(4) : itemId;
  const orderItem = order.items.find((i) => i.id === cleanItemId);
  if (orderItem) {
    orderItem.kitchenStatus = nextStatus;
  }

  const activeItems = order.items.filter((i) => i.kitchenStatus !== 'VOIDED');
  if (activeItems.length === 0) return;

  let derivedOrderStatus: OrderStatus = order.status;
  if (activeItems.every((i) => i.kitchenStatus === 'COMPLETED')) {
    derivedOrderStatus = 'READY';
  } else if (activeItems.some((i) => i.kitchenStatus === 'COOKING')) {
    derivedOrderStatus = 'COOKING';
  } else if (activeItems.some((i) => i.kitchenStatus === 'ACCEPTED')) {
    derivedOrderStatus = 'CONFIRMED';
  }

  if (
    derivedOrderStatus !== order.status &&
    order.status !== 'COMPLETED' &&
    order.status !== 'CANCELLED' &&
    order.status !== 'REJECTED'
  ) {
    order.status = derivedOrderStatus;
    order.updatedAt = new Date().toISOString();
    order.history.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: derivedOrderStatus,
      note:
        derivedOrderStatus === 'READY'
          ? 'Bếp đã hoàn thành toàn bộ món trong đơn'
          : derivedOrderStatus === 'COOKING'
            ? 'Bếp đang chế biến món'
            : 'Bếp đã tiếp nhận món',
      actorName: 'Trạm Bếp KDS',
      actorRole: 'KITCHEN_STAFF',
      timestamp: order.updatedAt,
    });
  }
}
