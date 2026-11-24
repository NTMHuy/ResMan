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

  async acceptOrder(_id: string, _actorName: string, _actorRole: UserRole): Promise<Order> {
    throw new Error('Tiếp nhận món được thực hiện tại màn hình KDS.');
  }

  async rejectOrder(_id: string, _reason: string, _actorName: string, _actorRole: UserRole): Promise<Order> {
    throw new Error('Backend hiện chưa hỗ trợ từ chối toàn bộ đơn hàng.');
  }

  async updateOrderStatus(
    _id: string,
    _status: OrderStatus,
    _note: string,
    _actorName: string,
    _actorRole: UserRole,
  ): Promise<Order> {
    throw new Error('Trạng thái món được cập nhật tại màn hình KDS.');
  }

  async addOrderItem(
    _orderId: string,
    _input: AddOrderItemInput,
    _actorName: string,
    _actorRole: UserRole,
  ): Promise<Order> {
    throw new Error('Thêm món từ POS chưa được backend hỗ trợ. Vui lòng gọi món qua phiên QR.');
  }

  async cancelOrder(_id: string, _reason: string, _actorName: string, _actorRole: UserRole): Promise<Order> {
    throw new Error('Backend hiện chỉ hỗ trợ hủy từng món, không hỗ trợ hủy toàn bộ đơn.');
  }

  async recordPayment(
    _id: string,
    _method: PaymentMethod,
    _actorName: string,
    _actorRole: UserRole,
  ): Promise<Order> {
    throw new Error('Ghi nhận thanh toán chưa được kết nối trong API đơn hàng hiện tại.');
  }
}
