import type { KDSRepository } from '@/src/repositories/interfaces/KDSRepository';
import type { KdsFilterParams, KdsItem, KdsItemStatus } from '@/src/features/kds/types/kds.types';
import type { ApiResponse } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';

type ApiKitchenItem = {
  id: string;
  orderCode: string;
  table: { id: string; code: string; name: string };
  itemName: string;
  quantity: number;
  note: string | null;
  status: 'AWAITING_ACCEPTANCE' | 'ACCEPTED' | 'IN_PREPARATION' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
};

function unwrap<T>(value: ApiResponse<T> | T): T {
  return value && typeof value === 'object' && 'data' in value
    ? (value as ApiResponse<T>).data
    : (value as T);
}

function mapStatus(status: ApiKitchenItem['status']): KdsItemStatus {
  switch (status) {
    case 'AWAITING_ACCEPTANCE': return 'QUEUED';
    case 'IN_PREPARATION': return 'COOKING';
    case 'COMPLETED': return 'COMPLETED';
    case 'CANCELLED': return 'VOIDED';
    default: return 'ACCEPTED';
  }
}

function mapItem(item: ApiKitchenItem): KdsItem {
  return {
    id: item.id,
    orderId: item.orderCode,
    orderNumber: item.orderCode,
    tableNumber: item.table.code,
    orderType: 'DINE_IN',
    menuItemId: '',
    menuItemName: item.itemName,
    station: 'HOT_KITCHEN',
    quantity: item.quantity,
    modifiers: [],
    note: item.note ?? '',
    status: mapStatus(item.status),
    slaMinutes: 15,
    createdAt: item.createdAt,
  };
}

function toBackendStatus(status: KdsItemStatus): string {
  switch (status) {
    case 'QUEUED': return 'AWAITING_ACCEPTANCE';
    case 'ACCEPTED': return 'ACCEPTED';
    case 'COOKING': return 'IN_PREPARATION';
    case 'COMPLETED': return 'COMPLETED';
    case 'VOIDED': return 'CANCELLED';
  }
}

export class ApiKDSRepository implements KDSRepository {
  async getKitchenQueue(params?: KdsFilterParams): Promise<KdsItem[]> {
    const response = await apiClient.get<ApiResponse<ApiKitchenItem[]> | ApiKitchenItem[]>(
      '/kitchen/queue',
    );
    let items = unwrap(response.data).map(mapItem);
    if (params?.station && params.station !== 'ALL') {
      items = items.filter((item) => item.station === params.station);
    }
    if (params?.status && params.status !== 'ALL') {
      items = items.filter((item) => item.status === params.status);
    }
    return items;
  }

  async updateItemStatus(itemId: string, status: KdsItemStatus, reason?: string): Promise<KdsItem> {
    const before = (await this.getKitchenQueue()).find((item) => item.id === itemId);
    if (!before) throw new Error('Món không còn trong hàng đợi. Vui lòng tải lại KDS.');
    await apiClient.patch(`/kitchen/items/${itemId}/status`, {
      status: toBackendStatus(status),
      ...(status === 'VOIDED' ? { reason: reason?.trim() } : {}),
    });
    return { ...before, status };
  }

  async bumpOrderTicket(_orderId: string): Promise<void> {
    throw new Error('Backend không hỗ trợ Bump ticket. Hãy cập nhật trạng thái từng món.');
  }

  async recallLastBumpedItem(): Promise<KdsItem | null> {
    throw new Error('Backend không hỗ trợ Recall. Không có thao tác gọi lại món đã hoàn thành.');
  }
}
