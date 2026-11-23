import type { CustomerOrderRepository } from '@/src/repositories/interfaces/CustomerOrderRepository';
import type { MenuCategory, MenuItem } from '@/src/features/menu/types/menu.types';
import type {
  CustomerOrderTracking,
  SubmitCustomerOrderInput,
} from '@/src/features/customer-order/types/customerOrder.types';
import type { ApiResponse } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';

export class ApiCustomerOrderRepository implements CustomerOrderRepository {
  async getCustomerMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
    const { data } = await apiClient.get<ApiResponse<{ categories: MenuCategory[]; items: MenuItem[] }>>(
      '/customer/menu'
    );
    return data.data;
  }

  async submitOrder(input: SubmitCustomerOrderInput): Promise<CustomerOrderTracking> {
    const { data } = await apiClient.post<ApiResponse<CustomerOrderTracking>>(
      '/customer/orders',
      input
    );
    return data.data;
  }

  async getOrderStatus(orderId: string): Promise<CustomerOrderTracking> {
    const { data } = await apiClient.get<ApiResponse<CustomerOrderTracking>>(
      `/customer/orders/${orderId}`
    );
    return data.data;
  }

  async getRecentTableOrders(tableNumber: string): Promise<CustomerOrderTracking[]> {
    const { data } = await apiClient.get<ApiResponse<CustomerOrderTracking[]>>(
      '/customer/orders',
      { params: { tableNumber } }
    );
    return data.data;
  }
}
