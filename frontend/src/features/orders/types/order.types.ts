import type { KitchenStation, UserRole } from '@/src/types/common';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COOKING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type PaymentStatus = 'UNPAID' | 'PAID';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD';

export type OrderItemKitchenStatus =
  | 'QUEUED'
  | 'ACCEPTED'
  | 'COOKING'
  | 'COMPLETED'
  | 'VOIDED';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  station: KitchenStation;
  quantity: number;
  unitPrice: number;
  modifiers: string[];
  note: string;
  kitchenStatus: OrderItemKitchenStatus;
}

export interface OrderStatusHistoryEntry {
  id: string;
  status: OrderStatus;
  note: string;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  orderType: 'DINE_IN' | 'TAKEAWAY';
  guestName: string;
  guestCount: number;
  staffName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  subtotal: number;
  serviceFee: number;
  taxAmount: number;
  totalAmount: number;
  items: OrderItem[];
  history: OrderStatusHistoryEntry[];
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  tableNumber: string;
  orderType: 'DINE_IN' | 'TAKEAWAY';
  guestName: string;
  guestCount: number;
  staffName: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    modifiers: string[];
    note: string;
  }>;
}

export interface AddOrderItemInput {
  menuItemId: string;
  quantity: number;
  modifiers: string[];
  note: string;
}

export interface OrderFilterParams {
  status?: OrderStatus | 'ALL';
  search?: string;
}
