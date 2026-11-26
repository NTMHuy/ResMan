import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ThemeProvider, useTheme } from '@/src/theme/ThemeContext';
import { ToastProvider } from '@/src/contexts/ToastContext';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { NavigationProvider, useAppNavigation } from '@/src/contexts/NavigationContext';
import { AppShell } from '@/src/components/layout/AppShell';
import { ErrorState, LoadingState } from '@/src/components/common/StateViews';
import { LoginScreen } from '@/src/features/auth/screens/LoginScreen';
import { DashboardScreen } from '@/src/features/dashboard/screens/DashboardScreen';
import { MenuScreen } from '@/src/features/menu/screens/MenuScreen';
import { CustomerOrderScreen } from '@/src/features/customer-order/screens/CustomerOrderScreen';
import { OrdersScreen } from '@/src/features/orders/screens/OrdersScreen';
import { KitchenScreen } from '@/src/features/kds/screens/KitchenScreen';
import { InventoryScreen } from '@/src/features/inventory/screens/InventoryScreen';
import { EmployeesScreen } from '@/src/features/employees/screens/EmployeesScreen';
import { ReportsScreen } from '@/src/features/reports/screens/ReportsScreen';
import type { AppRoute } from '@/src/types/common';

export function FeatureRouteView({ route }: { route: AppRoute }) {
  const { canAccessRoute, getDefaultRoute } = useAuth();
  const { navigate } = useAppNavigation();

  if (!canAccessRoute(route)) {
    return (
      <View style={styles.deniedWrap}>
        <ErrorState
          message="Tài khoản hiện tại không có quyền truy cập phân hệ này."
          onRetry={() => navigate(getDefaultRoute())}
        />
      </View>
    );
  }

  switch (route) {
    case 'dashboard':
      return <DashboardScreen />;
    case 'menu':
      return <MenuScreen />;
    case 'customer-order':
      return <CustomerOrderScreen />;
    case 'orders':
      return <OrdersScreen />;
    case 'kitchen':
      return <KitchenScreen />;
    case 'inventory':
      return <InventoryScreen />;
    case 'employees':
      return <EmployeesScreen />;
    case 'reports':
      return <ReportsScreen />;
  }
}

function AppGate() {
  const { theme } = useTheme();
  const { isLoading, isAuthenticated } = useAuth();
  const { currentRoute } = useAppNavigation();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.centerBoot, { backgroundColor: theme.colors.background }]}>
        <LoadingState message="Đang khôi phục phiên làm việc ResMan..." />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <AppShell>
      <FeatureRouteView route={currentRoute} />
    </AppShell>
  );
}

export default function AppRoot() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NavigationProvider>
            <AppGate />
          </NavigationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  centerBoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  deniedWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});
