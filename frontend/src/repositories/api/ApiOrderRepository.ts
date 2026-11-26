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
import type { ApiResponse, UserRole } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';

interface ActiveOrderApi {
  id: string;
  orderCode: string;
  createdAt: string;
  session: {
    id: string;
    openedAt: string;
    table: { id: string; code: string; name: string };
  };
  items: Array<{
    id: string;
    itemNameSnapshot: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    note: string | null;
    status: string;
    createdAt: string;
  }>;
}

function unwrapData<T>(value: unknown): T {
  if (value && typeof value === 'object' && 'data' in value) {
    return (value as ApiResponse<T>).data;
  }
  return value as T;
}

function mapItemStatus(status: string): OrderItem['kitchenStatus'] {
  switch (status) {
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'IN_PREPARATION':
      return 'COOKING';
    case 'COMPLETED':
      return 'COMPLETED';
    case 'CANCELLED':
      return 'VOIDED';
    default:
      return 'QUEUED';
  }
}

function mapOrderStatus(items: ActiveOrderApi['items']): OrderStatus {
  const statuses = items.map((item) => item.status);
  const active = statuses.filter((status) => status !== 'CANCELLED');
  if (active.length === 0) return statuses.length > 0 ? 'CANCELLED' : 'PENDING';
  if (active.some((status) => status === 'AWAITING_ACCEPTANCE')) return 'PENDING';
  if (active.every((status) => status === 'COMPLETED')) return 'COMPLETED';
  if (active.some((status) => status === 'IN_PREPARATION')) return 'COOKING';
  if (active.some((status) => status === 'ACCEPTED')) return 'CONFIRMED';
  return 'PENDING';
}

function mapActiveOrder(source: ActiveOrderApi): Order {
  const items: OrderItem[] = source.items.map((item) => ({
    id: String(item.id),
    // The active-orders API intentionally returns the item snapshot, not menu metadata.
    menuItemId: '',
    menuItemName: item.itemNameSnapshot,
    station: 'HOT_KITCHEN',
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    modifiers: [],
    note: item.note ?? '',
    kitchenStatus: mapItemStatus(item.status),
  }));
  const totalAmount = source.items
    .filter((item) => item.status !== 'CANCELLED')
    .reduce((sum, item) => sum + Number(item.lineTotal), 0);
  const updatedAt = source.items.reduce(
    (latest, item) => item.createdAt > latest ? item.createdAt : latest,
    source.createdAt,
  );

  return {
    id: String(source.id),
    sessionId: String(source.session.id),
    orderNumber: source.orderCode,
    tableNumber: source.session.table.code,
    orderType: 'DINE_IN',
    guestName: 'Khách tại bàn',
    guestCount: 1,
    staffName: 'Khách tự gọi món',
    status: mapOrderStatus(source.items),
    paymentStatus: 'UNPAID',
    subtotal: totalAmount,
    serviceFee: 0,
    taxAmount: 0,
    totalAmount,
    items,
    history: [],
    createdAt: source.createdAt,
    updatedAt,
  };
}

export class ApiOrderRepository implements OrderRepository {
  async getOrders(_params?: OrderFilterParams): Promise<Order[]> {
    const response = await apiClient.get('/orders/active');
    const orders = unwrapData<ActiveOrderApi[]>(response.data) ?? [];
    return orders.map(mapActiveOrder);
  }

  async getOrderById(id: string): Promise<Order> {
    const orders = await this.getOrders();
    const order = orders.find((item) => item.id === id);
    if (!order) throw new Error('Không tìm thấy đơn hàng trong các phiên đang mở.');
    return order;
  }

  async createOrder(_input: CreateOrderInput): Promise<Order> {
    throw new Error('Tạo đơn POS trực tiếp chưa được backend hỗ trợ. Khách hàng cần gọi món qua phiên QR.');
  }

  async acceptOrder(id: string, _actorName: string, _actorRole: UserRole): Promise<Order> {
    await apiClient.patch(`/orders/${id}/items/status`, { status: 'ACCEPTED' });
    return this.getOrderById(id);
  }

  async rejectOrder(id: string, reason: string, _actorName: string, _actorRole: UserRole): Promise<Order> {
    await apiClient.patch(`/orders/${id}/items/status`, { status: 'CANCELLED', reason });
    return this.getOrderById(id);
  }

  async updateOrderStatus(
    id: string, status: OrderStatus, note: string,
    _actorName: string, _actorRole: UserRole,
  ): Promise<Order> {
    const backendStatus = status === 'COOKING' ? 'IN_PREPARATION'
      : status === 'READY' ? 'COMPLETED' : null;
    if (!backendStatus) throw new Error('Trạng thái đơn hàng không được hỗ trợ.');
    await apiClient.patch(`/orders/${id}/items/status`, { status: backendStatus, reason: note });
    return this.getOrderById(id);
  }

  async addOrderItem(
    _orderId: string,
    _input: AddOrderItemInput,
    _actorName: string,
    _actorRole: UserRole,
  ): Promise<Order> {
    throw new Error('Thêm món từ POS chưa được backend hỗ trợ. Vui lòng gọi món qua phiên QR.');
  }

  async cancelOrder(id: string, reason: string, _actorName: string, _actorRole: UserRole): Promise<Order> {
    await apiClient.patch(`/orders/${id}/items/status`, { status: 'CANCELLED', reason });
    return this.getOrderById(id);
  }

  async recordPayment(id: string, method: PaymentMethod, _actorName: string, _actorRole: UserRole): Promise<Order> {
    const order = await this.getOrderById(id);
    if (!order.sessionId) throw new Error('Không tìm thấy phiên phục vụ của đơn hàng.');
    const response = await apiClient.post<ApiResponse<{
      session: { id: string; status: string; table: { id: string; status: string } };
      payment: { id: string; orderId: string; amount: string; status: string; paidAt: string };
    }> | {
      session: { id: string; status: string; table: { id: string; status: string } };
      payment: { id: string; orderId: string; amount: string; status: string; paidAt: string };
    }>(`/payments/sessions/${order.sessionId}/confirm`, { paymentMethod: method });
    const result = unwrapData<{
      session: { id: string; status: string; table: { id: string; status: string } };
      payment: { id: string; orderId: string; amount: string; status: string; paidAt: string };
    }>(response.data);
    if (result.payment.status !== 'PAID' || result.session.status !== 'CLOSED') {
      throw new Error('Backend chưa xác nhận thanh toán và đóng phiên thành công.');
    }
    return {
      ...order,
      paymentStatus: 'PAID',
      totalAmount: Number(result.payment.amount),
      subtotal: Number(result.payment.amount),
      updatedAt: result.payment.paidAt,
    };
  }
}
