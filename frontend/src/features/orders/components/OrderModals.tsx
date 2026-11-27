import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Banknote, CreditCard, Minus, Plus, QrCode, Search } from 'lucide-react-native';
import { z } from 'zod';
import { useTheme } from '@/src/theme/ThemeContext';
import { formatVND } from '@/src/utils/formatters';
import { ModalDialog } from '@/src/components/common/ModalDialog';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import type { MenuItem } from '@/src/features/menu/types/menu.types';
import type {
  AddOrderItemInput,
  CreateOrderInput,
  PaymentMethod,
} from '@/src/features/orders/types/order.types';

const reasonSchema = z.object({
  reason: z.string().trim().min(4, 'Vui lòng nhập lý do rõ ràng (tối thiểu 4 ký tự)'),
});

interface ReasonModalProps {
  visible: boolean;
  mode: 'REJECT' | 'CANCEL';
  orderNumber: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

const QUICK_REASONS = [
  'Khách yêu cầu hủy bàn / đổi lịch',
  'Hết nguyên liệu tươi theo xác nhận bếp',
  'Nhập nhầm số lượng món',
];

export function OrderReasonModal({
  visible,
  mode,
  orderNumber,
  loading,
  onClose,
  onConfirm,
}: ReasonModalProps) {
  const { theme } = useTheme();
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setReason('');
    setErrorMsg(null);
  }, [visible]);

  const handleSubmit = async () => {
    setErrorMsg(null);
    const parsed = reasonSchema.safeParse({ reason });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? 'Lý do không hợp lệ.');
      return;
    }
    try {
      await onConfirm(parsed.data.reason);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Thao tác thất bại.');
    }
  };

  const isCancel = mode === 'CANCEL';

  return (
    <ModalDialog
      visible={visible}
      title={isCancel ? `Hủy đơn hàng ${orderNumber}` : `Từ chối đơn ${orderNumber}`}
      subtitle="Hành động này sẽ được ghi vào lịch sử kiểm toán đơn hàng"
      onClose={onClose}
      maxWidth={440}
      footer={
        <>
          <Button label="Quay lại" variant="secondary" onPress={onClose} disabled={loading} />
          <Button
            label={isCancel ? 'Xác nhận hủy đơn' : 'Xác nhận từ chối'}
            variant="danger"
            onPress={() => void handleSubmit()}
            loading={loading}
          />
        </>
      }
    >
      <View style={styles.chipCol}>
        {QUICK_REASONS.map((preset) => (
          <Pressable
            key={preset}
            onPress={() => setReason(preset)}
            style={[
              styles.presetBtn,
              {
                backgroundColor:
                  reason === preset ? theme.colors.errorContainer : theme.colors.surfaceLow,
                borderColor: reason === preset ? theme.colors.error : theme.colors.border,
                borderRadius: theme.radius.md,
              },
            ]}
          >
            <Text style={[styles.presetText, { color: theme.colors.onSurface }]}>{preset}</Text>
          </Pressable>
        ))}
      </View>

      <Input
        label="Lý do chi tiết *"
        value={reason}
        onChangeText={setReason}
        placeholder="Nhập lý do hủy hoặc từ chối..."
        multiline
        error={errorMsg || undefined}
      />
    </ModalDialog>
  );
}

interface AddOrderItemModalProps {
  visible: boolean;
  orderNumber: string;
  availableItems: MenuItem[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (input: AddOrderItemInput) => Promise<void>;
}

export function AddOrderItemModal({
  visible,
  orderNumber,
  availableItems,
  loading,
  onClose,
  onSubmit,
}: AddOrderItemModalProps) {
  const { theme } = useTheme();
  const [selectedDishId, setSelectedDishId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setSelectedDishId(availableItems[0]?.id ?? '');
    setSearchQuery('');
    setQuantity(1);
    setNote('');
    setErrMsg(null);
  }, [visible, availableItems]);

  const filteredItems = availableItems.filter((dish) =>
    dish.name.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase()),
  );

  const handleAdd = async () => {
    if (!selectedDishId) {
      setErrMsg('Vui lòng chọn món ăn.');
      return;
    }
    try {
      await onSubmit({
        menuItemId: selectedDishId,
        quantity,
        modifiers: [],
        note: note.trim(),
      });
      onClose();
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Không thể thêm món.');
    }
  };

  return (
    <ModalDialog
      visible={visible}
      title={`Gọi thêm món · ${orderNumber}`}
      subtitle="Món mới sẽ được đồng bộ ngay tới trạm Bếp KDS"
      onClose={onClose}
      maxWidth={480}
      footer={
        <>
          <Button label="Hủy" variant="secondary" onPress={onClose} disabled={loading} />
          <Button
            label="Thêm vào đơn"
            variant="primary"
            onPress={() => void handleAdd()}
            loading={loading}
          />
        </>
      }
    >
      <Input
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tìm món theo tên..."
        leftIcon={<Search size={16} color={theme.colors.outline} />}
      />
      <View style={styles.dishList}>
        {filteredItems.map((dish) => {
          const active = dish.id === selectedDishId;
          return (
            <Pressable
              key={dish.id}
              onPress={() => setSelectedDishId(dish.id)}
              style={[
                styles.dishPickRow,
                {
                  backgroundColor: active ? theme.colors.secondaryContainer : theme.colors.surfaceLow,
                  borderColor: active ? theme.colors.secondary : theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <Text style={[styles.dishPickName, { color: theme.colors.onSurface }]}>
                {dish.name}
              </Text>
              <Text
                style={[
                  styles.dishPickPrice,
                  { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                ]}
              >
                {formatVND(dish.price)}
              </Text>
            </Pressable>
          );
        })}
        {filteredItems.length === 0 ? (
          <Text style={[styles.errText, { color: theme.colors.onSurfaceVariant }]}>Không tìm thấy món phù hợp.</Text>
        ) : null}
      </View>

      <View style={styles.qtyRow}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Số lượng</Text>
        <View style={styles.stepper}>
          <Pressable
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceLow }]}
          >
            <Minus size={15} color={theme.colors.onSurface} />
          </Pressable>
          <Text
            style={[
              styles.qtyText,
              { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
            ]}
          >
            {quantity}
          </Text>
          <Pressable
            onPress={() => setQuantity((q) => Math.min(20, q + 1))}
            style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceLow }]}
          >
            <Plus size={15} color={theme.colors.onSurface} />
          </Pressable>
        </View>
      </View>

      <Input
        label="Ghi chú chế biến"
        value={note}
        onChangeText={setNote}
        placeholder="VD: Ra món nhanh giúp khách..."
      />

      {errMsg ? <Text style={[styles.errText, { color: theme.colors.error }]}>{errMsg}</Text> : null}
    </ModalDialog>
  );
}

interface PaymentModalProps {
  visible: boolean;
  orderNumber: string;
  totalAmount: number;
  loading: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => Promise<void>;
}

const PAYMENT_OPTIONS: Array<{
  method: PaymentMethod;
  label: string;
  Icon: typeof Banknote;
}> = [
  { method: 'CASH', label: 'Tiền mặt tại quầy', Icon: Banknote },
  { method: 'BANK_TRANSFER', label: 'Chuyển khoản QR', Icon: QrCode },
  { method: 'CARD', label: 'Quẹt thẻ POS / Visa', Icon: CreditCard },
];

export function PaymentModal({
  visible,
  orderNumber,
  totalAmount,
  loading,
  onClose,
  onConfirm,
}: PaymentModalProps) {
  const { theme } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CASH');

  return (
    <ModalDialog
      visible={visible}
      title={`Thanh toán · ${orderNumber}`}
      subtitle="Xác nhận thu tiền và đóng đơn hàng"
      onClose={onClose}
      maxWidth={420}
      footer={
        <>
          <Button label="Hủy" variant="secondary" onPress={onClose} disabled={loading} />
          <Button
            label={`Xác nhận thu ${formatVND(totalAmount)}`}
            variant="success"
            loading={loading}
            onPress={() => void onConfirm(selectedMethod).then(onClose)}
          />
        </>
      }
    >
      <View
        style={[
          styles.amountBox,
          { backgroundColor: theme.colors.surfaceLow, borderRadius: theme.radius.md },
        ]}
      >
        <Text style={[styles.amountLabel, { color: theme.colors.onSurfaceVariant }]}>
          Tổng tiền thanh toán
        </Text>
        <Text
          style={[
            styles.amountVal,
            { color: theme.colors.secondary, fontFamily: theme.typography.mono },
          ]}
        >
          {formatVND(totalAmount)}
        </Text>
      </View>

      <View style={styles.chipCol}>
        {PAYMENT_OPTIONS.map((opt) => {
          const active = opt.method === selectedMethod;
          const IconComp = opt.Icon;
          return (
            <Pressable
              key={opt.method}
              onPress={() => setSelectedMethod(opt.method)}
              style={[
                styles.payOpt,
                {
                  backgroundColor: active ? theme.colors.secondaryContainer : theme.colors.surfaceLow,
                  borderColor: active ? theme.colors.secondary : theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <IconComp
                size={18}
                color={active ? theme.colors.secondary : theme.colors.onSurfaceVariant}
              />
              <Text style={[styles.payLabel, { color: theme.colors.onSurface }]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </ModalDialog>
  );
}

interface CreateOrderModalProps {
  visible: boolean;
  availableItems: MenuItem[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (input: Omit<CreateOrderInput, 'staffName'>) => Promise<void>;
}

const quickOrderSchema = z.object({
  tableNumber: z.string().trim().min(1, 'Vui lòng nhập số bàn hoặc Mang về'),
  guestName: z.string().trim().min(1, 'Vui lòng nhập tên khách'),
});

export function CreateOrderModal({
  visible,
  availableItems,
  loading,
  onClose,
  onSubmit,
}: CreateOrderModalProps) {
  const { theme } = useTheme();
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY'>('DINE_IN');
  const [tableNumber, setTableNumber] = useState('Bàn 06');
  const [guestName, setGuestName] = useState('Khách lẻ');
  const [guestCount, setGuestCount] = useState('2');
  const [selectedDishId, setSelectedDishId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setOrderType('DINE_IN');
    setTableNumber('Bàn 06');
    setGuestName('Khách lẻ');
    setGuestCount('2');
    setSelectedDishId(availableItems[0]?.id ?? '');
    setQuantity(1);
    setErrMsg(null);
  }, [visible, availableItems]);

  const handleCreate = async () => {
    setErrMsg(null);
    const parsed = quickOrderSchema.safeParse({ tableNumber, guestName });
    if (!parsed.success) {
      setErrMsg(parsed.error.issues[0]?.message ?? 'Thông tin đơn hàng chưa hợp lệ.');
      return;
    }
    if (!selectedDishId) {
      setErrMsg('Vui lòng chọn ít nhất 1 món.');
      return;
    }
    try {
      await onSubmit({
        orderType,
        tableNumber: orderType === 'TAKEAWAY' ? 'Mang về' : parsed.data.tableNumber,
        guestName: parsed.data.guestName,
        guestCount: Math.max(1, Number(guestCount) || 1),
        items: [{ menuItemId: selectedDishId, quantity, modifiers: [], note: '' }],
      });
      onClose();
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Không thể tạo đơn.');
    }
  };

  return (
    <ModalDialog
      visible={visible}
      title="Tạo đơn POS mới"
      subtitle="Đơn sẽ được xác nhận và đẩy ngay sang Bếp KDS"
      onClose={onClose}
      maxWidth={480}
      footer={
        <>
          <Button label="Hủy" variant="secondary" onPress={onClose} disabled={loading} />
          <Button
            label="Tạo & Gửi bếp"
            variant="primary"
            loading={loading}
            onPress={() => void handleCreate()}
          />
        </>
      }
    >
      <View style={styles.typeRow}>
        {(['DINE_IN', 'TAKEAWAY'] as const).map((t) => {
          const active = orderType === t;
          return (
            <Pressable
              key={t}
              onPress={() => setOrderType(t)}
              style={[
                styles.typeChip,
                {
                  backgroundColor: active ? theme.colors.primary : theme.colors.surfaceLow,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeLabel,
                  { color: active ? theme.colors.onPrimary : theme.colors.onSurface },
                ]}
              >
                {t === 'DINE_IN' ? 'Tại bàn (Dine-in)' : 'Mang về (Takeaway)'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.typeRow}>
        {orderType === 'DINE_IN' ? (
          <Input
            label="Số bàn *"
            value={tableNumber}
            onChangeText={setTableNumber}
            containerStyle={styles.flexOne}
          />
        ) : null}
        <Input
          label="Tên khách *"
          value={guestName}
          onChangeText={setGuestName}
          containerStyle={styles.flexOne}
        />
        <Input
          label="Số khách"
          value={guestCount}
          onChangeText={setGuestCount}
          keyboardType="numeric"
          containerStyle={styles.countInput}
        />
      </View>

      <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Chọn món chính</Text>
      <View style={styles.dishList}>
        {availableItems.slice(0, 6).map((dish) => {
          const active = dish.id === selectedDishId;
          return (
            <Pressable
              key={dish.id}
              onPress={() => setSelectedDishId(dish.id)}
              style={[
                styles.dishPickRow,
                {
                  backgroundColor: active ? theme.colors.secondaryContainer : theme.colors.surfaceLow,
                  borderColor: active ? theme.colors.secondary : theme.colors.border,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <Text style={[styles.dishPickName, { color: theme.colors.onSurface }]}>
                {dish.name}
              </Text>
              <Text
                style={[
                  styles.dishPickPrice,
                  { color: theme.colors.secondary, fontFamily: theme.typography.mono },
                ]}
              >
                {formatVND(dish.price)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.qtyRow}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Số lượng phần</Text>
        <View style={styles.stepper}>
          <Pressable
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceLow }]}
          >
            <Minus size={15} color={theme.colors.onSurface} />
          </Pressable>
          <Text
            style={[
              styles.qtyText,
              { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
            ]}
          >
            {quantity}
          </Text>
          <Pressable
            onPress={() => setQuantity((q) => Math.min(20, q + 1))}
            style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceLow }]}
          >
            <Plus size={15} color={theme.colors.onSurface} />
          </Pressable>
        </View>
      </View>

      {errMsg ? <Text style={[styles.errText, { color: theme.colors.error }]}>{errMsg}</Text> : null}
    </ModalDialog>
  );
}

const styles = StyleSheet.create({
  chipCol: {
    gap: 8,
  },
  presetBtn: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dishList: {
    gap: 6,
  },
  dishPickRow: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishPickName: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  dishPickPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  errText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amountBox: {
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  amountLabel: {
    fontSize: 12,
  },
  amountVal: {
    fontSize: 22,
    fontWeight: '700',
  },
  payOpt: {
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  payLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeChip: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  flexOne: {
    flex: 1,
    minWidth: 120,
  },
  countInput: {
    width: 90,
  },
});
