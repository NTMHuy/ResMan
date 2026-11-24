import type { AuthRepository } from "@/src/repositories/interfaces/AuthRepository";

import type {
  LoginRequest,
  LoginResponse,
  QuickLoginAccount,
} from "@/src/features/auth/types/auth.types";

import type { AuthUser } from "@/src/types/common";

import { mockUsersData, type MockUserRecord } from "@/src/data/mock/mockUsers";

import { simulateMockNetwork } from "@/src/data/mock/mockStore";
import { storageService } from "@/src/services/storage/storageService";

function stripPassword(record: MockUserRecord): AuthUser {
  const { password: _password, ...user } = record;

  return { ...user };
}

export class MockAuthRepository implements AuthRepository {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    await simulateMockNetwork();

    const identifier = payload.username.trim().toLowerCase();

    const userRecord = mockUsersData.find((user) => {
      const email = user.email.toLowerCase();
      const emailPrefix = email.split("@")[0];

      return email === identifier || emailPrefix === identifier;
    });

    if (!userRecord || userRecord.password !== payload.password) {
      throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }

    if (!userRecord.isActive) {
      throw new Error(
        "Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ Quản lý.",
      );
    }

    const user = stripPassword(userRecord);

    const accessToken = `mock-jwt-${user.id}-${Date.now()}`;

    await storageService.setToken(accessToken);
    await storageService.setUser(user);

    return {
      accessToken,
      user,
    };
  }

  async getCurrentUser(): Promise<AuthUser> {
    await simulateMockNetwork();

    const cached = await storageService.getUser();

    if (!cached) {
      throw new Error("Phiên đăng nhập chưa được khởi tạo.");
    }

    const latest = mockUsersData.find((user) => user.id === cached.id);

    if (!latest || !latest.isActive) {
      await storageService.clearAuth();
      throw new Error("Tài khoản không còn hoạt động.");
    }

    return stripPassword(latest);
  }

  async logout(): Promise<void> {
    await storageService.clearAuth();
  }

  async getQuickLoginAccounts(): Promise<QuickLoginAccount[]> {
    const primaryEmails = [
      "manager@resman.vn",
      "order@resman.vn",
      "kitchen@resman.vn",
      "inventory@resman.vn",
      "guest@resman.vn",
    ];

    return mockUsersData
      .filter((user) => primaryEmails.includes(user.email))
      .map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        role: user.role,
        station: user.station || "Downtown #04",
      }));
  }
}
