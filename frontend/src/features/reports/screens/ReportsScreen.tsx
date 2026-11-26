import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart3, DollarSign, Package, RefreshCw, ShoppingBag } from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { formatDateTime, formatVND } from '@/src/utils/formatters';
import { useReports } from '@/src/features/reports/hooks/useReports';
import type { ReportPeriod } from '@/src/types/common';
import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { Badge } from '@/src/components/common/Badge';
import { StatCard } from '@/src/components/common/StatCard';
import { SegmentedTabs } from '@/src/components/common/SegmentedTabs';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/common/StateViews';
import { RevenueChart } from '@/src/features/reports/components/RevenueChart';

export function ReportsScreen() {
  const { theme } = useTheme();
  const { isMobile, width } = useResponsive();
  const { period, setPeriod, report, loading, error, reload } = useReports();

  if (loading && !report) {
    return <View style={styles.padded}><LoadingState message="Đang tải báo cáo từ hệ thống..." /></View>;
  }
  if (error || !report) {
    return <View style={styles.padded}><ErrorState message={error || 'Không có dữ liệu báo cáo.'} onRetry={() => void reload()} /></View>;
  }

  const chartWidth = Math.max(280, width - 72);
  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <SegmentedTabs<ReportPeriod>
          value={period}
          onChange={setPeriod}
          options={[
            { key: 'DAY', label: 'Hôm nay' },
            { key: 'WEEK', label: '7 ngày' },
            { key: 'MONTH', label: 'Tháng này' },
          ]}
        />
        <Button label="Làm mới" variant="secondary" size="sm" leftIcon={<RefreshCw size={14} color={theme.colors.onSurface} />} onPress={() => void reload()} />
      </View>

      <View style={[styles.kpis, isMobile ? styles.column : styles.row]}>
        <StatCard label="Doanh thu đã thanh toán" value={formatVND(report.revenue)} helper={`${report.paidOrderCount} đơn đã thanh toán`} icon={<DollarSign size={17} color={theme.colors.secondary} />} style={styles.kpi} />
        <StatCard label="Số món đã bán" value={String(report.itemsSold)} helper="Từ các đơn đã thanh toán" icon={<ShoppingBag size={17} color={theme.colors.primary} />} style={styles.kpi} />
        <StatCard label="Giá trị đơn TB" value={formatVND(report.averagePaidOrderValue)} helper="Doanh thu / số đơn đã thanh toán" icon={<BarChart3 size={17} color={theme.colors.success} />} style={styles.kpi} />
        <StatCard label="Nguyên liệu cần chú ý" value={String(report.inventory.lowStockCount)} helper={`${report.inventory.ingredientCount} nguyên liệu đang hoạt động`} icon={<Package size={17} color={theme.colors.warning} />} style={styles.kpi} />
      </View>

      <Card padding="md" style={styles.card}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Doanh thu theo {period === 'MONTH' ? 'tháng' : 'ngày'}</Text>
        {report.revenueSeries.length ? <RevenueChart data={report.revenueSeries} width={chartWidth} /> : <EmptyState title="Chưa có doanh thu" description="Không có khoản thanh toán PAID trong khoảng thời gian này." />}
      </Card>

      <View style={[styles.row, isMobile && styles.column]}>
        <Card padding="md" style={styles.cardFlex}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Món bán chạy</Text>
          {report.topDishes.length ? report.topDishes.map((dish, index) => (
            <View key={`${dish.name}-${index}`} style={[styles.listRow, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.rank, { color: theme.colors.secondary }]}>#{index + 1}</Text>
              <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>{dish.name}</Text>
              <View>
                <Text style={[styles.amount, { color: theme.colors.onSurface }]}>{formatVND(dish.revenue)}</Text>
                <Text style={[styles.muted, { color: theme.colors.onSurfaceVariant }]}>{dish.quantitySold} phần</Text>
              </View>
            </View>
          )) : <Text style={{ color: theme.colors.onSurfaceVariant }}>Chưa có món bán ra trong kỳ.</Text>}
        </Card>

        <Card padding="md" style={styles.cardFlex}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Cảnh báo tồn kho</Text>
          {report.inventory.lowStockItems.length ? report.inventory.lowStockItems.map((item) => (
            <View key={item.id} style={[styles.listRow, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>{item.name}</Text>
                <Text style={[styles.muted, { color: theme.colors.onSurfaceVariant }]}>{item.code}</Text>
              </View>
              <Text style={[styles.amount, { color: theme.colors.warning }]}>{item.quantityOnHand} / {item.lowStockThreshold ?? '—'}</Text>
            </View>
          )) : <Text style={{ color: theme.colors.onSurfaceVariant }}>Không có nguyên liệu dưới định mức.</Text>}
        </Card>
      </View>
      <Card padding="md" style={styles.card}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Lịch sử đơn hàng ({report.orderHistory.length})</Text>
        {report.orderHistory.length ? report.orderHistory.map((order) => (
          <View key={order.id} style={[styles.historyOrder, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.historyHeader}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>{order.orderCode} · {order.table.code}</Text>
                <Text style={[styles.muted, { color: theme.colors.onSurfaceVariant }]}>{order.table.name} · {formatDateTime(order.createdAt)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Badge label={order.payment?.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'} tone={order.payment?.status === 'PAID' ? 'success' : 'warning'} />
                <Text style={[styles.amount, { color: theme.colors.onSurface }]}>{formatVND(Number(order.payment?.amount ?? order.items.filter((item) => item.status !== 'CANCELLED').reduce((sum, item) => sum + Number(item.lineTotal), 0)))}</Text>
              </View>
            </View>
            {order.items.map((item, index) => (
              <View key={`${order.id}-${index}`} style={styles.historyItem}>
                <Text style={[styles.muted, { color: theme.colors.onSurfaceVariant, flex: 1 }]}>{item.quantity} × {item.itemName} · {item.status === 'CANCELLED' ? 'Đã hủy' : item.status === 'COMPLETED' ? 'Hoàn thiện' : item.status === 'IN_PREPARATION' ? 'Đang chế biến' : item.status === 'ACCEPTED' ? 'Bếp đã nhận' : 'Chờ bếp nhận'}</Text>
                <Text style={[styles.muted, { color: theme.colors.onSurfaceVariant }]}>{formatVND(Number(item.lineTotal))}</Text>
              </View>
            ))}
          </View>
        )) : <EmptyState title="Chưa có đơn hàng trong kỳ" description="Đơn hàng sẽ xuất hiện tại đây khi có hoạt động tại nhà hàng." />}
      </Card>
      <Text style={[styles.muted, { color: theme.colors.onSurfaceVariant }]}>Kỳ báo cáo: {report.from} đến {report.to}. Doanh thu chỉ tính các khoản thanh toán PAID.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  padded: { padding: 16 },
  container: { padding: 16, gap: 14, paddingBottom: 36 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 },
  kpis: { gap: 10 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  column: { flexDirection: 'column' },
  kpi: { flex: 1, minWidth: 170 },
  card: { gap: 12 },
  cardFlex: { flex: 1, minWidth: 260, gap: 10 },
  title: { fontSize: 15, fontWeight: '700' },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: StyleSheet.hairlineWidth },
  historyOrder: { gap: 7, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  historyHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 10 },
  rank: { width: 26, fontWeight: '700' },
  itemName: { flex: 1, fontSize: 13, fontWeight: '600' },
  itemInfo: { flex: 1, gap: 2 },
  amount: { fontSize: 12, fontWeight: '700', textAlign: 'right' },
  muted: { fontSize: 11 },
});
