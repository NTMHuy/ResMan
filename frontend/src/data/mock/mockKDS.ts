import type { KdsItem } from '@/src/features/kds/types/kds.types';
import { mockOrdersData } from '@/src/data/mock/mockOrders';
import { mockMenuItemsData } from '@/src/data/mock/mockMenu';

export function buildInitialKdsQueue(): KdsItem[] {
  const items: KdsItem[] = [];

  for (const order of mockOrdersData) {
    if (order.status === 'CONFIRMED' || order.status === 'COOKING' || order.status === 'READY') {
      for (const orderItem of order.items) {
        if (orderItem.kitchenStatus === 'VOIDED') continue;
        const menuItem = mockMenuItemsData.find((m) => m.id === orderItem.menuItemId);
        items.push({
          id: `kds-${orderItem.id}`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          tableNumber: order.tableNumber,
          orderType: order.orderType,
          menuItemId: orderItem.menuItemId,
          menuItemName: orderItem.menuItemName,
          station: orderItem.station,
          quantity: orderItem.quantity,
          modifiers: orderItem.modifiers,
          note: orderItem.note,
          status: orderItem.kitchenStatus,
          slaMinutes: menuItem?.prepTimeMinutes ?? 12,
          createdAt: order.createdAt,
          acceptedAt: orderItem.kitchenStatus !== 'QUEUED' ? order.updatedAt : undefined,
          startedAt: orderItem.kitchenStatus === 'COOKING' ? order.updatedAt : undefined,
          completedAt: orderItem.kitchenStatus === 'COMPLETED' ? order.updatedAt : undefined,
        });
      }
    }
  }

  return items;
}

export const mockKdsItemsData: KdsItem[] = buildInitialKdsQueue();
export const mockKdsRecallStack: KdsItem[] = [];
