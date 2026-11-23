import type { OrderRepository } from '@/src/repositories/interfaces/OrderRepository';
import type {
  AddOrderItemInput,
  CreateOrderInput,
  Order,
  OrderFilterParams,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from '@/src/features/orders/types/order.types';
import type { UserRole } from '@/src/types/common';
import { mockOrdersData } from '@/src/data/mock/mockOrders';
import { mockMenuItemsData } from '@/src/data/mock/mockMenu';
import { mockKdsItemsData } from '@/src/data/mock/mockKDS';
import { mockStoreEvents, simulateMockNetwork, syncOrderItemsToKds } from '@/src/data/mock/mockStore';

function recalculateTotals(order: Order): void {
  const activeItems = order.items.filter((i) => i.kitchenStatus !== 'VOIDED');
  const subtotal = activeItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const serviceFee = order.orderType === 'DINE_IN' ? Math.round(subtotal * 0.05) : 0;
  const taxAmount = Math.round((subtotal + serviceFee) * 0.08);
  order.subtotal = subtotal;
  order.serviceFee = serviceFee;
  order.taxAmount = taxAmount;
  order.totalAmount = subtotal + serviceFee + taxAmount;
}

export class MockOrderRepository implements OrderRepository {
  async getOrders(params?: OrderFilterParams): Promise<Order[]> {
    await simulateMockNetwork();
    const search = params?.search?.trim().toLowerCase() ?? '';
    const status = params?.status;

    return mockOrdersData
      .filter((order) => {
        const matchStatus = !status || status === 'ALL' || order.status === status;
        const matchSearch =
          !search ||
          order.orderNumber.toLowerCase().includes(search) ||
          order.tableNumber.toLowerCase().includes(search) ||
          order.guestName.toLowerCase().includes(search);
        return matchStatus && matchSearch;
      })
      .map((o) => ({
        ...o,
        items: o.items.map((i) => ({ ...i })),
        history: o.history.map((h) => ({ ...h })),
      }));
  }

  async getOrderById(id: string): Promise<Order> {
    await simulateMockNetwork();
    const found = mockOrdersData.find((o) => o.id === id);
    if (!found) {
      throw new Error('Không tìm thấy đơn hàng.');
    }
    return {
      ...found,
      items: found.items.map((i) => ({ ...i })),
      history: found.history.map((h) => ({ ...h })),
    };
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    await simulateMockNetwork();
    if (input.items.length === 0) {
      throw new Error('Đơn hàng phải có ít nhất 1 món.');
    }
    const nowIso = new Date().toISOString();
    const orderItems: OrderItem[] = input.items.map((entry, idx) => {
      const dish = mockMenuItemsData.find((m) => m.id === entry.menuItemId);
      if (!dish) throw new Error('Món ăn không tồn tại.');
      return {
        id: `oi-${Date.now()}-${idx}`,
        menuItemId: dish.id,
        menuItemName: dish.name,
        station: dish.station,
        quantity: entry.quantity,
        unitPrice: dish.price,
        modifiers: entry.modifiers,
        note: entry.note,
        kitchenStatus: 'QUEUED',
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#ORD-${1044 + mockOrdersData.length}`,
      tableNumber: input.tableNumber,
      orderType: input.orderType,
      guestName: input.guestName,
      guestCount: input.guestCount,
      staffName: input.staffName,
      status: 'CONFIRMED',
      paymentStatus: 'UNPAID',
      subtotal: 0,
      serviceFee: 0,
      taxAmount: 0,
      totalAmount: 0,
      items: orderItems,
      history: [
        {
          id: `hist-${Date.now()}`,
          status: 'CONFIRMED',
          note: 'Nhân viên tạo đơn và gửi trực tiếp sang bếp KDS',
          actorName: input.staffName,
          actorRole: 'ORDER_STAFF',
          timestamp: nowIso,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    recalculateTotals(newOrder);
    mockOrdersData.unshift(newOrder);
    syncOrderItemsToKds(newOrder);
    mockStoreEvents.emit();

    return { ...newOrder };
  }

  async acceptOrder(id: string, actorName: string, actorRole: UserRole): Promise<Order> {
    await simulateMockNetwork();
    const order = mockOrdersData.find((o) => o.id === id);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');
    if (order.status !== 'PENDING') {
      throw new Error('Chỉ có thể tiếp nhận đơn đang ở trạng thái Chờ duyệt.');
    }

    const nowIso = new Date().toISOString();
    order.status = 'CONFIRMED';
    order.updatedAt = nowIso;
    order.history.push({
      id: `hist-${Date.now()}`,
      status: 'CONFIRMED',
      note: 'Đã tiếp nhận đơn và điều phối sang màn hình Bếp KDS',
      actorName,
      actorRole,
      timestamp: nowIso,
    });

    syncOrderItemsToKds(order);
    mockStoreEvents.emit();
    return { ...order };
  }

  async rejectOrder(id: string, reason: string, actorName: string, actorRole: UserRole): Promise<Order> {
    await simulateMockNetwork();
    const order = mockOrdersData.find((o) => o.id === id);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');
    if (!reason.trim()) throw new Error('Vui lòng nhập lý do từ chối đơn.');

    const nowIso = new Date().toISOString();
    order.status = 'REJECTED';
    order.cancelReason = reason.trim();
    order.updatedAt = nowIso;
    order.items.forEach((i) => {
      i.kitchenStatus = 'VOIDED';
    });
    order.history.push({
      id: `hist-${Date.now()}`,
      status: 'REJECTED',
      note: `Từ chối đơn: ${reason.trim()}`,
      actorName,
      actorRole,
      timestamp: nowIso,
    });

    mockStoreEvents.emit();
    return { ...order };
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    note: string,
    actorName: string,
    actorRole: UserRole
  ): Promise<Order> {
    await simulateMockNetwork();
    const order = mockOrdersData.find((o) => o.id === id);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');

    const nowIso = new Date().toISOString();
    order.status = status;
    order.updatedAt = nowIso;

    if (status === 'CONFIRMED') {
      syncOrderItemsToKds(order);
    }

    if (status === 'COMPLETED') {
      order.items.forEach((i) => {
        if (i.kitchenStatus !== 'VOIDED') i.kitchenStatus = 'COMPLETED';
      });
      mockKdsItemsData.forEach((k) => {
        if (k.orderId === order.id && k.status !== 'VOIDED') {
          k.status = 'COMPLETED';
          k.completedAt = nowIso;
        }
      });
    }

    order.history.push({
      id: `hist-${Date.now()}`,
      status,
      note: note.trim() || `Chuyển trạng thái sang ${status}`,
      actorName,
      actorRole,
      timestamp: nowIso,
    });

    mockStoreEvents.emit();
    return { ...order };
  }

  async addOrderItem(
    orderId: string,
    input: AddOrderItemInput,
    actorName: string,
    actorRole: UserRole
  ): Promise<Order> {
    await simulateMockNetwork();
    const order = mockOrdersData.find((o) => o.id === orderId);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED' || order.status === 'REJECTED') {
      throw new Error('Không thể thêm món vào đơn đã kết thúc hoặc đã hủy.');
    }

    const dish = mockMenuItemsData.find((m) => m.id === input.menuItemId);
    if (!dish) throw new Error('Món ăn không tồn tại.');
    if (dish.status !== 'AVAILABLE') {
      throw new Error(`Món "${dish.name}" hiện không khả dụng.`);
    }

    const nowIso = new Date().toISOString();
    const newItem: OrderItem = {
      id: `oi-${Date.now()}`,
      menuItemId: dish.id,
      menuItemName: dish.name,
      station: dish.station,
      quantity: input.quantity,
      unitPrice: dish.price,
      modifiers: input.modifiers,
      note: input.note,
      kitchenStatus: 'QUEUED',
    };

    order.items.push(newItem);
    recalculateTotals(order);
    order.updatedAt = nowIso;
    order.history.push({
      id: `hist-${Date.now()}`,
      status: order.status,
      note: `Gọi thêm ${input.quantity}x ${dish.name}`,
      actorName,
      actorRole,
      timestamp: nowIso,
    });

    if (order.status !== 'PENDING') {
      syncOrderItemsToKds(order);
    }

    mockStoreEvents.emit();
    return { ...order };
  }

  async cancelOrder(id: string, reason: string, actorName: string, actorRole: UserRole): Promise<Order> {
    await simulateMockNetwork();
    const order = mockOrdersData.find((o) => o.id === id);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');
    if (!reason.trim()) throw new Error('Bắt buộc nhập lý do hủy đơn.');

    const nowIso = new Date().toISOString();
    order.status = 'CANCELLED';
    order.cancelReason = reason.trim();
    order.updatedAt = nowIso;
    order.items.forEach((i) => {
      i.kitchenStatus = 'VOIDED';
    });

    mockKdsItemsData.forEach((k) => {
      if (k.orderId === order.id) {
        k.status = 'VOIDED';
      }
    });

    order.history.push({
      id: `hist-${Date.now()}`,
      status: 'CANCELLED',
      note: `Hủy đơn: ${reason.trim()}`,
      actorName,
      actorRole,
      timestamp: nowIso,
    });

    mockStoreEvents.emit();
    return { ...order };
  }

  async recordPayment(
    id: string,
    method: PaymentMethod,
    actorName: string,
    actorRole: UserRole
  ): Promise<Order> {
    await simulateMockNetwork();
    const order = mockOrdersData.find((o) => o.id === id);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');

    const nowIso = new Date().toISOString();
    order.paymentStatus = 'PAID';
    order.paymentMethod = method;
    order.status = 'COMPLETED';
    order.updatedAt = nowIso;
    order.history.push({
      id: `hist-${Date.now()}`,
      status: 'COMPLETED',
      note: `Ghi nhận thanh toán (${method === 'CASH' ? 'Tiền mặt' : method === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Thẻ'})`,
      actorName,
      actorRole,
      timestamp: nowIso,
    });

    mockStoreEvents.emit();
    return { ...order };
  }
}
