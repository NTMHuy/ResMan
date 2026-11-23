import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { APP_CONFIG } from "@/src/constants/config";
import { storageService } from "@/src/services/storage/storageService";
import type { ApiError } from "@/src/types/common";

type UnauthorizedHandler = () => void;

let onUnauthorizedHandler: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(
  handler: UnauthorizedHandler | null,
): void {
  onUnauthorizedHandler = handler;
}
export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{
      message?: string;
      code?: string;
      error?: string;
    }>;
    const statusCode = axiosErr.response?.status ?? 0;
    const serverMessage =
      axiosErr.response?.data?.message ||
      axiosErr.response?.data?.error ||
      axiosErr.message;

    if (axiosErr.code === "ECONNABORTED") {
      return {
        statusCode: 408,
        code: "REQUEST_TIMEOUT",
        message: "Kết nối máy chủ quá thời gian chờ. Vui lòng thử lại.",
      };
    }

    if (statusCode === 401) {
      return {
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      };
    }

    if (statusCode === 403) {
      return {
        statusCode: 403,
        code: "FORBIDDEN",
        message: "Bạn không có quyền thực hiện thao tác này.",
      };
    }

    return {
      statusCode,
      code: axiosErr.response?.data?.code || "API_ERROR",
      message: serverMessage || "Đã xảy ra lỗi khi kết nối máy chủ.",
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      code: "UNKNOWN_ERROR",
      message: error.message,
    };
  }

  return {
    statusCode: 500,
    code: "UNKNOWN_ERROR",
    message: "Lỗi không xác định.",
  };
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.API_URL,
  timeout: APP_CONFIG.API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storageService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(normalizeApiError(error)),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const normalized = normalizeApiError(error);
    if (normalized.statusCode === 401) {
      await storageService.clearAuth();
      if (onUnauthorizedHandler) {
        onUnauthorizedHandler();
      }
    }
    return Promise.reject(normalized);
  },
);
