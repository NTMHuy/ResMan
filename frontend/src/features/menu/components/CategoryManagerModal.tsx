import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Edit3, Plus, Trash2, X } from 'lucide-react-native';
import { z } from 'zod';
import { useTheme } from '@/src/theme/ThemeContext';
import { ModalDialog } from '@/src/components/common/ModalDialog';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import type {
  CreateCategoryInput,
  MenuCategory,
  UpdateCategoryInput,
} from '@/src/features/menu/types/menu.types';

const categorySchema = z.object({
  name: z.string().trim().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  description: z.string().trim().optional(),
});

interface CategoryManagerModalProps {
  visible: boolean;
  categories: MenuCategory[];
  loading: boolean;
  onClose: () => void;
  onCreate: (input: CreateCategoryInput) => Promise<void>;
  onUpdate: (id: string, input: UpdateCategoryInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function CategoryManagerModal({
  visible,
  categories,
  loading,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: CategoryManagerModalProps) {
  const { theme } = useTheme();
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdd = async () => {
    setErrorMsg(null);
    const parsed = categorySchema.safeParse({ name: newName, description: newDesc });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? 'Dữ liệu danh mục không hợp lệ.');
      return;
    }
    try {
      await onCreate({ name: parsed.data.name, description: parsed.data.description });
      setNewName('');
      setNewDesc('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể tạo danh mục.');
    }
  };

  const handleSaveEdit = async (id: string) => {
    setErrorMsg(null);
    const parsed = categorySchema.safeParse({ name: editName });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? 'Tên danh mục không hợp lệ.');
      return;
    }
    try {
      await onUpdate(id, { name: parsed.data.name });
      setEditingId(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể cập nhật danh mục.');
    }
  };

  const handleRemove = async (id: string) => {
    setErrorMsg(null);
    try {
      await onDelete(id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể xóa danh mục.');
    }
  };

  return (
    <ModalDialog
      visible={visible}
      title="Quản lý danh mục món ăn"
      subtitle="Thêm mới, đổi tên hoặc xóa danh mục chưa có món"
      onClose={onClose}
      maxWidth={500}
      footer={<Button label="Đóng" variant="secondary" onPress={onClose} />}
    >
      <View
        style={[
          styles.addBox,
          {
            backgroundColor: theme.colors.surfaceLow,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <Text style={[styles.subTitle, { color: theme.colors.onSurface }]}>Tạo danh mục mới</Text>
        <Input
          label="Tên danh mục *"
          value={newName}
          onChangeText={setNewName}
          placeholder="VD: Món lẩu, Combo trưa..."
        />
        <Input
          label="Mô tả ngắn"
          value={newDesc}
          onChangeText={setNewDesc}
          placeholder="Mô tả nhóm món ăn..."
        />
        <Button
          label="Thêm danh mục"
          variant="primary"
          size="sm"
          leftIcon={<Plus size={15} color={theme.colors.onPrimary} />}
          onPress={() => void handleAdd()}
          loading={loading}
        />
      </View>

      {errorMsg ? (
        <View
          style={[
            styles.errBox,
            { backgroundColor: theme.colors.errorContainer, borderRadius: theme.radius.md },
          ]}
        >
          <Text style={[styles.errText, { color: theme.colors.onErrorContainer }]}>{errorMsg}</Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {categories.map((cat) => {
          const isEditing = editingId === cat.id;
          return (
            <View
              key={cat.id}
              style={[
                styles.catRow,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              {isEditing ? (
                <View style={styles.editRow}>
                  <Input
                    value={editName}
                    onChangeText={setEditName}
                    containerStyle={styles.flexOne}
                  />
                  <Pressable
                    onPress={() => void handleSaveEdit(cat.id)}
                    style={[styles.iconBtn, { backgroundColor: theme.colors.successContainer }]}
                  >
                    <Check size={16} color={theme.colors.onSuccessContainer} />
                  </Pressable>
                  <Pressable
                    onPress={() => setEditingId(null)}
                    style={[styles.iconBtn, { backgroundColor: theme.colors.surfaceLow }]}
                  >
                    <X size={16} color={theme.colors.onSurfaceVariant} />
                  </Pressable>
                </View>
              ) : (
                <>
                  <View style={styles.catInfo}>
                    <Text style={[styles.catName, { color: theme.colors.onSurface }]}>
                      {cat.name}
                    </Text>
                    {cat.description ? (
                      <Text
                        numberOfLines={1}
                        style={[styles.catDesc, { color: theme.colors.onSurfaceVariant }]}
                      >
                        {cat.description}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => {
                        setEditingId(cat.id);
                        setEditName(cat.name);
                      }}
                      style={[styles.iconBtn, { backgroundColor: theme.colors.surfaceLow }]}
                    >
                      <Edit3 size={15} color={theme.colors.secondary} />
                    </Pressable>
                    <Pressable
                      onPress={() => void handleRemove(cat.id)}
                      style={[styles.iconBtn, { backgroundColor: theme.colors.errorContainer }]}
                    >
                      <Trash2 size={15} color={theme.colors.error} />
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          );
        })}
      </View>
    </ModalDialog>
  );
}

const styles = StyleSheet.create({
  addBox: {
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  errBox: {
    padding: 10,
  },
  errText: {
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    gap: 8,
  },
  catRow: {
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  catInfo: {
    flex: 1,
    gap: 2,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
  },
  catDesc: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flexOne: {
    flex: 1,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
