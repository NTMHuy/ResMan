import type { CustomerOrderRepository } from '@/src/repositories/interfaces/CustomerOrderRepository';
import type { MenuCategory, MenuItem } from '@/src/features/menu/types/menu.types';
import type {
  CustomerOrderTracking,
  SubmitCustomerOrderInput,
} from '@/src/features/customer-order/types/customerOrder.types';
import type { ApiResponse } from '@/src/types/common';
import type { OrderItem, OrderStatus } from '@/src/features/orders/types/order.types';
import { resolveMenuImageUrl } from '@/src/constants/config';
import { apiClient } from '@/src/services/api/apiClient';
import { storageService } from '@/src/services/storage/storageService';

interface GuestMenuItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
}

interface GuestMenuCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  items: GuestMenuItem[];
}

interface GuestSessionResponse {
  session: { status: string; openedAt: string };
  table: { code: string; name: string };
  order: { id: string; orderCode: string; createdAt: string };
  items: Array<{
    id: string;
    menuItemId: string;
    itemNameSnapshot: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    note: string | null;
    status: string;
    createdAt: string;
  }>;
}

function unwrapData<T>(value: unknown): T {
  if (value && typeof value === 'object' && 'data' in value) {
    return (value as ApiResponse<T>).data;
  }
  return value as T;
}

function mapMenu(source: GuestMenuCategory[]): {
  categories: MenuCategory[];
  items: MenuItem[];
} {
  const categories = source.map((category, index) => ({
    id: String(category.id),
    code: category.code,
    name: category.name,
    description: category.description ?? '',
    sortOrder: index,
    isActive: true,
    itemCount: category.items.length,
  }));

  const items = source.flatMap((category) =>
    category.items.map((item) => ({
      id: String(item.id),
      sku: item.code,
      name: item.name,
      description: item.description ?? '',
      price: Number(item.price),
      categoryId: String(category.id),
      station: 'HOT_KITCHEN' as const,
      imageUrl: resolveMenuImageUrl(item.imageUrl),
      status: 'AVAILABLE' as const,
      // MVP does not support paid modifiers or item variants.
      modifiers: [],
      linkedIngredientIds: [],
      prepTimeMinutes: 0,
      updatedAt: new Date().toISOString(),
    })),
  );

  return { categories, items };
}

function mapItemStatus(status: string): OrderItem['kitchenStatus'] {
  switch (status) {
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'IN_PREPARATION':
      return 'COOKING';
    case 'COMPLETED':
      return 'COMPLETED';
    case 'CANCELLED':
      return 'VOIDED';
    default:
      return 'QUEUED';
  }
}

function mapOrderStatus(statuses: string[]): OrderStatus {
  const active = statuses.filter((status) => status !== 'CANCELLED');
  if (active.length === 0) return statuses.length > 0 ? 'CANCELLED' : 'PENDING';
  if (active.every((status) => status === 'COMPLETED')) return 'COMPLETED';
  if (active.some((status) => status === 'IN_PREPARATION')) return 'COOKING';
  if (active.some((status) => status === 'ACCEPTED')) return 'CONFIRMED';
  return 'PENDING';
}

function mapGuestOrder(data: GuestSessionResponse): CustomerOrderTracking {
  const items: OrderItem[] = data.items.map((item) => ({
    id: String(item.id),
    menuItemId: String(item.menuItemId),
    menuItemName: item.itemNameSnapshot,
    station: 'HOT_KITCHEN',
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    modifiers: [],
    note: item.note ?? '',
    kitchenStatus: mapItemStatus(item.status),
  }));

  const totalAmount = data.items
    .filter((item) => item.status !== 'CANCELLED')
    .reduce((sum, item) => sum + Number(item.lineTotal), 0);

  return {
    id: String(data.order.id),
    orderNumber: data.order.orderCode,
    tableNumber: data.table.code,
    orderType: 'DINE_IN',
    guestName: 'Khách tại bàn',
    guestCount: 1,
    staffName: 'Tự phục vụ tại bàn',
    status: mapOrderStatus(data.items.map((item) => item.status)),
    paymentStatus: 'UNPAID',
    subtotal: totalAmount,
    serviceFee: 0,
    taxAmount: 0,
    totalAmount,
    items,
    history: [],
    createdAt: data.order.createdAt,
    updatedAt: data.items.reduce(
      (latest, item) => item.createdAt > latest ? item.createdAt : latest,
      data.order.createdAt,
    ),
  };
}

export class ApiCustomerOrderRepository implements CustomerOrderRepository {
  private async readSessionCode(): Promise<string | null> {
    return storageService.getCustomerSessionCode();
  }

  private async getGuestSession(): Promise<GuestSessionResponse> {
    const sessionCode = await this.readSessionCode();
    if (!sessionCode) {
      throw new Error('Chưa kết nối phiên bàn. Hãy nhập mã phiên do nhân viên cung cấp.');
    }

    const response = await apiClient.get('/guest/session', {
      headers: { 'X-Session-Code': sessionCode },
    });
    return unwrapData<GuestSessionResponse>(response.data);
  }

  async getCustomerMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
    const response = await apiClient.get('/menu');
    return mapMenu(unwrapData<GuestMenuCategory[]>(response.data) ?? []);
  }

  async submitOrder(input: SubmitCustomerOrderInput): Promise<CustomerOrderTracking> {
    const sessionCode = input.sessionCode?.trim() || await this.readSessionCode();
    if (!sessionCode) {
      throw new Error('Chưa kết nối phiên bàn. Hãy nhập mã phiên do nhân viên cung cấp.');
    }

    await storageService.setCustomerSessionCode(sessionCode);
    const items = input.items.map((item) => ({
      menuItemId: Number(item.menuItemId),
      quantity: item.quantity,
      note: [input.note?.trim(), item.note.trim()].filter(Boolean).join(' | ').slice(0, 500),
    }));

    await apiClient.post(
      '/guest/session/items',
      { items },
      { headers: { 'X-Session-Code': sessionCode } },
    );

    return mapGuestOrder(await this.getGuestSession());
  }

  async getOrderStatus(orderId: string): Promise<CustomerOrderTracking> {
    const order = mapGuestOrder(await this.getGuestSession());
    if (order.id !== orderId) {
      throw new Error('Không tìm thấy đơn hàng trong phiên bàn hiện tại.');
    }
    return order;
  }

  async getRecentTableOrders(_tableNumber: string): Promise<CustomerOrderTracking[]> {
    if (!(await this.readSessionCode())) return [];
    return [mapGuestOrder(await this.getGuestSession())];
  }

  async cancelGuestItem(itemId: string): Promise<void> {
    const sessionCode = await this.readSessionCode();
    if (!sessionCode) {
      throw new Error('Chưa kết nối phiên bàn.');
    }
    await apiClient.delete(`/guest/session/items/${encodeURIComponent(itemId)}`, {
      headers: { 'X-Session-Code': sessionCode },
    });
  }
}
