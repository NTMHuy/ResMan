import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { useTheme } from '@/src/theme/ThemeContext';
import { ModalDialog } from '@/src/components/common/ModalDialog';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import type {
  CreateIngredientInput,
  Ingredient,
  StorageZone,
  UpdateIngredientInput,
} from '@/src/features/inventory/types/inventory.types';

const ZONE_OPTIONS: Array<{ value: StorageZone; label: string }> = [
  { value: 'HOT_KITCHEN_COLD', label: 'Kho lạnh Bếp Nóng' },
  { value: 'MAIN_COOLER', label: 'Kho mát Tổng' },
  { value: 'BAR_PANTRY', label: 'Kho Quầy Bar' },
];

const ingredientSchema = z.object({
  sku: z.string().trim().min(2, 'Mã SKU tối thiểu 2 ký tự'),
  name: z.string().trim().min(2, 'Tên nguyên liệu tối thiểu 2 ký tự'),
  description: z.string().trim().optional(),
  unit: z.string().trim().min(1, 'Đơn vị tính không được trống'),
  currentStock: z.number().min(0, 'Tồn kho không được âm'),
  minThreshold: z.number().min(0, 'Định mức tối thiểu không được âm'),
});

interface IngredientFormModalProps {
  visible: boolean;
  editingItem: Ingredient | null;
  loading: boolean;
  onClose: () => void;
  onCreate: (input: CreateIngredientInput) => Promise<void>;
  onUpdate: (id: string, input: UpdateIngredientInput) => Promise<void>;
}

export function IngredientFormModal({
  visible,
  editingItem,
  loading,
  onClose,
  onCreate,
  onUpdate,
}: IngredientFormModalProps) {
  const { theme } = useTheme();
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [zone, setZone] = useState<StorageZone>('MAIN_COOLER');
  const [unit, setUnit] = useState('kg');
  const [currentStock, setCurrentStock] = useState('0');
  const [minThreshold, setMinThreshold] = useState('5');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setFieldErrors({});
    setErrMsg(null);
    if (editingItem) {
      setSku(editingItem.sku);
      setName(editingItem.name);
      setDescription(editingItem.description);
      setZone(editingItem.zone);
      setUnit(editingItem.unit);
      setCurrentStock(String(editingItem.currentStock));
      setMinThreshold(String(editingItem.minThreshold));
    } else {
      setSku(`ING-${Math.floor(100 + Math.random() * 899)}`);
      setName('');
      setDescription('');
      setZone('MAIN_COOLER');
      setUnit('kg');
      setCurrentStock('10');
      setMinThreshold('3');
    }
  }, [visible, editingItem]);

  const handleSubmit = async () => {
    setFieldErrors({});
    setErrMsg(null);

    const parsed = ingredientSchema.safeParse({
      sku,
      name,
      description,
      unit,
      currentStock: Number(currentStock),
      minThreshold: Number(minThreshold),
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      return;
    }

    try {
      if (editingItem) {
        await onUpdate(editingItem.id, {
          name: parsed.data.name,
          description: parsed.data.description || '',
          zone,
          unit: parsed.data.unit,
          minThreshold: parsed.data.minThreshold,
        });
      } else {
        await onCreate({
          sku: parsed.data.sku,
          name: parsed.data.name,
          description: parsed.data.description || '',
          zone,
          unit: parsed.data.unit,
          currentStock: parsed.data.currentStock,
          minThreshold: parsed.data.minThreshold,
        });
      }
      onClose();
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Không thể lưu nguyên liệu.');
    }
  };

  return (
    <ModalDialog
      visible={visible}
      title={editingItem ? `Cập nhật: ${editingItem.name}` : 'Thêm nguyên liệu mới'}
      subtitle="Thông tin nguyên liệu và định mức tồn kho"
      onClose={onClose}
      maxWidth={540}
      footer={
        <>
          <Button label="Hủy" variant="secondary" onPress={onClose} disabled={loading} />
          <Button
            label={editingItem ? 'Lưu thay đổi' : 'Tạo nguyên liệu'}
            variant="primary"
            loading={loading}
            onPress={() => void handleSubmit()}
          />
        </>
      }
    >
      <View style={styles.rowTwo}>
        <Input
          label="Mã SKU *"
          value={sku}
          onChangeText={setSku}
          editable={!editingItem}
          error={fieldErrors.sku}
          containerStyle={styles.flexOne}
        />
        <Input
          label="Đơn vị tính *"
          value={unit}
          onChangeText={setUnit}
          placeholder="kg, lít, chai..."
          error={fieldErrors.unit}
          containerStyle={styles.flexOne}
        />
      </View>

      <Input
        label="Tên nguyên liệu *"
        value={name}
        onChangeText={setName}
        placeholder="VD: Thăn nội Bò Úc, Tôm sú..."
        error={fieldErrors.name}
      />

      <Input
        label="Mô tả quy cách"
        value={description}
        onChangeText={setDescription}
        placeholder="Quy cách đóng gói, bảo quản..."
      />

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
          Khu vực lưu trữ
        </Text>
        <View style={styles.chipWrap}>
          {ZONE_OPTIONS.map((opt) => {
            const active = opt.value === zone;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setZone(opt.value)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.surfaceLow,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
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

      <View style={styles.rowTwo}>
        {!editingItem ? (
          <Input
            label="Tồn đầu kỳ *"
            value={currentStock}
            onChangeText={setCurrentStock}
            keyboardType="decimal-pad"
            error={fieldErrors.currentStock}
            containerStyle={styles.flexOne}
          />
        ) : null}
        <Input
          label="Định mức cảnh báo *"
          value={minThreshold}
          onChangeText={setMinThreshold}
          keyboardType="decimal-pad"
          error={fieldErrors.minThreshold}
          containerStyle={styles.flexOne}
        />
      </View>

      {errMsg ? <Text style={[styles.errText, { color: theme.colors.error }]}>{errMsg}</Text> : null}
    </ModalDialog>
  );
}

export type StockModalMode = 'IMPORT' | 'COUNT';

interface StockOperationModalProps {
  visible: boolean;
  mode: StockModalMode;
  ingredient: Ingredient | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (quantity: number, reason: string) => Promise<void>;
}

export function StockOperationModal({
  visible,
  mode,
  ingredient,
  loading,
  onClose,
  onSubmit,
}: StockOperationModalProps) {
  const { theme } = useTheme();
  const [qtyText, setQtyText] = useState('');
  const [reason, setReason] = useState('');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !ingredient) return;
    setErrMsg(null);
    if (mode === 'IMPORT') {
      setQtyText('');
      setReason('');
    } else {
      setQtyText(String(ingredient.currentStock));
      setReason('');
    }
  }, [visible, mode, ingredient]);

  if (!ingredient) return null;

  const isCount = mode === 'COUNT';
  const parsedQuantity = qtyText.trim() === '' ? null : Number(qtyText);
  const countedQuantity = parsedQuantity !== null && Number.isFinite(parsedQuantity) ? parsedQuantity : null;
  const difference = countedQuantity === null ? null : countedQuantity - ingredient.currentStock;
  const differenceLabel = difference === null
    ? 'Nhập số lượng thực tế để xem chênh lệch'
    : difference > 0
      ? `Thừa +${difference} ${ingredient.unit}`
      : difference < 0
        ? `Thiếu ${difference} ${ingredient.unit}`
        : 'Khớp với số lượng trên hệ thống';

  const handleConfirm = async () => {
    setErrMsg(null);
    const num = Number(qtyText);
    if (!qtyText.trim() || !Number.isFinite(num)) {
      setErrMsg('Vui lòng nhập số lượng hợp lệ.');
      return;
    }
    if (num < 0) {
      setErrMsg('Số lượng không được mang giá trị âm.');
      return;
    }
    if (num.toString().split('.')[1]?.length > 3) {
      setErrMsg('Chỉ được nhập tối đa 3 chữ số thập phân.');
      return;
    }
    if (reason.trim().length < 3) {
      setErrMsg(isCount
        ? 'Vui lòng ghi chú ca kiểm kê hoặc lý do chênh lệch (tối thiểu 3 ký tự).'
        : 'Vui lòng nhập lý do nhập kho (tối thiểu 3 ký tự).');
      return;
    }
    try {
      await onSubmit(num, reason.trim());
      onClose();
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Không thể cập nhật tồn kho.');
    }
  };

  return (
    <ModalDialog
      visible={visible}
      title={isCount ? `Kiểm kê & cập nhật tồn · ${ingredient.name}` : `Nhập kho · ${ingredient.name}`}
      subtitle={isCount
        ? `Tồn hệ thống: ${ingredient.currentStock} ${ingredient.unit}. Nhập số đếm thực tế; hệ thống sẽ tính chênh lệch và cập nhật tồn sau khi xác nhận.`
        : `Tồn hiện tại: ${ingredient.currentStock} ${ingredient.unit} · Định mức tối thiểu: ${ingredient.minThreshold} ${ingredient.unit}`}
      onClose={onClose}
      maxWidth={460}
      footer={
        <>
          <Button label="Hủy" variant="secondary" onPress={onClose} disabled={loading} />
          <Button
            label={isCount ? 'Xác nhận kiểm kê' : 'Xác nhận nhập kho'}
            variant="primary"
            loading={loading}
            onPress={() => void handleConfirm()}
          />
        </>
      }
    >
      <Input
        label={isCount ? `Số lượng đếm thực tế (${ingredient.unit}) *` : `Số lượng nhập thêm (${ingredient.unit}) *`}
        value={qtyText}
        onChangeText={setQtyText}
        keyboardType="decimal-pad"
      />
      {isCount ? (
        <View style={[styles.differenceBox, { backgroundColor: theme.colors.surfaceLow, borderRadius: theme.radius.md }]}>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Chênh lệch dự kiến</Text>
          <Text style={[styles.differenceText, {
            color: difference === null || difference === 0
              ? theme.colors.onSurface
              : difference > 0 ? theme.colors.success : theme.colors.error,
          }]}>
            {differenceLabel}
          </Text>
        </View>
      ) : null}
      <Input
        label={isCount ? 'Ghi chú kiểm kê / lý do chênh lệch *' : 'Lý do nhập kho / chứng từ *'}
        value={reason}
        onChangeText={setReason}
        multiline
        placeholder={isCount ? 'VD: Kiểm kê cuối ca, nguyên liệu hư hỏng...' : 'VD: Nhập hàng từ nhà cung cấp...'}
      />
      {errMsg ? <Text style={[styles.errText, { color: theme.colors.error }]}>{errMsg}</Text> : null}
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
    minWidth: 140,
  },
  section: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  differenceBox: {
    padding: 10,
    gap: 4,
  },
  differenceText: {
    fontSize: 14,
    fontWeight: '700',
  },
  errText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
