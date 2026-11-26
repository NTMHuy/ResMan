import type { KDSRepository } from '@/src/repositories/interfaces/KDSRepository';
import type { KdsFilterParams, KdsItem, KdsItemStatus } from '@/src/features/kds/types/kds.types';
import { mockKdsItemsData, mockKdsRecallStack } from '@/src/data/mock/mockKDS';
import { mockStoreEvents, simulateMockNetwork, syncKdsStatusToOrder } from '@/src/data/mock/mockStore';

export class MockKDSRepository implements KDSRepository {
  async getKitchenQueue(params?: KdsFilterParams): Promise<KdsItem[]> {
    await simulateMockNetwork();
    const station = params?.station;
    const status = params?.status;

    return mockKdsItemsData
      .filter((item) => {
        if (item.status === 'VOIDED') return false;
        const matchStation = !station || station === 'ALL' || item.station === station;
        const matchStatus = !status || status === 'ALL' || item.status === status;
        return matchStation && matchStatus;
      })
      .map((item) => ({ ...item }));
  }

  async updateItemStatus(itemId: string, status: KdsItemStatus): Promise<KdsItem> {
    await simulateMockNetwork();
    const target = mockKdsItemsData.find((k) => k.id === itemId);
    if (!target) {
      throw new Error('Không tìm thấy món trong hàng đợi bếp.');
    }

    const nowIso = new Date().toISOString();
    target.status = status;
    if (status === 'ACCEPTED' && !target.acceptedAt) target.acceptedAt = nowIso;
    if (status === 'COOKING' && !target.startedAt) target.startedAt = nowIso;
    if (status === 'COMPLETED') {
      target.completedAt = nowIso;
      mockKdsRecallStack.push({ ...target });
    }

    syncKdsStatusToOrder(target.orderId, target.id, status);
    mockStoreEvents.emit();
    return { ...target };
  }

  async bumpOrderTicket(orderId: string): Promise<void> {
    await simulateMockNetwork();
    const nowIso = new Date().toISOString();
    const items = mockKdsItemsData.filter(
      (k) => k.orderId === orderId && k.status !== 'VOIDED' && k.status !== 'COMPLETED'
    );

    for (const item of items) {
      item.status = 'COMPLETED';
      item.completedAt = nowIso;
      mockKdsRecallStack.push({ ...item });
      syncKdsStatusToOrder(item.orderId, item.id, 'COMPLETED');
    }

    mockStoreEvents.emit();
  }

  async recallLastBumpedItem(): Promise<KdsItem | null> {
    await simulateMockNetwork();
    const last = mockKdsRecallStack.pop();
    if (!last) return null;

    const target = mockKdsItemsData.find((k) => k.id === last.id);
    if (!target) return null;

    target.status = 'COOKING';
    target.completedAt = undefined;
    syncKdsStatusToOrder(target.orderId, target.id, 'COOKING');
    mockStoreEvents.emit();
    return { ...target };
  }
}
