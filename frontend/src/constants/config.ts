import Constants from "expo-constants";
import { Platform } from "react-native";

const metroHost = Constants.expoConfig?.hostUri?.split(":")[0];
const defaultHost =
  metroHost || (Platform.OS === "android" ? "10.0.2.2" : "localhost");

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? `http://${defaultHost}:3000/api/v1`
).replace(/\/+$/, "");

const USE_MOCK_DATA =
  (process.env.EXPO_PUBLIC_USE_MOCK_DATA ?? "true").toLowerCase() !== "false";

const USE_MOCK_AUTH =
  (process.env.EXPO_PUBLIC_USE_MOCK_AUTH ?? "false").toLowerCase() !== "false";

const USE_MOCK_MENU =
  (process.env.EXPO_PUBLIC_USE_MOCK_MENU ?? "false").toLowerCase() !== "false";

export const APP_CONFIG = {
  APP_NAME: "ResMan",
  BRANCH_NAME: "Downtown #04",
  API_URL,
  API_ORIGIN: new URL(API_URL).origin,
  API_TIMEOUT_MS: 15000,
  USE_MOCK_DATA,
  USE_MOCK_AUTH,
  USE_MOCK_MENU,
  MOCK_LATENCY_MS: 220,
} as const;

/** Convert backend-relative image paths into absolute URLs without duplicating the API prefix. */
export function resolveMenuImageUrl(imageUrl?: string | null): string {
  const value = imageUrl?.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value.replace(/^\/+/, ""), `${APP_CONFIG.API_ORIGIN}/`).toString();
}
