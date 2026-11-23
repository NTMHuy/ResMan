import type { EmployeeRepository } from '@/src/repositories/interfaces/EmployeeRepository';
import type {
  CreateEmployeeInput,
  Employee,
  EmployeeFilterParams,
  UpdateEmployeeInput,
} from '@/src/features/employees/types/employee.types';
import type { ApiResponse, UserRole } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';

export class ApiEmployeeRepository implements EmployeeRepository {
  async getEmployees(params?: EmployeeFilterParams): Promise<Employee[]> {
    const { data } = await apiClient.get<ApiResponse<Employee[]>>('/users', { params });
    return data.data;
  }

  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const { data } = await apiClient.post<ApiResponse<Employee>>('/users', input);
    return data.data;
  }

  async updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const { data } = await apiClient.patch<ApiResponse<Employee>>(`/users/${id}`, input);
    return data.data;
  }

  async assignRole(id: string, role: UserRole): Promise<Employee> {
    const { data } = await apiClient.patch<ApiResponse<Employee>>(`/users/${id}/role`, { role });
    return data.data;
  }

  async toggleActive(id: string, isActive: boolean): Promise<Employee> {
    const { data } = await apiClient.patch<ApiResponse<Employee>>(`/users/${id}/status`, {
      isActive,
    });
    return data.data;
  }
}
