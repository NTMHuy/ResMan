import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser } from '@/src/types/common';

const KEYS = {
  AUTH_TOKEN: '@resman/auth_token',
  AUTH_USER: '@resman/auth_user',
  THEME: '@resman/theme',
  CUSTOMER_CART: '@resman/customer_cart',
  CUSTOMER_TABLE: '@resman/customer_table',
} as const;

export const storageService = {
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
  },

  async getUser(): Promise<AuthUser | null> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.AUTH_USER);
      if (!raw) return null;
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  async setUser(user: AuthUser): Promise<void> {
    await AsyncStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.AUTH_USER);
  },

  async clearAuth(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(KEYS.AUTH_USER),
    ]);
  },

  async getThemePreference(): Promise<'light' | 'dark' | null> {
    try {
      const val = await AsyncStorage.getItem(KEYS.THEME);
      return val === 'dark' || val === 'light' ? val : null;
    } catch {
      return null;
    }
  },

  async setThemePreference(mode: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem(KEYS.THEME, mode);
  },

  async getJson<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setJson<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  KEYS,
};
