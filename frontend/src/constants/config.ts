const readEnv = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return String(process.env[key]);
  }
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (metaEnv && metaEnv[key]) {
    return String(metaEnv[key]);
  }
  return fallback;
};

export const APP_CONFIG = {
  APP_NAME: 'ResMan',
  BRANCH_NAME: 'Downtown #04',
  API_URL: readEnv('EXPO_PUBLIC_API_URL', 'http://localhost:3000/api/v1'),
  USE_MOCK_DATA: readEnv('EXPO_PUBLIC_USE_MOCK_DATA', 'true').toLowerCase() !== 'false',
  API_TIMEOUT_MS: 15000,
  MOCK_LATENCY_MS: 220,
} as const;
