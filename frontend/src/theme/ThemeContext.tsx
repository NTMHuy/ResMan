import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DARK_THEME, LIGHT_THEME, type ThemeTokens } from '@/src/theme/tokens';
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    void storageService.getThemePreference().then((saved) => {
      if (saved === 'dark') {
        setIsDark(true);
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      void storageService.setThemePreference(next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
