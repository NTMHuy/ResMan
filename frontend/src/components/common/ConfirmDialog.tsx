import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { ModalDialog } from '@/src/components/common/ModalDialog';
import { Button } from '@/src/components/common/Button';
import { useTheme } from '@/src/theme/ThemeContext';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { theme } = useTheme();

  return (
    <ModalDialog
      visible={visible}
      title={title}
      onClose={onCancel}
      maxWidth={420}
      footer={
        <>
          <Button label={cancelLabel} variant="secondary" onPress={onCancel} disabled={loading} />
          <Button
            label={confirmLabel}
            variant={destructive ? 'danger' : 'primary'}
            onPress={onConfirm}
            loading={loading}
          />
        </>
      }
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: destructive
                ? theme.colors.errorContainer
                : theme.colors.warningContainer,
            },
          ]}
        >
          <AlertTriangle
            size={20}
            color={destructive ? theme.colors.error : theme.colors.warning}
          />
        </View>
        <Text
          style={[
            styles.message,
            { color: theme.colors.onSurface, fontFamily: theme.typography.body },
          ]}
        >
          {message}
        </Text>
      </View>
    </ModalDialog>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
