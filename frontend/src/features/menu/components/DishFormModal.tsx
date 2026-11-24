import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { useTheme } from '@/src/theme/ThemeContext';
import { ModalDialog } from '@/src/components/common/ModalDialog';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { resolveMenuImageUrl } from '@/src/constants/config';
import type {
  CreateMenuItemInput,
  DishStatus,
  MenuCategory,
  MenuItem,
  UploadMenuImageInput,
} from '@/src/features/menu/types/menu.types';
import type { KitchenStation } from '@/src/types/common';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

const dishSchema = z.object({
  sku: z.string().trim().min(2, 'Mã SKU tối thiểu 2 ký tự'),
  name: z.string().trim().min(2, 'Tên món ăn tối thiểu 2 ký tự'),
  description: z.string().trim().min(5, 'Mô tả ngắn tối thiểu 5 ký tự'),
  price: z.number().min(1000, 'Giá bán phải từ 1.000đ trở lên'),
  prepTimeMinutes: z.number().min(1, 'Thời gian chế biến tối thiểu 1 phút').max(120),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
});

const STATUS_OPTIONS: Array<{ value: DishStatus; label: string }> = [
  { value: 'AVAILABLE', label: 'Đang bán' },
  { value: 'OUT_OF_STOCK', label: 'Hết hàng (86)' },
];

interface DishFormModalProps {
  visible: boolean;
  editingItem: MenuItem | null;
  categories: MenuCategory[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (
    values: CreateMenuItemInput,
    editingId?: string,
    selectedImage?: UploadMenuImageInput | null,
    removeImage?: boolean,
  ) => Promise<void>;
}

export function DishFormModal({
  visible,
  editingItem,
  categories,
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
  const [selectedImage, setSelectedImage] = useState<UploadMenuImageInput | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;

    setFieldErrors({});
    setSubmitError(null);
    setSelectedImage(null);
    setRemoveImage(false);

    if (editingItem) {
      setSku(editingItem.sku ?? '');
      setName(editingItem.name ?? '');
      setDescription(editingItem.description ?? '');
      setPriceText(String(editingItem.price ?? 0));
      setPrepText(String(editingItem.prepTimeMinutes ?? 10));
      setCategoryId(editingItem.categoryId ?? categories[0]?.id ?? '');
      setStation(editingItem.station ?? 'HOT_KITCHEN');
      setStatus(editingItem.status ?? 'AVAILABLE');
      setImageUrl(editingItem.imageUrl ?? '');
    } else {
      setSku(`MN-${Math.floor(100 + Math.random() * 899)}`);
      setName('');
      setDescription('');
      setPriceText('65000');
      setPrepText('10');
      setCategoryId(categories[0]?.id ?? '');
      setStation('HOT_KITCHEN');
      setStatus('AVAILABLE');
      setImageUrl('');
    }
  }, [visible, editingItem, categories]);

  const handleChooseImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });

      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      const mimeType = asset.mimeType || asset.file?.type || '';
      const inferredExtension = Object.entries(ALLOWED_IMAGE_TYPES)
        .find(([, mime]) => mime === mimeType)?.[0];
      const originalName = asset.fileName || asset.file?.name || asset.uri.split('/').pop() || 'menu-image';
      const extension = originalName.split('.').pop()?.toLowerCase() || inferredExtension || '';
      const fileName = /\\.(jpg|jpeg|png|webp)$/i.test(originalName)
        ? originalName
        : `${originalName}.${inferredExtension || extension}`;

      if (!ALLOWED_IMAGE_TYPES[extension] || !mimeType || mimeType !== ALLOWED_IMAGE_TYPES[extension]) {
        setSubmitError('Chỉ chấp nhận ảnh JPG, JPEG, PNG hoặc WEBP.');
        return;
      }

      const size = asset.fileSize ?? asset.file?.size ?? 0;
      if (size > MAX_IMAGE_SIZE) {
        setSubmitError('Ảnh vượt quá dung lượng tối đa 5MB.');
        return;
      }

      setSubmitError(null);
      setSelectedImage({
        uri: asset.uri,
        name: fileName,
        type: mimeType,
        size,
        ...(asset.file ? { file: asset.file } : {}),
      });
      setRemoveImage(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Không thể chọn ảnh.');
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageUrl('');
    setRemoveImage(Boolean(editingItem?.imageUrl));
    setSubmitError(null);
  };

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
          // Existing URL is display state only; ApiMenuRepository never sends it in JSON.
          imageUrl,
          status,
          prepTimeMinutes: parsed.data.prepTimeMinutes,
          modifiers: editingItem?.modifiers ?? [],
          linkedIngredientIds: editingItem?.linkedIngredientIds ?? [],
        },
        editingItem?.id,
        selectedImage,
        removeImage,
      );
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Không thể lưu món ăn.');
    }
  };

  const previewUri = selectedImage?.uri || resolveMenuImageUrl(imageUrl);

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
                <Text style={[styles.optionText, { color: active ? theme.colors.onPrimary : theme.colors.onSurface }]}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {fieldErrors.categoryId ? (
          <Text style={[styles.errText, { color: theme.colors.error }]}>{fieldErrors.categoryId}</Text>
        ) : null}
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
                <Text style={[styles.optionText, { color: active ? theme.colors.onPrimary : theme.colors.onSurface }]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
          Ảnh món ăn (JPG, JPEG, PNG, WEBP · tối đa 5MB)
        </Text>
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.imagePreview} resizeMode="cover" />
        ) : (
          <View style={[styles.imagePlaceholder, { borderColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Chưa có ảnh món ăn</Text>
          </View>
        )}
        {selectedImage ? (
          <Text style={[styles.imageMeta, { color: theme.colors.onSurfaceVariant }]}>
            Ảnh mới: {selectedImage.name}
          </Text>
        ) : imageUrl && !removeImage ? (
          <Text style={[styles.imageMeta, { color: theme.colors.onSurfaceVariant }]}>
            Ảnh hiện tại trên máy chủ
          </Text>
        ) : null}
        <View style={styles.imageActions}>
          <Button
            label={selectedImage || imageUrl ? 'Thay đổi ảnh' : 'Chọn ảnh'}
            variant="secondary"
            onPress={() => void handleChooseImage()}
            disabled={loading}
          />
          {(selectedImage || imageUrl) ? (
            <Button
              label="Xóa ảnh"
              variant="secondary"
              onPress={handleRemoveImage}
              disabled={loading}
            />
          ) : null}
        </View>
      </View>

      {submitError ? (
        <Text style={[styles.errText, { color: theme.colors.error }]}>{submitError}</Text>
      ) : null}
    </ModalDialog>
  );
}

const styles = StyleSheet.create({
  rowTwo: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  flexOne: { flex: 1, minWidth: 180 },
  section: { gap: 6 },
  sectionLabel: { fontSize: 12, fontWeight: '600' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  optionText: { fontSize: 12, fontWeight: '600' },
  imagePreview: { width: '100%', height: 180, borderRadius: 10 },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageMeta: { fontSize: 11 },
  imageActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  errText: { fontSize: 12, fontWeight: '600' },
});
