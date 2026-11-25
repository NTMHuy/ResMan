import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { useTheme } from '@/src/theme/ThemeContext';
import { ROLE_LABELS } from '@/src/constants/rbac';
import { ModalDialog } from '@/src/components/common/ModalDialog';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import type { UserRole } from '@/src/types/common';
import type {
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeInput,
} from '@/src/features/employees/types/employee.types';

const STAFF_ROLES: UserRole[] = ['ORDER_STAFF', 'KITCHEN_STAFF', 'INVENTORY_STAFF'];

const createSchema = z.object({
  code: z.string().trim().min(3, 'Mã nhân viên tối thiểu 3 ký tự'),
  fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: z.string().trim().email('Email không hợp lệ'),
  phone: z.string().trim().min(9, 'Số điện thoại không hợp lệ'),
  station: z.string().trim().min(2, 'Vui lòng nhập bộ phận trực'),
  shift: z.string().trim().min(2, 'Vui lòng nhập ca làm việc'),
  password: z.string().min(12, 'Mật khẩu tối thiểu 12 ký tự'),
});

const updateSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: z.string().trim().email('Email không hợp lệ'),
  phone: z.string().trim().min(9, 'Số điện thoại không hợp lệ'),
  station: z.string().trim().min(2, 'Vui lòng nhập bộ phận trực'),
  shift: z.string().trim().min(2, 'Vui lòng nhập ca làm việc'),
});

interface EmployeeFormModalProps {
  visible: boolean;
  editingEmployee: Employee | null;
  canAssignRole: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: (input: CreateEmployeeInput) => Promise<void>;
  onUpdate: (id: string, input: UpdateEmployeeInput) => Promise<void>;
}

export function EmployeeFormModal({
  visible,
  editingEmployee,
  canAssignRole,
  loading,
  onClose,
  onCreate,
  onUpdate,
}: EmployeeFormModalProps) {
  const { theme } = useTheme();
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('ORDER_STAFF');
  const [station, setStation] = useState('');
  const [shift, setShift] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setFieldErrors({});
    setErrMsg(null);
    if (editingEmployee) {
      setCode(editingEmployee.code);
      setFullName(editingEmployee.fullName);
      setEmail(editingEmployee.email);
      setPhone(editingEmployee.phone);
      setRole(editingEmployee.role);
      setStation(editingEmployee.station || 'Sảnh chính');
      setShift(editingEmployee.shift || 'Ca sáng (08:00 - 16:00)');
      setPassword('');
    } else {
      setCode(`NV-${Math.floor(100 + Math.random() * 899)}`);
      setFullName('');
      setEmail('');
      setPhone('090');
      setRole('ORDER_STAFF');
      setStation('Sảnh tầng 1');
      setShift('Ca chiều (14:00 - 22:00)');
      setPassword('ResMan@2026!');
    }
  }, [visible, editingEmployee]);

  const handleSave = async () => {
    setFieldErrors({});
    setErrMsg(null);

    if (editingEmployee) {
      const parsed = updateSchema.safeParse({ fullName, email, phone, station, shift });
      if (!parsed.success) {
        const next: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const k = String(issue.path[0] ?? 'form');
          if (!next[k]) next[k] = issue.message;
        }
        setFieldErrors(next);
        return;
      }
      try {
        await onUpdate(editingEmployee.id, {
          ...parsed.data,
          role: canAssignRole ? role : editingEmployee.role,
        });
        onClose();
      } catch (err) {
        setErrMsg(err instanceof Error ? err.message : 'Không thể cập nhật nhân viên.');
      }
      return;
    }

    const parsed = createSchema.safeParse({
      code,
      fullName,
      email,
      phone,
      station,
      shift,
      password,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0] ?? 'form');
        if (!next[k]) next[k] = issue.message;
      }
      setFieldErrors(next);
      return;
    }

    try {
      await onCreate({
        ...parsed.data,
        role,
      });
      onClose();
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Không thể tạo nhân viên.');
    }
  };

  return (
    <ModalDialog
      visible={visible}
      title={editingEmployee ? `Hồ sơ: ${editingEmployee.fullName}` : 'Thêm nhân viên mới'}
      subtitle="Cấp tài khoản, ca làm việc và phân quyền vai trò"
      onClose={onClose}
      maxWidth={540}
      footer={
        <>
          <Button label="Hủy" variant="secondary" onPress={onClose} disabled={loading} />
          <Button
            label={editingEmployee ? 'Lưu cập nhật' : 'Tạo tài khoản'}
            variant="primary"
            loading={loading}
            onPress={() => void handleSave()}
          />
        </>
      }
    >
      <View style={styles.rowTwo}>
        <Input
          label="Mã nhân viên *"
          value={code}
          onChangeText={setCode}
          editable={!editingEmployee}
          error={fieldErrors.code}
          containerStyle={styles.flexOne}
        />
        <Input
          label="Họ và tên *"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nguyễn Văn A"
          error={fieldErrors.fullName}
          containerStyle={styles.flexTwo}
        />
      </View>

      <View style={styles.rowTwo}>
        <Input
          label="Email đăng nhập *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={fieldErrors.email}
          containerStyle={styles.flexOne}
        />
        <Input
          label="Số điện thoại *"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          error={fieldErrors.phone}
          containerStyle={styles.flexOne}
        />
      </View>

      {canAssignRole || !editingEmployee ? (
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            Vai trò phân quyền *
          </Text>
          <View style={styles.chipWrap}>
            {STAFF_ROLES.map((r) => {
              const active = r === role;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
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
                    {ROLE_LABELS[r]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      <View style={styles.rowTwo}>
        <Input
          label="Khu vực / Trạm *"
          value={station}
          onChangeText={setStation}
          error={fieldErrors.station}
          containerStyle={styles.flexOne}
        />
        <Input
          label="Ca làm việc *"
          value={shift}
          onChangeText={setShift}
          error={fieldErrors.shift}
          containerStyle={styles.flexOne}
        />
      </View>

      {!editingEmployee ? (
        <Input
          label="Mật khẩu khởi tạo *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={fieldErrors.password}
        />
      ) : null}

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
    minWidth: 150,
  },
  flexTwo: {
    flex: 1.5,
    minWidth: 180,
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
