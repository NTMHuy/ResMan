
import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from '@/src/theme/ThemeContext';
import { ToastProvider } from '@/src/contexts/ToastContext';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { NavigationProvider } from '@/src/contexts/NavigationContext';

function RootContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NavigationProvider>
            <RootContent />
          </NavigationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
