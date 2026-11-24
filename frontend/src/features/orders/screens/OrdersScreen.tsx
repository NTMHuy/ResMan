import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Ban,
  Check,
  ChefHat,
  CreditCard,
  History,
  Plus,
  Search,
  UtensilsCrossed,
  X,
} from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useToast } from '@/src/contexts/ToastContext';
import { formatDateTime, formatTime, formatVND } from '@/src/utils/formatters';
import { useOrders } from '@/src/features/orders/hooks/useOrders';
import type { OrderItemKitchenStatus, OrderStatus } from '@/src/features/orders/types/order.types';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { StatCard } from '@/src/components/common/StatCard';
import { SegmentedTabs } from '@/src/components/common/SegmentedTabs';
import { PermissionGate } from '@/src/components/common/PermissionGate';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/common/StateViews';
import { OrderStatusBadge } from '@/src/features/orders/components/OrderStatusBadge';
import {
  AddOrderItemModal,
  CreateOrderModal,
  OrderReasonModal,
  PaymentModal,
} from '@/src/features/orders/components/OrderModals';

const KITCHEN_ITEM_BADGE: Record<
  OrderItemKitchenStatus,
  { label: string; tone: 'neutral' | 'info' | 'warning' | 'success' | 'danger' }
> = {
  QUEUED: { label: 'Chờ bếp', tone: 'neutral' },
  ACCEPTED: { label: 'Đã nhận', tone: 'info' },
  COOKING: { label: 'Đang nấu', tone: 'warning' },
  COMPLETED: { label: 'Đã xong', tone: 'success' },
  VOIDED: { label: 'Đã hủy', tone: 'danger' },
};

export function OrdersScreen() {
  const { theme } = useTheme();
  const { isMobile, isDesktop } = useResponsive();
  const { showToast } = useToast();
  const {
    orders,
    availableMenuItems,
    counts,
    loading,
    mutating,
    error,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    reload,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    addOrderItem,
    cancelOrder,
    recordPayment,
    createOrder,
  } = useOrders();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [reasonModal, setReasonModal] = useState<'REJECT' | 'CANCEL' | null>(null);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const selectedOrder = useMemo(() => {
    if (orders.length === 0) return null;
    return orders.find((o) => o.id === selectedOrderId) ?? orders[0];
  }, [orders, selectedOrderId]);

  if (loading && orders.length === 0) {
    return (
      <View style={styles.padded}>
        <LoadingState message="Đang tải danh sách đơn hàng POS..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.padded}>
        <ErrorState message={error} onRetry={() => void reload()} />
      </View>
    );
  }

  const isTerminal =
    selectedOrder?.status === 'COMPLETED' ||
    selectedOrder?.status === 'CANCELLED' ||
    selectedOrder?.status === 'REJECTED';

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      {/* KPI & Action Strip */}
      <View style={[styles.kpiStrip, isMobile ? styles.col : styles.row]}>
        <StatCard
          label="Chờ tiếp nhận"
          value={String(counts.PENDING)}
          accentColor={counts.PENDING > 0 ? theme.colors.warning : theme.colors.onSurface}
          style={styles.kpiCard}
        />
        <StatCard
          label="Đang phục vụ"
          value={String(counts.ACTIVE)}
          accentColor={theme.colors.secondary}
          style={styles.kpiCard}
        />
        <StatCard
          label="Hoàn tất"
          value={String(counts.COMPLETED)}
          accentColor={theme.colors.success}
          style={styles.kpiCard}
        />
        <StatCard
          label="Hủy / Từ chối"
          value={String(counts.STOPPED)}
          accentColor={counts.STOPPED > 0 ? theme.colors.error : theme.colors.onSurface}
          style={styles.kpiCard}
        />
      </View>

      {/* Filter Bar */}
      <Card padding="md" style={styles.filterCard}>
        <View style={[styles.filterTop, isMobile ? styles.col : styles.row]}>
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm mã đơn (#ORD...), số bàn hoặc tên khách..."
            leftIcon={<Search size={16} color={theme.colors.outline} />}
            containerStyle={styles.searchBox}
          />
          <PermissionGate permission="ORDER_CREATE">
            <Button
              label="Tạo đơn mới"
              variant="primary"
              size="md"
              leftIcon={<Plus size={16} color={theme.colors.onPrimary} />}
              onPress={() => setCreateOpen(true)}
            />
          </PermissionGate>
        </View>

        <SegmentedTabs<OrderStatus | 'ALL'>
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { key: 'ALL', label: 'Tất cả', count: counts.ALL },
            { key: 'PENDING', label: 'Chờ duyệt', count: counts.PENDING },
            { key: 'CONFIRMED', label: 'Đã nhận' },
            { key: 'COOKING', label: 'Đang nấu' },
            { key: 'READY', label: 'Sẵn sàng' },
            { key: 'COMPLETED', label: 'Hoàn tất' },
            { key: 'CANCELLED', label: 'Đã hủy' },
          ]}
        />
      </Card>

      {orders.length === 0 ? (
        <EmptyState
          title="Chưa có đơn hàng phù hợp"
          description="Thay đổi bộ lọc hoặc tạo đơn hàng mới để bắt đầu phục vụ."
          actionLabel="Xem tất cả đơn"
          onAction={() => {
            setStatusFilter('ALL');
            setSearch('');
          }}
        />
      ) : (
        <View style={[styles.workspace, isDesktop ? styles.rowStart : styles.col]}>
          {/* Left Queue */}
          <View style={styles.queueCol}>
            {orders.map((ord) => {
              const active = selectedOrder?.id === ord.id;
              return (
                <Pressable
                  key={ord.id}
                  onPress={() => setSelectedOrderId(ord.id)}
                  style={[
                    styles.orderCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: active ? theme.colors.secondary : theme.colors.border,
                      borderWidth: active ? 1.5 : 1,
                      borderRadius: theme.radius.lg,
                    },
                  ]}
                >
                  <View style={styles.orderCardTop}>
                    <View style={styles.rowGap}>
                      <Text
                        style={[
                          styles.orderNum,
                          { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                        ]}
                      >
                        {ord.orderNumber}
                      </Text>
                      <Badge label={ord.tableNumber} tone="neutral" mono />
                    </View>
                    <OrderStatusBadge status={ord.status} />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={[styles.guestLine, { color: theme.colors.onSurfaceVariant }]}
                  >
                    {ord.guestName} · {ord.guestCount} khách · {ord.items.length} món
                  </Text>

                  <View style={styles.orderCardFoot}>
                    <Text
                      style={[
                        styles.timeText,
                        { color: theme.colors.outline, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {formatTime(ord.createdAt)}
                    </Text>
                    <View style={styles.rowGap}>
                      <Badge
                        label={ord.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thu tiền'}
                        tone={ord.paymentStatus === 'PAID' ? 'success' : 'warning'}
                      />
                      <Text
                        style={[
                          styles.totalNum,
                          { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                        ]}
                      >
                        {formatVND(ord.totalAmount)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Right Order Detail Panel */}
          {selectedOrder ? (
            <Card padding="md" style={styles.detailCol}>
              <View style={styles.detailHeader}>
                <View style={styles.detailTitleWrap}>
                  <View style={styles.rowGap}>
                    <Text
                      style={[
                        styles.detailNum,
                        { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {selectedOrder.orderNumber}
                    </Text>
                    <Badge label={selectedOrder.tableNumber} tone="info" mono />
                    <OrderStatusBadge status={selectedOrder.status} />
                  </View>
                  <Text style={[styles.detailSub, { color: theme.colors.onSurfaceVariant }]}>
                    {selectedOrder.guestName} ({selectedOrder.guestCount} khách) · NV:{' '}
                    {selectedOrder.staffName}
                  </Text>
                </View>

                <Badge
                  label={
                    selectedOrder.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'
                  }
                  tone={selectedOrder.paymentStatus === 'PAID' ? 'success' : 'warning'}
                />
              </View>

              {/* Action Toolbar gated by RBAC */}
              <View style={styles.actionBar}>
                {selectedOrder.status === 'PENDING' ? (
                  <>
                    <PermissionGate permission="ORDER_ACCEPT">
                      <Button
                        label="Tiếp nhận đơn"
                        variant="primary"
                        size="sm"
                        loading={mutating}
                        leftIcon={<Check size={15} color={theme.colors.onPrimary} />}
                        onPress={async () => {
                          try {
                            await acceptOrder(selectedOrder.id);
                            showToast('Đã tiếp nhận & chuyển bếp KDS', 'success');
                          } catch (err) {
                            showToast(
                              'Không thể tiếp nhận',
                              'error',
                              err instanceof Error ? err.message : undefined
                            );
                          }
                        }}
                      />
                    </PermissionGate>
                    <PermissionGate permission="ORDER_REJECT">
                      <Button
                        label="Từ chối"
                        variant="danger"
                        size="sm"
                        leftIcon={<X size={15} color={theme.colors.onErrorContainer} />}
                        onPress={() => setReasonModal('REJECT')}
                      />
                    </PermissionGate>
                  </>
                ) : null}

                {!isTerminal ? (
                  <>
                    <PermissionGate permission="ORDER_ADD_ITEM">
                      <Button
                        label="Gọi thêm món"
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus size={15} color={theme.colors.onSurface} />}
                        onPress={() => setAddItemOpen(true)}
                      />
                    </PermissionGate>

                    {selectedOrder.status === 'CONFIRMED' ? (
                      <PermissionGate permission="ORDER_UPDATE_STATUS">
                        <Button
                          label="Chuyển Đang nấu"
                          variant="secondary"
                          size="sm"
                          leftIcon={<ChefHat size={15} color={theme.colors.secondary} />}
                          onPress={() =>
                            void updateOrderStatus(
                              selectedOrder.id,
                              'COOKING',
                              'Nhân viên xác nhận bếp đang chế biến'
                            )
                          }
                        />
                      </PermissionGate>
                    ) : null}

                    {selectedOrder.status === 'COOKING' ? (
                      <PermissionGate permission="ORDER_UPDATE_STATUS">
                        <Button
                          label="Báo Sẵn sàng"
                          variant="secondary"
                          size="sm"
                          leftIcon={<UtensilsCrossed size={15} color={theme.colors.success} />}
                          onPress={() =>
                            void updateOrderStatus(
                              selectedOrder.id,
                              'READY',
                              'Món đã hoàn tất, sẵn sàng lên bàn'
                            )
                          }
                        />
                      </PermissionGate>
                    ) : null}

                    <PermissionGate permission="ORDER_CANCEL">
                      <Button
                        label="Hủy đơn"
                        variant="danger"
                        size="sm"
                        leftIcon={<Ban size={15} color={theme.colors.onErrorContainer} />}
                        onPress={() => setReasonModal('CANCEL')}
                      />
                    </PermissionGate>
                  </>
                ) : null}
              </View>

              {selectedOrder.paymentStatus === 'UNPAID' ? (
                <PermissionGate permission="ORDER_PAYMENT">
                  <Button
                    label="Thu tiền & Hoàn tất"
                    variant="success"
                    size="sm"
                    leftIcon={<CreditCard size={15} color={theme.colors.onSuccess} />}
                    onPress={() => setPaymentOpen(true)}
                  />
                </PermissionGate>
              ) : null}

              {selectedOrder.cancelReason ? (
                <View
                  style={[
                    styles.reasonBanner,
                    { backgroundColor: theme.colors.errorContainer, borderRadius: theme.radius.md },
                  ]}
                >
                  <Text style={[styles.reasonText, { color: theme.colors.onErrorContainer }]}>
                    Lý do: {selectedOrder.cancelReason}
                  </Text>
                </View>
              ) : null}

              {/* Items Table */}
              <View style={styles.sectionBlock}>
                <Text style={[styles.blockTitle, { color: theme.colors.onSurface }]}>
                  Chi tiết món gọi ({selectedOrder.items.length})
                </Text>
                <View style={styles.itemsList}>
                  {selectedOrder.items.map((item) => {
                    const kBadge = KITCHEN_ITEM_BADGE[item.kitchenStatus];
                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.itemRow,
                          {
                            backgroundColor: theme.colors.surfaceLow,
                            borderRadius: theme.radius.md,
                          },
                        ]}
                      >
                        <View style={styles.itemLeft}>
                          <Text
                            style={[
                              styles.itemQty,
                              { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                            ]}
                          >
                            {item.quantity}x
                          </Text>
                          <View style={styles.itemInfo}>
                            <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>
                              {item.menuItemName}
                            </Text>
                            {item.modifiers.length > 0 ? (
                              <Text style={[styles.itemSub, { color: theme.colors.secondary }]}>
                                {item.modifiers.join(' · ')}
                              </Text>
                            ) : null}
                            {item.note ? (
                              <Text style={[styles.itemSub, { color: theme.colors.warning }]}>
                                Ghi chú: {item.note}
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        <View style={styles.itemRight}>
                          <Badge label={kBadge.label} tone={kBadge.tone} />
                          <Text
                            style={[
                              styles.itemPrice,
                              { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                            ]}
                          >
                            {formatVND(item.unitPrice * item.quantity)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Financials */}
              <View style={[styles.totalsCard, { borderColor: theme.colors.border }]}>
                <View style={styles.totalLine}>
                  <Text style={[styles.totalKey, { color: theme.colors.onSurfaceVariant }]}>
                    Tạm tính món
                  </Text>
                  <Text
                    style={[
                      styles.totalVal,
                      { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {formatVND(selectedOrder.subtotal)}
                  </Text>
                </View>
                <View style={styles.totalLine}>
                  <Text style={[styles.totalKey, { color: theme.colors.onSurfaceVariant }]}>
                    Phí phục vụ (5%)
                  </Text>
                  <Text
                    style={[
                      styles.totalVal,
                      { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {formatVND(selectedOrder.serviceFee)}
                  </Text>
                </View>
                <View style={styles.totalLine}>
                  <Text style={[styles.totalKey, { color: theme.colors.onSurfaceVariant }]}>
                    Thuế VAT (8%)
                  </Text>
                  <Text
                    style={[
                      styles.totalVal,
                      { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {formatVND(selectedOrder.taxAmount)}
                  </Text>
                </View>
                <View style={[styles.totalLine, styles.grandLine]}>
                  <Text style={[styles.grandKey, { color: theme.colors.onSurface }]}>
                    Tổng thanh toán
                  </Text>
                  <Text
                    style={[
                      styles.grandVal,
                      { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {formatVND(selectedOrder.totalAmount)}
                  </Text>
                </View>
              </View>

              {/* History Timeline */}
              <View style={styles.sectionBlock}>
                <View style={styles.rowGap}>
                  <History size={16} color={theme.colors.onSurfaceVariant} />
                  <Text style={[styles.blockTitle, { color: theme.colors.onSurface }]}>
                    Lịch sử trạng thái đơn hàng
                  </Text>
                </View>
                <View style={styles.timeline}>
                  {selectedOrder.history.map((entry) => (
                    <View
                      key={entry.id}
                      style={[styles.timelineRow, { borderLeftColor: theme.colors.secondary }]}
                    >
                      <View style={styles.timelineTop}>
                        <OrderStatusBadge status={entry.status} />
                        <Text
                          style={[
                            styles.timelineTime,
                            { color: theme.colors.outline, fontFamily: theme.typography.mono },
                          ]}
                        >
                          {formatDateTime(entry.timestamp)}
                        </Text>
                      </View>
                      <Text style={[styles.timelineNote, { color: theme.colors.onSurface }]}>
                        {entry.note}
                      </Text>
                      <Text style={[styles.timelineActor, { color: theme.colors.onSurfaceVariant }]}>
                        Thực hiện: {entry.actorName}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>
          ) : null}
        </View>
      )}

      {selectedOrder ? (
        <>
          <OrderReasonModal
            visible={reasonModal !== null}
            mode={reasonModal || 'CANCEL'}
            orderNumber={selectedOrder.orderNumber}
            loading={mutating}
            onClose={() => setReasonModal(null)}
            onConfirm={async (reason) => {
              if (reasonModal === 'REJECT') {
                await rejectOrder(selectedOrder.id, reason);
                showToast('Đã từ chối đơn hàng', 'warning', selectedOrder.orderNumber);
              } else {
                await cancelOrder(selectedOrder.id, reason);
                showToast('Đã hủy đơn hàng', 'warning', selectedOrder.orderNumber);
              }
            }}
          />

          <AddOrderItemModal
            visible={addItemOpen}
            orderNumber={selectedOrder.orderNumber}
            availableItems={availableMenuItems}
            loading={mutating}
            onClose={() => setAddItemOpen(false)}
            onSubmit={async (input) => {
              await addOrderItem(selectedOrder.id, input);
              showToast('Đã thêm món vào đơn', 'success', selectedOrder.orderNumber);
            }}
          />

          <PaymentModal
            visible={paymentOpen}
            orderNumber={selectedOrder.orderNumber}
            totalAmount={selectedOrder.totalAmount}
            loading={mutating}
            onClose={() => setPaymentOpen(false)}
            onConfirm={async (method) => {
              await recordPayment(selectedOrder.id, method);
              showToast('Đã ghi nhận thanh toán', 'success', selectedOrder.orderNumber);
            }}
          />
        </>
      ) : null}

      <CreateOrderModal
        visible={createOpen}
        availableItems={availableMenuItems}
        loading={mutating}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (input) => {
          const created = await createOrder(input);
          setSelectedOrderId(created.id);
          showToast('Đã tạo đơn hàng mới', 'success', created.orderNumber);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  padded: {
    padding: 16,
  },
  container: {
    padding: 16,
    gap: 14,
    paddingBottom: 36,
  },
  kpiStrip: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  col: {
    flexDirection: 'column',
  },
  kpiCard: {
    flex: 1,
  },
  filterCard: {
    gap: 10,
  },
  filterTop: {
    gap: 10,
  },
  searchBox: {
    flex: 1,
    minWidth: 220,
  },
  workspace: {
    gap: 14,
  },
  queueCol: {
    flex: 1,
    gap: 10,
  },
  orderCard: {
    padding: 12,
    gap: 8,
  },
  orderCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderNum: {
    fontSize: 14,
    fontWeight: '700',
  },
  guestLine: {
    fontSize: 12,
  },
  orderCardFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  timeText: {
    fontSize: 11,
  },
  totalNum: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailCol: {
    flex: 1.35,
    gap: 14,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
  },
  detailTitleWrap: {
    gap: 4,
    flex: 1,
  },
  detailNum: {
    fontSize: 18,
    fontWeight: '700',
  },
  detailSub: {
    fontSize: 12,
  },
  actionBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonBanner: {
    padding: 10,
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionBlock: {
    gap: 8,
  },
  blockTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemQty: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 26,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemSub: {
    fontSize: 11,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  totalsCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalKey: {
    fontSize: 12,
  },
  totalVal: {
    fontSize: 12,
    fontWeight: '600',
  },
  grandLine: {
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148,163,184,0.25)',
  },
  grandKey: {
    fontSize: 14,
    fontWeight: '700',
  },
  grandVal: {
    fontSize: 16,
    fontWeight: '700',
  },
  timeline: {
    gap: 10,
  },
  timelineRow: {
    borderLeftWidth: 2,
    paddingLeft: 10,
    gap: 3,
  },
  timelineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTime: {
    fontSize: 11,
  },
  timelineNote: {
    fontSize: 12,
    fontWeight: '500',
  },
  timelineActor: {
    fontSize: 11,
  },
});
