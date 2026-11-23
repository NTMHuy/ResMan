import type { OrderRepository } from '@/src/repositories/interfaces/OrderRepository';
import type {
  AddOrderItemInput,
  CreateOrderInput,
  Order,
  OrderFilterParams,
  OrderStatus,
  PaymentMethod,
} from '@/src/features/orders/types/order.types';
import type { ApiResponse, UserRole } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';

export class ApiOrderRepository implements OrderRepository {
  async getOrders(params?: OrderFilterParams): Promise<Order[]> {
    const { data } = await apiClient.get<ApiResponse<Order[]>>('/orders', { params });
    return data.data;
  }

  async getOrderById(id: string): Promise<Order> {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>('/orders', input);
    return data.data;
  }

  async acceptOrder(id: string, actorName: string, actorRole: UserRole): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/accept`, {
      actorName,
      actorRole,
    });
    return data.data;
  }

  async rejectOrder(id: string, reason: string, actorName: string, actorRole: UserRole): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/reject`, {
      reason,
      actorName,
      actorRole,
    });
    return data.data;
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    note: string,
    actorName: string,
    actorRole: UserRole
  ): Promise<Order> {
    const { data } = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, {
      status,
      note,
      actorName,
      actorRole,
    });
    return data.data;
  }

  async addOrderItem(
    orderId: string,
    input: AddOrderItemInput,
    actorName: string,
    actorRole: UserRole
  ): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/items`, {
      ...input,
      actorName,
      actorRole,
    });
    return data.data;
  }

  async cancelOrder(id: string, reason: string, actorName: string, actorRole: UserRole): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`, {
      reason,
      actorName,
      actorRole,
    });
    return data.data;
  }

  async recordPayment(
    id: string,
    method: PaymentMethod,
    actorName: string,
    actorRole: UserRole
  ): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/payment`, {
      method,
      actorName,
      actorRole,
    });
    return data.data;
  }
}
