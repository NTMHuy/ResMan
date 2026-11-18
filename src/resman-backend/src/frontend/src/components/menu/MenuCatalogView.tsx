import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  Boxes, 
  ToggleLeft, 
  ToggleRight, 
  X,
  ExternalLink
} from 'lucide-react';
import type { MenuItem } from '../../types';

interface MenuCatalogViewProps {
  menuItems: MenuItem[];
  onMenuItemsChange: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const MenuCatalogView: React.FC<MenuCatalogViewProps> = ({
  menuItems,
  onMenuItemsChange,
  showToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<MenuItem>(menuItems[0]);

  // Add Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newDishName, setNewDishName] = useState<string>('');
  const [newDishCategory, setNewDishCategory] = useState<'APPETIZER' | 'MAIN' | 'DESSERT' | 'BEVERAGE'>('MAIN');
  const [newDishPrice, setNewDishPrice] = useState<number>(85000);
  const [newDishStation, setNewDishStation] = useState<'Bếp Nóng' | 'Bếp Nguội' | 'Quầy Bar' | 'Bếp Nướng Than'>('Bếp Nóng');
  const [newDishDescription, setNewDishDescription] = useState<string>('');

  // Batch Status Modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  const handleToggle86 = (id: string) => {
    onMenuItemsChange((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus = item.status === 'AVAILABLE' ? 'OUT_OF_STOCK' : 'AVAILABLE';
        const nextStatusLabel = nextStatus === 'AVAILABLE' ? 'Đang bán' : 'Hết hàng (86)';
        const updated = {
          ...item,
          status: nextStatus as MenuItem['status'],
          statusLabel: nextStatusLabel
        };
        if (selectedItem.id === id) {
          setSelectedItem(updated);
        }
        showToast(
          `Đã chuyển trạng thái ${item.name} sang: ${nextStatusLabel} (BR-010)`,
          nextStatus === 'AVAILABLE' ? 'success' : 'error'
        );
        return updated;
      })
    );
  };

  const handleCreateNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) {
      showToast('Vui lòng nhập tên món ăn', 'error');
      return;
    }

    const newDish: MenuItem = {
      id: `MN-${String(menuItems.length + 1).padStart(3, '0')}`,
      name: newDishName.trim(),
      category: newDishCategory,
      categoryLabel:
        newDishCategory === 'APPETIZER'
          ? 'Khai vị'
          : newDishCategory === 'MAIN'
          ? 'Món chính'
          : newDishCategory === 'DESSERT'
          ? 'Tráng miệng'
          : 'Đồ uống',
      station: newDishStation,
      price: Number(newDishPrice),
      status: 'AVAILABLE',
      statusLabel: 'Đang bán',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCOk4gjM1xi-kYRf1WR6sbGGtlglvg73PrAZdvO0dq_4rmM20LQMF0-eAKqueXPs-6Y4JhC3iWQR1Y36c-6mzYUe-BJu7FIvU4IKLb4ugW__SmbiPwj-S1b5TG0u65RS626apqQrxm6psytNDDH1gO5FFkVNfZarJUaiUbhHc-G5z0vRj9LgXAx_FlYCouQoW38D6qd174iN339iOdA37ITqRmoXdlyXJLP8vOAa2eevU8KGAqisTXtDg',
      description: newDishDescription || 'Món mới được thêm vào danh mục thực đơn.',
      inventoryLinks: [
        { name: 'Nguyên liệu chính định mức', amount: '150g / phần' },
        { name: 'Gia vị chuẩn bị', amount: 'Tiêu chuẩn' }
      ],
      modifiers: ['↳ Tiêu chuẩn']
    };

    onMenuItemsChange((prev) => [newDish, ...prev]);
    setSelectedItem(newDish);
    setIsAddModalOpen(false);
    setNewDishName('');
    setNewDishDescription('');
    showToast(`Đã thêm thành công món "${newDish.name}" vào thực đơn (F-001)`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
            Quản Lý Thực Đơn (F-001)
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Phân loại, định lượng kho nguyên liệu (F-010) và điều chỉnh trạng thái mở bán thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsBatchModalOpen(true)}
            className="min-h-[40px] px-3.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4 text-on-surface-variant" />
            <span>Cập nhật trạng thái hàng loạt</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="min-h-[40px] px-4 rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm món mới</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Tổng món trong Menu
            </span>
            <div className="font-tabular-data font-bold text-2xl text-on-surface">
              {menuItems.length}
            </div>
            <span className="text-[11px] text-secondary font-semibold">
              Hoạt động 100%
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Đang mở bán
            </span>
            <div className="font-tabular-data font-bold text-2xl text-secondary">
              {menuItems.filter((m) => m.status === 'AVAILABLE').length}
            </div>
            <span className="text-[11px] text-on-surface-variant">
              Tỷ lệ khả dụng cao
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Tạm hết hàng (86)
            </span>
            <div className="font-tabular-data font-bold text-2xl text-error">
              {menuItems.filter((m) => m.status === 'OUT_OF_STOCK').length}
            </div>
            <span className="text-[11px] text-error font-medium">
              BR-010 Tự động khóa
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-error-container/60 flex items-center justify-center text-error">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Món chính (Chủ lực)
            </span>
            <div className="font-tabular-data font-bold text-2xl text-on-surface">
              {menuItems.filter((m) => m.category === 'MAIN').length}
            </div>
            <span className="text-[11px] text-on-surface-variant">
              Đóng góp 62% GMV
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Table + Right Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Bar & Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Category Tabs & Filter Toolbar */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container-high/60 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'APPETIZER', label: 'Khai vị' },
                { id: 'MAIN', label: 'Món chính' },
                { id: 'DESSERT', label: 'Tráng miệng' },
                { id: 'BEVERAGE', label: 'Đồ uống' }
              ].map((cat) => {
                const count =
                  cat.id === 'ALL'
                    ? menuItems.length
                    : menuItems.filter((i) => i.category === cat.id).length;
                const isActive = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`min-h-[36px] px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <span>{cat.label}</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-surface-container/60">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên món, mã SKU..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-secondary border border-surface-container"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface focus:outline-none border border-surface-container cursor-pointer"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="AVAILABLE">Đang bán</option>
                  <option value="OUT_OF_STOCK">Hết hàng (86)</option>
                  <option value="INACTIVE">Tạm dừng</option>
                </select>
              </div>
            </div>
          </div>

          {/* Menu Items Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-on-surface-variant font-tabular-data border-b border-surface-container">
                  <tr>
                    <th className="py-3 px-4 uppercase font-semibold">Mã &amp; Hình</th>
                    <th className="py-3 px-4 uppercase font-semibold">Tên món ăn</th>
                    <th className="py-3 px-4 uppercase font-semibold">Phân loại &amp; Trạm</th>
                    <th className="py-3 px-4 uppercase font-semibold text-right">Đơn giá (VND)</th>
                    <th className="py-3 px-4 uppercase font-semibold text-center">Trạng thái</th>
                    <th className="py-3 px-4 uppercase font-semibold text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    const isAvailable = item.status === 'AVAILABLE';
                    const isOutOfStock = item.status === 'OUT_OF_STOCK';

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`hover:bg-surface-container-low/80 cursor-pointer transition-colors ${
                          isSelected ? 'bg-surface-container-low ring-1 ring-secondary/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover bg-surface-container shrink-0 border border-surface-container-high"
                            />
                            <span className="font-tabular-data text-[11px] font-bold text-on-surface-variant">
                              {item.id}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface text-sm">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant line-clamp-1 max-w-xs">
                              {item.description}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-on-surface font-medium">
                              {item.categoryLabel}
                            </span>
                            <span className="font-tabular-data text-[10px] text-on-surface-variant">
                              {item.station}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span className="font-tabular-data font-bold text-sm text-on-surface">
                            {item.price.toLocaleString('vi-VN')} ₫
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {isAvailable && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-tabular-data text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              Đang bán
                            </span>
                          )}
                          {isOutOfStock && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-tabular-data text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                              Hết hàng (86)
                            </span>
                          )}
                          {item.status === 'INACTIVE' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-tabular-data text-[11px] font-semibold">
                              Tạm dừng
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              title="Xem chi tiết"
                              className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggle86(item.id)}
                              title={isAvailable ? 'Khóa 86 (Hết hàng)' : 'Mở bán lại'}
                              className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                            >
                              {isAvailable ? (
                                <ToggleRight className="w-5 h-5 text-secondary" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-error" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Item Detail Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container/60">
            <div className="flex items-center gap-2">
              <span className="font-tabular-data text-xs text-on-surface-variant font-bold">
                {selectedItem.id}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                {selectedItem.categoryLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggle86(selectedItem.id)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors ${
                selectedItem.status === 'AVAILABLE'
                  ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                  : 'bg-error-container text-on-error-container'
              }`}
            >
              <span>{selectedItem.statusLabel}</span>
            </button>
          </div>

          {/* Photo */}
          <div className="relative rounded-lg overflow-hidden aspect-video bg-surface-container border border-surface-container-high">
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-primary/80 backdrop-blur-xs text-on-primary px-2.5 py-1 rounded font-tabular-data font-bold text-xs">
              {selectedItem.price.toLocaleString('vi-VN')} ₫
            </div>
          </div>

          <div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              {selectedItem.name}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {selectedItem.description}
            </p>
          </div>

          {/* Inventory Link Section (F-010) */}
          <div className="bg-surface-container-low p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-on-surface font-semibold text-xs">
                <Boxes className="w-3.5 h-3.5 text-secondary" />
                <span>Liên kết định lượng kho (F-010)</span>
              </div>
              <span className="font-tabular-data text-[10px] text-secondary font-semibold">
                BR-009 Active
              </span>
            </div>

            <div className="space-y-1 pt-1">
              {selectedItem.inventoryLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 border-b border-surface-container/40 last:border-0"
                >
                  <span className="text-on-surface">{link.name}</span>
                  <span className="font-tabular-data text-on-surface-variant font-medium">
                    {link.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modifiers List */}
          <div className="space-y-2">
            <span className="font-tabular-data text-xs text-on-surface font-semibold block">
              Tùy chọn ghi chú &amp; Modifiers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedItem.modifiers.map((mod, idx) => (
                <span
                  key={idx}
                  className="font-tabular-data text-[11px] px-2.5 py-1 bg-surface-container-low text-on-surface rounded-md border border-surface-container"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleToggle86(selectedItem.id)}
              className={`w-full min-h-[44px] rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                selectedItem.status === 'AVAILABLE'
                  ? 'bg-error text-on-error hover:bg-error/90'
                  : 'bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant'
              }`}
            >
              {selectedItem.status === 'AVAILABLE' ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>KHÓA HẾT HÀNG (86) THỜI GIAN THỰC</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MỞ BÁN LẠI MÓN ĂN TRÊN TOÀN HỆ THỐNG</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Thêm món mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline font-bold text-base text-on-surface">
                Thêm Món Mới Vào Menu (F-001)
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDish} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Tên món ăn (*):</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="Ví dụ: Bò Bít Tết Sốt Nấm Truffle"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Phân loại danh mục:</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container focus:outline-none"
                  >
                    <option value="MAIN">Món chính</option>
                    <option value="APPETIZER">Khai vị</option>
                    <option value="DESSERT">Tráng miệng</option>
                    <option value="BEVERAGE">Đồ uống</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Đơn giá bán (VND):</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Trạm chế biến KDS:</label>
                <select
                  value={newDishStation}
                  onChange={(e) => setNewDishStation(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container focus:outline-none"
                >
                  <option value="Bếp Nóng">Bếp Nóng (KDS-H1)</option>
                  <option value="Bếp Nguội">Bếp Nguội (KDS-C1)</option>
                  <option value="Quầy Bar">Quầy Bar &amp; Đồ Uống</option>
                  <option value="Bếp Nướng Than">Bếp Nướng Than</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Mô tả chi tiết:</label>
                <textarea
                  rows={2}
                  value={newDishDescription}
                  onChange={(e) => setNewDishDescription(e.target.value)}
                  placeholder="Mô tả nguyên liệu, hương vị đặc trưng..."
                  className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="min-h-[40px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-bold cursor-pointer"
                >
                  Lưu &amp; Kích hoạt mở bán
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Batch Status */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-5 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Cập Nhật Trạng Thái Hàng Loạt
              </h3>
              <button
                type="button"
                onClick={() => setIsBatchModalOpen(false)}
                className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Chọn thao tác áp dụng đồng loạt cho danh mục {selectedCategory === 'ALL' ? 'toàn bộ menu' : selectedCategory}:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onMenuItemsChange((prev) =>
                    prev.map((i) =>
                      selectedCategory === 'ALL' || i.category === selectedCategory
                        ? { ...i, status: 'AVAILABLE', statusLabel: 'Đang bán' }
                        : i
                    )
                  );
                  setIsBatchModalOpen(false);
                  showToast('Đã mở bán lại toàn bộ món trong danh mục đã chọn', 'success');
                }}
                className="w-full p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-xs font-semibold text-on-surface flex items-center justify-between cursor-pointer"
              >
                <span>Mở bán tất cả món khả dụng</span>
                <CheckCircle2 className="w-4 h-4 text-secondary" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onMenuItemsChange((prev) =>
                    prev.map((i) =>
                      selectedCategory === 'ALL' || i.category === selectedCategory
                        ? { ...i, status: 'OUT_OF_STOCK', statusLabel: 'Hết hàng (86)' }
                        : i
                    )
                  );
                  setIsBatchModalOpen(false);
                  showToast('Đã chuyển tất cả món đã chọn sang trạng thái Hết hàng (86)', 'error');
                }}
                className="w-full p-3 rounded-lg bg-error-container/50 hover:bg-error-container text-left text-xs font-semibold text-on-error-container flex items-center justify-between cursor-pointer"
              >
                <span>Khóa 86 toàn bộ danh mục</span>
                <AlertCircle className="w-4 h-4 text-error" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
