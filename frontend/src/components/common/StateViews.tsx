import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AlertCircle, Inbox } from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button } from '@/src/components/common/Button';

export function LoadingState({ message = 'Đang tải dữ liệu...' }: { message?: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.centerBox,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <ActivityIndicator size="large" color={theme.colors.secondary} />
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.centerBox,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.errorContainer,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.errorContainer }]}>
        <AlertCircle size={24} color={theme.colors.error} />
      </View>
      <Text
        style={[
          styles.title,
          { color: theme.colors.onSurface, fontFamily: theme.typography.display },
        ]}
      >
        Không thể tải dữ liệu
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
        ]}
      >
        {message}
      </Text>
      {onRetry ? <Button label="Thử lại" onPress={onRetry} variant="primary" size="sm" /> : null}
    </View>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.centerBox,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceLow }]}>
        <Inbox size={24} color={theme.colors.outline} />
      </View>
      <Text
        style={[
          styles.title,
          { color: theme.colors.onSurface, fontFamily: theme.typography.display },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
        ]}
      >
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="primary" size="sm" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centerBox: {
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 19,
  },
});
