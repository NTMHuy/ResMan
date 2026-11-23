export interface ThemeColors {
  background: string;
  surface: string;
  surfaceLow: string;
  surfaceMuted: string;
  surfaceHigh: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  border: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  success: string;
  onSuccess: string;
  successContainer: string;
  onSuccessContainer: string;
  warning: string;
  onWarning: string;
  warningContainer: string;
  onWarningContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  overlay: string;
}

export interface ThemeTokens {
  isDark: boolean;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    display: string;
    body: string;
    mono: string;
  };
}

export const LIGHT_THEME: ThemeTokens = {
  isDark: false,
  colors: {
    background: '#f8f9ff',
    surface: '#ffffff',
    surfaceLow: '#eff4ff',
    surfaceMuted: '#e5eeff',
    surfaceHigh: '#dce9ff',
    onSurface: '#0b1c30',
    onSurfaceVariant: '#45464d',
    outline: '#76777d',
    border: '#dbe2f0',
    primary: '#0f172a',
    onPrimary: '#ffffff',
    primaryContainer: '#131b2e',
    onPrimaryContainer: '#dbe2fd',
    secondary: '#0051d5',
    onSecondary: '#ffffff',
    secondaryContainer: '#dbe1ff',
    onSecondaryContainer: '#003ea8',
    success: '#15803d',
    onSuccess: '#ffffff',
    successContainer: '#dcfce7',
    onSuccessContainer: '#14532d',
    warning: '#c76c00',
    onWarning: '#ffffff',
    warningContainer: '#ffdcc3',
    onWarningContainer: '#6e3900',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#93000a',
    overlay: 'rgba(11, 28, 48, 0.45)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    display: 'Plus Jakarta Sans, sans-serif',
    body: 'DM Sans, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
};

export const DARK_THEME: ThemeTokens = {
  ...LIGHT_THEME,
  isDark: true,
  colors: {
    background: '#0b1220',
    surface: '#111a2e',
    surfaceLow: '#16223b',
    surfaceMuted: '#1c2b4a',
    surfaceHigh: '#24365c',
    onSurface: '#f1f5f9',
    onSurfaceVariant: '#94a3b8',
    outline: '#64748b',
    border: '#253352',
    primary: '#f8fafc',
    onPrimary: '#0f172a',
    primaryContainer: '#1e293b',
    onPrimaryContainer: '#e2e8f0',
    secondary: '#60a5fa',
    onSecondary: '#0b1220',
    secondaryContainer: '#1d4ed8',
    onSecondaryContainer: '#dbeafe',
    success: '#4ade80',
    onSuccess: '#052e16',
    successContainer: '#14532d',
    onSuccessContainer: '#bbf7d0',
    warning: '#fbbf24',
    onWarning: '#451a03',
    warningContainer: '#78350f',
    onWarningContainer: '#fef3c7',
    error: '#f87171',
    onError: '#450a0a',
    errorContainer: '#7f1d1d',
    onErrorContainer: '#fee2e2',
    overlay: 'rgba(0, 0, 0, 0.65)',
  },
};
