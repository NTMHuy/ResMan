import type { KDSRepository } from '@/src/repositories/interfaces/KDSRepository';
import type { KdsFilterParams, KdsItem, KdsItemStatus } from '@/src/features/kds/types/kds.types';
import type { ApiResponse } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';

export class ApiKDSRepository implements KDSRepository {
  async getKitchenQueue(params?: KdsFilterParams): Promise<KdsItem[]> {
    const { data } = await apiClient.get<ApiResponse<KdsItem[]>>('/kitchen/queue', { params });
    return data.data;
  }

  async updateItemStatus(itemId: string, status: KdsItemStatus): Promise<KdsItem> {
    const { data } = await apiClient.patch<ApiResponse<KdsItem>>(`/kitchen/items/${itemId}/status`, {
      status,
    });
    return data.data;
  }

  async bumpOrderTicket(orderId: string): Promise<void> {
    await apiClient.post(`/kitchen/tickets/${orderId}/bump`);
  }

  async recallLastBumpedItem(): Promise<KdsItem | null> {
    const { data } = await apiClient.post<ApiResponse<KdsItem | null>>('/kitchen/items/recall');
    return data.data;
  }
}
