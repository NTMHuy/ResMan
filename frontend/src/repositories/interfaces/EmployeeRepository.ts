import type {
  CreateEmployeeInput,
  Employee,
  EmployeeFilterParams,
  UpdateEmployeeInput,
} from '@/src/features/employees/types/employee.types';
import type { UserRole } from '@/src/types/common';

export interface EmployeeRepository {
  getEmployees(params?: EmployeeFilterParams): Promise<Employee[]>;
  createEmployee(input: CreateEmployeeInput): Promise<Employee>;
  updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee>;
  assignRole(id: string, role: UserRole): Promise<Employee>;
  toggleActive(id: string, isActive: boolean): Promise<Employee>;
}
