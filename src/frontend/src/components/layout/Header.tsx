import React from 'react';
import {
  ShieldCheck,
  Receipt,
  Utensils,
  Boxes,
  Smartphone,
  Bell,
  User,
  Radio
} from 'lucide-react';
import type { UserRole, ActiveTab } from '../../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onTabChange?: (tab: ActiveTab) => void;
}

const ROLE_CONFIG: {
  role: UserRole;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  targetTab: ActiveTab;
}[] = [
  { role: 'Manager', label: 'Quản lý', icon: ShieldCheck, targetTab: 'reporting-analytics' },
  { role: 'Order Staff', label: 'Nhân viên Order', icon: Receipt, targetTab: 'order-management' },
  { role: 'Kitchen / KDS', label: 'Nhân viên Bếp', icon: Utensils, targetTab: 'kitchen-display-system' },
  { role: 'Inventory', label: 'Nhân viên Kho', icon: Boxes, targetTab: 'inventory-stock' },
  { role: 'Customer View', label: 'Khách hàng', icon: Smartphone, targetTab: 'customer-ordering' }
];

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, onTabChange }) => {
  const isCustomer = currentRole === 'Customer View';

  const handleRoleSelect = (role: UserRole, targetTab: ActiveTab) => {
    onRoleChange(role);
    onTabChange?.(targetTab);
  };

  return (
    <header className={`fixed top-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-3 sm:px-4 lg:px-6 border-b border-surface-container-high/40 ${
      isCustomer ? 'left-0' : 'lg:left-64'
    }`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="hidden xl:inline text-[10px] uppercase tracking-wider font-tabular-data text-on-surface-variant">Demo role</span>
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg overflow-x-auto max-w-[calc(100vw-130px)] sm:max-w-[calc(100vw-180px)]">
          {ROLE_CONFIG.map((btn) => {
            const Icon = btn.icon;
            const isSelected = currentRole === btn.role;
            return (
              <button
                key={btn.role}
                type="button"
                onClick={() => handleRoleSelect(btn.role, btn.targetTab)}
                className={`min-h-[40px] px-2 sm:px-3 rounded font-tabular-data text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs border border-surface-container'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-secondary' : 'text-on-surface-variant'}`} />
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="hidden md:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-container-high/50">
          <Radio className="w-3.5 h-3.5 text-secondary animate-pulse" />
          <span className="font-tabular-data text-xs text-on-surface font-medium">Đồng bộ</span>
          <span className="font-tabular-data text-xs text-on-surface-variant font-bold">12ms</span>
        </div>

        <button
          type="button"
          className="w-9 h-9 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer relative"
          title="Thông báo hệ thống"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
        </button>

        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
