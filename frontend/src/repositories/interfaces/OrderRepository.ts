import type {
  AddOrderItemInput,
  CreateOrderInput,
  Order,
  OrderFilterParams,
  OrderStatus,
  PaymentMethod,
} from '@/src/features/orders/types/order.types';
import type { UserRole } from '@/src/types/common';

export interface OrderRepository {
  getOrders(params?: OrderFilterParams): Promise<Order[]>;
  getOrderById(id: string): Promise<Order>;
  createOrder(input: CreateOrderInput): Promise<Order>;
  acceptOrder(id: string, actorName: string, actorRole: UserRole): Promise<Order>;
  rejectOrder(id: string, reason: string, actorName: string, actorRole: UserRole): Promise<Order>;
  updateOrderStatus(
    id: string,
    status: OrderStatus,
    note: string,
    actorName: string,
    actorRole: UserRole
  ): Promise<Order>;
  addOrderItem(
    orderId: string,
    input: AddOrderItemInput,
    actorName: string,
    actorRole: UserRole
  ): Promise<Order>;
  cancelOrder(id: string, reason: string, actorName: string, actorRole: UserRole): Promise<Order>;
  recordPayment(
    id: string,
    method: PaymentMethod,
    actorName: string,
    actorRole: UserRole
  ): Promise<Order>;
}
