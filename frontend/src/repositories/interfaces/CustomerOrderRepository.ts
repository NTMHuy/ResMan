import type { MenuCategory, MenuItem } from '@/src/features/menu/types/menu.types';
import type {
  CustomerOrderTracking,
  SubmitCustomerOrderInput,
} from '@/src/features/customer-order/types/customerOrder.types';

export interface CustomerOrderRepository {
  getActiveSession(): Promise<{ id: string; tableNumber: string } | null>;
  startSession(): Promise<string>;
  requestPayment(): Promise<void>;
  getCustomerMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }>;
  submitOrder(input: SubmitCustomerOrderInput): Promise<CustomerOrderTracking>;
  getOrderStatus(orderId: string): Promise<CustomerOrderTracking>;
  getRecentTableOrders(tableNumber: string): Promise<CustomerOrderTracking[]>;
  cancelGuestItem?(itemId: string): Promise<void>;
}
