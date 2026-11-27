import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'primary';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  mono?: boolean;
}

export function Badge({ label, tone = 'neutral', mono = false }: BadgeProps) {
  const { theme } = useTheme();

  const getColors = () => {
    switch (tone) {
      case 'info':
        return { bg: theme.colors.secondaryContainer, fg: theme.colors.onSecondaryContainer };
      case 'success':
        return { bg: theme.colors.successContainer, fg: theme.colors.onSuccessContainer };
      case 'warning':
        return { bg: theme.colors.warningContainer, fg: theme.colors.onWarningContainer };
      case 'danger':
        return { bg: theme.colors.errorContainer, fg: theme.colors.onErrorContainer };
      case 'primary':
        return { bg: theme.colors.primary, fg: theme.colors.onPrimary };
      default:
        return { bg: theme.colors.surfaceMuted, fg: theme.colors.onSurfaceVariant };
    }
  };

  const palette = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          borderRadius: theme.radius.sm,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          {
            color: palette.fg,
            fontFamily: mono ? theme.typography.mono : theme.typography.body,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
});
