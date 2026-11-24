import type { AuthUser } from "@/src/types/common";

import type {
  BackendAuthUser,
  BackendLoginResponse,
  BackendProfileResponse,
  LoginRequest,
  LoginResponse,
  QuickLoginAccount,
} from "@/src/features/auth/types/auth.types";

import type { AuthRepository } from "@/src/repositories/interfaces/AuthRepository";

import { apiClient } from "@/src/services/api/apiClient";
import { storageService } from "@/src/services/storage/storageService";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function mapBackendUser(
  source: BackendAuthUser | BackendProfileResponse,
): AuthUser {
  const fullName = source.employee?.fullName || source.username;

  return {
    id: source.id,
    code: source.employee?.employeeCode || source.username,
    fullName,

    email: source.email ?? "",
    phone: source.employee?.phone ?? "",

    role: source.role.code,

    station: undefined,
    shift: undefined,

    isActive: source.isActive,
    avatarInitials: getInitials(fullName),
    createdAt: "",

    permissions: source.permissions ?? [],
  };
}

export class ApiAuthRepository implements AuthRepository {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<BackendLoginResponse>(
      "/auth/login",
      payload,
    );

    const result = response.data;

    if (!result.accessToken || !result.user) {
      throw new Error("Backend trả về dữ liệu đăng nhập không hợp lệ.");
    }

    const user = mapBackendUser(result.user);

    await storageService.setToken(result.accessToken);
    await storageService.setUser(user);

    return {
      accessToken: result.accessToken,
      user,
    };
  }

  async getCurrentUser(): Promise<AuthUser> {
    const response =
      await apiClient.get<BackendProfileResponse>("/auth/profile");

    const user = mapBackendUser(response.data);

    await storageService.setUser(user);

    return user;
  }

  async logout(): Promise<void> {
    // Backend hiện chưa có endpoint logout.
    // JWT được xác thực theo hạn token và trạng thái user.
    await storageService.clearAuth();
  }

  async getQuickLoginAccounts(): Promise<QuickLoginAccount[]> {
    // Backend không cung cấp API đăng nhập nhanh.
    return [];
  }
}
