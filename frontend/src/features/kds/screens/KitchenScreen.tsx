import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  RefreshCw,
  RotateCcw,
} from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useToast } from '@/src/contexts/ToastContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { formatElapsed, getElapsedMinutes } from '@/src/utils/formatters';
import { useKds } from '@/src/features/kds/hooks/useKds';
import type { KitchenStation } from '@/src/types/common';
import type { KdsItem, KdsItemStatus } from '@/src/features/kds/types/kds.types';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { SegmentedTabs } from '@/src/components/common/SegmentedTabs';
import { PermissionGate } from '@/src/components/common/PermissionGate';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/common/StateViews';

const ITEM_STATUS_META: Record<
  KdsItemStatus,
  { label: string; tone: 'neutral' | 'info' | 'warning' | 'success' | 'danger' }
> = {
  QUEUED: { label: 'Chờ nhận', tone: 'neutral' },
  ACCEPTED: { label: 'Đã nhận', tone: 'info' },
  COOKING: { label: 'Đang nấu', tone: 'warning' },
  COMPLETED: { label: 'Đã xong', tone: 'success' },
  VOIDED: { label: 'Đã hủy', tone: 'danger' },
};

const STATION_LABELS: Record<KitchenStation, string> = {
  HOT_KITCHEN: 'Bếp Nóng',
  COLD_KITCHEN: 'Bếp Nguội',
  BAR: 'Quầy Bar',
};

export function KitchenScreen() {
  const { theme } = useTheme();
  const { isMobile } = useResponsive();
  const { showToast } = useToast();
  const { hasPermission } = useAuth();
  const {
    tickets,
    counts,
    nowMs,
    loading,
    mutating,
    error,
    stationFilter,
    setStationFilter,
    statusFilter,
    setStatusFilter,
    urgentOnly,
    setUrgentOnly,
    autoRefresh,
    setAutoRefresh,
    reload,
    updateItemStatus,
    bumpTicket,
    recallLast,
  } = useKds();

  const advanceItem = async (item: KdsItem) => {
    let next: KdsItemStatus | null = null;
    if (item.status === 'QUEUED' && hasPermission('KDS_ACCEPT_ITEM')) {
      next = 'ACCEPTED';
    } else if (item.status === 'ACCEPTED' && hasPermission('KDS_START_COOKING')) {
      next = 'COOKING';
    } else if (item.status === 'COOKING' && hasPermission('KDS_COMPLETE_ITEM')) {
      next = 'COMPLETED';
    }

    if (!next) return;
    try {
      await updateItemStatus(item.id, next);
      showToast(`Đã chuyển trạng thái món`, 'success', `${item.menuItemName} → ${ITEM_STATUS_META[next].label}`);
    } catch (err) {
      showToast('Lỗi cập nhật món', 'error', err instanceof Error ? err.message : undefined);
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <View style={styles.padded}>
        <LoadingState message="Đang kết nối màn hình điều phối bếp KDS..." />
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

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      {/* Top Station Bar & Controls */}
      <Card padding="md" style={styles.toolbarCard}>
        <View style={styles.toolbarTop}>
          <SegmentedTabs<KitchenStation | 'ALL'>
            value={stationFilter}
            onChange={setStationFilter}
            options={[
              { key: 'ALL', label: 'Tất cả bếp', count: counts.ALL },
              { key: 'HOT_KITCHEN', label: 'Bếp Nóng', count: counts.HOT_KITCHEN },
              { key: 'COLD_KITCHEN', label: 'Bếp Nguội', count: counts.COLD_KITCHEN },
              { key: 'BAR', label: 'Quầy Bar', count: counts.BAR },
            ]}
          />

          <View style={styles.controlActions}>
            <View style={styles.syncToggle}>
              <Text style={[styles.syncLabel, { color: theme.colors.onSurfaceVariant }]}>
                Tự động đồng bộ
              </Text>
              <Switch value={autoRefresh} onValueChange={setAutoRefresh} />
            </View>
            <Button
              label="Làm mới"
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw size={14} color={theme.colors.onSurface} />}
              onPress={() => void reload()}
            />
            <PermissionGate permission="KDS_BUMP_TICKET">
              <Button
                label="Hoàn tác (Recall)"
                variant="secondary"
                size="sm"
                loading={mutating}
                leftIcon={<RotateCcw size={14} color={theme.colors.onSurface} />}
                onPress={async () => {
                  const recalled = await recallLast();
                  if (recalled) {
                    showToast('Đã gọi lại món vừa xong', 'info', recalled.menuItemName);
                  } else {
                    showToast('Không có món đã xong để hoàn tác', 'warning');
                  }
                }}
              />
            </PermissionGate>
          </View>
        </View>

        <View style={styles.toolbarBottom}>
          <SegmentedTabs<KdsItemStatus | 'ALL'>
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { key: 'ALL', label: 'Đang xử lý', count: counts.ALL },
              { key: 'QUEUED', label: 'Chờ nhận', count: counts.QUEUED },
              { key: 'ACCEPTED', label: 'Đã nhận', count: counts.ACCEPTED },
              { key: 'COOKING', label: 'Đang nấu', count: counts.COOKING },
              { key: 'COMPLETED', label: 'Đã xong', count: counts.COMPLETED },
            ]}
          />

          <Pressable
            onPress={() => setUrgentOnly((v) => !v)}
            style={[
              styles.urgentChip,
              {
                backgroundColor: urgentOnly
                  ? theme.colors.errorContainer
                  : theme.colors.surfaceLow,
                borderColor: urgentOnly ? theme.colors.error : theme.colors.border,
                borderRadius: theme.radius.md,
              },
            ]}
          >
            <AlertTriangle
              size={14}
              color={urgentOnly ? theme.colors.error : theme.colors.warning}
            />
            <Text
              style={[
                styles.urgentText,
                {
                  color: urgentOnly ? theme.colors.onErrorContainer : theme.colors.onSurface,
                },
              ]}
            >
              Trễ SLA ({counts.OVERDUE})
            </Text>
          </Pressable>
        </View>
      </Card>

      {/* Tickets Grid */}
      {tickets.length === 0 ? (
        <EmptyState
          title="Hàng đợi bếp hiện đang trống"
          description="Không có món nào đang chờ chế biến theo bộ lọc hiện tại."
          actionLabel="Hiển thị tất cả món"
          onAction={() => {
            setStationFilter('ALL');
            setStatusFilter('ALL');
            setUrgentOnly(false);
          }}
        />
      ) : (
        <View style={[styles.ticketGrid, isMobile ? styles.gridSingle : styles.gridMulti]}>
          {tickets.map((ticket) => {
            const elapsedMin = getElapsedMinutes(ticket.createdAt, nowMs);
            const isLate = elapsedMin >= ticket.slaMinutes;
            const headerBg = isLate
              ? theme.colors.error
              : ticket.items.some((i) => i.status === 'COOKING')
                ? theme.colors.secondary
                : theme.colors.primary;
            const headerFg = '#ffffff';

            return (
              <View
                key={ticket.orderId}
                style={[
                  styles.ticketCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: isLate ? theme.colors.error : theme.colors.border,
                    borderRadius: theme.radius.lg,
                    minWidth: isMobile ? '100%' : 300,
                  },
                ]}
              >
                {/* Ticket Header */}
                <View style={[styles.ticketHeader, { backgroundColor: headerBg }]}>
                  <View style={styles.ticketTitleLeft}>
                    <Text
                      style={[
                        styles.ticketOrderNum,
                        { color: headerFg, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {ticket.orderNumber}
                    </Text>
                    <View style={styles.tableTag}>
                      <Text
                        style={[
                          styles.tableTagText,
                          { color: headerFg, fontFamily: theme.typography.mono },
                        ]}
                      >
                        {ticket.tableNumber}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.clockBadge}>
                    <Clock size={13} color={headerFg} />
                    <Text
                      style={[
                        styles.clockText,
                        { color: headerFg, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {formatElapsed(ticket.createdAt, nowMs)}
                    </Text>
                  </View>
                </View>

                {/* SLA Alert strip */}
                <View
                  style={[
                    styles.slaStrip,
                    {
                      backgroundColor: isLate
                        ? theme.colors.errorContainer
                        : theme.colors.surfaceLow,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.slaText,
                      {
                        color: isLate
                          ? theme.colors.onErrorContainer
                          : theme.colors.onSurfaceVariant,
                      },
                    ]}
                  >
                    {ticket.orderType === 'DINE_IN' ? 'Tại bàn' : 'Mang về'} · SLA{' '}
                    {ticket.slaMinutes} phút
                  </Text>
                  {isLate ? (
                    <Badge
                      label={`Quá ${Math.max(1, elapsedMin - ticket.slaMinutes)} phút`}
                      tone="danger"
                      mono
                    />
                  ) : null}
                </View>

                {/* Ticket Items */}
                <View style={styles.ticketBody}>
                  {ticket.items.map((item) => {
                    const statusMeta = ITEM_STATUS_META[item.status];
                    const actionLabel =
                      item.status === 'QUEUED'
                        ? 'Tiếp nhận'
                        : item.status === 'ACCEPTED'
                          ? 'Bắt đầu nấu'
                          : item.status === 'COOKING'
                            ? 'Hoàn thành'
                            : null;

                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.kdsItemRow,
                          {
                            backgroundColor: theme.colors.surfaceLow,
                            borderRadius: theme.radius.md,
                          },
                        ]}
                      >
                        <View style={styles.itemTopLine}>
                          <Text
                            style={[
                              styles.itemQty,
                              { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                            ]}
                          >
                            {item.quantity}x
                          </Text>
                          <View style={styles.itemTextCol}>
                            <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>
                              {item.menuItemName}
                            </Text>
                            <Text style={[styles.stationMeta, { color: theme.colors.outline }]}>
                              {STATION_LABELS[item.station]}
                            </Text>
                          </View>
                          <Badge label={statusMeta.label} tone={statusMeta.tone} />
                        </View>

                        {item.modifiers.length > 0 ? (
                          <View
                            style={[
                              styles.noteChip,
                              { backgroundColor: theme.colors.warningContainer },
                            ]}
                          >
                            <Text
                              style={[
                                styles.noteChipText,
                                { color: theme.colors.onWarningContainer },
                              ]}
                            >
                              {item.modifiers.join(' · ')}
                            </Text>
                          </View>
                        ) : null}

                        {item.note ? (
                          <Text style={[styles.itemNote, { color: theme.colors.error }]}>
                            Lưu ý: {item.note}
                          </Text>
                        ) : null}

                        {actionLabel ? (
                          <View style={styles.itemActionRow}>
                            <Button
                              label={actionLabel}
                              size="sm"
                              variant={
                                item.status === 'COOKING'
                                  ? 'success'
                                  : item.status === 'ACCEPTED'
                                    ? 'primary'
                                    : 'secondary'
                              }
                              loading={mutating}
                              leftIcon={
                                item.status === 'QUEUED' ? (
                                  <Check size={13} color={theme.colors.onSurface} />
                                ) : item.status === 'ACCEPTED' ? (
                                  <Flame size={13} color={theme.colors.onPrimary} />
                                ) : (
                                  <CheckCircle2 size={13} color={theme.colors.onSuccess} />
                                )
                              }
                              onPress={() => void advanceItem(item)}
                            />
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>

                {/* Ticket Footer: Bump Ticket */}
                {ticket.items.some((i) => i.status !== 'COMPLETED') ? (
                  <PermissionGate permission="KDS_BUMP_TICKET">
                    <View style={[styles.ticketFooter, { borderTopColor: theme.colors.border }]}>
                      <Button
                        label="Báo xong vé bếp (Bump)"
                        variant="primary"
                        fullWidth
                        loading={mutating}
                        leftIcon={<Play size={14} color={theme.colors.onPrimary} />}
                        onPress={async () => {
                          await bumpTicket(ticket.orderId);
                          showToast('Đã hoàn tất vé bếp', 'success', ticket.orderNumber);
                        }}
                      />
                    </View>
                  </PermissionGate>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
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
  toolbarCard: {
    gap: 10,
  },
  toolbarTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  controlActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  syncToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  toolbarBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  urgentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ticketGrid: {
    gap: 12,
  },
  gridSingle: {
    flexDirection: 'column',
  },
  gridMulti: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  ticketCard: {
    flex: 1,
    maxWidth: 420,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  ticketHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  ticketTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketOrderNum: {
    fontSize: 15,
    fontWeight: '700',
  },
  tableTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tableTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  clockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clockText: {
    fontSize: 13,
    fontWeight: '700',
  },
  slaStrip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ticketBody: {
    padding: 12,
    gap: 8,
  },
  kdsItemRow: {
    padding: 10,
    gap: 6,
  },
  itemTopLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemQty: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 26,
  },
  itemTextCol: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
  },
  stationMeta: {
    fontSize: 11,
  },
  noteChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  noteChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemNote: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  ticketFooter: {
    padding: 12,
    borderTopWidth: 1,
  },
});
