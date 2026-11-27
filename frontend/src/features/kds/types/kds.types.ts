import type { KitchenStation } from '@/src/types/common';

export type KdsItemStatus = 'QUEUED' | 'ACCEPTED' | 'COOKING' | 'COMPLETED' | 'VOIDED';

export interface KdsItem {
  id: string;
  orderId: string;
  orderNumber: string;
  tableNumber: string;
  orderType: 'DINE_IN' | 'TAKEAWAY';
  menuItemId: string;
  menuItemName: string;
  station: KitchenStation;
  quantity: number;
  modifiers: string[];
  note: string;
  status: KdsItemStatus;
  slaMinutes: number;
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface KdsTicket {
  orderId: string;
  orderNumber: string;
  tableNumber: string;
  orderType: 'DINE_IN' | 'TAKEAWAY';
  createdAt: string;
  slaMinutes: number;
  items: KdsItem[];
}

export interface KdsFilterParams {
  station?: KitchenStation | 'ALL';
  status?: KdsItemStatus | 'ALL';
}
