import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Clock, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { formatVND } from '@/src/utils/formatters';
import { ModalDialog } from '@/src/components/common/ModalDialog';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { Badge } from '@/src/components/common/Badge';
import type { MenuItem } from '@/src/features/menu/types/menu.types';

interface DishCustomizerModalProps {
  visible: boolean;
  dish: MenuItem | null;
  onClose: () => void;
  onAddToCart: (dish: MenuItem, quantity: number, modifiers: string[], note: string) => void;
}

export function DishCustomizerModal({
  visible,
  dish,
  onClose,
  onAddToCart,
}: DishCustomizerModalProps) {
  const { theme } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!visible) return;
    setQuantity(1);
    setSelectedMods([]);
    setNote('');
  }, [visible, dish?.id]);

  if (!dish) return null;

  const extraPrice = dish.modifiers
    .filter((m) => selectedMods.includes(m.label))
    .reduce((sum, m) => sum + m.extraPrice, 0);
  const isOrderable =
    dish.price > 0 &&
    dish.pricingType !== "MARKET_PRICE" &&
    dish.pricingType !== "UNSET";
  const isPerUnit = dish.pricingType === "PER_UNIT";
  const hasUnit = isPerUnit || Boolean(dish.priceUnit);
  const priceUnit = dish.priceUnit || (isPerUnit ? "lạng" : "phần");
  const quantityLabel = hasUnit ? `Số ${priceUnit}` : "Số lượng phần";
  const lineTotal = isOrderable ? (dish.price + extraPrice) * quantity : 0;
  const priceLabel =
    dish.pricingType === "MARKET_PRICE"
      ? "Giá theo thời điểm"
      : dish.pricingType === "UNSET" || !isOrderable
        ? "Liên hệ nhân viên để báo giá"
        : `${formatVND(dish.price)}${hasUnit ? `/${priceUnit}` : ""}`;

  const toggleModifier = (label: string) => {
    setSelectedMods((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <ModalDialog
      visible={visible}
      title={dish.name}
      subtitle={`Mã ${dish.sku} · Thời gian chuẩn bị ~${dish.prepTimeMinutes} phút`}
      onClose={onClose}
      maxWidth={480}
      footer={
        <>
          <Button label="Đóng" variant="secondary" onPress={onClose} />
          <Button
            label={isOrderable ? `Thêm vào giỏ · ${formatVND(lineTotal)}` : "Liên hệ nhân viên"}
            variant="primary"
            disabled={dish.status !== 'AVAILABLE' || !isOrderable}
            onPress={() => {
              onAddToCart(dish, quantity, selectedMods, note);
              onClose();
            }}
          />
        </>
      }
    >
      <Image source={{ uri: dish.imageUrl }} style={styles.bannerImage} resizeMode="cover" />

      <View style={styles.priceRow}>
        <Text
          style={[
            styles.price,
            { color: theme.colors.secondary, fontFamily: theme.typography.mono },
          ]}
        >
          {priceLabel}
        </Text>
        <View style={styles.prepBadge}>
          <Clock size={14} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.prepText, { color: theme.colors.onSurfaceVariant }]}>
            {dish.prepTimeMinutes} phút
          </Text>
        </View>
      </View>

      <Text style={[styles.desc, { color: theme.colors.onSurfaceVariant }]}>
        {dish.description}
      </Text>

      {dish.modifiers.length > 0 ? (
        <View style={styles.modSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Tùy chọn khẩu vị & Món kèm
          </Text>
          <View style={styles.modList}>
            {dish.modifiers.map((mod) => {
              const checked = selectedMods.includes(mod.label);
              return (
                <Pressable
                  key={mod.id}
                  onPress={() => toggleModifier(mod.label)}
                  style={[
                    styles.modItem,
                    {
                      backgroundColor: checked
                        ? theme.colors.secondaryContainer
                        : theme.colors.surfaceLow,
                      borderColor: checked ? theme.colors.secondary : theme.colors.border,
                      borderRadius: theme.radius.md,
                    },
                  ]}
                >
                  <View style={styles.modLeft}>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: checked ? theme.colors.secondary : 'transparent',
                          borderColor: checked ? theme.colors.secondary : theme.colors.outline,
                        },
                      ]}
                    >
                      {checked ? <Check size={12} color={theme.colors.onSecondary} /> : null}
                    </View>
                    <Text style={[styles.modLabel, { color: theme.colors.onSurface }]}>
                      {mod.label}
                    </Text>
                  </View>
                  {mod.extraPrice > 0 ? (
                    <Badge label={`+${formatVND(mod.extraPrice)}`} tone="info" mono />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      <Input
        label="Ghi chú cho bếp"
        value={note}
        onChangeText={setNote}
        placeholder="VD: Không cay, trụng kỹ, để riêng nước chấm..."
      />

      <View style={styles.qtyRow}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{quantityLabel}</Text>
        <View style={styles.stepper}>
          <Pressable
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceLow }]}
          >
            <Minus size={16} color={theme.colors.onSurface} />
          </Pressable>
          <Text
            style={[
              styles.qtyValue,
              { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
            ]}
          >
            {quantity}
          </Text>
          <Pressable
            onPress={() => setQuantity((q) => Math.min(20, q + 1))}
            style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceLow }]}
          >
            <Plus size={16} color={theme.colors.onSurface} />
          </Pressable>
        </View>
      </View>
    </ModalDialog>
  );
}

const styles = StyleSheet.create({
  bannerImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  prepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  prepText: {
    fontSize: 12,
    fontWeight: '600',
  },
  desc: {
    fontSize: 13,
    lineHeight: 19,
  },
  modSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  modList: {
    gap: 8,
  },
  modItem: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  modLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 26,
    textAlign: 'center',
  },
});
