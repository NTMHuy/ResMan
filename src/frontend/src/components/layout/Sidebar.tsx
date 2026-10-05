import React from 'react';
import {
  UtensilsCrossed,
  ArrowUpDown,
  BookOpen,
  ShoppingBag,
  ReceiptText,
  Flame,
  Boxes,
  BadgeCheck,
  LineChart,
  Monitor
} from 'lucide-react';
import type { ActiveTab, UserRole } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  currentRole: UserRole;
  onTabChange: (tab: ActiveTab) => void;
  branchName?: string;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_BY_ROLE: Record<Exclude<UserRole, 'Customer View'>, NavItem[]> = {
  Manager: [
    { id: 'reporting-analytics', label: 'Tổng quan', code: 'F-014 / F-015', icon: LineChart },
    { id: 'order-management', label: 'Đơn hàng', code: 'F-005 - F-007', icon: ReceiptText, badge: '14' },
    { id: 'menu-management', label: 'Thực đơn', code: 'F-001', icon: BookOpen },
    { id: 'inventory-stock', label: 'Tồn kho', code: 'F-010 / F-011', icon: Boxes },
    { id: 'employee-management', label: 'Nhân viên', code: 'F-013', icon: BadgeCheck }
  ],
  'Order Staff': [
    { id: 'order-management', label: 'Đơn hàng', code: 'F-005 - F-007', icon: ReceiptText, badge: '14' },
    { id: 'customer-ordering', label: 'Gọi món', code: 'F-002 / F-003', icon: ShoppingBag }
  ],
  'Kitchen / KDS': [
    { id: 'kitchen-display-system', label: 'Bếp KDS', code: 'F-008 / F-009', icon: Flame }
  ],
  Inventory: [
    { id: 'inventory-stock', label: 'Tồn kho', code: 'F-010 / F-011', icon: Boxes }
  ]
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  currentRole,
  onTabChange,
  branchName = 'Downtown #04'
}) => {
  if (currentRole === 'Customer View') return null;

  const navItems = NAV_BY_ROLE[currentRole];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col border-r border-surface-container-high/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col h-full">
        <div className="h-16 px-4 flex items-center gap-2.5 border-b border-surface-container/60">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-base text-on-surface tracking-tight leading-none">ResMan</span>
            <span className="font-tabular-data text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">RESTAURANT OS</span>
          </div>
          <span className="ml-auto text-[10px] font-tabular-data px-1.5 py-0.5 bg-surface-container text-on-surface-variant rounded">MVP</span>
        </div>

        <div className="px-3 py-3">
          <div className="w-full bg-surface-container-low px-3 py-2.5 rounded-lg flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-tabular-data text-[10px] text-on-surface-variant uppercase font-medium">Chi nhánh</span>
              <span className="font-headline font-semibold text-sm text-on-surface">{branchName}</span>
            </div>
            <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
          </div>
        </div>

        <nav className="flex-1 px-2 py-1 space-y-1 overflow-y-auto">
          <div className="px-3 pt-2 pb-2 font-tabular-data text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
            {currentRole}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left flex items-center justify-between px-3 min-h-[46px] rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`} />
                  <div className="flex flex-col">
                    <span className={`text-sm leading-tight ${isActive ? 'text-on-primary' : 'text-on-surface'}`}>{item.label}</span>
                    <span className={`text-[10px] font-tabular-data ${isActive ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{item.code}</span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`font-tabular-data text-xs px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface'
                  }`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-surface-container/60">
          <div className="px-3 py-2 bg-surface-container-low/40">
            <div className="flex items-center justify-between font-tabular-data text-[11px]">
              <div className="flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-on-surface-variant" />
                <span className="text-on-surface-variant">DESKTOP-01</span>
              </div>
              <span className="text-secondary font-semibold">Sẵn sàng</span>
            </div>
          </div>
          <div className="p-3 bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="font-tabular-data text-[11px] text-on-surface-variant">Hệ thống đang hoạt động</span>
            </div>
            <span className="font-tabular-data text-[11px] text-on-surface-variant font-medium">12ms</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
