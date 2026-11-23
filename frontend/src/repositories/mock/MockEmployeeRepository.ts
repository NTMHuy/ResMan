import type { EmployeeRepository } from '@/src/repositories/interfaces/EmployeeRepository';
import type {
  CreateEmployeeInput,
  Employee,
  EmployeeFilterParams,
  UpdateEmployeeInput,
} from '@/src/features/employees/types/employee.types';
import type { UserRole } from '@/src/types/common';
import { mockEmployeesData } from '@/src/data/mock/mockEmployees';
import { mockStoreEvents, simulateMockNetwork } from '@/src/data/mock/mockStore';
import { getInitials } from '@/src/utils/formatters';

function toEmployee(record: (typeof mockEmployeesData)[number]): Employee {
  const { password: _pwd, ...rest } = record;
  return { ...rest };
}

export class MockEmployeeRepository implements EmployeeRepository {
  async getEmployees(params?: EmployeeFilterParams): Promise<Employee[]> {
    await simulateMockNetwork();
    const search = params?.search?.trim().toLowerCase() ?? '';
    const role = params?.role;

    return mockEmployeesData
      .filter((emp) => emp.role !== 'GUEST')
      .filter((emp) => {
        const matchRole = !role || role === 'ALL' || emp.role === role;
        const matchSearch =
          !search ||
          emp.fullName.toLowerCase().includes(search) ||
          emp.code.toLowerCase().includes(search) ||
          emp.email.toLowerCase().includes(search);
        return matchRole && matchSearch;
      })
      .map(toEmployee);
  }

  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    await simulateMockNetwork();
    const duplicateEmail = mockEmployeesData.some(
      (e) => e.email.toLowerCase() === input.email.trim().toLowerCase()
    );
    if (duplicateEmail) {
      throw new Error('Email nhân viên đã tồn tại trong hệ thống.');
    }

    const record = {
      id: `usr-${Date.now()}`,
      code: input.code.trim().toUpperCase(),
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      role: input.role,
      station: input.station.trim(),
      shift: input.shift.trim(),
      isActive: true,
      avatarInitials: getInitials(input.fullName),
      password: input.password,
      createdAt: new Date().toISOString(),
    };
    mockEmployeesData.unshift(record);
    mockStoreEvents.emit();
    return toEmployee(record);
  }

  async updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    await simulateMockNetwork();
    const target = mockEmployeesData.find((e) => e.id === id);
    if (!target) {
      throw new Error('Không tìm thấy nhân viên.');
    }
    if (input.fullName !== undefined) {
      target.fullName = input.fullName.trim();
      target.avatarInitials = getInitials(target.fullName);
    }
    if (input.email !== undefined) target.email = input.email.trim().toLowerCase();
    if (input.phone !== undefined) target.phone = input.phone.trim();
    if (input.role !== undefined) target.role = input.role;
    if (input.station !== undefined) target.station = input.station.trim();
    if (input.shift !== undefined) target.shift = input.shift.trim();
    if (input.isActive !== undefined) target.isActive = input.isActive;
    mockStoreEvents.emit();
    return toEmployee(target);
  }

  async assignRole(id: string, role: UserRole): Promise<Employee> {
    return this.updateEmployee(id, { role });
  }

  async toggleActive(id: string, isActive: boolean): Promise<Employee> {
    return this.updateEmployee(id, { isActive });
  }
}
