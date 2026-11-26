import type { AuthUser, UserRole } from '@/src/types/common';

export type Employee = AuthUser;

export interface CreateEmployeeInput {
  code: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

export interface UpdateEmployeeInput {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface EmployeeFilterParams {
  search?: string;
  role?: UserRole | 'ALL';
}
