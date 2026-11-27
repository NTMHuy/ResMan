import React, { createContext, useCallback, useContext, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (title: string, variant?: ToastVariant, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, variant: ToastVariant = 'success', message?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, title, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  const getPalette = (variant: ToastVariant) => {
    switch (variant) {
      case 'success':
        return {
          bg: theme.colors.primary,
          fg: theme.colors.onPrimary,
          accent: '#4ade80',
          Icon: CheckCircle2,
        };
      case 'error':
        return {
          bg: theme.colors.error,
          fg: theme.colors.onError,
          accent: theme.colors.onError,
          Icon: XCircle,
        };
      case 'warning':
        return {
          bg: theme.colors.warning,
          fg: theme.colors.onWarning,
          accent: theme.colors.onWarning,
          Icon: AlertTriangle,
        };
      default:
        return {
          bg: theme.colors.secondary,
          fg: theme.colors.onSecondary,
          accent: theme.colors.onSecondary,
          Icon: Info,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={styles.root}>
        {children}
        {toasts.length > 0 && (
          <View
            pointerEvents="box-none"
            style={[
              styles.container,
              Platform.OS === 'web' ? styles.webPosition : styles.nativePosition,
            ]}
          >
            {toasts.map((toast) => {
              const palette = getPalette(toast.variant);
              const IconComp = palette.Icon;
              return (
                <View
                  key={toast.id}
                  style={[
                    styles.toastCard,
                    {
                      backgroundColor: palette.bg,
                      borderRadius: theme.radius.lg,
                    },
                  ]}
                >
                  <IconComp size={18} color={palette.accent} />
                  <View style={styles.toastTextWrap}>
                    <Text
                      style={[
                        styles.toastTitle,
                        { color: palette.fg, fontFamily: theme.typography.body },
                      ]}
                    >
                      {toast.title}
                    </Text>
                    {toast.message ? (
                      <Text
                        style={[
                          styles.toastMessage,
                          { color: palette.fg, fontFamily: theme.typography.body },
                        ]}
                      >
                        {toast.message}
                      </Text>
                    ) : null}
                  </View>
                  <Pressable onPress={() => dismiss(toast.id)} hitSlop={8}>
                    <X size={16} color={palette.fg} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    zIndex: 9999,
    gap: 8,
    maxWidth: 380,
    width: '90%',
  },
  webPosition: {
    bottom: 24,
    right: 24,
  },
  nativePosition: {
    bottom: 32,
    alignSelf: 'center',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  toastTextWrap: {
    flex: 1,
    gap: 2,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  toastMessage: {
    fontSize: 12,
    opacity: 0.9,
  },
});
