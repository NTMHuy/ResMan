import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  AlertTriangle,
  ArrowDownToLine,
  ClipboardCheck,
  Edit3,
  Package,
  Plus,
  Search,
} from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useToast } from '@/src/contexts/ToastContext';
import { formatDateTime } from '@/src/utils/formatters';
import { useInventory } from '@/src/features/inventory/hooks/useInventory';
import type {
  Ingredient,
  StockMovementType,
  StockStatus,
  StorageZone,
} from '@/src/features/inventory/types/inventory.types';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { StatCard } from '@/src/components/common/StatCard';
import { SegmentedTabs } from '@/src/components/common/SegmentedTabs';
import { PermissionGate } from '@/src/components/common/PermissionGate';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/common/StateViews';
import {
  IngredientFormModal,
  StockOperationModal,
  type StockModalMode,
} from '@/src/features/inventory/components/InventoryModals';

type InventoryTab = 'ITEMS' | 'LEDGER' | 'COUNTS';

const STOCK_STATUS_META: Record<
  StockStatus,
  { label: string; tone: 'success' | 'warning' | 'danger' }
> = {
  IN_STOCK: { label: 'Đủ hàng', tone: 'success' },
  LOW_STOCK: { label: 'Sắp hết', tone: 'warning' },
  OUT_OF_STOCK: { label: 'Hết hàng', tone: 'danger' },
};

const ZONE_LABELS: Record<StorageZone, string> = {
  HOT_KITCHEN_COLD: 'Kho lạnh Bếp Nóng',
  MAIN_COOLER: 'Kho mát Tổng',
  BAR_PANTRY: 'Kho Quầy Bar',
};

const MOVEMENT_BADGE: Record<
  StockMovementType,
  { label: string; tone: 'success' | 'info' | 'warning' | 'neutral' }
> = {
  IMPORT: { label: 'Nhập kho', tone: 'success' },
  EXPORT: { label: 'Xuất kho', tone: 'info' },
  ADJUST: { label: 'Điều chỉnh', tone: 'warning' },
  AUDIT: { label: 'Kiểm kê', tone: 'neutral' },
};

export function InventoryScreen() {
  const { theme } = useTheme();
  const { isMobile } = useResponsive();
  const { showToast } = useToast();
  const {
    ingredients,
    movements,
    counts,
    summary,
    loading,
    mutating,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    zoneFilter,
    setZoneFilter,
    reload,
    createIngredient,
    updateIngredient,
    stockIn,
    countStock,
  } = useInventory();

  const [activeTab, setActiveTab] = useState<InventoryTab>('ITEMS');
  const [formOpen, setFormOpen] = useState(false);
  const [editingIng, setEditingIng] = useState<Ingredient | null>(null);
  const [opModal, setOpModal] = useState<{ mode: StockModalMode; ing: Ingredient } | null>(null);

  if (loading && ingredients.length === 0) {
    return (
      <View style={styles.padded}>
        <LoadingState message="Đang tải dữ liệu tồn kho nguyên liệu..." />
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
      {/* KPI Cards */}
      <View style={[styles.kpiStrip, isMobile ? styles.col : styles.row]}>
        <StatCard
          label="Tổng mã nguyên liệu"
          value={String(summary.total)}
          helper={`${summary.inStock} mã đủ định mức`}
          icon={<Package size={17} color={theme.colors.secondary} />}
          style={styles.kpiCard}
        />
        <StatCard
          label="Cảnh báo tồn kho"
          value={String(summary.alertCount)}
          helper={`${summary.outOfStock} hết hàng · ${summary.lowStock} sắp hết`}
          accentColor={
            summary.outOfStock > 0
              ? theme.colors.error
              : summary.lowStock > 0
                ? theme.colors.warning
                : theme.colors.success
          }
          icon={<AlertTriangle size={17} color={theme.colors.warning} />}
          iconBg={theme.colors.warningContainer}
          style={styles.kpiCard}
        />
      </View>

      {/* Alert Banner if any item is low or out */}
      {summary.alertCount > 0 ? (
        <View
          style={[
            styles.alertBanner,
            {
              backgroundColor: theme.colors.warningContainer,
              borderColor: theme.colors.warning,
              borderRadius: theme.radius.lg,
            },
          ]}
        >
          <AlertTriangle size={18} color={theme.colors.onWarningContainer} />
          <Text style={[styles.alertBannerText, { color: theme.colors.onWarningContainer }]}>
            Có {summary.outOfStock} nguyên liệu đã hết hàng và {summary.lowStock} nguyên liệu dưới định mức tối thiểu.
          </Text>
        </View>
      ) : null}

      {/* Top Controls */}
      <Card padding="md" style={styles.filterCard}>
        <View style={[styles.filterTop, isMobile ? styles.col : styles.row]}>
          <SegmentedTabs<InventoryTab>
            value={activeTab}
            onChange={setActiveTab}
            options={[
              { key: 'ITEMS', label: 'Danh sách nguyên liệu', count: summary.total },
              { key: 'LEDGER', label: 'Lịch sử nhập / xuất', count: movements.length },
              { key: 'COUNTS', label: 'Lịch sử kiểm kê', count: counts.length },
            ]}
          />

          <PermissionGate permission="INVENTORY_CREATE">
            <Button
              label="Thêm nguyên liệu"
              variant="primary"
              size="sm"
              leftIcon={<Plus size={15} color={theme.colors.onPrimary} />}
              onPress={() => {
                setEditingIng(null);
                setFormOpen(true);
              }}
            />
          </PermissionGate>
        </View>

        {activeTab === 'ITEMS' ? (
          <>
            <View style={[styles.filterTop, isMobile ? styles.col : styles.row]}>
              <Input
                value={search}
                onChangeText={setSearch}
                placeholder="Tìm tên hoặc mã nguyên liệu..."
                leftIcon={<Search size={16} color={theme.colors.outline} />}
                containerStyle={styles.searchBox}
              />
              <SegmentedTabs<StockStatus | 'ALL'>
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { key: 'ALL', label: 'Tất cả' },
                  { key: 'OUT_OF_STOCK', label: 'Hết hàng' },
                  { key: 'LOW_STOCK', label: 'Sắp hết' },
                  { key: 'IN_STOCK', label: 'Đủ hàng' },
                ]}
              />
            </View>

            <SegmentedTabs<StorageZone | 'ALL'>
              value={zoneFilter}
              onChange={setZoneFilter}
              options={[
                { key: 'ALL', label: 'Tất cả kho' },
                { key: 'HOT_KITCHEN_COLD', label: 'Kho lạnh Bếp Nóng' },
                { key: 'MAIN_COOLER', label: 'Kho mát Tổng' },
                { key: 'BAR_PANTRY', label: 'Kho Quầy Bar' },
              ]}
            />
          </>
        ) : null}
      </Card>

      {/* Main Content */}
      {activeTab === 'ITEMS' ? (
        ingredients.length === 0 ? (
          <EmptyState
            title="Không tìm thấy nguyên liệu"
            description="Thử thay đổi bộ lọc khu vực kho hoặc từ khóa tìm kiếm."
            actionLabel="Đặt lại bộ lọc"
            onAction={() => {
              setSearch('');
              setStatusFilter('ALL');
              setZoneFilter('ALL');
            }}
          />
        ) : (
          <View style={styles.list}>
            {ingredients.map((ing) => {
              const badge = STOCK_STATUS_META[ing.status];
              return (
                <Card key={ing.id} padding="md" style={styles.ingCard}>
                  <View style={styles.ingTop}>
                    <View style={styles.ingTitleWrap}>
                      <View style={styles.rowGap}>
                        <Text
                          style={[
                            styles.ingName,
                            { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                          ]}
                        >
                          {ing.name}
                        </Text>
                        <Badge label={badge.label} tone={badge.tone} />
                      </View>
                      <Text style={[styles.ingMeta, { color: theme.colors.onSurfaceVariant }]}>
                        {ing.sku} · {ZONE_LABELS[ing.zone]}
                      </Text>
                    </View>

                    <View style={styles.stockBox}>
                      <Text
                        style={[
                          styles.stockQty,
                          {
                            color:
                              ing.status === 'OUT_OF_STOCK'
                                ? theme.colors.error
                                : ing.status === 'LOW_STOCK'
                                  ? theme.colors.warning
                                  : theme.colors.onSurface,
                            fontFamily: theme.typography.mono,
                          },
                        ]}
                      >
                        {ing.currentStock} {ing.unit}
                      </Text>
                      <Text style={[styles.thresholdText, { color: theme.colors.outline }]}>
                        Tối thiểu: {ing.minThreshold} {ing.unit}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.ingFoot, { borderTopColor: theme.colors.border }]}>
                    <View style={styles.actionRow}>
                      <PermissionGate permission="INVENTORY_STOCK_IN">
                        <Button
                          label="Nhập kho"
                          size="sm"
                          variant="primary"
                          leftIcon={<ArrowDownToLine size={14} color={theme.colors.onPrimary} />}
                          onPress={() => setOpModal({ mode: 'IMPORT', ing })}
                        />
                      </PermissionGate>
<PermissionGate permission="INVENTORY_AUDIT">
                        <Button
                          label="Kiểm kê"
                          size="sm"
                          variant="secondary"
                          leftIcon={<ClipboardCheck size={14} color={theme.colors.secondary} />}
                          onPress={() => setOpModal({ mode: 'COUNT', ing })}
                        />
                      </PermissionGate>
                      <PermissionGate permission="INVENTORY_UPDATE">
                        <Pressable
                          onPress={() => {
                            setEditingIng(ing);
                            setFormOpen(true);
                          }}
                          style={[styles.editBtn, { backgroundColor: theme.colors.surfaceLow }]}
                        >
                          <Edit3 size={15} color={theme.colors.secondary} />
                        </Pressable>
                      </PermissionGate>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )
      ) : activeTab === 'LEDGER' ? (
        movements.length === 0 ? (
          <EmptyState
            title="Chưa có lịch sử giao dịch kho"
            description="Lịch sử nhập kho và các chênh lệch được ghi nhận tại đây."
          />
        ) : (
          <View style={styles.list}>
            {movements.map((mov) => {
              const b = MOVEMENT_BADGE[mov.type];
              const deltaText =
                mov.quantityDelta > 0 ? `+${mov.quantityDelta}` : `${mov.quantityDelta}`;
              return (
                <Card key={mov.id} padding="md" style={styles.movCard}>
                  <View style={styles.movTop}>
                    <View style={styles.rowGap}>
                      <Badge label={b.label} tone={b.tone} />
                      <Text style={[styles.movName, { color: theme.colors.onSurface }]}>
                        {mov.ingredientName}
                      </Text>
                      <Text
                        style={[
                          styles.movSku,
                          { color: theme.colors.outline, fontFamily: theme.typography.mono },
                        ]}
                      >
                        {mov.ingredientSku}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.movDelta,
                        {
                          color:
                            mov.quantityDelta > 0
                              ? theme.colors.success
                              : mov.quantityDelta < 0
                                ? theme.colors.error
                                : theme.colors.onSurface,
                          fontFamily: theme.typography.mono,
                        },
                      ]}
                    >
                      {deltaText} {mov.unit}
                    </Text>
                  </View>

                  <Text style={[styles.movReason, { color: theme.colors.onSurfaceVariant }]}>
                    {mov.reason}
                  </Text>
                  <Text
                    style={[
                      styles.movActor,
                      { color: theme.colors.outline, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {mov.actorName} · {formatDateTime(mov.createdAt)}
                  </Text>
                </Card>
              );
            })}
          </View>
        )
      ) : counts.length === 0 ? (
        <EmptyState
          title="Chưa có lần kiểm kê nào"
          description="Mỗi lần xác nhận số lượng thực tế sẽ được lưu tại đây để đối chiếu."
        />
      ) : (
        <View style={styles.list}>
          {counts.map((record) => (
            <Card key={record.id} padding="md" style={styles.movCard}>
              <View style={styles.movTop}>
                <View style={styles.rowGap}>
                  <Badge label={record.countType === "OPENING" ? "Đầu ca" : record.countType === "CLOSING" ? "Cuối ca" : "Kiểm kê cũ"} tone="neutral" />
                  <Text style={[styles.movName, { color: theme.colors.onSurface }]}>
                    {record.ingredientName}
                  </Text>
                </View>
                <Text style={[styles.movDelta, { color: theme.colors.onSurface, fontFamily: theme.typography.mono }]}>
                  {record.actualQuantity} {record.unit}
                </Text>
              </View>
              <Text style={[styles.movReason, { color: theme.colors.onSurfaceVariant }]}>
                Mã: {record.ingredientSku} · {record.note || 'Không có ghi chú'}
              </Text>
              <Text style={[styles.movActor, { color: theme.colors.outline, fontFamily: theme.typography.mono }]}>
                Người kiểm kê: {record.countedBy} · {formatDateTime(record.countedAt)}
              </Text>
            </Card>
          ))}
        </View>
      )}

      <IngredientFormModal
        visible={formOpen}
        editingItem={editingIng}
        loading={mutating}
        onClose={() => setFormOpen(false)}
        onCreate={async (input) => {
          await createIngredient(input);
          showToast('Đã thêm nguyên liệu mới', 'success', input.name);
        }}
        onUpdate={async (id, input) => {
          await updateIngredient(id, input);
          showToast('Đã cập nhật nguyên liệu', 'success');
        }}
      />

      <StockOperationModal
        visible={opModal !== null}
        mode={opModal?.mode || 'IMPORT'}
        ingredient={opModal?.ing || null}
        loading={mutating}
        onClose={() => setOpModal(null)}
        onSubmit={async (qty, reason, countType) => {
          if (!opModal) return;
          if (opModal.mode === 'IMPORT') {
            await stockIn(opModal.ing.id, qty, reason);
            showToast('Đã nhập kho thành công', 'success', `+${qty} ${opModal.ing.unit}`);
          } else {
            await countStock(opModal.ing.id, qty, reason, countType ?? 'CLOSING');
            showToast('Đã kiểm kê và cập nhật tồn kho', 'success', `${qty} ${opModal.ing.unit}`);
          }
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
  col: {
    flexDirection: 'column',
  },
  kpiCard: {
    flex: 1,
  },
  alertBanner: {
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  filterCard: {
    gap: 10,
  },
  filterTop: {
    gap: 10,
    justifyContent: 'space-between',
  },
  searchBox: {
    flex: 1,
    minWidth: 220,
  },
  list: {
    gap: 10,
  },
  ingCard: {
    gap: 10,
  },
  ingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  ingTitleWrap: {
    flex: 1,
    gap: 4,
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  ingName: {
    fontSize: 15,
    fontWeight: '700',
  },
  ingMeta: {
    fontSize: 12,
  },
  stockBox: {
    alignItems: 'flex-end',
    gap: 2,
  },
  stockQty: {
    fontSize: 18,
    fontWeight: '700',
  },
  thresholdText: {
    fontSize: 11,
  },
  ingFoot: {
    borderTopWidth: 1,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movCard: {
    gap: 6,
  },
  movTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  movName: {
    fontSize: 14,
    fontWeight: '700',
  },
  movSku: {
    fontSize: 11,
  },
  movDelta: {
    fontSize: 15,
    fontWeight: '700',
  },
  movReason: {
    fontSize: 12,
  },
  movActor: {
    fontSize: 11,
  },
});
