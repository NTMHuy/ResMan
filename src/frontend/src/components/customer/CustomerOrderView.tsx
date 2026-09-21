import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  Utensils, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Tablet, 
  X,
  SlidersHorizontal,
  Flame,
  CornerDownRight
} from 'lucide-react';
import type { MenuItem } from '../../types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: string[];
  note: string;
}

interface CustomerOrderViewProps {
  menuItems: MenuItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onPlaceOrder?: (cart: CartItem[], table: string) => void;
}

export const CustomerOrderView: React.FC<CustomerOrderViewProps> = ({
  menuItems,
  showToast,
  onPlaceOrder
}) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet'>('mobile');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Modifier Modal
  const [modifierItem, setModifierItem] = useState<MenuItem | null>(null);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [specialNote, setSpecialNote] = useState<string>('');

  // Cart Drawer
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [tableNumber, setTableNumber] = useState<string>('Bàn 04');

  // Order Stepper Status
  const [activeStep, setActiveStep] = useState<number>(2); // 1: Đã gửi, 2: Đang nấu, 3: Sẵn sàng

  const totalCartItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalCartPrice = cart.reduce((sum, i) => sum + i.quantity * i.menuItem.price, 0);

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleAddToCart = (item: MenuItem) => {
    if (item.status === 'OUT_OF_STOCK') {
      showToast('Món ăn đã tạm hết nguyên liệu (86). Vui lòng chọn món khác!', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1, selectedModifiers: [], note: '' }];
    });

    showToast(`Đã thêm 1x "${item.name}" vào giỏ gọi món`, 'success');
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.menuItem.id === itemId) {
            const nextQty = i.quantity + delta;
            return { ...i, quantity: nextQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const openModifierModal = (item: MenuItem) => {
    setModifierItem(item);
    setSelectedMods([]);
    setSpecialNote('');
  };

  const handleAddWithModifiers = () => {
    if (!modifierItem) return;
    setCart((prev) => [
      ...prev,
      {
        menuItem: modifierItem,
        quantity: 1,
        selectedModifiers: selectedMods,
        note: specialNote.trim()
      }
    ]);
    setModifierItem(null);
    showToast(`Đã thêm "${modifierItem.name}" với tùy chọn riêng vào giỏ`, 'success');
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      showToast('Giỏ hàng đang trống. Vui lòng chọn món ăn!', 'error');
      return;
    }

    if (onPlaceOrder) {
      onPlaceOrder(cart, tableNumber);
    }

    setCart([]);
    setIsCartDrawerOpen(false);
    setActiveStep(1);
    showToast(`Đã chuyển đơn của ${tableNumber} tới Bếp KDS & Quầy Bar thành công!`, 'success');
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {/* Device View Mode Switcher */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-surface-container/60">
        <div>
          <h2 className="font-headline font-bold text-lg text-on-surface">
            Giao Diện Thực Khách Gọi Món QR (F-002 / F-003)
          </h2>
          <p className="text-xs text-on-surface-variant">
            Mô phỏng trải nghiệm quét mã QR tại bàn gọi món trực tiếp không cần chờ phục vụ
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile QR (Khung điện thoại)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'tablet'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet Tại Bàn (Rộng)</span>
          </button>
        </div>
      </div>

      {/* Main Container framed based on viewMode */}
      <div
        className={`w-full bg-surface-container-lowest border border-surface-container-high/60 shadow-md rounded-2xl overflow-hidden transition-all relative flex flex-col ${
          viewMode === 'mobile' ? 'max-w-md' : 'max-w-4xl'
        }`}
      >
        {/* Table & Brand Banner */}
        <div className="bg-primary text-on-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-secondary-fixed" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-on-primary">{tableNumber}</span>
                <span className="text-[10px] font-tabular-data px-1.5 py-0.2 rounded bg-white/20 text-on-primary">
                  Tầng 1
                </span>
              </div>
              <span className="text-[11px] text-on-primary-container">
                ResMan Smart Dining Express
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-tabular-data text-[11px] text-on-primary-container">
              Bếp Trực Tuyến
            </span>
          </div>
        </div>

        {/* Live Order Tracking Stepper Banner */}
        <div className="bg-surface-container-low p-3 border-b border-surface-container">
          <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface-variant mb-2">
            <span className="flex items-center gap-1 text-on-surface">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span>Tiến độ món bàn của bạn:</span>
            </span>
            <span className="font-tabular-data text-secondary font-bold">
              Ước tính: ~8 phút
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-medium">
            <div
              className={`p-1.5 rounded ${
                activeStep >= 1
                  ? 'bg-secondary-fixed text-on-secondary-fixed font-bold'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              1. Đã nhận đơn (11:32)
            </div>
            <div
              className={`p-1.5 rounded ${
                activeStep >= 2
                  ? 'bg-secondary-container text-on-secondary-container font-bold animate-pulse'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              2. Bếp đang nấu
            </div>
            <div
              className={`p-1.5 rounded ${
                activeStep >= 3
                  ? 'bg-secondary text-on-secondary font-bold'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              3. Sẵn sàng ra món
            </div>
          </div>
        </div>

        {/* Category Filters & Search */}
        <div className="p-3 bg-surface-container-lowest border-b border-surface-container/60 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm món ngon, nước uống..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none border border-surface-container"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'APPETIZER', label: 'Khai vị' },
              { id: 'MAIN', label: 'Món chính' },
              { id: 'DESSERT', label: 'Tráng miệng' },
              { id: 'BEVERAGE', label: 'Đồ uống' }
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Items List / Grid */}
        <div
          className={`p-3 overflow-y-auto max-h-[520px] pb-24 ${
            viewMode === 'tablet'
              ? 'grid grid-cols-2 gap-3'
              : 'flex flex-col gap-3'
          }`}
        >
          {filteredItems.map((item) => {
            const isOutOfStock = item.status === 'OUT_OF_STOCK';
            const cartItem = cart.find((i) => i.menuItem.id === item.id);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex gap-3 ${
                  isOutOfStock
                    ? 'bg-surface-container-low/40 border-surface-container opacity-70'
                    : 'bg-surface-container-lowest border-surface-container-high/60 shadow-xs hover:border-secondary/40'
                }`}
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-primary/70 backdrop-blur-xs flex items-center justify-center text-center p-1">
                      <span className="font-tabular-data text-[10px] font-bold text-error-container">
                        86 TẠM HẾT
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-headline font-bold text-sm text-on-surface line-clamp-1">
                        {item.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-surface-container/40">
                    <span className="font-tabular-data font-bold text-sm text-secondary">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </span>

                    {isOutOfStock ? (
                      <span className="text-[10px] text-error font-medium">
                        Hết nguyên liệu
                      </span>
                    ) : cartItem ? (
                      <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-5 h-5 rounded bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-tabular-data text-xs font-bold text-on-surface min-w-3 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="w-5 h-5 rounded bg-primary text-on-primary hover:bg-inverse-surface flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openModifierModal(item)}
                          className="px-2 py-1 rounded text-[11px] font-medium bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer"
                        >
                          Tùy chọn
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="w-7 h-7 rounded-lg bg-primary hover:bg-inverse-surface text-on-primary flex items-center justify-center shadow-xs cursor-pointer"
                          title="Thêm nhanh"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Floating Cart Bar */}
        {totalCartItems > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container-high shadow-lg">
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="w-full min-h-[48px] rounded-xl bg-primary hover:bg-inverse-surface text-on-primary p-3 flex items-center justify-between shadow-md cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-secondary-fixed" />
                  <span className="absolute -top-1.5 -right-1.5 bg-secondary text-on-secondary text-[10px] font-tabular-data font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight">
                    Xem Giỏ Gọi Món ({totalCartItems} món)
                  </span>
                  <span className="text-[10px] text-on-primary-container">
                    Chạm để gửi lệnh trực tiếp vào bếp
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-tabular-data font-bold text-sm text-secondary-fixed">
                  {totalCartPrice.toLocaleString('vi-VN')} ₫
                </span>
                <ChevronRight className="w-4 h-4 text-on-primary-container" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* MODAL: Tùy biến món & Modifier */}
      {modifierItem && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-sm w-full p-5 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div>
                <h3 className="font-headline font-bold text-sm text-on-surface">
                  {modifierItem.name}
                </h3>
                <span className="font-tabular-data text-xs text-secondary font-bold">
                  {modifierItem.price.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModifierItem(null)}
                className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <span className="font-semibold block text-on-surface">
                Tùy chọn khẩu vị bếp:
              </span>
              <div className="space-y-1.5">
                {modifierItem.modifiers.map((mod, idx) => {
                  const isChecked = selectedMods.includes(mod);
                  return (
                    <label
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-secondary bg-secondary-fixed text-on-secondary-fixed-variant'
                          : 'border-surface-container bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span>{mod}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedMods(selectedMods.filter((m) => m !== mod));
                          } else {
                            setSelectedMods([...selectedMods, mod]);
                          }
                        }}
                        className="accent-secondary"
                      />
                    </label>
                  );
                })}
              </div>

              <div>
                <label className="font-semibold block mb-1">Ghi chú riêng cho bếp:</label>
                <input
                  type="text"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Ví dụ: Nước dùng thật nóng, để đá riêng..."
                  className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-surface-container focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModifierItem(null)}
                className="min-h-[38px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddWithModifiers}
                className="min-h-[38px] rounded-lg bg-primary hover:bg-inverse-surface text-on-primary text-xs font-bold cursor-pointer"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: Xem giỏ hàng & Gửi bếp */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 border border-surface-container max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Giỏ Hàng {tableNumber}
                </h3>
                <span className="text-xs text-on-surface-variant">
                  Xác nhận gọi món trực tiếp vào bếp KDS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 divide-y divide-surface-container/50">
              {cart.map((c, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-on-surface">{c.menuItem.name}</span>
                    {c.selectedModifiers.length > 0 && (
                      <div className="text-[10px] text-on-tertiary-container font-medium mt-0.5">
                        {c.selectedModifiers.join(' • ')}
                      </div>
                    )}
                    {c.note && (
                      <div className="text-[10px] text-on-surface-variant italic mt-0.5">
                        Ghi chú: {c.note}
                      </div>
                    )}
                    <span className="font-tabular-data text-[11px] text-secondary font-semibold block mt-1">
                      {c.menuItem.price.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(c.menuItem.id, -1)}
                      className="w-5 h-5 rounded bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-tabular-data text-xs font-bold text-on-surface min-w-3 text-center">
                      {c.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(c.menuItem.id, 1)}
                      className="w-5 h-5 rounded bg-primary text-on-primary hover:bg-inverse-surface flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Tạm tính ({totalCartItems} phần):</span>
                <span className="font-tabular-data font-semibold text-on-surface">
                  {totalCartPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Phí dịch vụ &amp; VAT:</span>
                <span className="font-tabular-data text-on-surface">Theo hóa đơn</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-surface-container font-bold text-sm text-on-surface">
                <span>TỔNG TIỀN MÓN:</span>
                <span className="font-tabular-data text-lg text-secondary">
                  {totalCartPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmOrder}
              className="w-full min-h-[48px] rounded-xl bg-primary hover:bg-inverse-surface text-on-primary font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Utensils className="w-4 h-4 text-secondary-fixed" />
              <span>XÁC NHẬN GỌI MÓN (GỬI BẾP)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
