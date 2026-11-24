import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  CheckCircle2,
  ChefHat,
  Clock,
  Minus,
  Plus,
  Search,
  Send,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useToast } from '@/src/contexts/ToastContext';
import { formatTime, formatVND } from '@/src/utils/formatters';
import { APP_CONFIG } from '@/src/constants/config';
import {
  TABLE_OPTIONS,
  useCustomerOrder,
} from '@/src/features/customer-order/hooks/useCustomerOrder';
import type { MenuItem } from '@/src/features/menu/types/menu.types';
import type { OrderStatus } from '@/src/features/orders/types/order.types';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { SegmentedTabs } from '@/src/components/common/SegmentedTabs';
import { PermissionGate } from '@/src/components/common/PermissionGate';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/common/StateViews';
import { DishCustomizerModal } from '@/src/features/customer-order/components/DishCustomizerModal';

type ViewMode = 'MENU' | 'TRACKING';

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }
  return fallback;
}

const ORDER_STEPS: Array<{ key: OrderStatus; label: string }> = [
  { key: 'CONFIRMED', label: '1. Đã gửi bếp' },
  { key: 'COOKING', label: '2. Đang nấu' },
  { key: 'READY', label: '3. Sẵn sàng phục vụ' },
  { key: 'COMPLETED', label: '4. Hoàn tất' },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'PENDING':
      return 0;
    case 'CONFIRMED':
      return 1;
    case 'COOKING':
      return 2;
    case 'READY':
      return 3;
    case 'COMPLETED':
      return 4;
    default:
      return 0;
  }
}

export function CustomerOrderScreen() {
  const { theme } = useTheme();
  const { isDesktop } = useResponsive();
  const { showToast } = useToast();
  const {
    categories,
    items,
    cart,
    cartSummary,
    tableNumber,
    changeTable,
    sessionCode,
    setSessionCode,
    connectSession,
    disconnectSession,
    guestName,
    setGuestName,
    guestCount,
    setGuestCount,
    tableOrders,
    loading,
    submitting,
    error,
    search,
    setSearch,
    selectedCategoryId,
    setSelectedCategoryId,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    submitOrder,
    cancelGuestItem,
    reload,
  } = useCustomerOrder();

  const [viewMode, setViewMode] = useState<ViewMode>('MENU');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [orderNote, setOrderNote] = useState('');

  const handleSubmitOrder = async () => {
    try {
      const created = await submitOrder(orderNote);
      setOrderNote('');
      showToast(
        'Đã gửi đơn xuống bếp thành công',
        'success',
        `${created.orderNumber} · ${created.tableNumber}`
      );
      if (!isDesktop) {
        setViewMode('TRACKING');
      }
    } catch (err) {
      showToast('Không thể gửi đơn', 'error', getErrorMessage(err, 'Vui lòng thử lại.'));
    }
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.padded}>
        <LoadingState message="Đang tải thực đơn gọi món..." />
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

  const activeOrder = tableOrders[0];

  const renderCartAndTracking = () => (
    <View style={styles.sideColumn}>
      {/* Guest & Table Context */}
      <Card padding="md" style={styles.cartCard}>
        <View style={styles.cardHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurface, fontFamily: theme.typography.display },
            ]}
          >
            Thông tin bàn phục vụ
          </Text>
          <Badge label={tableNumber} tone="info" mono />
        </View>

        {APP_CONFIG.USE_MOCK_DATA ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tableChips}
          >
            {TABLE_OPTIONS.map((table) => {
              const active = table === tableNumber;
              return (
                <Pressable
                  key={table}
                  onPress={() => changeTable(table)}
                  style={[
                    styles.tableChip,
                    {
                      backgroundColor: active ? theme.colors.primary : theme.colors.surfaceLow,
                      borderColor: active ? theme.colors.primary : theme.colors.border,
                      borderRadius: theme.radius.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableChipText,
                      { color: active ? theme.colors.onPrimary : theme.colors.onSurface },
                    ]}
                  >
                    {table}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          <View style={{ gap: 8 }}>
            <Input
              label="Mã phiên bàn"
              value={sessionCode}
              onChangeText={setSessionCode}
              placeholder="Nhập mã phiên 64 ký tự từ nhân viên/QR"
              autoCapitalize="none"
              autoCorrect={false}
              editable={tableNumber === 'Chưa kết nối'}
            />
            <View style={styles.dishBtnGroup}>
              <Button
                label="Kết nối phiên"
                size="sm"
                variant="primary"
                disabled={tableNumber !== 'Chưa kết nối' || !sessionCode.trim()}
                onPress={async () => {
                  try {
                    await connectSession();
                    showToast('Đã kết nối bàn', 'success', 'Bạn có thể bắt đầu gọi món.');
                  } catch (err) {
                    showToast('Không thể kết nối', 'error', getErrorMessage(err, 'Vui lòng kiểm tra mã phiên và kết nối mạng.'));
                  }
                }}
              />
              <Button
                label="Ngắt kết nối"
                size="sm"
                variant="secondary"
                disabled={tableNumber === 'Chưa kết nối'}
                onPress={() => {
                  void disconnectSession();
                  showToast('Đã ngắt kết nối phiên bàn', 'success');
                }}
              />
            </View>
          </View>
        )}

        {APP_CONFIG.USE_MOCK_DATA ? (
          <View style={styles.guestRow}>
            <Input
              label="Tên khách"
              value={guestName}
              onChangeText={setGuestName}
              placeholder="Khách tại bàn"
              containerStyle={styles.flexOne}
            />
            <View style={styles.guestCountBox}>
              <Text style={[styles.guestCountLabel, { color: theme.colors.onSurfaceVariant }]}>
                Số khách
              </Text>
              <View style={styles.miniStepper}>
                <Pressable
                  onPress={() => setGuestCount((c) => Math.max(1, c - 1))}
                  style={[styles.miniBtn, { backgroundColor: theme.colors.surfaceLow }]}
                >
                  <Minus size={14} color={theme.colors.onSurface} />
                </Pressable>
                <Text
                  style={[
                    styles.miniQty,
                    { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                  ]}
                >
                  {guestCount}
                </Text>
                <Pressable
                  onPress={() => setGuestCount((c) => Math.min(20, c + 1))}
                  style={[styles.miniBtn, { backgroundColor: theme.colors.surfaceLow }]}
                >
                  <Plus size={14} color={theme.colors.onSurface} />
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}
      </Card>

      {/* Cart */}
      <Card padding="md" style={styles.cartCard}>
        <View style={styles.cardHeader}>
          <View style={styles.rowGap}>
            <ShoppingBag size={18} color={theme.colors.secondary} />
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSurface, fontFamily: theme.typography.display },
              ]}
            >
              Giỏ hàng ({cartSummary.totalItems} món)
            </Text>
          </View>
          {cart.length > 0 ? (
            <Pressable onPress={clearCart}>
              <Text style={[styles.clearText, { color: theme.colors.error }]}>Xóa hết</Text>
            </Pressable>
          ) : null}
        </View>

        {cart.length === 0 ? (
          <Text style={[styles.emptyCartText, { color: theme.colors.onSurfaceVariant }]}>
            Chưa có món nào trong giỏ. Chọn món ở thực đơn để bắt đầu đặt món.
          </Text>
        ) : (
          <View style={styles.cartList}>
            {cart.map((entry) => {
              const unit = entry.menuItem.price + entry.extraPrice;
              return (
                <View
                  key={entry.cartItemId}
                  style={[
                    styles.cartRow,
                    {
                      backgroundColor: theme.colors.surfaceLow,
                      borderRadius: theme.radius.md,
                    },
                  ]}
                >
                  <View style={styles.cartInfo}>
                    <Text style={[styles.cartTitle, { color: theme.colors.onSurface }]}>
                      {entry.menuItem.name}
                    </Text>
                    {entry.selectedModifiers.length > 0 ? (
                      <Text style={[styles.cartSub, { color: theme.colors.secondary }]}>
                        {entry.selectedModifiers.join(' · ')}
                      </Text>
                    ) : null}
                    {entry.note ? (
                      <Text style={[styles.cartSub, { color: theme.colors.warning }]}>
                        Ghi chú: {entry.note}
                      </Text>
                    ) : null}
                    <Text
                      style={[
                        styles.cartPrice,
                        { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {formatVND(unit * entry.quantity)}
                    </Text>
                  </View>

                  <View style={styles.miniStepper}>
                    <Pressable
                      onPress={() => updateCartQuantity(entry.cartItemId, -1)}
                      style={[styles.miniBtn, { backgroundColor: theme.colors.surface }]}
                    >
                      <Minus size={14} color={theme.colors.onSurface} />
                    </Pressable>
                    <Text
                      style={[
                        styles.miniQty,
                        { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {entry.quantity}
                    </Text>
                    <Pressable
                      onPress={() => updateCartQuantity(entry.cartItemId, 1)}
                      style={[styles.miniBtn, { backgroundColor: theme.colors.surface }]}
                    >
                      <Plus size={14} color={theme.colors.onSurface} />
                    </Pressable>
                    <Pressable
                      onPress={() => removeFromCart(entry.cartItemId)}
                      style={[styles.miniBtn, { backgroundColor: theme.colors.errorContainer }]}
                    >
                      <Trash2 size={14} color={theme.colors.error} />
                    </Pressable>
                  </View>
                </View>
              );
            })}

            <Input
              value={orderNote}
              onChangeText={setOrderNote}
              placeholder="Ghi chú chung cho đơn hàng..."
            />

            <View style={[styles.totalsBox, { borderTopColor: theme.colors.border }]}>
              <View style={styles.totalLine}>
                <Text style={[styles.totalKey, { color: theme.colors.onSurfaceVariant }]}>
                  Tạm tính
                </Text>
                <Text
                  style={[
                    styles.totalVal,
                    { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                  ]}
                >
                  {formatVND(cartSummary.subtotal)}
                </Text>
              </View>
              <View style={styles.totalLine}>
                <Text style={[styles.totalKey, { color: theme.colors.onSurfaceVariant }]}>
                  {APP_CONFIG.USE_MOCK_DATA ? 'Phí phục vụ (5%) & VAT (8%)' : 'Phí dịch vụ / VAT (chưa áp dụng)'}
                </Text>
                <Text
                  style={[
                    styles.totalVal,
                    { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                  ]}
                >
                  {formatVND(cartSummary.serviceFee + cartSummary.taxAmount)}
                </Text>
              </View>
              <View style={styles.totalLine}>
                <Text style={[styles.grandKey, { color: theme.colors.onSurface }]}>Tổng cộng</Text>
                <Text
                  style={[
                    styles.grandVal,
                    { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                  ]}
                >
                  {formatVND(cartSummary.totalAmount)}
                </Text>
              </View>
            </View>

            <PermissionGate permission="CUSTOMER_ORDER_SUBMIT">
              <Button
                label="Gửi đơn xuống bếp"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
                disabled={!APP_CONFIG.USE_MOCK_DATA && tableNumber === 'Chưa kết nối'}
                leftIcon={<Send size={16} color={theme.colors.onPrimary} />}
                onPress={() => void handleSubmitOrder()}
              />
            </PermissionGate>
          </View>
        )}
      </Card>

      {/* Live Order Tracker */}
      <Card padding="md" style={styles.cartCard}>
        <View style={styles.cardHeader}>
          <View style={styles.rowGap}>
            <ChefHat size={18} color={theme.colors.primary} />
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSurface, fontFamily: theme.typography.display },
              ]}
            >
              Theo dõi đơn {tableNumber}
            </Text>
          </View>
          <Badge label={`${tableOrders.length} đơn`} tone="neutral" mono />
        </View>

        {tableOrders.length === 0 ? (
          <Text style={[styles.emptyCartText, { color: theme.colors.onSurfaceVariant }]}>
            Chưa có đơn hàng nào được gửi tại {tableNumber}.
          </Text>
        ) : (
          <View style={styles.trackList}>
            {tableOrders.slice(0, 3).map((ord) => {
              const stepIdx = getStepIndex(ord.status);
              const isStopped = ord.status === 'CANCELLED' || ord.status === 'REJECTED';
              return (
                <View
                  key={ord.id}
                  style={[
                    styles.trackCard,
                    {
                      backgroundColor: theme.colors.surfaceLow,
                      borderColor: theme.colors.border,
                      borderRadius: theme.radius.md,
                    },
                  ]}
                >
                  <View style={styles.trackTop}>
                    <Text
                      style={[
                        styles.trackNum,
                        { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {ord.orderNumber}
                    </Text>
                    <Text
                      style={[
                        styles.trackTime,
                        { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {formatTime(ord.createdAt)} · {formatVND(ord.totalAmount)}
                    </Text>
                  </View>

                  {isStopped ? (
                    <Badge
                      label={ord.status === 'CANCELLED' ? 'Đã hủy' : 'Đã từ chối'}
                      tone="danger"
                    />
                  ) : (
                    <View style={styles.stepsRow}>
                      {ORDER_STEPS.map((st, idx) => {
                        const reached = stepIdx >= idx + 1;
                        return (
                          <View key={st.key} style={styles.stepCol}>
                            <View
                              style={[
                                styles.stepBar,
                                {
                                  backgroundColor: reached
                                    ? theme.colors.secondary
                                    : theme.colors.border,
                                },
                              ]}
                            />
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.stepLabel,
                                {
                                  color: reached
                                    ? theme.colors.secondary
                                    : theme.colors.onSurfaceVariant,
                                },
                              ]}
                            >
                              {st.label}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  <View style={{ gap: 7 }}>
                    {ord.items.map((item, index) => (
                      <View
                        key={item.id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                        }}
                      >
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={[styles.trackItems, { color: theme.colors.onSurface }]}>
                            {index + 1}. {item.quantity}x {item.menuItemName}
                          </Text>
                          <Text style={[styles.trackItems, { color: theme.colors.onSurfaceVariant }]}>
                            {item.kitchenStatus === 'QUEUED' ? 'Chờ bếp tiếp nhận' :
                              item.kitchenStatus === 'ACCEPTED' ? 'Đã tiếp nhận' :
                              item.kitchenStatus === 'COOKING' ? 'Đang chế biến' :
                              item.kitchenStatus === 'COMPLETED' ? 'Đã hoàn thành' : 'Đã hủy'}
                            {' · '}{formatVND(item.unitPrice * item.quantity)}
                          </Text>
                        </View>
                        {!APP_CONFIG.USE_MOCK_DATA && item.kitchenStatus === 'QUEUED' ? (
                          <Button
                            label="Hủy món"
                            size="sm"
                            variant="danger"
                            onPress={async () => {
                              try {
                                await cancelGuestItem(item.id);
                                showToast('Đã hủy món', 'success', item.menuItemName);
                              } catch (err) {
                                showToast('Không thể hủy món', 'error', getErrorMessage(err, 'Món có thể đã được bếp tiếp nhận.'));
                              }
                            }}
                          />
                        ) : null}
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </Card>
    </View>
  );

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      {/* Active Order Banner */}
      {activeOrder && activeOrder.status !== 'COMPLETED' && activeOrder.status !== 'CANCELLED' ? (
        <View
          style={[
            styles.liveBanner,
            {
              backgroundColor: theme.colors.secondaryContainer,
              borderColor: theme.colors.secondary,
              borderRadius: theme.radius.lg,
            },
          ]}
        >
          <View style={styles.rowGap}>
            <CheckCircle2 size={18} color={theme.colors.onSecondaryContainer} />
            <Text style={[styles.bannerTitle, { color: theme.colors.onSecondaryContainer }]}>
              Đơn hiện tại {activeOrder.orderNumber} ({tableNumber})
            </Text>
          </View>
          <Text style={[styles.bannerMeta, { color: theme.colors.onSecondaryContainer }]}>
            {activeOrder.items.length} món · Tổng {formatVND(activeOrder.totalAmount)} · Trạng thái:{' '}
            {activeOrder.status}
          </Text>
        </View>
      ) : null}

      {!isDesktop ? (
        <SegmentedTabs<ViewMode>
          value={viewMode}
          onChange={setViewMode}
          options={[
            { key: 'MENU', label: 'Thực đơn món' },
            {
              key: 'TRACKING',
              label: 'Giỏ hàng & Theo dõi',
              count: cartSummary.totalItems,
            },
          ]}
        />
      ) : null}

      <View style={[styles.layout, isDesktop ? styles.layoutRow : styles.layoutCol]}>
        {isDesktop || viewMode === 'MENU' ? (
          <View style={styles.menuColumn}>
            <Card padding="md" style={styles.filterCard}>
              <Input
                value={search}
                onChangeText={setSearch}
                placeholder="Tìm tên món, đồ uống, hương vị..."
                leftIcon={<Search size={16} color={theme.colors.outline} />}
              />
              <SegmentedTabs<string>
                value={selectedCategoryId}
                onChange={setSelectedCategoryId}
                options={[
                  { key: 'ALL', label: 'Tất cả' },
                  ...categories.map((cat) => ({ key: cat.id, label: cat.name })),
                ]}
              />
            </Card>

            {items.length === 0 ? (
              <EmptyState
                title="Không có món ăn phù hợp"
                description="Vui lòng chọn danh mục khác hoặc xóa từ khóa tìm kiếm."
                actionLabel="Xem tất cả"
                onAction={() => {
                  setSearch('');
                  setSelectedCategoryId('ALL');
                }}
              />
            ) : (
              <View style={styles.dishGrid}>
                {items.map((dish) => {
                  const isOut = dish.status === 'OUT_OF_STOCK';
                  const inCartQty = cart
                    .filter((c) => c.menuItem.id === dish.id)
                    .reduce((s, c) => s + c.quantity, 0);

                  return (
                    <Card
                      key={dish.id}
                      padding="md"
                      style={isOut ? { ...styles.dishCard, opacity: 0.68 } : styles.dishCard}
                    >
                      <Pressable
                        onPress={() => setSelectedDish(dish)}
                        style={styles.dishRow}
                      >
                        <Image
                          source={{ uri: dish.imageUrl }}
                          style={styles.dishImg}
                          resizeMode="cover"
                        />
                        <View style={styles.dishBody}>
                          <View style={styles.dishTopLine}>
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.dishTitle,
                                {
                                  color: theme.colors.onSurface,
                                  fontFamily: theme.typography.display,
                                },
                              ]}
                            >
                              {dish.name}
                            </Text>
                            {dish.isBestseller ? <Badge label="Bán chạy" tone="primary" /> : null}
                            {isOut ? <Badge label="Hết hàng (86)" tone="danger" /> : null}
                          </View>

                          <Text
                            numberOfLines={2}
                            style={[styles.dishDesc, { color: theme.colors.onSurfaceVariant }]}
                          >
                            {dish.description}
                          </Text>

                          <View style={styles.dishFooter}>
                            <View>
                              <Text
                                style={[
                                  styles.dishPrice,
                                  {
                                    color: isOut ? theme.colors.outline : theme.colors.onSurface,
                                    fontFamily: theme.typography.mono,
                                  },
                                ]}
                              >
                                {formatVND(dish.price)}
                              </Text>
                              <View style={styles.prepLine}>
                                <Clock size={12} color={theme.colors.outline} />
                                <Text style={[styles.prepLabel, { color: theme.colors.outline }]}>
                                  ~{dish.prepTimeMinutes} phút
                                </Text>
                              </View>
                            </View>

                            {isOut ? (
                              <Badge label="Không khả dụng" tone="neutral" />
                            ) : (
                              <View style={styles.dishBtnGroup}>
                                <Button
                                  label="Tùy chọn"
                                  size="sm"
                                  variant="secondary"
                                  leftIcon={
                                    <SlidersHorizontal size={13} color={theme.colors.onSurface} />
                                  }
                                  onPress={() => setSelectedDish(dish)}
                                />
                                <Button
                                  label={inCartQty > 0 ? `Thêm (${inCartQty})` : 'Thêm món'}
                                  size="sm"
                                  variant="primary"
                                  leftIcon={<Plus size={14} color={theme.colors.onPrimary} />}
                                  onPress={() => {
                                    addToCart(dish, 1, [], '');
                                    showToast('Đã thêm vào giỏ', 'success', dish.name);
                                  }}
                                />
                              </View>
                            )}
                          </View>
                        </View>
                      </Pressable>
                    </Card>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}

        {isDesktop || viewMode === 'TRACKING' ? renderCartAndTracking() : null}
      </View>

      {!isDesktop && viewMode === 'MENU' && cartSummary.totalItems > 0 ? (
        <Pressable
          onPress={() => setViewMode('TRACKING')}
          style={[
            styles.floatingCartBar,
            { backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg },
          ]}
        >
          <View>
            <Text style={[styles.floatingCount, { color: theme.colors.onPrimary }]}>
              {cartSummary.totalItems} món trong giỏ ({tableNumber})
            </Text>
            <Text
              style={[
                styles.floatingAmount,
                { color: theme.colors.onPrimaryContainer, fontFamily: theme.typography.mono },
              ]}
            >
              {formatVND(cartSummary.totalAmount)}
            </Text>
          </View>
          <View style={[styles.floatingCta, { backgroundColor: theme.colors.secondary }]}>
            <Text style={[styles.floatingCtaText, { color: theme.colors.onSecondary }]}>
              Xem giỏ & Gửi đơn
            </Text>
          </View>
        </Pressable>
      ) : null}

      <DishCustomizerModal
        visible={Boolean(selectedDish)}
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={(dish, qty, mods, note) => {
          addToCart(dish, qty, mods, note);
          showToast('Đã thêm vào giỏ hàng', 'success', `${qty}x ${dish.name}`);
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
    paddingBottom: 40,
  },
  liveBanner: {
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  bannerMeta: {
    fontSize: 12,
  },
  layout: {
    gap: 14,
  },
  layoutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  layoutCol: {
    flexDirection: 'column',
  },
  menuColumn: {
    flex: 1.45,
    gap: 12,
  },
  sideColumn: {
    flex: 1,
    minWidth: 300,
    gap: 12,
  },
  filterCard: {
    gap: 10,
  },
  dishGrid: {
    gap: 10,
  },
  dishCard: {
    overflow: 'hidden',
  },
  dishRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  dishImg: {
    width: 88,
    height: 88,
    borderRadius: 10,
  },
  dishBody: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  dishTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  dishTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  dishDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  dishFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  dishPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  prepLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  prepLabel: {
    fontSize: 11,
  },
  dishBtnGroup: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  cartCard: {
    gap: 12,
  },
  cardHeader: {
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tableChips: {
    gap: 6,
    paddingVertical: 2,
  },
  tableChip: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tableChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  guestRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },
  flexOne: {
    flex: 1,
  },
  guestCountBox: {
    gap: 5,
  },
  guestCountLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  miniStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniQty: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 13,
    lineHeight: 19,
  },
  cartList: {
    gap: 8,
  },
  cartRow: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cartInfo: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  cartTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  cartSub: {
    fontSize: 11,
  },
  cartPrice: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  totalsBox: {
    borderTopWidth: 1,
    paddingTop: 10,
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
  grandKey: {
    fontSize: 14,
    fontWeight: '700',
  },
  grandVal: {
    fontSize: 16,
    fontWeight: '700',
  },
  trackList: {
    gap: 10,
  },
  trackCard: {
    borderWidth: 1,
    padding: 10,
    gap: 8,
  },
  trackTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackNum: {
    fontSize: 13,
    fontWeight: '700',
  },
  trackTime: {
    fontSize: 11,
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepCol: {
    flex: 1,
    gap: 4,
  },
  stepBar: {
    height: 4,
    borderRadius: 2,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  trackItems: {
    fontSize: 12,
  },
  floatingCartBar: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  floatingCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  floatingAmount: {
    fontSize: 12,
  },
  floatingCta: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  floatingCtaText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
