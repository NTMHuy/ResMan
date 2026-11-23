import React from 'react';
import { Badge, type BadgeTone } from '@/src/components/common/Badge';
import type { OrderStatus } from '@/src/features/orders/types/order.types';

const STATUS_MAP: Record<OrderStatus, { label: string; tone: BadgeTone }> = {
  PENDING: { label: 'Chờ duyệt', tone: 'warning' },
  CONFIRMED: { label: 'Đã nhận đơn', tone: 'info' },
  COOKING: { label: 'Đang chế biến', tone: 'info' },
  READY: { label: 'Sẵn sàng phục vụ', tone: 'success' },
  COMPLETED: { label: 'Hoàn tất', tone: 'primary' },
  CANCELLED: { label: 'Đã hủy', tone: 'danger' },
  REJECTED: { label: 'Từ chối', tone: 'danger' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_MAP[status];
  return <Badge label={cfg.label} tone={cfg.tone} />;
}
