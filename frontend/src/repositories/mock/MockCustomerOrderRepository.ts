import type { CustomerOrderRepository } from '@/src/repositories/interfaces/CustomerOrderRepository';
import type { MenuCategory, MenuItem } from '@/src/features/menu/types/menu.types';
import type {
  CustomerOrderTracking,
  SubmitCustomerOrderInput,
} from '@/src/features/customer-order/types/customerOrder.types';
import type { Order, OrderItem } from '@/src/features/orders/types/order.types';
import { mockCategoriesData, mockMenuItemsData } from '@/src/data/mock/mockMenu';
import { mockOrdersData } from '@/src/data/mock/mockOrders';
import { mockStoreEvents, simulateMockNetwork, syncOrderItemsToKds } from '@/src/data/mock/mockStore';

export class MockCustomerOrderRepository implements CustomerOrderRepository {
  async getCustomerMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
    await simulateMockNetwork();
    const categories = mockCategoriesData
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((c) => ({ ...c }));

    const items = mockMenuItemsData
      .filter((m) => m.status !== 'INACTIVE')
      .map((m) => ({ ...m }));

    return { categories, items };
  }

  async submitOrder(input: SubmitCustomerOrderInput): Promise<CustomerOrderTracking> {
    await simulateMockNetwork();
    if (input.items.length === 0) {
      throw new Error('Giỏ hàng đang trống. Vui lòng chọn ít nhất 1 món.');
    }

    const nowIso = new Date().toISOString();
    const orderId = `ord-${Date.now()}`;
    const nextNum = 1044 + mockOrdersData.length;

    const orderItems: OrderItem[] = input.items.map((entry, idx) => {
      const dish = mockMenuItemsData.find((m) => m.id === entry.menuItemId);
      if (!dish) {
        throw new Error('Một món trong giỏ hàng không còn tồn tại.');
      }
      if (dish.status !== 'AVAILABLE') {
        throw new Error(`Món "${dish.name}" hiện đã hết hàng hoặc ngừng phục vụ.`);
      }
      const modifierExtra = dish.modifiers
        .filter((mod) => entry.modifiers.includes(mod.label))
        .reduce((acc, mod) => acc + mod.extraPrice, 0);

      return {
        id: `oi-${Date.now()}-${idx}`,
        menuItemId: dish.id,
        menuItemName: dish.name,
        station: dish.station,
        quantity: entry.quantity,
        unitPrice: dish.price + modifierExtra,
        modifiers: entry.modifiers,
        note: entry.note,
        kitchenStatus: 'QUEUED',
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const serviceFee = Math.round(subtotal * 0.05);
    const taxAmount = Math.round((subtotal + serviceFee) * 0.08);
    const totalAmount = subtotal + serviceFee + taxAmount;

    const newOrder: Order = {
      id: orderId,
      orderNumber: `#ORD-${nextNum}`,
      tableNumber: input.tableNumber,
      orderType: 'DINE_IN',
      guestName: input.guestName?.trim() || `Khách ${input.tableNumber}`,
      guestCount: input.guestCount,
      staffName: 'Tự phục vụ tại bàn',
      status: 'CONFIRMED',
      paymentStatus: 'UNPAID',
      subtotal,
      serviceFee,
      taxAmount,
      totalAmount,
      items: orderItems,
      history: [
        {
          id: `hist-${Date.now()}-1`,
          status: 'PENDING',
          note: input.note
            ? `Khách gửi đơn tại ${input.tableNumber}: ${input.note}`
            : `Khách gửi đơn tại ${input.tableNumber}`,
          actorName: input.guestName?.trim() || `Khách ${input.tableNumber}`,
          actorRole: 'GUEST',
          timestamp: nowIso,
        },
        {
          id: `hist-${Date.now()}-2`,
          status: 'CONFIRMED',
          note: 'Đơn tự động tiếp nhận vào hàng đợi POS & KDS Bếp',
          actorName: 'Hệ thống ResMan',
          actorRole: 'ORDER_STAFF',
          timestamp: nowIso,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    mockOrdersData.unshift(newOrder);
    syncOrderItemsToKds(newOrder);
    mockStoreEvents.emit();

    return { ...newOrder, items: [...newOrder.items], history: [...newOrder.history] };
  }

  async getOrderStatus(orderId: string): Promise<CustomerOrderTracking> {
    await simulateMockNetwork(false);
    const found = mockOrdersData.find((o) => o.id === orderId);
    if (!found) {
      throw new Error('Không tìm thấy thông tin đơn hàng.');
    }
    return { ...found, items: [...found.items], history: [...found.history] };
  }

  async getRecentTableOrders(tableNumber: string): Promise<CustomerOrderTracking[]> {
    await simulateMockNetwork();
    return mockOrdersData
      .filter((o) => o.tableNumber.toLowerCase() === tableNumber.toLowerCase())
      .map((o) => ({ ...o, items: [...o.items], history: [...o.history] }));
  }
}
