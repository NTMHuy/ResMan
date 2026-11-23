import { useCallback, useEffect, useMemo, useState } from 'react';
import { repositories } from '@/src/repositories';
import { mockStoreEvents } from '@/src/data/mock/mockStore';
import type { UserRole } from '@/src/types/common';
import type {
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeInput,
} from '@/src/features/employees/types/employee.types';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  const fetchEmployees = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const list = await repositories.employee.getEmployees();
      setEmployees(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách nhân viên.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEmployees();
    const unsubscribe = mockStoreEvents.subscribe(() => {
      void fetchEmployees(true);
    });
    return unsubscribe;
  }, [fetchEmployees]);

  const counts = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter((e) => e.isActive).length,
      inactive: employees.filter((e) => !e.isActive).length,
    };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter((emp) => {
      const matchRole = roleFilter === 'ALL' || emp.role === roleFilter;
      const matchSearch =
        !q ||
        emp.fullName.toLowerCase().includes(q) ||
        emp.code.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.phone.includes(q);
      return matchRole && matchSearch;
    });
  }, [employees, search, roleFilter]);

  const createEmployee = useCallback(
    async (input: CreateEmployeeInput) => {
      setMutating(true);
      try {
        const created = await repositories.employee.createEmployee(input);
        await fetchEmployees(true);
        return created;
      } finally {
        setMutating(false);
      }
    },
    [fetchEmployees]
  );

  const updateEmployee = useCallback(
    async (id: string, input: UpdateEmployeeInput) => {
      setMutating(true);
      try {
        const updated = await repositories.employee.updateEmployee(id, input);
        await fetchEmployees(true);
        return updated;
      } finally {
        setMutating(false);
      }
    },
    [fetchEmployees]
  );

  const assignRole = useCallback(
    async (id: string, role: UserRole) => {
      setMutating(true);
      try {
        const updated = await repositories.employee.assignRole(id, role);
        await fetchEmployees(true);
        return updated;
      } finally {
        setMutating(false);
      }
    },
    [fetchEmployees]
  );

  const toggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      setMutating(true);
      try {
        const updated = await repositories.employee.toggleActive(id, isActive);
        await fetchEmployees(true);
        return updated;
      } finally {
        setMutating(false);
      }
    },
    [fetchEmployees]
  );

  return {
    employees: filteredEmployees,
    counts,
    loading,
    mutating,
    error,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    reload: () => fetchEmployees(false),
    createEmployee,
    updateEmployee,
    assignRole,
    toggleActive,
  };
}
