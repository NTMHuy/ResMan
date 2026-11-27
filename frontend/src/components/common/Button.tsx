import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { theme } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.colors.primary,
          fg: theme.colors.onPrimary,
          border: theme.colors.primary,
        };
      case 'secondary':
        return {
          bg: theme.colors.surfaceLow,
          fg: theme.colors.onSurface,
          border: theme.colors.border,
        };
      case 'danger':
        return {
          bg: theme.colors.errorContainer,
          fg: theme.colors.onErrorContainer,
          border: theme.colors.errorContainer,
        };
      case 'success':
        return {
          bg: theme.colors.success,
          fg: theme.colors.onSuccess,
          border: theme.colors.success,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          fg: theme.colors.secondary,
          border: 'transparent',
        };
    }
  };

  const palette = getColors();
  const minHeight = size === 'sm' ? 36 : size === 'lg' ? 48 : 42;
  const paddingHorizontal = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 15 : 14;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderRadius: theme.radius.md,
          minHeight,
          paddingHorizontal,
          opacity: disabled ? 0.5 : pressed ? 0.84 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.fg} />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              {
                color: palette.fg,
                fontSize,
                fontFamily: theme.typography.body,
              },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontWeight: '600',
  },
});
