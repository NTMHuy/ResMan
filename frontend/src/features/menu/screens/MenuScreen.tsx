import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import {
  BookOpen,
  Edit3,
  FolderKanban,
  Plus,
  Search,
  Trash2,
} from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useToast } from '@/src/contexts/ToastContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { formatVND } from '@/src/utils/formatters';
import { useMenu } from '@/src/features/menu/hooks/useMenu';
import { resolveMenuImageUrl } from '@/src/constants/config';
import type {
  CreateMenuItemInput,
  DishStatus,
  MenuItem,
  UploadMenuImageInput,
} from '@/src/features/menu/types/menu.types';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { StatCard } from '@/src/components/common/StatCard';
import { SegmentedTabs } from '@/src/components/common/SegmentedTabs';
import { PermissionGate } from '@/src/components/common/PermissionGate';
import { ConfirmDialog } from '@/src/components/common/ConfirmDialog';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/common/StateViews';
import { DishFormModal } from '@/src/features/menu/components/DishFormModal';
import { CategoryManagerModal } from '@/src/features/menu/components/CategoryManagerModal';

const STATUS_BADGE: Record<DishStatus, { label: string; tone: 'success' | 'danger' | 'neutral' }> = {
  AVAILABLE: { label: 'Còn bán', tone: 'success' },
  OUT_OF_STOCK: { label: 'Hết hàng (86)', tone: 'danger' },
  INACTIVE: { label: 'Ngừng bán', tone: 'neutral' },
};

const STATION_LABEL: Record<MenuItem['station'], string> = {
  HOT_KITCHEN: 'Bếp Nóng',
  COLD_KITCHEN: 'Bếp Nguội',
  BAR: 'Quầy Bar',
};

export function MenuScreen() {
  const { theme } = useTheme();
  const { isMobile, isDesktop } = useResponsive();
  const { showToast } = useToast();
  const { hasPermission } = useAuth();
  const {
    categories,
    items,
    allItemsCount,
    loading,
    mutating,
    error,
    search,
    setSearch,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedStatus,
    setSelectedStatus,
    reload,
    createCategory,
    updateCategory,
    deleteCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemStatus,
    uploadMenuItemImage,
    deleteMenuItemImage,
  } = useMenu();

  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<MenuItem | null>(null);

  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of categories) map.set(c.id, c.name);
    return map;
  }, [categories]);

  const activePreview = useMemo(() => {
    if (selectedPreview) {
      return items.find((i) => i.id === selectedPreview.id) ?? items[0] ?? null;
    }
    return items[0] ?? null;
  }, [items, selectedPreview]);

  const handleDishSubmit = async (
    values: CreateMenuItemInput,
    editingId?: string,
    selectedImage?: UploadMenuImageInput | null,
    removeImage?: boolean,
  ) => {
    // Persist the menu item first. The image is uploaded only after we have its real backend ID.
    const savedItem = editingId
      ? await updateMenuItem(editingId, values)
      : await createMenuItem({ ...values, imageUrl: '' });

    try {
      if (selectedImage) {
        await uploadMenuItemImage(savedItem.id, selectedImage);
      } else if (editingId && removeImage) {
        await deleteMenuItemImage(savedItem.id);
      }
    } catch (error) {
      // The item itself is already saved; don't re-create it on a retry.
      showToast(
        'Đã lưu thông tin món nhưng chưa cập nhật được ảnh',
        'error',
        error instanceof Error ? error.message : 'Vui lòng mở chỉnh sửa và thử tải ảnh lại.',
      );
      return;
    }

    showToast(
      editingId ? 'Đã cập nhật món ăn' : 'Đã thêm món ăn mới',
      'success',
      values.name,
    );
  };

  const handleToggleSale = async (dish: MenuItem, isSelling: boolean) => {
    const nextStatus: DishStatus = isSelling ? 'AVAILABLE' : 'INACTIVE';
    try {
      await toggleMenuItemStatus(dish.id, nextStatus);
      showToast(
        isSelling ? 'Đã bật bán lại món ăn' : 'Đã tạm ngừng kinh doanh',
        isSelling ? 'success' : 'warning',
        dish.name
      );
    } catch (err) {
      showToast('Cập nhật trạng thái thất bại', 'error', err instanceof Error ? err.message : undefined);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMenuItem(deleteTarget.id);
      showToast('Đã xóa món ăn', 'success', deleteTarget.name);
      setDeleteTarget(null);
    } catch (err) {
      showToast('Không thể xóa món ăn', 'error', err instanceof Error ? err.message : undefined);
    }
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.padded}>
        <LoadingState message="Đang tải danh mục và thực đơn món ăn..." />
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

  const canToggle = hasPermission('MENU_TOGGLE_STATUS');

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      {/* Top KPI + Actions */}
      <View style={styles.topRow}>
        <View style={[styles.kpiStrip, isMobile ? styles.col : styles.row]}>
          <StatCard
            label="Tổng số món"
            value={String(allItemsCount.total)}
            helper={`${categories.length} danh mục`}
            icon={<BookOpen size={17} color={theme.colors.secondary} />}
            style={styles.kpiCard}
          />
          <StatCard
            label="Đang mở bán"
            value={String(allItemsCount.available)}
            accentColor={theme.colors.success}
            style={styles.kpiCard}
          />
          <StatCard
            label="Ngừng / Hết hàng"
            value={String(allItemsCount.unavailable)}
            accentColor={allItemsCount.unavailable > 0 ? theme.colors.error : theme.colors.onSurface}
            style={styles.kpiCard}
          />
        </View>

        <View style={styles.topActionButtons}>
          <PermissionGate permission="MENU_UPDATE">
            <Button
              label="Danh mục"
              variant="secondary"
              size="sm"
              leftIcon={<FolderKanban size={15} color={theme.colors.onSurface} />}
              onPress={() => setCatModalOpen(true)}
            />
          </PermissionGate>
          <PermissionGate permission="MENU_CREATE">
            <Button
              label="Thêm món ăn"
              variant="primary"
              size="sm"
              leftIcon={<Plus size={15} color={theme.colors.onPrimary} />}
              onPress={() => {
                setEditingDish(null);
                setDishModalOpen(true);
              }}
            />
          </PermissionGate>
        </View>
      </View>

      {/* Search + Category & Status Filter */}
      <Card padding="md" style={styles.filterCard}>
        <View style={[styles.filterRow, isMobile ? styles.col : styles.row]}>
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm theo tên món, mã SKU hoặc mô tả..."
            leftIcon={<Search size={16} color={theme.colors.outline} />}
            containerStyle={styles.searchBox}
          />
          <SegmentedTabs<DishStatus | 'ALL'>
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { key: 'ALL', label: 'Tất cả' },
              { key: 'AVAILABLE', label: 'Còn bán' },
              { key: 'OUT_OF_STOCK', label: 'Hết hàng' },
              { key: 'INACTIVE', label: 'Ngừng bán' },
            ]}
          />
        </View>

        <SegmentedTabs<string>
          value={selectedCategoryId}
          onChange={setSelectedCategoryId}
          options={[
            { key: 'ALL', label: 'Tất cả danh mục', count: allItemsCount.total },
            ...categories.map((cat) => ({
              key: cat.id,
              label: cat.name,
            })),
          ]}
        />
      </Card>

      {/* Content Area: List + Detail Inspector */}
      {items.length === 0 ? (
        <EmptyState
          title="Không tìm thấy món ăn phù hợp"
          description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục để xem danh sách món."
          actionLabel="Đặt lại bộ lọc"
          onAction={() => {
            setSearch('');
            setSelectedCategoryId('ALL');
            setSelectedStatus('ALL');
          }}
        />
      ) : (
        <View style={[styles.workspace, isDesktop ? styles.workspaceRow : styles.col]}>
          <View style={styles.listColumn}>
            {items.map((dish) => {
              const badge = STATUS_BADGE[dish.status];
              const isSelected = activePreview?.id === dish.id;
              const isAvailable = dish.status === 'AVAILABLE';
              return (
                <Pressable
                  key={dish.id}
                  onPress={() => setSelectedPreview(dish)}
                  style={[
                    styles.dishCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: isSelected ? theme.colors.secondary : theme.colors.border,
                      borderWidth: isSelected ? 1.5 : 1,
                      borderRadius: theme.radius.lg,
                      opacity: dish.status === 'INACTIVE' ? 0.72 : 1,
                    },
                  ]}
                >
                  <Image
                    source={dish.imageUrl ? { uri: resolveMenuImageUrl(dish.imageUrl) } : undefined}
                    style={styles.dishThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.dishMain}>
                    <View style={styles.dishTitleRow}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.dishName,
                          { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                        ]}
                      >
                        {dish.name}
                      </Text>
                      <Badge label={badge.label} tone={badge.tone} />
                    </View>

                    <View style={styles.metaRow}>
                      <Text
                        style={[
                          styles.skuText,
                          { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.mono },
                        ]}
                      >
                        {dish.sku}
                      </Text>
                      <Text style={[styles.dotText, { color: theme.colors.outline }]}>·</Text>
                      <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                        {categoryNameMap.get(dish.categoryId) || 'Khác'}
                      </Text>
                      <Text style={[styles.dotText, { color: theme.colors.outline }]}>·</Text>
                      <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                        {STATION_LABEL[dish.station]}
                      </Text>
                    </View>

                    <View style={styles.bottomRow}>
                      <Text
                        style={[
                          styles.priceText,
                          { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                        ]}
                      >
                        {formatVND(dish.price)}
                      </Text>

                      <View style={styles.cardActions}>
                        {canToggle ? (
                          <View style={styles.switchWrap}>
                            <Text style={[styles.switchLabel, { color: theme.colors.onSurfaceVariant }]}>
                              {isAvailable ? 'Mở bán' : 'Tắt bán'}
                            </Text>
                            <Switch
                              value={isAvailable}
                              onValueChange={(val) => void handleToggleSale(dish, val)}
                              disabled={mutating}
                            />
                          </View>
                        ) : null}

                        <PermissionGate permission="MENU_UPDATE">
                          <Pressable
                            onPress={() => {
                              setEditingDish(dish);
                              setDishModalOpen(true);
                            }}
                            style={[styles.iconAction, { backgroundColor: theme.colors.surfaceLow }]}
                          >
                            <Edit3 size={15} color={theme.colors.secondary} />
                          </Pressable>
                        </PermissionGate>

                        <PermissionGate permission="MENU_DELETE">
                          <Pressable
                            onPress={() => setDeleteTarget(dish)}
                            style={[
                              styles.iconAction,
                              { backgroundColor: theme.colors.errorContainer },
                            ]}
                          >
                            <Trash2 size={15} color={theme.colors.error} />
                          </Pressable>
                        </PermissionGate>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {isDesktop && activePreview ? (
            <Card style={styles.previewPanel} padding="md">
              <Image
                source={activePreview.imageUrl ? { uri: resolveMenuImageUrl(activePreview.imageUrl) } : undefined}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <View style={styles.previewHeader}>
                <Badge
                  label={activePreview.sku}
                  tone="neutral"
                  mono
                />
                <Badge
                  label={STATUS_BADGE[activePreview.status].label}
                  tone={STATUS_BADGE[activePreview.status].tone}
                />
              </View>
              <Text
                style={[
                  styles.previewTitle,
                  { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                ]}
              >
                {activePreview.name}
              </Text>
              <Text
                style={[
                  styles.previewPrice,
                  { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                ]}
              >
                {formatVND(activePreview.price)}
              </Text>
              <Text style={[styles.previewDesc, { color: theme.colors.onSurfaceVariant }]}>
                {activePreview.description}
              </Text>

              <View style={[styles.specBox, { borderColor: theme.colors.border }]}>
                <View style={styles.specRow}>
                  <Text style={[styles.specKey, { color: theme.colors.onSurfaceVariant }]}>
                    Danh mục
                  </Text>
                  <Text style={[styles.specVal, { color: theme.colors.onSurface }]}>
                    {categoryNameMap.get(activePreview.categoryId) || 'Khác'}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specKey, { color: theme.colors.onSurfaceVariant }]}>
                    Trạm bếp
                  </Text>
                  <Text style={[styles.specVal, { color: theme.colors.onSurface }]}>
                    {STATION_LABEL[activePreview.station]}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specKey, { color: theme.colors.onSurfaceVariant }]}>
                    Thời gian chuẩn
                  </Text>
                  <Text
                    style={[
                      styles.specVal,
                      { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {activePreview.prepTimeMinutes} phút
                  </Text>
                </View>
              </View>

              <PermissionGate permission="MENU_UPDATE">
                <Button
                  label="Chỉnh sửa món này"
                  variant="primary"
                  leftIcon={<Edit3 size={15} color={theme.colors.onPrimary} />}
                  onPress={() => {
                    setEditingDish(activePreview);
                    setDishModalOpen(true);
                  }}
                />
              </PermissionGate>
            </Card>
          ) : null}
        </View>
      )}

      <DishFormModal
        visible={dishModalOpen}
        editingItem={editingDish}
        categories={categories}
        loading={mutating}
        onClose={() => setDishModalOpen(false)}
        onSubmit={handleDishSubmit}
      />

      <CategoryManagerModal
        visible={catModalOpen}
        categories={categories}
        loading={mutating}
        onClose={() => setCatModalOpen(false)}
        onCreate={async (input) => {
          await createCategory(input);
          showToast('Đã tạo danh mục mới', 'success', input.name);
        }}
        onUpdate={async (id, input) => {
          await updateCategory(id, input);
          showToast('Đã cập nhật danh mục', 'success');
        }}
        onDelete={async (id) => {
          await deleteCategory(id);
          showToast('Đã xóa danh mục', 'success');
        }}
      />

      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title="Xác nhận xóa món ăn"
        message={`Bạn có chắc muốn xóa món "${deleteTarget?.name ?? ''}" khỏi thực đơn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa món"
        destructive
        loading={mutating}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteTarget(null)}
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
    paddingBottom: 32,
  },
  topRow: {
    gap: 12,
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
  topActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterCard: {
    gap: 10,
  },
  filterRow: {
    gap: 10,
  },
  searchBox: {
    flex: 1,
    minWidth: 220,
  },
  workspace: {
    gap: 14,
  },
  workspaceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listColumn: {
    flex: 1.5,
    gap: 10,
  },
  dishCard: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  dishThumb: {
    width: 78,
    height: 78,
    borderRadius: 10,
  },
  dishMain: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  dishTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dishName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  skuText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dotText: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconAction: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPanel: {
    width: 320,
    gap: 12,
  },
  previewImage: {
    width: '100%',
    height: 170,
    borderRadius: 10,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  previewPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  previewDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  specBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specKey: {
    fontSize: 12,
  },
  specVal: {
    fontSize: 12,
    fontWeight: '600',
  },
});
