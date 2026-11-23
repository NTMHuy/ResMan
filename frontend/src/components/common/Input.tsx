import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  leftIcon,
  containerStyle,
  multiline,
  ...rest
}: InputProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
          ]}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: theme.colors.surfaceLow,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.radius.md,
            minHeight: multiline ? 76 : 42,
            alignItems: multiline ? 'flex-start' : 'center',
            paddingVertical: multiline ? 8 : 0,
          },
        ]}
      >
        {leftIcon ? <View style={styles.iconSlot}>{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor={theme.colors.outline}
          multiline={multiline}
          style={[
            styles.input,
            {
              color: theme.colors.onSurface,
              fontFamily: theme.typography.body,
            },
          ]}
          {...rest}
        />
      </View>
      {error ? (
        <Text style={[styles.error, { color: theme.colors.error, fontFamily: theme.typography.body }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputBox: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  iconSlot: {
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
  },
});
