import type { EmployeeRepository } from "@/src/repositories/interfaces/EmployeeRepository";
import type {
  CreateEmployeeInput,
  Employee,
  EmployeeFilterParams,
  UpdateEmployeeInput,
} from "@/src/features/employees/types/employee.types";
import type { UserRole } from "@/src/types/common";
import { apiClient } from "@/src/services/api/apiClient";

type BackendUser = {
  id: string | number;
  username: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  role: { code: string };
  employee: { employeeCode: string; fullName: string; phone: string | null } | null;
};

type UsersResponse = { data: BackendUser[] };

function unwrap<T>(value: unknown): T {
  if (value && typeof value === "object" && "success" in value && "data" in value) {
    return (value as { data: T }).data;
  }
  return value as T;
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  return words.length > 1
    ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function mapEmployee(source: BackendUser): Employee {
  const fullName = source.employee?.fullName || source.username;
  return {
    id: String(source.id),
    code: source.employee?.employeeCode || source.username,
    fullName,
    email: source.email ?? "",
    phone: source.employee?.phone ?? "",
    role: source.role.code as UserRole,
    isActive: source.isActive,
    avatarInitials: initials(fullName),
    createdAt: source.createdAt,
  };
}

export class ApiEmployeeRepository implements EmployeeRepository {
  async getEmployees(params?: EmployeeFilterParams): Promise<Employee[]> {
    const { data } = await apiClient.get("/users", { params: { page: 1, limit: 100 } });
    const payload = unwrap<UsersResponse>(data);
    let employees = (payload.data ?? [])
      .filter((user) => user.role.code !== "CUSTOMER")
      .map(mapEmployee);
    if (params?.role && params.role !== "ALL") {
      employees = employees.filter((employee) => employee.role === params.role);
    }
    if (params?.search?.trim()) {
      const query = params.search.trim().toLowerCase();
      employees = employees.filter((employee) =>
        [employee.fullName, employee.code, employee.email, employee.phone]
          .some((value) => value.toLowerCase().includes(query)),
      );
    }
    return employees;
  }

  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const { data } = await apiClient.post("/users", {
      username: input.email.trim().toLowerCase(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      roleCode: input.role,
      employeeCode: input.code,
      fullName: input.fullName,
      phone: input.phone,
    });
    return mapEmployee(unwrap<BackendUser>(data));
  }

  async updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const { data } = await apiClient.patch(`/users/${encodeURIComponent(id)}`, {
      fullName: input.fullName,
      email: input.email?.trim().toLowerCase(),
      phone: input.phone,
    });
    let employee = mapEmployee(unwrap<BackendUser>(data));
    if (input.role && input.role !== employee.role) {
      const roleResponse = await apiClient.patch(`/users/${encodeURIComponent(id)}/role`, {
        roleCode: input.role,
      });
      employee = mapEmployee(unwrap<BackendUser>(roleResponse.data));
    }
    return employee;
  }

  async assignRole(id: string, role: UserRole): Promise<Employee> {
    const { data } = await apiClient.patch(`/users/${encodeURIComponent(id)}/role`, { roleCode: role });
    return mapEmployee(unwrap<BackendUser>(data));
  }

  async toggleActive(id: string, isActive: boolean): Promise<Employee> {
    const { data } = await apiClient.patch(`/users/${encodeURIComponent(id)}/status`, { isActive });
    return mapEmployee(unwrap<BackendUser>(data));
  }
}
