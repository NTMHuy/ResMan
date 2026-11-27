import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { formatVND } from '@/src/utils/formatters';
import type { MenuItem } from '@/src/features/menu/types/menu.types';

interface MealSuggestionCardProps {
  items: MenuItem[];
  message: string;
  available: boolean;
  onAdd: (item: MenuItem) => void;
}

export function MealSuggestionCard({ items, message, available, onAdd }: MealSuggestionCardProps) {
  const { theme } = useTheme();

  return (
    <Card padding="md" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Sparkles size={18} color={theme.colors.secondary} />
          <Text style={[styles.title, { color: theme.colors.onSurface, fontFamily: theme.typography.display }]}>
            Gợi ý món ăn dành cho bạn
          </Text>
        </View>
        <Badge label={items.length > 0 ? 'Đề xuất' : available ? 'AI đã kết nối' : 'Chưa kết nối AI'} tone="info" />
      </View>

      {items.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
          {items.map((item) => {
            const unavailable =
              item.status === 'OUT_OF_STOCK' ||
              item.price <= 0 ||
              item.pricingType === "MARKET_PRICE" ||
              item.pricingType === "UNSET";
            const isPerUnit = item.pricingType === "PER_UNIT";
            const hasUnit = isPerUnit || Boolean(item.priceUnit);
            const priceUnit = item.priceUnit || (isPerUnit ? "lạng" : "phần");
            return (
              <View
                key={item.id}
                style={[
                  styles.suggestion,
                  {
                    backgroundColor: theme.colors.surfaceLow,
                    borderColor: theme.colors.border,
                    borderRadius: theme.radius.md,
                    opacity: unavailable ? 0.6 : 1,
                  },
                ]}
              >
                <Text numberOfLines={2} style={[styles.itemName, { color: theme.colors.onSurface }]}>
                  {item.name}
                </Text>
                <Text style={[styles.price, { color: theme.colors.secondary, fontFamily: theme.typography.mono }]}>
                  {unavailable ? "Liên hệ nhân viên" : `${formatVND(item.price)}${hasUnit ? `/${priceUnit}` : ""}`}
                </Text>
                <Button
                  label={item.status === 'OUT_OF_STOCK' ? 'Hết món' : unavailable ? 'Liên hệ nhân viên' : 'Thêm món'}
                  size="sm"
                  variant="primary"
                  disabled={unavailable}
                  onPress={() => onAdd(item)}
                />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={[styles.placeholder, { backgroundColor: theme.colors.surfaceLow, borderRadius: theme.radius.md }]}>
          <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>{message}</Text>
          <Text style={[styles.hint, { color: theme.colors.outline }]}>
            Khu vực này sẽ nhận đề xuất từ AI dựa trên thực đơn và ngữ cảnh gọi món. Hiện tại chưa hiển thị món đề xuất tự động.
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  list: {
    gap: 8,
    paddingVertical: 2,
  },
  suggestion: {
    width: 170,
    minHeight: 116,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
    gap: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    minHeight: 34,
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
  },
  placeholder: {
    padding: 12,
    gap: 6,
  },
  message: {
    fontSize: 13,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
  },
});
