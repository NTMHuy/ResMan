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
  costPerUnit: z.number().min(0, 'Đơn giá nhập không được âm'),
  supplier: z.string().trim().min(2, 'Vui lòng nhập nhà cung cấp'),
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
  const [costPerUnit, setCostPerUnit] = useState('120000');
  const [supplier, setSupplier] = useState('');
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
      setCostPerUnit(String(editingItem.costPerUnit));
      setSupplier(editingItem.supplier);
    } else {
      setSku(`ING-${Math.floor(100 + Math.random() * 899)}`);
      setName('');
      setDescription('');
      setZone('MAIN_COOLER');
      setUnit('kg');
      setCurrentStock('10');
      setMinThreshold('3');
      setCostPerUnit('100000');
      setSupplier('Thực phẩm Sạch Việt');
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
      costPerUnit: Number(costPerUnit),
      supplier,
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
          costPerUnit: parsed.data.costPerUnit,
          supplier: parsed.data.supplier,
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
          costPerUnit: parsed.data.costPerUnit,
          supplier: parsed.data.supplier,
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
      subtitle="Quản lý định mức tồn kho tối thiểu và nhà cung cấp"
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
        <Input
          label="Giá nhập / ĐVT (VNĐ) *"
          value={costPerUnit}
          onChangeText={setCostPerUnit}
          keyboardType="numeric"
          error={fieldErrors.costPerUnit}
          containerStyle={styles.flexOne}
        />
      </View>

      <Input
        label="Nhà cung cấp *"
        value={supplier}
        onChangeText={setSupplier}
        error={fieldErrors.supplier}
      />

      {errMsg ? <Text style={[styles.errText, { color: theme.colors.error }]}>{errMsg}</Text> : null}
    </ModalDialog>
  );
}

export type StockModalMode = 'IMPORT' | 'ADJUST' | 'AUDIT';

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
      setQtyText('5');
      setReason('Nhập hàng bổ sung từ nhà cung cấp');
    } else if (mode === 'ADJUST') {
      setQtyText(String(ingredient.currentStock));
      setReason('Điều chỉnh hao hụt sơ chế');
    } else {
      setQtyText(String(ingredient.currentStock));
      setReason('Kiểm kê thực tế cuối ca');
    }
  }, [visible, mode, ingredient]);

  if (!ingredient) return null;

  const title =
    mode === 'IMPORT'
      ? `Nhập kho · ${ingredient.name}`
      : mode === 'ADJUST'
        ? `Điều chỉnh tồn · ${ingredient.name}`
        : `Kiểm kê kho · ${ingredient.name}`;

  const qtyLabel =
    mode === 'IMPORT'
      ? `Số lượng nhập thêm (${ingredient.unit}) *`
      : mode === 'ADJUST'
        ? `Số lượng tồn mới (${ingredient.unit}) *`
        : `Số lượng đếm thực tế (${ingredient.unit}) *`;

  const handleConfirm = async () => {
    setErrMsg(null);
    const num = Number(qtyText);
    if (Number.isNaN(num)) {
      setErrMsg('Vui lòng nhập số hợp lệ.');
      return;
    }
    if (mode === 'IMPORT' && num <= 0) {
      setErrMsg('Số lượng nhập kho phải lớn hơn 0.');
      return;
    }
    if (mode !== 'IMPORT' && num < 0) {
      setErrMsg('Số lượng tồn kho không được mang giá trị âm.');
      return;
    }
    if (reason.trim().length < 3) {
      setErrMsg('Vui lòng nhập ghi chú lý do tối thiểu 3 ký tự.');
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
      title={title}
      subtitle={`Tồn hiện tại: ${ingredient.currentStock} ${ingredient.unit} · Định mức tối thiểu: ${ingredient.minThreshold} ${ingredient.unit}`}
      onClose={onClose}
      maxWidth={440}
      footer={
        <>
          <Button label="Hủy" variant="secondary" onPress={onClose} disabled={loading} />
          <Button
            label="Xác nhận lưu kho"
            variant="primary"
            loading={loading}
            onPress={() => void handleConfirm()}
          />
        </>
      }
    >
      <Input
        label={qtyLabel}
        value={qtyText}
        onChangeText={setQtyText}
        keyboardType="decimal-pad"
      />
      <Input
        label="Lý do / Chứng từ *"
        value={reason}
        onChangeText={setReason}
        multiline
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
  errText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
