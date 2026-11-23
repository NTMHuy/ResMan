import type { AuthUser, UserRole } from '@/src/types/common';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface QuickLoginAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  station: string;
}
