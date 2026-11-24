const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const USE_MOCK_DATA =
  (process.env.EXPO_PUBLIC_USE_MOCK_DATA ?? "true").toLowerCase() !== "false";

const USE_MOCK_AUTH =
  (process.env.EXPO_PUBLIC_USE_MOCK_AUTH ?? "false").toLowerCase() !== "false";

export const APP_CONFIG = {
  APP_NAME: "ResMan",
  BRANCH_NAME: "Downtown #04",

  API_URL: API_URL.replace(/\/+$/, ""),
  API_TIMEOUT_MS: 15000,

  // Các feature chưa tích hợp vẫn giữ mock repository.
  USE_MOCK_DATA,

  // Auth mặc định dùng Backend thật.
  USE_MOCK_AUTH,

  MOCK_LATENCY_MS: 220,
} as const;
