import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  Download, 
  Plus, 
  Search, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  Thermometer, 
  Droplets, 
  Lock, 
  Edit3, 
  History, 
  X,
  ShieldAlert,
  ArrowDownToLine,
  ArrowUpFromLine
} from 'lucide-react';
import type { InventoryItem } from '../../types';

interface InventoryAuditViewProps {
  items: InventoryItem[];
  onItemsChange: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const InventoryAuditView: React.FC<InventoryAuditViewProps> = ({
  items,
  onItemsChange,
  showToast
}) => {
  const [activeZone, setActiveZone] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Stock Adjustment Modal
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<'restock' | 'adjust' | 'waste'>('restock');
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Nhập hàng định kỳ từ nhà cung cấp');

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeZone !== 'ALL' && item.zone !== activeZone) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.sku.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;

    // BR-009: Negative-stock protection
    let nextStock = adjustItem.currentStock;
    if (adjustType === 'restock') {
      nextStock += Number(adjustAmount);
    } else if (adjustType === 'adjust') {
      nextStock = Number(adjustAmount);
    } else if (adjustType === 'waste') {
      nextStock = Math.max(0, nextStock - Number(adjustAmount));
    }

    if (nextStock < 0) {
      showToast('Lỗi BR-009: Hệ thống ngăn chặn tồn kho âm!', 'error');
      return;
    }

    let nextStatus: InventoryItem['status'] = 'IN_STOCK';
    if (nextStock === 0) {
      nextStatus = 'OUT_OF_STOCK';
    } else if (nextStock <= adjustItem.minStock) {
      nextStatus = 'LOW_STOCK';
    }

    onItemsChange((prev) =>
      prev.map((i) =>
        i.sku === adjustItem.sku
          ? {
              ...i,
              currentStock: nextStock,
              status: nextStatus,
              updatedAt: new Date().toLocaleTimeString('vi-VN')
            }
          : i
      )
    );

    setAdjustItem(null);
    showToast(
      `Đã cập nhật tồn kho ${adjustItem.sku} (${adjustItem.name}): Tồn mới = ${nextStock} ${adjustItem.unit}`,
      'success'
    );
  };

  const handleExportCSV = () => {
    showToast('Đang kết xuất file báo cáo kiểm kê tồn kho (F-010) định dạng CSV...', 'info');
    setTimeout(() => {
      showToast('Đã tải xuống thành công: ResMan_Inventory_Audit_Report.csv', 'success');
    }, 600);
  };

  const handleEmergencyRestock = (sku: string) => {
    onItemsChange((prev) =>
      prev.map((i) =>
        i.sku === sku
          ? {
              ...i,
              currentStock: 25.0,
              status: 'IN_STOCK',
              updatedAt: new Date().toLocaleTimeString('vi-VN')
            }
          : i
      )
    );
    showToast(`Đã nhập khẩn cấp 25.0 kg cho ${sku}! Đã mở lại mở bán tự động trên Menu (BR-010).`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
            Quản Lý &amp; Kiểm Kê Tồn Kho (F-010)
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Đối soát nguyên vật liệu thời gian thực, quản lý kho lạnh và kiểm toán nhật ký xuất nhập tồn
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="min-h-[40px] px-3.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-on-surface-variant" />
            <span>Xuất Báo Cáo Kho (CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => setAdjustItem(items[0])}
            className="min-h-[40px] px-4 rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Phiếu Nhập / Điều Chỉnh Kho</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Tổng số mặt hàng SKU
            </span>
            <div className="font-tabular-data font-bold text-2xl text-on-surface">
              128
            </div>
            <span className="text-[11px] text-secondary font-semibold">
              Đang kiểm soát 100%
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Cận định mức an toàn
            </span>
            <div className="font-tabular-data font-bold text-2xl text-on-tertiary-container">
              {items.filter((i) => i.status === 'LOW_STOCK').length + 10}
            </div>
            <span className="text-[11px] text-on-tertiary-container font-medium">
              Cần đặt thêm hôm nay
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-tertiary-container">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Cảnh báo hết hàng (86)
            </span>
            <div className="font-tabular-data font-bold text-2xl text-error">
              {items.filter((i) => i.status === 'OUT_OF_STOCK').length}
            </div>
            <span className="text-[11px] text-error font-medium">
              BR-010 Khóa trên Menu
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-error-container/60 flex items-center justify-center text-error">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Tổng giá trị hàng tồn
            </span>
            <div className="font-tabular-data font-bold text-2xl text-on-surface">
              142.85M ₫
            </div>
            <span className="text-[11px] text-secondary font-semibold">
              +2.4% so với tuần trước
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner (BR-008 & BR-010) */}
      <div className="bg-error-container/80 border border-error/30 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div>
            <span className="font-headline font-bold text-sm text-on-error-container">
              CẢNH BÁO TỒN KHO NGUY CẤP (BR-008 &amp; BR-010)
            </span>
            <p className="text-xs text-on-error-container mt-0.5">
              Thịt Bò Wagyu A5 (SKU-0091) đã về 0.0 kg. Hệ thống đã tự động khóa mở bán món MN-006 trên Menu Order và thông báo đến Bếp Trưởng.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleEmergencyRestock('SKU-0091')}
          className="min-h-[38px] px-3.5 rounded-lg bg-error hover:bg-error/90 text-on-error font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
        >
          Nhập Hàng Khẩn Cấp (+25kg)
        </button>
      </div>

      {/* Cold Storage Sensor & Zone Layout */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-4 relative rounded-xl overflow-hidden aspect-video bg-surface-container border border-surface-container-high">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqiUmb1mgMKlzMmZzMPeyXz8NNxJ_uh30_lLN8niIDSWYYhO2WbE46QqphTW06BEn2QXUfcsI1cVh9WA5i9KRPvD3xpvdmllMHKhrSFj2UL1ys-kT0Ef-hWhYUkCNqhWLqKyCxNqDQynsvOuXKK7V6MFOVT0Z-bynApujbGIpiydlgMcT0ZfuEdMev775VfVPNTQJBBBt6B_gFvdzOs-gQEQr6oDLcTYxwiJgg_cYDAS5fm_FyE54BcQ"
            alt="Kho lạnh bảo quản ResMan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-xs text-on-primary px-2 py-0.5 rounded text-[10px] font-tabular-data font-bold">
            CAMERA SENSOR KHO-01
          </div>
        </div>

        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-sm text-on-surface">
              Hệ Thống Giám Sát Cảm Biến Kho Lạnh &amp; Thực Phẩm
            </span>
            <span className="font-tabular-data text-xs text-secondary font-semibold">
              Chuẩn HACCP Đạt
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container flex items-center gap-2.5">
              <Thermometer className="w-4 h-4 text-secondary shrink-0" />
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase font-medium">Nhiệt độ ngăn đông</span>
                <span className="font-tabular-data font-bold text-sm text-on-surface">-18.4°C (Chuẩn)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-secondary shrink-0" />
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase font-medium">Độ ẩm lưu trữ</span>
                <span className="font-tabular-data font-bold text-sm text-on-surface">88% RH (Tối ưu)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-secondary shrink-0" />
              <div>
                <span className="text-[10px] text-on-surface-variant block uppercase font-medium">Cửa kho tự động</span>
                <span className="font-tabular-data font-bold text-sm text-on-surface">Khóa từ an toàn</span>
              </div>
            </div>
          </div>

          {/* Station Readiness Gauge */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-tabular-data">
              <span className="text-on-surface-variant">Mức độ sẵn sàng nguyên liệu ca trực:</span>
              <span className="font-bold text-secondary">94.2%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div className="w-[94.2%] h-full bg-secondary rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table & Zone Tabs */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 overflow-hidden space-y-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Storage Zone tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'ALL', label: 'Tất cả kho' },
              { id: 'BEP_NONG', label: 'Kho Lạnh Bếp Nóng' },
              { id: 'KHO_MAT', label: 'Kho Mát Tổng' },
              { id: 'PHA_CHE', label: 'Quầy Pha Chế' }
            ].map((zone) => {
              const count =
                zone.id === 'ALL'
                  ? items.length
                  : items.filter((i) => i.zone === zone.id).length;
              const isActive = activeZone === zone.id;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveZone(zone.id)}
                  className={`min-h-[36px] px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span>{zone.label}</span>
                  <span
                    className={`font-tabular-data text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-on-primary' : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm SKU, tên nguyên liệu..."
                className="w-full h-9 pl-8 pr-3 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none border border-surface-container"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface focus:outline-none border border-surface-container cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="IN_STOCK">Đủ tồn kho</option>
              <option value="LOW_STOCK">Cận định mức</option>
              <option value="OUT_OF_STOCK">Hết hàng (86)</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-surface-container">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-tabular-data border-b border-surface-container">
              <tr>
                <th className="py-2.5 px-3 uppercase font-semibold">Mã SKU</th>
                <th className="py-2.5 px-3 uppercase font-semibold">Tên nguyên liệu</th>
                <th className="py-2.5 px-3 uppercase font-semibold">Vị trí lưu kho</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-center">ĐVT</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-right">Tồn thực tế</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-right">Mức tối thiểu</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-center">Trạng thái</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container/60">
              {filteredItems.map((item) => (
                <tr key={item.sku} className="hover:bg-surface-container-low/50">
                  <td className="py-3 px-3 font-tabular-data font-bold text-on-surface-variant">
                    {item.sku}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface text-sm">{item.name}</span>
                      <span className="text-[11px] text-on-surface-variant">{item.usageDesc}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-on-surface font-medium">
                    {item.zoneLabel}
                  </td>
                  <td className="py-3 px-3 text-center font-tabular-data text-on-surface-variant">
                    {item.unit}
                  </td>
                  <td className="py-3 px-3 text-right font-tabular-data font-bold text-sm">
                    <span
                      className={
                        item.currentStock === 0
                          ? 'text-error'
                          : item.currentStock <= item.minStock
                          ? 'text-on-tertiary-container'
                          : 'text-on-surface'
                      }
                    >
                      {item.currentStock.toFixed(1)} {item.unit}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-tabular-data text-on-surface-variant">
                    {item.minStock.toFixed(1)} {item.unit}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.status === 'IN_STOCK' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-tabular-data text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-secondary" />
                        Đủ tồn kho
                      </span>
                    )}
                    {item.status === 'LOW_STOCK' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-tabular-data text-[10px] font-semibold">
                        <AlertTriangle className="w-3 h-3 text-on-tertiary-container" />
                        Cận tồn ({item.tag || 'Cần nhập'})
                      </span>
                    )}
                    {item.status === 'OUT_OF_STOCK' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-tabular-data text-[10px] font-semibold">
                        <AlertTriangle className="w-3 h-3 text-error" />
                        {item.tag || "86'D HẾT TỒN"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setAdjustItem(item);
                        setAdjustAmount(item.minStock);
                      }}
                      className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Điều chỉnh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Điều chỉnh tồn kho (BR-009) */}
      {adjustItem && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div>
                <h3 className="font-headline font-bold text-sm text-on-surface">
                  Phiếu Kiểm Kê / Nhập Tồn Kho (BR-009)
                </h3>
                <span className="text-xs text-on-surface-variant font-tabular-data">
                  {adjustItem.sku} • {adjustItem.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAdjustItem(null)}
                className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
              <div className="bg-surface-container-low p-3 rounded-lg flex justify-between">
                <span className="text-on-surface-variant">Tồn thực tế hiện tại:</span>
                <span className="font-tabular-data font-bold text-on-surface">
                  {adjustItem.currentStock.toFixed(1)} {adjustItem.unit}
                </span>
              </div>

              <div>
                <label className="font-semibold block mb-1">Loại nghiệp vụ:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('restock')}
                    className={`py-2 px-1 text-center rounded-lg border font-semibold cursor-pointer ${
                      adjustType === 'restock'
                        ? 'border-secondary bg-secondary-fixed text-on-secondary-fixed-variant'
                        : 'border-surface-container bg-surface-container-low text-on-surface'
                    }`}
                  >
                    + Nhập thêm
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('adjust')}
                    className={`py-2 px-1 text-center rounded-lg border font-semibold cursor-pointer ${
                      adjustType === 'adjust'
                        ? 'border-secondary bg-secondary-fixed text-on-secondary-fixed-variant'
                        : 'border-surface-container bg-surface-container-low text-on-surface'
                    }`}
                  >
                    = Cập nhật số
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('waste')}
                    className={`py-2 px-1 text-center rounded-lg border font-semibold cursor-pointer ${
                      adjustType === 'waste'
                        ? 'border-error bg-error-container text-on-error-container'
                        : 'border-surface-container bg-surface-container-low text-on-surface'
                    }`}
                  >
                    - Xuất hủy
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Số lượng ({adjustItem.unit}):
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container font-tabular-data font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Lý do điều chỉnh / Ghi chú kiểm kê:</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustItem(null)}
                  className="min-h-[40px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-bold cursor-pointer shadow-xs"
                >
                  Lưu &amp; Cập nhật kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
