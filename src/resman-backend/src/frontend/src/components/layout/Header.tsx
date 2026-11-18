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

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onTabChange
}) => {
  const roleButtons: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }>; targetTab?: ActiveTab }[] = [
    { role: 'Manager', label: 'Manager', icon: ShieldCheck, targetTab: 'reporting-analytics' },
    { role: 'Order Staff', label: 'Order Staff', icon: Receipt, targetTab: 'order-management' },
    { role: 'Kitchen / KDS', label: 'Kitchen / KDS', icon: Utensils, targetTab: 'kitchen-display-system' },
    { role: 'Inventory', label: 'Inventory', icon: Boxes, targetTab: 'inventory-stock' },
    { role: 'Customer View', label: 'Customer View', icon: Smartphone, targetTab: 'customer-ordering' }
  ];

  const handleRoleSelect = (role: UserRole, targetTab?: ActiveTab) => {
    onRoleChange(role);
    if (targetTab && onTabChange) {
      onTabChange(targetTab);
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 border-b border-surface-container-high/40">
      {/* Role Switcher Toolbar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
          {roleButtons.map((btn) => {
            const Icon = btn.icon;
            const isSelected = currentRole === btn.role;

            return (
              <button
                key={btn.role}
                type="button"
                onClick={() => handleRoleSelect(btn.role, btn.targetTab)}
                className={`min-h-[36px] px-3.5 rounded font-tabular-data text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs border border-surface-container'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-secondary' : 'text-on-surface-variant'}`} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Telemetry & Profile */}
      <div className="flex items-center gap-3">
        {/* System Latency Tag */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-container-high/50">
          <Radio className="w-3.5 h-3.5 text-secondary animate-pulse" />
          <span className="font-tabular-data text-xs text-on-surface font-medium">
            Cloud POS Link OK
          </span>
          <span className="font-tabular-data text-xs text-on-surface-variant font-bold">
            12ms
          </span>
        </div>

        {/* Manager Status Badge */}
        <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-primary text-on-primary rounded text-[11px] font-tabular-data font-semibold">
          LEAD SHIFT MGR
        </div>

        {/* Notification Bell */}
        <button 
          type="button"
          className="w-9 h-9 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer relative"
          title="Thông báo hệ thống"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
