import React from 'react';
import { Slot } from 'expo-router';
import { ThemeProvider } from '@/src/theme/ThemeContext';
import { ToastProvider } from '@/src/contexts/ToastContext';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { NavigationProvider } from '@/src/contexts/NavigationContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NavigationProvider>
            <Slot />
          </NavigationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
