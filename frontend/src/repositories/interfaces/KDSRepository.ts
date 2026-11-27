import type { KdsFilterParams, KdsItem, KdsItemStatus } from '@/src/features/kds/types/kds.types';

export interface KDSRepository {
  getKitchenQueue(params?: KdsFilterParams): Promise<KdsItem[]>;
  updateItemStatus(itemId: string, status: KdsItemStatus, reason?: string): Promise<KdsItem>;
  bumpOrderTicket(orderId: string): Promise<void>;
  recallLastBumpedItem(): Promise<KdsItem | null>;
}
