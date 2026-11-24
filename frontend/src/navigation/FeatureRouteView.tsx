
import React from 'react';
import { View, StyleSheet } from 'react-native';

import type { AppRoute } from '@/src/types/common';

import { useAuth } from '@/src/contexts/AuthContext';
import { useAppNavigation } from '@/src/contexts/NavigationContext';

import {
  ErrorState,
} from '@/src/components/common/StateViews';

import { DashboardScreen } from '@/src/features/dashboard/screens/DashboardScreen';
import { MenuScreen } from '@/src/features/menu/screens/MenuScreen';
import { CustomerOrderScreen } from '@/src/features/customer-order/screens/CustomerOrderScreen';
import { OrdersScreen } from '@/src/features/orders/screens/OrdersScreen';
import { KitchenScreen } from '@/src/features/kds/screens/KitchenScreen';
import { InventoryScreen } from '@/src/features/inventory/screens/InventoryScreen';
import { EmployeesScreen } from '@/src/features/employees/screens/EmployeesScreen';
import { ReportsScreen } from '@/src/features/reports/screens/ReportsScreen';
import { TablesScreen } from '@/src/features/tables/screens/TablesScreen';

export function FeatureRouteView({
  route,
}: {
  route: AppRoute;
}) {
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

    case 'tables':
      return <TablesScreen />;

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

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  deniedWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});
