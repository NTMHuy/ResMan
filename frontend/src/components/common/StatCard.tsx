import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';

interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  iconBg?: string;
  style?: ViewStyle;
}

export function StatCard({
  label,
  value,
  helper,
  icon,
  accentColor,
  iconBg,
  style,
}: StatCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
          ]}
        >
          {label}
        </Text>
        {icon ? (
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: iconBg || theme.colors.surfaceLow,
                borderRadius: theme.radius.md,
              },
            ]}
          >
            {icon}
          </View>
        ) : null}
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.value,
          {
            color: accentColor || theme.colors.onSurface,
            fontFamily: theme.typography.mono,
          },
        ]}
      >
        {value}
      </Text>

      {helper ? (
        <Text
          numberOfLines={1}
          style={[
            styles.helper,
            { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
          ]}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 14,
    gap: 6,
    minWidth: 150,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  helper: {
    fontSize: 12,
  },
});
