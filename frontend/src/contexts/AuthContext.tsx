
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

  // Xử lý trường hợp API trả về 401.
  const handleSessionExpired = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(handleSessionExpired);

    return () => {
      registerUnauthorizedHandler(null);
    };
  }, [handleSessionExpired]);

  // Khôi phục phiên đăng nhập khi ứng dụng khởi động.
  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const presets = await repositories.auth
          .getQuickLoginAccounts()
          .catch(() => []);

        if (!active) return;

        setQuickAccounts(presets);

        const [savedToken, savedUser] = await Promise.all([
          storageService.getToken(),
          storageService.getUser(),
        ]);

        if (!active) return;

        // Không có đủ thông tin phiên thì không giữ trạng thái đăng nhập.
        if (!savedToken || !savedUser) {
          if (savedToken || savedUser) {
            await storageService.clearAuth();
          }

          return;
        }

        try {
          const freshUser =
            await repositories.auth.getCurrentUser();

          if (active) {
            setUser(freshUser);
          }
        } catch {
          await storageService.clearAuth();

          if (active) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error(
          '[AuthContext] Cannot restore session:',
          error
        );

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

  // Đăng nhập.
  const login = useCallback(
    async (payload: LoginRequest): Promise<AuthUser> => {
      const response = await repositories.auth.login(payload);

      setUser(response.user);

      return response.user;
    },
    []
  );

  // Đăng xuất: luôn xóa phiên local kể cả khi request logout thất bại.
 const logout = useCallback(async () => {
  try {
    await repositories.auth.logout();
  } catch (error) {
    console.warn('[AuthContext] Logout request failed:', error);
  } finally {
    await storageService.clearAuth();
    setUser(null);
  }
}, []);

  // Làm mới thông tin người dùng.
  const refreshProfile = useCallback(async () => {
    const freshUser =
      await repositories.auth.getCurrentUser();

    setUser(freshUser);
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => {
      return checkPermission(user?.role, permission);
    },
    [user?.role]
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
