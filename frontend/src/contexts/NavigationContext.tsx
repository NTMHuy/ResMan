
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import {
  usePathname,
  useRouter,
} from 'expo-router';

import type { AppRoute } from '@/src/types/common';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  canAccessRoute,
  getDefaultRouteForRole,
} from '@/src/constants/rbac';

const ROUTE_PATHS = {
  dashboard: '/(main)/dashboard',
  menu: '/(main)/menu',
  'customer-order': '/(main)/customer-order',
  orders: '/(main)/orders',
  kitchen: '/(main)/kitchen',
  inventory: '/(main)/inventory',
  employees: '/(main)/employees',
  reports: '/(main)/reports',
} as const;

const VALID_ROUTES: AppRoute[] = [
  'dashboard',
  'menu',
  'customer-order',
  'orders',
  'kitchen',
  'inventory',
  'employees',
  'reports',
];

function getRouteFromPathname(
  pathname: string
): AppRoute | null {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  return VALID_ROUTES.includes(lastSegment as AppRoute)
    ? (lastSegment as AppRoute)
    : null;
}

interface NavigationContextValue {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
}

const NavigationContext =
  createContext<NavigationContextValue>({
    currentRoute: 'dashboard',
    navigate: () => {},
  });

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuth();

  const currentRoute = useMemo(
    () => getRouteFromPathname(pathname) ?? 'dashboard',
    [pathname]
  );

  // Bảo vệ cả trường hợp người dùng nhập URL trực tiếp.
  useEffect(() => {
    if (!user) return;

    const requestedRoute = getRouteFromPathname(pathname);

    if (!requestedRoute) return;

    if (!canAccessRoute(user.role, requestedRoute)) {
      const fallback = getDefaultRouteForRole(user.role);

      router.replace(ROUTE_PATHS[fallback]);
    }
  }, [user, pathname, router]);

  const navigate = useCallback(
    (route: AppRoute) => {
      if (!user) {
        router.replace('/login');
        return;
      }

      if (!canAccessRoute(user.role, route)) {
        const fallback = getDefaultRouteForRole(user.role);

        router.replace(ROUTE_PATHS[fallback]);
        return;
      }

      router.replace(ROUTE_PATHS[route]);
    },
    [user, router]
  );

  const value = useMemo(
    () => ({
      currentRoute,
      navigate,
    }),
    [currentRoute, navigate]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useAppNavigation() {
  return useContext(NavigationContext);
}
