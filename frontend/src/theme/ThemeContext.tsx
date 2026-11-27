
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  DARK_THEME,
  LIGHT_THEME,
  type ThemeTokens,
} from '@/src/theme/tokens';

import { storageService } from '@/src/services/storage/storageService';

interface ThemeContextValue {
  theme: ThemeTokens;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: LIGHT_THEME,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Đọc theme đã lưu.
  useEffect(() => {
    let active = true;

    const loadTheme = async () => {
      try {
        const savedTheme =
          await storageService.getThemePreference();

        if (!active) return;

        setIsDark(savedTheme === 'dark');
      } catch (error) {
        console.error(
          '[ThemeContext] Cannot load theme:',
          error
        );
      } finally {
        if (active) {
          setIsReady(true);
        }
      }
    };

    void loadTheme();

    return () => {
      active = false;
    };
  }, []);

  // Lưu theme sau khi đã đọc xong lựa chọn trước đó.
  useEffect(() => {
    if (!isReady) return;

    void storageService
      .setThemePreference(isDark ? 'dark' : 'light')
      .catch((error) => {
        console.error(
          '[ThemeContext] Cannot save theme:',
          error
        );
      });
  }, [isDark, isReady]);

  const toggleTheme = useCallback(() => {
    setIsDark((previous) => !previous);
  }, []);

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
