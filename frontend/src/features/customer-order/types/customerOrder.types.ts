import type { MenuItem } from '@/src/features/menu/types/menu.types';
import type { Order } from '@/src/features/orders/types/order.types';

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: string[];
  extraPrice: number;
  note: string;
}

export interface SubmitCustomerOrderInput {
  sessionCode?: string;
  tableNumber: string;
  guestName?: string;
  guestCount: number;
  note?: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    modifiers: string[];
    note: string;
  }>;
}

export type CustomerOrderTracking = Order;
