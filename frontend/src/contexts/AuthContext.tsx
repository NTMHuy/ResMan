
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { AuthUser, AppRoute } from '@/src/types/common';

import type {
  LoginRequest,
  QuickLoginAccount,
} from '@/src/features/auth/types/auth.types';

import { repositories } from '@/src/repositories';
import { storageService } from '@/src/services/storage/storageService';
import { registerUnauthorizedHandler } from '@/src/services/api/apiClient';

import {
  canAccessRoute as checkRouteAccess,
  getDefaultRouteForRole,
  hasPermission as checkPermission,
  type Permission,
} from '@/src/constants/rbac';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  quickAccounts: QuickLoginAccount[];

  login: (payload: LoginRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;

  hasPermission: (permission: Permission) => boolean;
  canAccessRoute: (route: AppRoute) => boolean;
  getDefaultRoute: () => AppRoute;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  quickAccounts: [],

  login: async () => {
    throw new Error('AuthProvider not mounted');
  },

  logout: async () => {},
  refreshProfile: async () => {},

  hasPermission: () => false,
  canAccessRoute: () => false,
  getDefaultRoute: () => 'customer-order',
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [quickAccounts, setQuickAccounts] = useState<
    QuickLoginAccount[]
  >([]);

  const handleSessionExpired = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(handleSessionExpired);

    return () => {
      registerUnauthorizedHandler(null);
    };
  }, [handleSessionExpired]);

  // Khôi phục phiên đăng nhập.
  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const accounts = await repositories.auth
          .getQuickLoginAccounts()
          .catch(() => []);

        if (!active) return;

        setQuickAccounts(accounts);

        const token = await storageService.getToken();

        if (!active) return;

        if (!token) {
          await storageService.clearAuth();
          return;
        }

        // Không tin hoàn toàn user đã lưu.
        // Luôn xác thực lại bằng Backend.
        const freshUser =
          await repositories.auth.getCurrentUser();

        if (active) {
          setUser(freshUser);
        }
      } catch (error) {
        console.error(
          '[AuthContext] Cannot restore session:',
          error
        );

        await storageService.clearAuth();

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

const login = useCallback(
  async (payload: LoginRequest): Promise<AuthUser> => {
    const response = await repositories.auth.login(payload);

    console.log('[AUTH DEBUG] User sau đăng nhập:', response.user);
    console.log('[AUTH DEBUG] Role:', response.user?.role);

    setUser(response.user);

    return response.user;
  },
  []
);

  const logout = useCallback(async () => {
    try {
      await repositories.auth.logout();
    } catch (error) {
      console.warn(
        '[AuthContext] Logout failed:',
        error
      );
    } finally {
      await storageService.clearAuth();
      setUser(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const freshUser =
      await repositories.auth.getCurrentUser();

    setUser(freshUser);
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => {
      return checkPermission(
        user?.role,
        permission,
        user?.permissions
      );
    },
    [user]
  );

  const canAccessRoute = useCallback(
    (route: AppRoute) => {
      return checkRouteAccess(user?.role, route);
    },
    [user?.role]
  );

  const getDefaultRoute = useCallback(() => {
    return getDefaultRouteForRole(user?.role);
  }, [user?.role]);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    quickAccounts,

    login,
    logout,
    refreshProfile,

    hasPermission,
    canAccessRoute,
    getDefaultRoute,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
