import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { AuthUser } from "@/src/types/common";

const KEYS = {
  AUTH_TOKEN: "@resman/auth_token",
  AUTH_USER: "@resman/auth_user",
  THEME: "@resman/theme",
  CUSTOMER_CART: "@resman/customer_cart",
  CUSTOMER_TABLE: "@resman/customer_table",
  CUSTOMER_SESSION_CODE: "@resman/customer_session_code",
} as const;

async function readToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  }

  return SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
}

async function writeToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    return;
  }

  await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
}

async function deleteToken(): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    return;
  }

  await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
}

export const storageService = {
  async getToken(): Promise<string | null> {
    try {
      return await readToken();
    } catch {
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    await writeToken(token);
  },

  async removeToken(): Promise<void> {
    await deleteToken();
  },

  async getCustomerSessionCode(): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        return await AsyncStorage.getItem(KEYS.CUSTOMER_SESSION_CODE);
      }
      return await SecureStore.getItemAsync(KEYS.CUSTOMER_SESSION_CODE);
    } catch {
      return null;
    }
  },

  async setCustomerSessionCode(code: string): Promise<void> {
    const value = code.trim();
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(KEYS.CUSTOMER_SESSION_CODE, value);
      return;
    }
    await SecureStore.setItemAsync(KEYS.CUSTOMER_SESSION_CODE, value);
  },

  async removeCustomerSessionCode(): Promise<void> {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(KEYS.CUSTOMER_SESSION_CODE);
      return;
    }
    await SecureStore.deleteItemAsync(KEYS.CUSTOMER_SESSION_CODE);
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
    await Promise.all([deleteToken(), AsyncStorage.removeItem(KEYS.AUTH_USER)]);
  },

  async getThemePreference(): Promise<"light" | "dark" | null> {
    try {
      const value = await AsyncStorage.getItem(KEYS.THEME);

      return value === "dark" || value === "light" ? value : null;
    } catch {
      return null;
    }
  },

  async setThemePreference(mode: "light" | "dark"): Promise<void> {
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
