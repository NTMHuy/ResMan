import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Ban,
  BarChart3,
  Clock,
  DollarSign,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { formatDateTime, formatVND } from '@/src/utils/formatters';
import { useReports } from '@/src/features/reports/hooks/useReports';
import type { ReportPeriod } from '@/src/types/common';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { StatCard } from '@/src/components/common/StatCard';
import { SegmentedTabs } from '@/src/components/common/SegmentedTabs';
import { ErrorState, LoadingState } from '@/src/components/common/StateViews';
import { RevenueChart } from '@/src/features/reports/components/RevenueChart';

export function ReportsScreen() {
  const { theme } = useTheme();
  const { width, isMobile, isDesktop } = useResponsive();
  const { period, setPeriod, report, loading, error, reload } = useReports();

  if (loading && !report) {
    return (
      <View style={styles.padded}>
        <LoadingState message="Đang tổng hợp báo cáo doanh thu & vận hành..." />
      </View>
    );
  }

  if (error || !report) {
    return (
      <View style={styles.padded}>
        <ErrorState message={error || 'Không có dữ liệu báo cáo.'} onRetry={() => void reload()} />
      </View>
    );
  }

  const chartWidth = isDesktop ? Math.min(720, Math.max(460, width - 560)) : Math.max(300, width - 72);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      {/* Header + Period Tabs */}
      <View style={styles.headerRow}>
        <SegmentedTabs<ReportPeriod>
          value={period}
          onChange={setPeriod}
          options={[
            { key: 'DAY', label: 'Hôm nay' },
            { key: 'WEEK', label: '7 ngày (Tuần)' },
            { key: 'MONTH', label: 'Tháng hiện tại' },
          ]}
        />

        <Button
          label="Làm mới số liệu"
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw size={14} color={theme.colors.onSurface} />}
          onPress={() => void reload()}
        />
      </View>

      {/* 4 Financial & Ops KPIs */}
      <View style={[styles.kpiGrid, isMobile ? styles.col : styles.rowWrap]}>
        <StatCard
          label="Tổng doanh thu"
          value={formatVND(report.totalRevenue)}
          helper={`+${report.revenueGrowthPercent}% so với kỳ trước`}
          accentColor={theme.colors.secondary}
          icon={<DollarSign size={17} color={theme.colors.secondary} />}
          style={styles.kpiItem}
        />
        <StatCard
          label="Tổng số đơn hàng"
          value={String(report.totalOrders)}
          helper={`${report.completedOrders} hoàn tất · ${report.cancelledOrders} hủy`}
          icon={<ShoppingBag size={17} color={theme.colors.primary} />}
          style={styles.kpiItem}
        />
        <StatCard
          label="Giá trị đơn trung bình"
          value={formatVND(report.averageOrderValue)}
          helper="Tính trên đơn hợp lệ"
          icon={<TrendingUp size={17} color={theme.colors.success} />}
          style={styles.kpiItem}
        />
        <StatCard
          label="Thời gian chế biến TB"
          value={`${report.avgCookTimeMinutes} phút`}
          helper={`Tỷ lệ trễ SLA: ${report.slaDelayRatePercent}%`}
          accentColor={report.slaDelayRatePercent > 10 ? theme.colors.warning : theme.colors.success}
          icon={<Clock size={17} color={theme.colors.warning} />}
          style={styles.kpiItem}
        />
      </View>

      {/* Chart + Category Breakdown */}
      <View style={[styles.splitRow, isDesktop ? styles.rowStart : styles.col]}>
        <Card padding="md" style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <View style={styles.rowGap}>
              <BarChart3 size={18} color={theme.colors.secondary} />
              <Text
                style={[
                  styles.cardTitle,
                  { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                ]}
              >
                Biểu đồ doanh thu theo {period === 'DAY' ? 'khung giờ' : period === 'WEEK' ? 'ngày' : 'tuần'}
              </Text>
            </View>
            <Badge label={`+${report.revenueGrowthPercent}%`} tone="success" mono />
          </View>

          <RevenueChart data={report.revenueSeries} width={chartWidth} />
        </Card>

        <Card padding="md" style={styles.sideCard}>
          <Text
            style={[
              styles.cardTitle,
              { color: theme.colors.onSurface, fontFamily: theme.typography.display },
            ]}
          >
            Tỷ trọng doanh thu theo nhóm món
          </Text>

          <View style={styles.catList}>
            {report.categoryBreakdown.map((slice) => (
              <View key={slice.categoryName} style={styles.catItem}>
                <View style={styles.catTop}>
                  <Text style={[styles.catName, { color: theme.colors.onSurface }]}>
                    {slice.categoryName}
                  </Text>
                  <Text
                    style={[
                      styles.catPct,
                      { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {slice.percentage}% · {formatVND(slice.revenue)}
                  </Text>
                </View>
                <View style={[styles.barTrack, { backgroundColor: theme.colors.surfaceLow }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.min(100, Math.max(4, slice.percentage))}%`,
                        backgroundColor: slice.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Inventory Health */}
          <View style={[styles.invBox, { borderTopColor: theme.colors.border }]}>
            <View style={styles.rowGap}>
              <Package size={16} color={theme.colors.primary} />
              <Text style={[styles.subSectionTitle, { color: theme.colors.onSurface }]}>
                Tình trạng kho nguyên liệu ({report.inventoryHealth.totalIngredients} mã)
              </Text>
            </View>
            <View style={styles.invBadges}>
              <Badge label={`Đủ hàng: ${report.inventoryHealth.inStockCount}`} tone="success" />
              <Badge label={`Sắp hết: ${report.inventoryHealth.lowStockCount}`} tone="warning" />
              <Badge label={`Hết hàng: ${report.inventoryHealth.outOfStockCount}`} tone="danger" />
            </View>
          </View>
        </Card>
      </View>

      {/* Top Selling Dishes + Cancelled Audit */}
      <View style={[styles.splitRow, isDesktop ? styles.rowStart : styles.col]}>
        <Card padding="md" style={styles.chartCard}>
          <Text
            style={[
              styles.cardTitle,
              { color: theme.colors.onSurface, fontFamily: theme.typography.display },
            ]}
          >
            Top món ăn bán chạy
          </Text>
          <View style={styles.dishList}>
            {report.topDishes.map((dish, idx) => (
              <View
                key={dish.menuItemId}
                style={[
                  styles.dishRow,
                  {
                    backgroundColor: theme.colors.surfaceLow,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rankText,
                    { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                  ]}
                >
                  #{idx + 1}
                </Text>
                <View style={styles.dishInfo}>
                  <Text style={[styles.dishName, { color: theme.colors.onSurface }]}>
                    {dish.name}
                  </Text>
                  <Text style={[styles.dishMeta, { color: theme.colors.onSurfaceVariant }]}>
                    {dish.sku} · {dish.station} · TB {dish.avgCookMinutes} phút
                  </Text>
                </View>
                <View style={styles.dishMetrics}>
                  <Text
                    style={[
                      styles.dishRev,
                      { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {formatVND(dish.revenue)}
                  </Text>
                  <Text
                    style={[
                      styles.dishQty,
                      { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                    ]}
                  >
                    {dish.quantitySold} phần
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card padding="md" style={styles.sideCard}>
          <View style={styles.rowGap}>
            <Ban size={16} color={theme.colors.error} />
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.onSurface, fontFamily: theme.typography.display },
              ]}
            >
              Đơn hủy / Từ chối gần đây ({report.cancellationAudits.length})
            </Text>
          </View>

          {report.cancellationAudits.length === 0 ? (
            <Text style={[styles.emptyHint, { color: theme.colors.onSurfaceVariant }]}>
              Không ghi nhận đơn hủy hoặc từ chối trong kỳ báo cáo.
            </Text>
          ) : (
            <View style={styles.dishList}>
              {report.cancellationAudits.map((audit) => (
                <View
                  key={audit.orderNumber}
                  style={[
                    styles.auditRow,
                    {
                      backgroundColor: theme.colors.errorContainer,
                      borderRadius: theme.radius.md,
                    },
                  ]}
                >
                  <View style={styles.auditTop}>
                    <Text
                      style={[
                        styles.auditNum,
                        { color: theme.colors.onErrorContainer, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {audit.orderNumber} · {audit.tableNumber}
                    </Text>
                    <Text
                      style={[
                        styles.auditAmt,
                        { color: theme.colors.onErrorContainer, fontFamily: theme.typography.mono },
                      ]}
                    >
                      {formatVND(audit.amount)}
                    </Text>
                  </View>
                  <Text style={[styles.auditReason, { color: theme.colors.onErrorContainer }]}>
                    {audit.reason}
                  </Text>
                  <Text style={[styles.auditTime, { color: theme.colors.onErrorContainer }]}>
                    {formatDateTime(audit.cancelledAt)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card>
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
    gap: 14,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  kpiGrid: {
    gap: 10,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  col: {
    flexDirection: 'column',
  },
  kpiItem: {
    flex: 1,
    minWidth: 200,
  },
  splitRow: {
    gap: 14,
  },
  chartCard: {
    flex: 1.4,
    gap: 12,
  },
  sideCard: {
    flex: 1,
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
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  catList: {
    gap: 12,
  },
  catItem: {
    gap: 5,
  },
  catTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  catName: {
    fontSize: 13,
    fontWeight: '600',
  },
  catPct: {
    fontSize: 12,
    fontWeight: '600',
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  invBox: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 8,
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  invBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dishList: {
    gap: 8,
  },
  dishRow: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    width: 28,
  },
  dishInfo: {
    flex: 1,
    gap: 2,
  },
  dishName: {
    fontSize: 13,
    fontWeight: '700',
  },
  dishMeta: {
    fontSize: 11,
  },
  dishMetrics: {
    alignItems: 'flex-end',
    gap: 2,
  },
  dishRev: {
    fontSize: 13,
    fontWeight: '700',
  },
  dishQty: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 13,
  },
  auditRow: {
    padding: 10,
    gap: 4,
  },
  auditTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  auditNum: {
    fontSize: 12,
    fontWeight: '700',
  },
  auditAmt: {
    fontSize: 12,
    fontWeight: '700',
  },
  auditReason: {
    fontSize: 12,
  },
  auditTime: {
    fontSize: 11,
    opacity: 0.85,
  },
});
