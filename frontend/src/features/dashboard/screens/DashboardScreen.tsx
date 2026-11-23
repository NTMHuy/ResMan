import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  AlertTriangle,
  ArrowRight,
  ChefHat,
  ClipboardList,
  DollarSign,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAppNavigation } from '@/src/contexts/NavigationContext';
import { useDashboard } from '@/src/features/dashboard/hooks/useDashboard';
import { formatTime, formatVND } from '@/src/utils/formatters';
import { StatCard } from '@/src/components/common/StatCard';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { ErrorState, LoadingState } from '@/src/components/common/StateViews';
import { OrderStatusBadge } from '@/src/features/orders/components/OrderStatusBadge';

export function DashboardScreen() {
  const { theme } = useTheme();
  const { isMobile, isDesktop } = useResponsive();
  const { canAccessRoute } = useAuth();
  const { navigate } = useAppNavigation();
  const { summary, loading, error, reload } = useDashboard();

  if (loading && !summary) {
    return (
      <View style={styles.padded}>
        <LoadingState message="Đang tổng hợp hoạt động nhà hàng..." />
      </View>
    );
  }

  if (error || !summary) {
    return (
      <View style={styles.padded}>
        <ErrorState message={error || 'Không có dữ liệu.'} onRetry={() => void reload()} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      {/* Header action strip */}
      <View style={styles.headerRow}>
        <View style={styles.headerInfo}>
          <Text
            style={[
              styles.heading,
              { color: theme.colors.onSurface, fontFamily: theme.typography.display },
            ]}
          >
            Bảng điều hành hoạt động
          </Text>
          <Text
            style={[
              styles.subHeading,
              { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
            ]}
          >
            Theo dõi doanh thu, đơn hàng đang phục vụ, hàng đợi bếp và cảnh báo tồn kho.
          </Text>
        </View>
        <Button
          label="Làm mới"
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw size={15} color={theme.colors.onSurface} />}
          onPress={() => void reload()}
        />
      </View>

      {/* 4 Primary KPI Cards */}
      <View style={[styles.kpiGrid, isMobile ? styles.gridSingle : styles.gridMulti]}>
        <StatCard
          label="Doanh thu hôm nay"
          value={formatVND(summary.todayRevenue)}
          helper={`${summary.todayOrderCount} đơn ghi nhận`}
          accentColor={theme.colors.secondary}
          icon={<DollarSign size={18} color={theme.colors.secondary} />}
          style={styles.kpiItem}
        />
        <StatCard
          label="Đơn đang hoạt động"
          value={String(summary.activeOrderCount)}
          helper={`${summary.pendingOrderCount} đơn chờ tiếp nhận`}
          accentColor={summary.pendingOrderCount > 0 ? theme.colors.warning : theme.colors.onSurface}
          icon={<ClipboardList size={18} color={theme.colors.primary} />}
          style={styles.kpiItem}
        />
        <StatCard
          label="Món chờ tại bếp (KDS)"
          value={String(summary.kdsQueueCount)}
          helper={`${summary.activeStaffCount} nhân sự đang trực`}
          icon={<ChefHat size={18} color={theme.colors.secondary} />}
          style={styles.kpiItem}
        />
        <StatCard
          label="Cảnh báo nguyên liệu"
          value={String(summary.lowStockAlertsCount + summary.outOfStockCount)}
          helper={`${summary.outOfStockCount} hết hàng · ${summary.lowStockAlertsCount} cận tồn`}
          accentColor={
            summary.outOfStockCount > 0
              ? theme.colors.error
              : summary.lowStockAlertsCount > 0
                ? theme.colors.warning
                : theme.colors.success
          }
          icon={<AlertTriangle size={18} color={theme.colors.error} />}
          iconBg={theme.colors.errorContainer}
          style={styles.kpiItem}
        />
      </View>

      {/* Quick Navigation Shortcuts */}
      <View style={styles.shortcutRow}>
        {canAccessRoute('orders') ? (
          <Button
            label="Xử lý đơn hàng"
            variant="primary"
            size="sm"
            leftIcon={<ClipboardList size={15} color={theme.colors.onPrimary} />}
            onPress={() => navigate('orders')}
          />
        ) : null}
        {canAccessRoute('customer-order') ? (
          <Button
            label="Đặt món tại bàn"
            variant="secondary"
            size="sm"
            leftIcon={<ShoppingBag size={15} color={theme.colors.onSurface} />}
            onPress={() => navigate('customer-order')}
          />
        ) : null}
        {canAccessRoute('kitchen') ? (
          <Button
            label="Mở màn hình Bếp KDS"
            variant="secondary"
            size="sm"
            leftIcon={<ChefHat size={15} color={theme.colors.onSurface} />}
            onPress={() => navigate('kitchen')}
          />
        ) : null}
        {canAccessRoute('inventory') ? (
          <Button
            label="Kiểm tra kho"
            variant="secondary"
            size="sm"
            leftIcon={<Package size={15} color={theme.colors.onSurface} />}
            onPress={() => navigate('inventory')}
          />
        ) : null}
      </View>

      {/* Two-Column Split: Recent Orders + Top Dishes & Stock Alerts */}
      <View style={[styles.columns, isDesktop ? styles.columnsRow : styles.columnsCol]}>
        <Card style={styles.colPrimary} padding="md">
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.onSurface, fontFamily: theme.typography.display },
              ]}
            >
              Đơn hàng gần nhất
            </Text>
            {canAccessRoute('orders') ? (
              <Pressable onPress={() => navigate('orders')} style={styles.linkBtn}>
                <Text style={[styles.linkText, { color: theme.colors.secondary }]}>Xem tất cả</Text>
                <ArrowRight size={14} color={theme.colors.secondary} />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.listStack}>
            {summary.recentOrders.map((order) => (
              <Pressable
                key={order.id}
                onPress={() => {
                  if (canAccessRoute('orders')) navigate('orders');
                }}
                style={[
                  styles.orderRow,
                  {
                    backgroundColor: theme.colors.surfaceLow,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                <View style={styles.orderRowLeft}>
                  <View style={styles.orderTitleLine}>
                    <Text
                      style={[
                        styles.monoBold,
                        { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {order.orderNumber}
                    </Text>
                    <Badge label={order.tableNumber} tone="neutral" mono />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[styles.orderMeta, { color: theme.colors.onSurfaceVariant }]}
                  >
                    {order.items.length} món · {order.guestName} · {formatTime(order.createdAt)}
                  </Text>
                </View>

                <View style={styles.orderRowRight}>
                  <Text
                    style={[
                      styles.monoBold,
                      { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {formatVND(order.totalAmount)}
                  </Text>
                  <OrderStatusBadge status={order.status} />
                </View>
              </Pressable>
            ))}
          </View>
        </Card>

        <View style={styles.colSecondary}>
          <Card padding="md">
            <View style={styles.cardHeader}>
              <View style={styles.iconTitleRow}>
                <TrendingUp size={17} color={theme.colors.secondary} />
                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                  ]}
                >
                  Món bán chạy hôm nay
                </Text>
              </View>
              {canAccessRoute('reports') ? (
                <Pressable onPress={() => navigate('reports')} style={styles.linkBtn}>
                  <Text style={[styles.linkText, { color: theme.colors.secondary }]}>Báo cáo</Text>
                  <ArrowRight size={14} color={theme.colors.secondary} />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.listStack}>
              {summary.topDishes.slice(0, 4).map((dish, idx) => (
                <View
                  key={dish.menuItemId}
                  style={[styles.dishRow, { borderBottomColor: theme.colors.border }]}
                >
                  <Text
                    style={[
                      styles.rankNum,
                      { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                    ]}
                  >
                    #{idx + 1}
                  </Text>
                  <View style={styles.dishInfo}>
                    <Text
                      numberOfLines={1}
                      style={[styles.dishName, { color: theme.colors.onSurface }]}
                    >
                      {dish.name}
                    </Text>
                    <Text style={[styles.dishSub, { color: theme.colors.onSurfaceVariant }]}>
                      {dish.station} · {dish.quantitySold} phần
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.monoBold,
                      { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {formatVND(dish.revenue)}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          <Card padding="md">
            <View style={styles.cardHeader}>
              <View style={styles.iconTitleRow}>
                <AlertTriangle size={17} color={theme.colors.warning} />
                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                  ]}
                >
                  Cảnh báo tồn kho
                </Text>
              </View>
              {canAccessRoute('inventory') ? (
                <Pressable onPress={() => navigate('inventory')} style={styles.linkBtn}>
                  <Text style={[styles.linkText, { color: theme.colors.secondary }]}>Nhập kho</Text>
                  <ArrowRight size={14} color={theme.colors.secondary} />
                </Pressable>
              ) : null}
            </View>

            {summary.lowStockIngredients.length === 0 ? (
              <Text style={[styles.emptyHint, { color: theme.colors.onSurfaceVariant }]}>
                Tất cả nguyên liệu đều đang đủ định mức tồn kho.
              </Text>
            ) : (
              <View style={styles.listStack}>
                {summary.lowStockIngredients.map((ing) => (
                  <View
                    key={ing.id}
                    style={[
                      styles.alertRow,
                      {
                        backgroundColor:
                          ing.status === 'OUT_OF_STOCK'
                            ? theme.colors.errorContainer
                            : theme.colors.warningContainer,
                        borderRadius: theme.radius.md,
                      },
                    ]}
                  >
                    <View style={styles.dishInfo}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.dishName,
                          {
                            color:
                              ing.status === 'OUT_OF_STOCK'
                                ? theme.colors.onErrorContainer
                                : theme.colors.onWarningContainer,
                          },
                        ]}
                      >
                        {ing.name}
                      </Text>
                      <Text
                        style={[
                          styles.dishSub,
                          {
                            color:
                              ing.status === 'OUT_OF_STOCK'
                                ? theme.colors.onErrorContainer
                                : theme.colors.onWarningContainer,
                          },
                        ]}
                      >
                        {ing.sku} · Tối thiểu: {ing.minThreshold} {ing.unit}
                      </Text>
                    </View>
                    <Badge
                      label={`${ing.currentStock} ${ing.unit}`}
                      tone={ing.status === 'OUT_OF_STOCK' ? 'danger' : 'warning'}
                      mono
                    />
                  </View>
                ))}
              </View>
            )}
          </Card>
        </View>
      </View>
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
    gap: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  headerInfo: {
    flex: 1,
    minWidth: 220,
    gap: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
  },
  subHeading: {
    fontSize: 13,
  },
  kpiGrid: {
    gap: 12,
  },
  gridSingle: {
    flexDirection: 'column',
  },
  gridMulti: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  kpiItem: {
    flex: 1,
    minWidth: 210,
  },
  shortcutRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  columns: {
    gap: 14,
  },
  columnsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  columnsCol: {
    flexDirection: 'column',
  },
  colPrimary: {
    flex: 1.35,
  },
  colSecondary: {
    flex: 1,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listStack: {
    gap: 8,
  },
  orderRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  orderRowLeft: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  orderTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderMeta: {
    fontSize: 12,
  },
  orderRowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  monoBold: {
    fontSize: 13,
    fontWeight: '700',
  },
  dishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  rankNum: {
    fontSize: 13,
    fontWeight: '700',
    width: 26,
  },
  dishInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  dishName: {
    fontSize: 13,
    fontWeight: '600',
  },
  dishSub: {
    fontSize: 11,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    gap: 10,
  },
  emptyHint: {
    fontSize: 13,
  },
});
