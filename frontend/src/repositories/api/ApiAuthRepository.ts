import type { AuthRepository } from '@/src/repositories/interfaces/AuthRepository';
import type { LoginRequest, LoginResponse, QuickLoginAccount } from '@/src/features/auth/types/auth.types';
import type { ApiResponse, AuthUser } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';
import { storageService } from '@/src/services/storage/storageService';

export class ApiAuthRepository implements AuthRepository {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    await storageService.setToken(data.data.accessToken);
    await storageService.setUser(data.data.user);
    return data.data;
  }

  async getCurrentUser(): Promise<AuthUser> {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
    await storageService.setUser(data.data);
    return data.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await storageService.clearAuth();
    }
  }

  async getQuickLoginAccounts(): Promise<QuickLoginAccount[]> {
    return [];
  }
}
