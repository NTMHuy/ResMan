import type { AuthUser, UserRole } from "@/src/types/common";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface BackendRole {
  id: string;
  code: UserRole;
  name: string;
}

export interface BackendEmployee {
  id: string;
  employeeCode: string;
  fullName: string;
  phone: string | null;
}

export interface BackendAuthUser {
  id: string;
  username: string;
  email: string | null;
  isActive: boolean;

  role: BackendRole;
  employee: BackendEmployee | null;

  permissions: string[];
}

export interface BackendLoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: BackendAuthUser;
}

export interface BackendProfileResponse {
  id: string;
  username: string;
  email: string | null;
  isActive: boolean;

  role: BackendRole;
  employee: BackendEmployee | null;

  permissions: string[];
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
