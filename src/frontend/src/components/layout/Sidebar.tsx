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
import type { ActiveTab } from '../../types';
interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  branchName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  branchName = 'Downtown #04'
}) => {
  const navItems = [
    {
      id: 'menu-management' as ActiveTab,
      label: 'Menu Catalog',
      code: 'F-001 / F-002',
      icon: BookOpen
    },
    {
      id: 'customer-ordering' as ActiveTab,
      label: 'Customer Order',
      code: 'F-002 / F-003',
      icon: ShoppingBag
    },
    {
      id: 'order-management' as ActiveTab,
      label: 'Live Orders',
      code: 'F-003 - F-007',
      icon: ReceiptText,
      badge: '14'
    },
    {
      id: 'kitchen-display-system' as ActiveTab,
      label: 'KDS Kitchen Display',
      code: 'F-008 / F-009',
      icon: Flame
    },
    {
      id: 'inventory-stock' as ActiveTab,
      label: 'Inventory Audit',
      code: 'F-010 / F-011',
      icon: Boxes
    },
    {
      id: 'employee-management' as ActiveTab,
      label: 'Staff & Shifts',
      code: 'F-013',
      icon: BadgeCheck
    },
    {
      id: 'reporting-analytics' as ActiveTab,
      label: 'Reports & Telemetry',
      code: 'F-014 / F-015',
      icon: LineChart
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container-high/40">
      <div className="flex flex-col h-full">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center gap-2.5 bg-surface-container-lowest border-b border-surface-container/60">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-base text-on-surface tracking-tight leading-none">
              ResMan
            </span>
            <span className="font-tabular-data text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
              ENTERPRISE OS
            </span>
          </div>
          <span className="ml-auto text-[10px] font-tabular-data px-1.5 py-0.5 bg-surface-container text-on-surface-variant rounded">
            v2.4
          </span>
        </div>

        {/* Branch Station Selector */}
        <div className="px-3 py-2">
          <button 
            type="button"
            className="w-full text-left bg-surface-container-low px-3 py-2 rounded-lg flex items-center justify-between hover:bg-surface-container transition-colors group cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-tabular-data text-[10px] text-on-surface-variant uppercase font-medium">
                Branch Station
              </span>
              <span className="font-headline font-semibold text-sm text-on-surface">
                {branchName}
              </span>
            </div>
            <ArrowUpDown className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface" />
          </button>
        </div>

        {/* Operations Core Navigation Rail */}
        <nav className="flex-1 px-2 py-1 space-y-1 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 font-tabular-data text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
            Operations Core
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left flex items-center justify-between px-3 min-h-[44px] rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`} />
                  <div className="flex flex-col">
                    <span className={`text-sm leading-tight ${isActive ? 'text-on-primary' : 'text-on-surface'}`}>
                      {item.label}
                    </span>
                    <span className={`text-[10px] font-tabular-data ${isActive ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                      {item.code}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`font-tabular-data text-xs px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Terminal Info & Sync Engine Status */}
        <div className="mt-auto border-t border-surface-container/60">
          <div className="px-3 py-2 bg-surface-container-low/40">
            <div className="flex items-center justify-between font-tabular-data text-[11px]">
              <div className="flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-on-surface-variant" />
                <span className="text-on-surface-variant">POS-DESK-02</span>
              </div>
              <span className="text-secondary font-semibold">Ready</span>
            </div>
          </div>
          <div className="p-3 bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="font-tabular-data text-[11px] text-on-surface-variant">
                Sync Engine Active
              </span>
            </div>
            <span className="font-tabular-data text-[11px] text-on-surface-variant font-medium">
              0.02s
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
