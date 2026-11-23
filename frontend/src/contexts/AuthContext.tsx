import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AuthUser, AppRoute } from '@/src/types/common';
import type { LoginRequest, QuickLoginAccount } from '@/src/features/auth/types/auth.types';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAccounts, setQuickAccounts] = useState<QuickLoginAccount[]>([]);

  const handleSessionExpired = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(handleSessionExpired);
  }, [handleSessionExpired]);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        const [savedToken, savedUser, presets] = await Promise.all([
          storageService.getToken(),
          storageService.getUser(),
          repositories.auth.getQuickLoginAccounts(),
        ]);

        if (!active) return;
        setQuickAccounts(presets);

        if (savedToken && savedUser) {
          try {
            const freshUser = await repositories.auth.getCurrentUser();
            if (active) setUser(freshUser);
          } catch {
            await storageService.clearAuth();
            if (active) setUser(null);
          }
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest): Promise<AuthUser> => {
    const res = await repositories.auth.login(payload);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    await repositories.auth.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const fresh = await repositories.auth.getCurrentUser();
    setUser(fresh);
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => checkPermission(user?.role, permission),
    [user?.role]
  );

  const canAccessRoute = useCallback(
    (route: AppRoute) => checkRouteAccess(user?.role, route),
    [user?.role]
  );

  const getDefaultRoute = useCallback(
    () => getDefaultRouteForRole(user?.role),
    [user?.role]
  );

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
