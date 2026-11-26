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

function getServerMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  const body = data as {
    message?: string | string[];
    error?: string;
  };

  if (Array.isArray(body.message)) {
    return body.message.join(", ");
  }

  return body.message || body.error;
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>;
    const statusCode = axiosError.response?.status ?? 0;

    if (axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT") {
      return {
        statusCode: 408,
        code: "REQUEST_TIMEOUT",
        message: "Kết nối máy chủ quá thời gian chờ. Vui lòng thử lại.",
      };
    }

    if (!axiosError.response) {
      return {
        statusCode: 503,
        code: "NETWORK_ERROR",
        message:
          "Không thể kết nối Backend. Hãy kiểm tra máy chủ và địa chỉ API.",
      };
    }

    if (statusCode === 401) {
      return {
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
      };
    }

    if (statusCode === 403) {
      return {
        statusCode: 403,
        code: "FORBIDDEN",
        message: "Bạn không có quyền thực hiện thao tác này.",
      };
    }

    if (statusCode === 404) {
      return {
        statusCode: 404,
        code: "NOT_FOUND",
        message: "Không tìm thấy tài nguyên yêu cầu.",
      };
    }

    if (statusCode === 400) {
      return {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message:
          getServerMessage(axiosError.response.data) ||
          "Dữ liệu gửi lên không hợp lệ.",
      };
    }

    return {
      statusCode,
      code: "API_ERROR",
      message:
        getServerMessage(axiosError.response.data) ||
        "Đã xảy ra lỗi khi kết nối máy chủ.",
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
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const requestUrl = config.url?.replace(/\/+$/, "") ?? "";
    const isLoginRequest = requestUrl === "/auth/login";
    const isGuestSessionRequest = requestUrl.startsWith("/guest/session");

    if (isLoginRequest || isGuestSessionRequest) {
      delete config.headers.Authorization;
      return config;
    }

    const token = await storageService.getToken();

    if (token) {
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

    const requestUrl = error?.config?.url ?? "";
    const normalizedUrl = requestUrl.replace(/\/+$/, "");
    const isLoginRequest = normalizedUrl === "/auth/login";
    const isGuestSessionRequest = normalizedUrl.startsWith("/guest/session");

    if (normalized.statusCode === 401 && !isLoginRequest && !isGuestSessionRequest) {
      await storageService.clearAuth();
      onUnauthorizedHandler?.();
    }

    return Promise.reject(normalized);
  },
);
