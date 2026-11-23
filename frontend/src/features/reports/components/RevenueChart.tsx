import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/src/theme/ThemeContext';
import { formatVND } from '@/src/utils/formatters';
import type { RevenuePoint } from '@/src/features/reports/types/report.types';

interface RevenueChartProps {
  data: RevenuePoint[];
  width?: number;
}

export function RevenueChart({ data, width = 560 }: RevenueChartProps) {
  const { theme } = useTheme();

  if (data.length === 0) {
    return (
      <Text style={[styles.empty, { color: theme.colors.onSurfaceVariant }]}>
        Chưa có dữ liệu biểu đồ doanh thu.
      </Text>
    );
  }

  const chartHeight = 200;
  const chartPaddingLeft = 14;
  const chartPaddingRight = 14;
  const chartPaddingTop = 24;
  const chartPaddingBottom = 32;
  const plotWidth = Math.max(240, width - chartPaddingLeft - chartPaddingRight);
  const plotHeight = chartHeight - chartPaddingTop - chartPaddingBottom;
  const maxVal = Math.max(...data.map((d) => d.revenue), 1);

  const slotWidth = plotWidth / data.length;
  const barWidth = Math.min(36, Math.max(14, slotWidth * 0.56));

  const formatCompact = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${Math.round(val / 1_000)}K`;
    return String(val);
  };

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height={chartHeight} viewBox={`0 0 ${width} ${chartHeight}`}>
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = chartPaddingTop + plotHeight * (1 - ratio);
          return (
            <Line
              key={ratio}
              x1={chartPaddingLeft}
              y1={y}
              x2={width - chartPaddingRight}
              y2={y}
              stroke={theme.colors.border}
              strokeWidth={1}
              strokeDasharray={ratio === 0 ? undefined : '4,4'}
            />
          );
        })}

        {/* Bars */}
        {data.map((pt, idx) => {
          const ratio = pt.revenue / maxVal;
          const barH = Math.max(4, ratio * plotHeight);
          const x = chartPaddingLeft + idx * slotWidth + (slotWidth - barWidth) / 2;
          const y = chartPaddingTop + plotHeight - barH;
          const isPeak = pt.revenue === maxVal;

          return (
            <React.Fragment key={pt.label}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={4}
                fill={isPeak ? theme.colors.secondary : theme.colors.primary}
                opacity={isPeak ? 1 : 0.85}
              />
              <SvgText
                x={x + barWidth / 2}
                y={Math.max(12, y - 6)}
                fontSize={10}
                fontWeight="600"
                fill={theme.colors.onSurfaceVariant}
                textAnchor="middle"
              >
                {formatCompact(pt.revenue)}
              </SvgText>
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight - 10}
                fontSize={11}
                fontWeight="600"
                fill={theme.colors.onSurface}
                textAnchor="middle"
              >
                {pt.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      <View style={styles.legendRow}>
        <Text style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>
          Đỉnh doanh thu: {formatVND(maxVal)}
        </Text>
        <Text style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>
          Tổng {data.reduce((s, d) => s + d.orders, 0)} đơn trong chuỗi
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  empty: {
    fontSize: 13,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
