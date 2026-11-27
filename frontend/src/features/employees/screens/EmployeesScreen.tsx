import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Edit3, Mail, Phone, Plus, Search, Shield, Users } from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useToast } from '@/src/contexts/ToastContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROLE_LABELS } from '@/src/constants/rbac';
import { useEmployees } from '@/src/features/employees/hooks/useEmployees';
import type { UserRole } from '@/src/types/common';
import type { Employee } from '@/src/features/employees/types/employee.types';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { StatCard } from '@/src/components/common/StatCard';
import { SegmentedTabs } from '@/src/components/common/SegmentedTabs';
import { PermissionGate } from '@/src/components/common/PermissionGate';
import { ConfirmDialog } from '@/src/components/common/ConfirmDialog';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/common/StateViews';
import { EmployeeFormModal } from '@/src/features/employees/components/EmployeeFormModal';
import { CustomerTabletAccountsPanel } from '@/src/features/employees/components/CustomerTabletAccountsPanel';

export function EmployeesScreen() {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'STAFF' | 'CUSTOMER_TABLETS'>('STAFF');
  const { isMobile } = useResponsive();
  const { showToast } = useToast();
  const { user: currentUser, hasPermission } = useAuth();
  const {
    employees,
    counts,
    loading,
    mutating,
    error,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    reload,
    createEmployee,
    updateEmployee,
    toggleActive,
  } = useEmployees();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [toggleTarget, setToggleTarget] = useState<{ emp: Employee; nextActive: boolean } | null>(
    null
  );

  if (viewMode === 'STAFF' && loading && employees.length === 0) {
    return (
      <View style={styles.padded}>
        <LoadingState message="Đang tải danh sách nhân sự nhà hàng..." />
      </View>
    );
  }

  if (viewMode === 'STAFF' && error) {
    return (
      <View style={styles.padded}>
        <ErrorState message={error} onRetry={() => void reload()} />
      </View>
    );
  }

  const canToggle = hasPermission('EMPLOYEE_TOGGLE_ACTIVE');
  const canAssignRole = hasPermission('EMPLOYEE_ASSIGN_ROLE');

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      <SegmentedTabs<'STAFF' | 'CUSTOMER_TABLETS'>
        value={viewMode}
        onChange={setViewMode}
        options={[
          { key: 'STAFF', label: 'Tài khoản nhân viên' },
          { key: 'CUSTOMER_TABLETS', label: 'Tài khoản khách / Tablet' },
        ]}
      />
      {viewMode === 'CUSTOMER_TABLETS' ? (
        <CustomerTabletAccountsPanel />
      ) : (
        <>
      {/* KPI Strip */}
      <View style={[styles.kpiStrip, isMobile ? styles.col : styles.row]}>
        <StatCard
          label="Tổng nhân sự"
          value={String(counts.total)}
          icon={<Users size={17} color={theme.colors.secondary} />}
          style={styles.kpiCard}
        />
        <StatCard
          label="Đang hoạt động"
          value={String(counts.active)}
          accentColor={theme.colors.success}
          style={styles.kpiCard}
        />
        <StatCard
          label="Đã khóa tài khoản"
          value={String(counts.inactive)}
          accentColor={counts.inactive > 0 ? theme.colors.error : theme.colors.onSurface}
          style={styles.kpiCard}
        />
      </View>

      {/* Filter & Actions */}
      <Card padding="md" style={styles.filterCard}>
        <View style={[styles.filterTop, isMobile ? styles.col : styles.row]}>
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm họ tên, mã NV, email hoặc SĐT..."
            leftIcon={<Search size={16} color={theme.colors.outline} />}
            containerStyle={styles.searchBox}
          />
          <PermissionGate permission="EMPLOYEE_CREATE">
            <Button
              label="Thêm nhân viên"
              variant="primary"
              size="md"
              leftIcon={<Plus size={16} color={theme.colors.onPrimary} />}
              onPress={() => {
                setEditingEmp(null);
                setFormOpen(true);
              }}
            />
          </PermissionGate>
        </View>

        <SegmentedTabs<UserRole | 'ALL'>
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { key: 'ALL', label: 'Tất cả vai trò', count: counts.total },
            { key: 'MANAGER', label: 'Quản lý' },
            { key: 'ORDER_STAFF', label: 'Phục vụ / Order' },
            { key: 'KITCHEN_STAFF', label: 'Nhân viên bếp' },
            { key: 'INVENTORY_STAFF', label: 'Nhân viên kho' },
          ]}
        />
      </Card>

      {/* Staff List */}
      {employees.length === 0 ? (
        <EmptyState
          title="Không tìm thấy nhân viên phù hợp"
          description="Thử thay đổi bộ lọc vai trò hoặc từ khóa tìm kiếm."
          actionLabel="Đặt lại bộ lọc"
          onAction={() => {
            setSearch('');
            setRoleFilter('ALL');
          }}
        />
      ) : (
        <View style={styles.list}>
          {employees.map((emp) => {
            const isSelf = currentUser?.id === emp.id;
            return (
              <Card
                key={emp.id}
                padding="md"
                style={emp.isActive ? styles.empCard : { ...styles.empCard, opacity: 0.72 }}
              >
                <View style={styles.empTop}>
                  <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                    <Text style={[styles.avatarText, { color: theme.colors.onPrimary }]}>
                      {emp.avatarInitials}
                    </Text>
                  </View>

                  <View style={styles.empInfo}>
                    <View style={styles.rowGap}>
                      <Text
                        style={[
                          styles.empName,
                          { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                        ]}
                      >
                        {emp.fullName}
                      </Text>
                      <Badge label={emp.code} tone="neutral" mono />
                      <Badge
                        label={emp.isActive ? 'Hoạt động' : 'Đã khóa'}
                        tone={emp.isActive ? 'success' : 'danger'}
                      />
                    </View>

                    <View style={styles.rowGap}>
                      <Shield size={13} color={theme.colors.secondary} />
                      <Text style={[styles.roleText, { color: theme.colors.secondary }]}>
                        {ROLE_LABELS[emp.role]}
                      </Text>

                    </View>

                    <View style={styles.contactRow}>
                      <View style={styles.contactItem}>
                        <Mail size={12} color={theme.colors.outline} />
                        <Text style={[styles.contactText, { color: theme.colors.onSurfaceVariant }]}>
                          {emp.email}
                        </Text>
                      </View>
                      <View style={styles.contactItem}>
                        <Phone size={12} color={theme.colors.outline} />
                        <Text
                          style={[
                            styles.contactText,
                            { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.mono },
                          ]}
                        >
                          {emp.phone}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.empActions}>
                    {canToggle && !isSelf ? (
                      <View style={styles.switchWrap}>
                        <Text style={[styles.switchLabel, { color: theme.colors.onSurfaceVariant }]}>
                          {emp.isActive ? 'Đang mở' : 'Đã khóa'}
                        </Text>
                        <Switch
                          value={emp.isActive}
                          onValueChange={(next) => setToggleTarget({ emp, nextActive: next })}
                          disabled={mutating}
                        />
                      </View>
                    ) : null}

                    <PermissionGate permission="EMPLOYEE_UPDATE">
                      <Pressable
                        onPress={() => {
                          setEditingEmp(emp);
                          setFormOpen(true);
                        }}
                        style={[styles.editBtn, { backgroundColor: theme.colors.surfaceLow }]}
                      >
                        <Edit3 size={15} color={theme.colors.secondary} />
                      </Pressable>
                    </PermissionGate>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      )}

      <EmployeeFormModal
        visible={formOpen}
        editingEmployee={editingEmp}
        canAssignRole={canAssignRole}
        loading={mutating}
        onClose={() => setFormOpen(false)}
        onCreate={async (input) => {
          await createEmployee(input);
          showToast('Đã tạo tài khoản nhân viên', 'success', input.fullName);
        }}
        onUpdate={async (id, input) => {
          await updateEmployee(id, input);
          showToast('Đã cập nhật hồ sơ nhân viên', 'success');
        }}
      />

      <ConfirmDialog
        visible={toggleTarget !== null}
        title={toggleTarget?.nextActive ? 'Kích hoạt tài khoản' : 'Khóa tài khoản nhân viên'}
        message={
          toggleTarget?.nextActive
            ? `Cho phép "${toggleTarget.emp.fullName}" đăng nhập lại vào hệ thống ResMan?`
            : `Khóa quyền truy cập của "${toggleTarget?.emp.fullName ?? ''}"? Nhân viên này sẽ không thể đăng nhập.`
        }
        confirmLabel={toggleTarget?.nextActive ? 'Kích hoạt' : 'Khóa tài khoản'}
        destructive={!toggleTarget?.nextActive}
        loading={mutating}
        onConfirm={async () => {
          if (!toggleTarget) return;
          await toggleActive(toggleTarget.emp.id, toggleTarget.nextActive);
          showToast(
            toggleTarget.nextActive ? 'Đã kích hoạt tài khoản' : 'Đã khóa tài khoản',
            toggleTarget.nextActive ? 'success' : 'warning',
            toggleTarget.emp.fullName
          );
          setToggleTarget(null);
        }}
        onCancel={() => setToggleTarget(null)}
      />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  padded: {
    padding: 16,
  },
  container: {
    padding: 16,
    gap: 14,
    paddingBottom: 36,
  },
  kpiStrip: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col: {
    flexDirection: 'column',
  },
  kpiCard: {
    flex: 1,
  },
  filterCard: {
    gap: 10,
  },
  filterTop: {
    gap: 10,
    justifyContent: 'space-between',
  },
  searchBox: {
    flex: 1,
    minWidth: 220,
  },
  list: {
    gap: 10,
  },
  empCard: {
    gap: 8,
  },
  empTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  empInfo: {
    flex: 1,
    minWidth: 220,
    gap: 4,
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  empName: {
    fontSize: 15,
    fontWeight: '700',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dotText: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  contactText: {
    fontSize: 12,
  },
  empActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
