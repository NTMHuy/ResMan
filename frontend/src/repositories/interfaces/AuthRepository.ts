import type { AuthUser } from "@/src/types/common";

import type {
  LoginRequest,
  LoginResponse,
  QuickLoginAccount,
} from "@/src/features/auth/types/auth.types";

export interface AuthRepository {
  login(payload: LoginRequest): Promise<LoginResponse>;

  getCurrentUser(): Promise<AuthUser>;

  logout(): Promise<void>;

  getQuickLoginAccounts(): Promise<QuickLoginAccount[]>;
}
