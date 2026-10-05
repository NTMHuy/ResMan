import React from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Clock3,
  DollarSign,
  Flame,
  PackageCheck,
  ShoppingBag,
  Users,
  Utensils,
} from 'lucide-react';
import type { InventoryItem, LiveOrder, StaffMember } from '../../types';

interface ManagerDashboardProps {
  orders: LiveOrder[];
  inventoryItems: InventoryItem[];
  staff: StaffMember[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' ₫';

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  orders,
  inventoryItems,
  staff,
  showToast,
}) => {
  const activeOrders = orders.filter((order) => ['pending', 'cooking'].includes(order.status));
  const readyOrders = orders.filter((order) => order.status === 'ready');
  const lowStock = inventoryItems.filter((item) => item.status === 'LOW_STOCK');
  const outOfStock = inventoryItems.filter((item) => item.status === 'OUT_OF_STOCK');
  const activeStaff = staff.filter((member) => member.statusType === 'active').length;

  const todayRevenue = orders.reduce((total, order) => total + order.grandTotal, 0);
  const avgOrder = orders.length ? todayRevenue / orders.length : 0;

  const handleOpenOrders = () => showToast('Đang mở danh sách đơn hàng đang xử lý...', 'info');
  const handleOpenInventory = () => showToast('Đang mở danh sách tồn kho cần xử lý...', 'info');

  return (
    <div className="flex flex-col gap-6 w-full">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="font-tabular-data text-[11px] uppercase tracking-wider text-secondary font-bold">
            Manager Workspace
          </span>
          <h1 className="font-headline font-bold text-2xl lg:text-3xl text-on-surface tracking-tight mt-1">
            Tổng quan vận hành
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Theo dõi tình hình nhà hàng và xử lý các vấn đề cần ưu tiên trong ca hiện tại.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-tabular-data text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg">
          <Clock3 className="w-4 h-4 text-secondary" />
          <span>Ca sáng • 06:00 - 14:00</span>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <button type="button" onClick={handleOpenOrders} className="text-left bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high/60 shadow-xs hover:border-secondary/40 transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">Doanh thu hiện tại</span>
              <div className="font-tabular-data font-bold text-2xl text-on-surface mt-1">{formatCurrency(todayRevenue)}</div>
              <span className="text-[11px] text-secondary font-semibold flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +14.2% so với hôm qua
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </button>

        <button type="button" onClick={handleOpenOrders} className="text-left bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high/60 shadow-xs hover:border-secondary/40 transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">Đơn đang xử lý</span>
              <div className="font-tabular-data font-bold text-2xl text-on-surface mt-1">{activeOrders.length}</div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">TB {formatCurrency(avgOrder)} / đơn</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </button>

        <button type="button" onClick={handleOpenOrders} className="text-left bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high/60 shadow-xs hover:border-secondary/40 transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">Chờ phục vụ / thanh toán</span>
              <div className="font-tabular-data font-bold text-2xl text-secondary mt-1">{readyOrders.length}</div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">Đã hoàn tất từ bếp</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
        </button>

        <button type="button" onClick={handleOpenInventory} className="text-left bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high/60 shadow-xs hover:border-error/40 transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">Cảnh báo tồn kho</span>
              <div className="font-tabular-data font-bold text-2xl text-error mt-1">{lowStock.length + outOfStock.length}</div>
              <span className="text-[11px] text-error font-semibold mt-1 block">
                {outOfStock.length} mặt hàng hết hàng
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-error-container/70 flex items-center justify-center text-error">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
        </button>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-xl border border-surface-container-high/60 shadow-xs overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-surface-container/60">
            <div>
              <h2 className="font-headline font-bold text-base text-on-surface">Đơn hàng cần theo dõi</h2>
              <p className="text-xs text-on-surface-variant mt-1">Các đơn đang chờ duyệt, đang nấu hoặc đã sẵn sàng.</p>
            </div>
            <button type="button" onClick={handleOpenOrders} className="text-xs font-semibold text-secondary hover:underline cursor-pointer">
              Xem tất cả
            </button>
          </div>

          <div className="divide-y divide-surface-container/60">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between gap-4 hover:bg-surface-container-low/50">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-tabular-data font-bold text-sm text-on-surface">{order.id}</span>
                    <span className="text-xs text-on-surface-variant">{order.table}</span>
                    {order.isVip && (
                      <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">VIP</span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 truncate">
                    {order.items.length} món • {order.guests} khách • {order.serverName}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-semibold ${order.statusBadgeClass}`}>
                    {order.statusBadge}
                  </span>
                  <div className="font-tabular-data text-xs font-bold text-on-surface mt-1">{formatCurrency(order.grandTotal)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high/60 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-surface-container/60">
            <h2 className="font-headline font-bold text-base text-on-surface">Cảnh báo cần xử lý</h2>
            <p className="text-xs text-on-surface-variant mt-1">Ưu tiên theo mức độ ảnh hưởng vận hành.</p>
          </div>
          <div className="p-4 space-y-3">
            {outOfStock.map((item) => (
              <button key={item.sku} type="button" onClick={handleOpenInventory} className="w-full text-left p-3 rounded-lg bg-error-container/60 border border-error/20 cursor-pointer hover:bg-error-container transition-colors">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-error mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-on-error-container block">Hết hàng</span>
                    <span className="text-xs text-on-error-container/90">{item.name}</span>
                  </div>
                </div>
              </button>
            ))}
            {lowStock.map((item) => (
              <button key={item.sku} type="button" onClick={handleOpenInventory} className="w-full text-left p-3 rounded-lg bg-tertiary-fixed/60 border border-tertiary/20 cursor-pointer hover:bg-tertiary-fixed transition-colors">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-on-tertiary-container mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-on-tertiary-container block">Sắp chạm định mức</span>
                    <span className="text-xs text-on-tertiary-container/90">{item.name}</span>
                  </div>
                </div>
              </button>
            ))}
            {outOfStock.length === 0 && lowStock.length === 0 && (
              <div className="py-8 text-center text-xs text-on-surface-variant">Không có cảnh báo tồn kho.</div>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high/60 p-5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-secondary" />
            <h2 className="font-headline font-bold text-sm text-on-surface">Trạng thái bếp</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Đơn đang chế biến</span>
              <span className="font-tabular-data font-bold text-on-surface">{orders.filter((o) => o.status === 'cooking').length}</span>
            </div>
            <div className="h-2 rounded-full bg-surface-container-low overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${Math.min(100, orders.filter((o) => o.status === 'cooking').length * 20)}%` }} />
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary font-semibold">
              <PackageCheck className="w-4 h-4" />
              KDS đang hoạt động
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high/60 p-5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-secondary" />
            <h2 className="font-headline font-bold text-sm text-on-surface">Nhân sự trong ca</h2>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="font-tabular-data font-bold text-3xl text-on-surface">{activeStaff}</div>
              <span className="text-xs text-on-surface-variant">đang hoạt động / {staff.length} nhân sự</span>
            </div>
            <div className="text-right text-xs text-secondary font-semibold">Sẵn sàng vận hành</div>
          </div>
        </div>

        <div className="bg-primary rounded-xl p-5 text-on-primary shadow-sm">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-secondary-fixed" />
            <h2 className="font-headline font-bold text-sm">Tóm tắt ca</h2>
          </div>
          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex justify-between gap-4"><span className="text-on-primary-container">Tổng đơn</span><span className="font-tabular-data font-bold">{orders.length}</span></div>
            <div className="flex justify-between gap-4"><span className="text-on-primary-container">Đơn đã sẵn sàng</span><span className="font-tabular-data font-bold">{readyOrders.length}</span></div>
            <div className="flex justify-between gap-4"><span className="text-on-primary-container">Hết hàng</span><span className="font-tabular-data font-bold">{outOfStock.length}</span></div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low p-4 rounded-xl border border-surface-container flex items-start gap-3">
        <PackageCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
        <div>
          <span className="font-headline font-bold text-sm text-on-surface">Nguyên tắc dashboard</span>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Dashboard chỉ tập trung vào thông tin giúp quản lý quan sát, phát hiện vấn đề và chuyển nhanh sang nghiệp vụ cần xử lý. Các màn hình chi tiết vẫn nằm ở Đơn hàng, Tồn kho, Thực đơn và Nhân viên.
          </p>
        </div>
      </section>
    </div>
  );
};
