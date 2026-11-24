const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const USE_MOCK_DATA =
  (process.env.EXPO_PUBLIC_USE_MOCK_DATA ?? "true").toLowerCase() !== "false";

const USE_MOCK_AUTH =
  (process.env.EXPO_PUBLIC_USE_MOCK_AUTH ?? "false").toLowerCase() !== "false";

const USE_MOCK_MENU =
  (process.env.EXPO_PUBLIC_USE_MOCK_MENU ?? "false").toLowerCase() !== "false";

export const APP_CONFIG = {
  APP_NAME: "ResMan",
  BRANCH_NAME: "Downtown #04",

  API_URL: API_URL.replace(/\/+$/, ""),
  API_TIMEOUT_MS: 15000,

  // Các feature chưa tích hợp tiếp tục sử dụng cấu hình mock chung.
  USE_MOCK_DATA,

  // Auth có cấu hình độc lập, không bị ảnh hưởng bởi Menu.
  USE_MOCK_AUTH,

  // Menu có thể dùng API thật trong khi feature khác vẫn dùng mock.
  USE_MOCK_MENU,

  MOCK_LATENCY_MS: 220,
} as const;
