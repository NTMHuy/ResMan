import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { useTheme } from '@/src/theme/ThemeContext';
import { ModalDialog } from '@/src/components/common/ModalDialog';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import type {
  CreateMenuItemInput,
  DishStatus,
  MenuCategory,
  MenuItem,
} from '@/src/features/menu/types/menu.types';
import type { KitchenStation } from '@/src/types/common';

const dishSchema = z.object({
  sku: z.string().trim().min(2, 'Mã SKU tối thiểu 2 ký tự'),
  name: z.string().trim().min(2, 'Tên món ăn tối thiểu 2 ký tự'),
  description: z.string().trim().min(5, 'Mô tả ngắn tối thiểu 5 ký tự'),
  price: z.number().min(1000, 'Giá bán phải từ 1.000đ trở lên'),
  prepTimeMinutes: z.number().min(1, 'Thời gian chế biến tối thiểu 1 phút').max(120),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  imageUrl: z.string().trim().min(1, 'Vui lòng chọn hoặc nhập URL hình ảnh'),
});

const STATION_OPTIONS: Array<{ value: KitchenStation; label: string }> = [
  { value: 'HOT_KITCHEN', label: 'Bếp Nóng' },
  { value: 'COLD_KITCHEN', label: 'Bếp Nguội' },
  { value: 'BAR', label: 'Quầy Bar' },
];

const STATUS_OPTIONS: Array<{ value: DishStatus; label: string }> = [
  { value: 'AVAILABLE', label: 'Đang bán' },
  { value: 'OUT_OF_STOCK', label: 'Hết hàng (86)' },
  { value: 'INACTIVE', label: 'Ngừng kinh doanh' },
];

interface DishFormModalProps {
  visible: boolean;
  editingItem: MenuItem | null;
  categories: MenuCategory[];
  imagePresets: Array<{ label: string; url: string }>;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: CreateMenuItemInput, editingId?: string) => Promise<void>;
}

export function DishFormModal({
  visible,
  editingItem,
  categories,
  imagePresets,
  loading,
  onClose,
  onSubmit,
}: DishFormModalProps) {
  const { theme } = useTheme();
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceText, setPriceText] = useState('');
  const [prepText, setPrepText] = useState('10');
  const [categoryId, setCategoryId] = useState('');
  const [station, setStation] = useState<KitchenStation>('HOT_KITCHEN');
  const [status, setStatus] = useState<DishStatus>('AVAILABLE');
  const [imageUrl, setImageUrl] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setFieldErrors({});
    setSubmitError(null);
    if (editingItem) {
      setSku(editingItem.sku);
      setName(editingItem.name);
      setDescription(editingItem.description);
      setPriceText(String(editingItem.price));
      setPrepText(String(editingItem.prepTimeMinutes));
      setCategoryId(editingItem.categoryId);
      setStation(editingItem.station);
      setStatus(editingItem.status);
      setImageUrl(editingItem.imageUrl);
    } else {
      setSku(`MN-${Math.floor(100 + Math.random() * 899)}`);
      setName('');
      setDescription('');
      setPriceText('65000');
      setPrepText('10');
      setCategoryId(categories[0]?.id ?? '');
      setStation('HOT_KITCHEN');
      setStatus('AVAILABLE');
      setImageUrl(imagePresets[0]?.url ?? '');
    }
  }, [visible, editingItem, categories, imagePresets]);

  const handleSave = async () => {
    setFieldErrors({});
    setSubmitError(null);
    const parsedPrice = Number(priceText.replace(/[^0-9]/g, ''));
    const parsedPrep = Number(prepText.replace(/[^0-9]/g, ''));

    const parsed = dishSchema.safeParse({
      sku,
      name,
      description,
      price: parsedPrice,
      prepTimeMinutes: parsedPrep,
      categoryId,
      imageUrl,
    });

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    try {
      await onSubmit(
        {
          sku: parsed.data.sku,
          name: parsed.data.name,
          description: parsed.data.description,
          price: parsed.data.price,
          categoryId: parsed.data.categoryId,
          station,
          imageUrl: parsed.data.imageUrl,
          status,
          prepTimeMinutes: parsed.data.prepTimeMinutes,
          modifiers: editingItem?.modifiers ?? [],
          linkedIngredientIds: editingItem?.linkedIngredientIds ?? [],
        },
        editingItem?.id
      );
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Không thể lưu món ăn.');
    }
  };

  return (
    <ModalDialog
      visible={visible}
      title={editingItem ? `Cập nhật món: ${editingItem.name}` : 'Thêm món ăn mới'}
      subtitle="Cấu hình giá bán, trạm bếp và trạng thái kinh doanh"
      onClose={onClose}
      maxWidth={560}
      footer={
        <>
          <Button label="Hủy" variant="secondary" onPress={onClose} disabled={loading} />
          <Button
            label={editingItem ? 'Lưu cập nhật' : 'Tạo món ăn'}
            variant="primary"
            onPress={() => void handleSave()}
            loading={loading}
          />
        </>
      }
    >
      <View style={styles.rowTwo}>
        <Input
          label="Mã SKU *"
          value={sku}
          onChangeText={setSku}
          placeholder="VD: MN-010"
          error={fieldErrors.sku}
          containerStyle={styles.flexOne}
        />
        <Input
          label="Giá bán (VNĐ) *"
          value={priceText}
          onChangeText={setPriceText}
          keyboardType="numeric"
          placeholder="85000"
          error={fieldErrors.price}
          containerStyle={styles.flexOne}
        />
      </View>

      <Input
        label="Tên món ăn *"
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên món hiển thị trên thực đơn"
        error={fieldErrors.name}
      />

      <Input
        label="Mô tả thành phần & hương vị *"
        value={description}
        onChangeText={setDescription}
        placeholder="Mô tả chi tiết giúp khách hàng dễ chọn món"
        multiline
        error={fieldErrors.description}
      />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
          Danh mục món ăn *
        </Text>
        <View style={styles.chipWrap}>
          {categories.map((cat) => {
            const active = cat.id === categoryId;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setCategoryId(cat.id)}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.surfaceLow,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: active ? theme.colors.onPrimary : theme.colors.onSurface },
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {fieldErrors.categoryId ? (
          <Text style={[styles.errText, { color: theme.colors.error }]}>
            {fieldErrors.categoryId}
          </Text>
        ) : null}
      </View>

      <View style={styles.rowTwo}>
        <View style={[styles.section, styles.flexOne]}>
          <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
            Trạm bếp chế biến
          </Text>
          <View style={styles.chipWrap}>
            {STATION_OPTIONS.map((st) => {
              const active = st.value === station;
              return (
                <Pressable
                  key={st.value}
                  onPress={() => setStation(st.value)}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: active ? theme.colors.secondary : theme.colors.surfaceLow,
                      borderColor: active ? theme.colors.secondary : theme.colors.border,
                      borderRadius: theme.radius.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: active ? theme.colors.onSecondary : theme.colors.onSurface },
                    ]}
                  >
                    {st.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Input
          label="Thời gian nấu (phút) *"
          value={prepText}
          onChangeText={setPrepText}
          keyboardType="numeric"
          placeholder="10"
          error={fieldErrors.prepTimeMinutes}
          containerStyle={styles.prepInput}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
          Trạng thái kinh doanh
        </Text>
        <View style={styles.chipWrap}>
          {STATUS_OPTIONS.map((opt) => {
            const active = opt.value === status;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setStatus(opt.value)}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.surfaceLow,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: active ? theme.colors.onPrimary : theme.colors.onSurface },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
          Hình ảnh món ăn (chọn mẫu hoặc dán URL)
        </Text>
        <View style={styles.imageRow}>
          {imagePresets.map((preset) => {
            const selected = imageUrl === preset.url;
            return (
              <Pressable
                key={preset.url}
                onPress={() => setImageUrl(preset.url)}
                style={[
                  styles.presetCard,
                  {
                    borderColor: selected ? theme.colors.secondary : theme.colors.border,
                    borderWidth: selected ? 2 : 1,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                <Image source={{ uri: preset.url }} style={styles.presetThumb} resizeMode="cover" />
                <Text
                  numberOfLines={1}
                  style={[styles.presetLabel, { color: theme.colors.onSurface }]}
                >
                  {preset.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Input
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="Đường dẫn ảnh món ăn..."
          error={fieldErrors.imageUrl}
        />
      </View>

      {submitError ? (
        <Text style={[styles.errText, { color: theme.colors.error }]}>{submitError}</Text>
      ) : null}
    </ModalDialog>
  );
}

const styles = StyleSheet.create({
  rowTwo: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  flexOne: {
    flex: 1,
    minWidth: 180,
  },
  prepInput: {
    width: 150,
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetCard: {
    width: 82,
    padding: 4,
    alignItems: 'center',
    gap: 4,
  },
  presetThumb: {
    width: 72,
    height: 52,
    borderRadius: 6,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  errText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
