import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';

export interface TabOption<T extends string> {
  key: T;
  label: string;
  count?: number;
}

interface SegmentedTabsProps<T extends string> {
  options: Array<TabOption<T>>;
  value: T;
  onChange: (next: T) => void;
}

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
}: SegmentedTabsProps<T>) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceLow,
          borderRadius: theme.radius.md,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[
              styles.tab,
              {
                backgroundColor: active ? theme.colors.primary : 'transparent',
                borderRadius: theme.radius.sm,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.tabLabel,
                {
                  color: active ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                  fontFamily: theme.typography.body,
                },
              ]}
            >
              {opt.label}
            </Text>
            {typeof opt.count === 'number' ? (
              <View
                style={[
                  styles.countBox,
                  {
                    backgroundColor: active
                      ? 'rgba(255,255,255,0.2)'
                      : theme.colors.surfaceHigh,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    {
                      color: active ? theme.colors.onPrimary : theme.colors.onSurface,
                      fontFamily: theme.typography.mono,
                    },
                  ]}
                >
                  {opt.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 4,
    borderWidth: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    minHeight: 36,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  countBox: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
