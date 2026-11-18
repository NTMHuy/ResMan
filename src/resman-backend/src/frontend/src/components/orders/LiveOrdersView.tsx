import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Printer, 
  Send, 
  CreditCard, 
  XCircle, 
  Clock, 
  User, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Receipt,
  X,
  Banknote,
  QrCode
} from 'lucide-react';
import type { LiveOrder, LiveOrderItem } from '../../types';interface LiveOrdersViewProps {
  orders: LiveOrder[];
  onOrdersChange: React.Dispatch<React.SetStateAction<LiveOrder[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onSendToKDS?: (order: LiveOrder) => void;
}

export const LiveOrdersView: React.FC<LiveOrdersViewProps> = ({
  orders,
  onOrdersChange,
  showToast,
  onSendToKDS
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || 'ORD-1042');
  const [activeQueueTab, setActiveQueueTab] = useState<'all' | 'pending' | 'cooking' | 'ready'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card'>('cash');
  const [cashReceived, setCashReceived] = useState<number>(2200000);

  // Void/Refund Modal (BR-006)
  const [isVoidModalOpen, setIsVoidModalOpen] = useState<boolean>(false);
  const [voidReason, setVoidReason] = useState<string>('Khách yêu cầu hủy trước khi vào bếp');

  // New Table Order Modal (F-003)
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [newOrderTable, setNewOrderTable] = useState<string>('Bàn 15');
  const [newOrderGuests, setNewOrderGuests] = useState<number>(2);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const filteredOrders = orders.filter((order) => {
    if (activeQueueTab !== 'all' && order.status !== activeQueueTab) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchTable = order.table.toLowerCase().includes(q);
      const matchServer = order.serverName.toLowerCase().includes(q);
      if (!matchId && !matchTable && !matchServer) return false;
    }
    return true;
  });

  const handleDispatchToKitchen = (orderId: string) => {
    onOrdersChange((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const updatedItems = ord.items.map((item) => ({
          ...item,
          kdsStatus: 'Đang nấu' as LiveOrderItem['kdsStatus']
        }));
        const updatedLogs = [
          ...ord.logs,
          {
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            title: 'Lệnh chuyển bếp thành công (F-006)',
            description: 'Tất cả các món ăn đã được chuyển sang trạm KDS Bếp Nóng & Bar.',
            isCurrent: true
          }
        ];
        return {
          ...ord,
          status: 'cooking',
          statusBadge: 'Đang nấu tại KDS',
          statusBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant',
          items: updatedItems,
          logs: updatedLogs
        };
      })
    );

    if (onSendToKDS && selectedOrder) {
      onSendToKDS(selectedOrder);
    }

    showToast(`Đã chuyển đơn #${orderId} sang toàn bộ màn hình KDS Station bếp chế biến (F-006)`, 'success');
  };

  const handleCompletePayment = () => {
    if (!selectedOrder) return;
    onOrdersChange((prev) =>
      prev.map((ord) => {
        if (ord.id !== selectedOrder.id) return ord;
        return {
          ...ord,
          status: 'completed',
          statusBadge: 'Đã thanh toán (F-012)',
          statusBadgeClass: 'bg-surface-container text-on-surface'
        };
      })
    );
    setIsPaymentModalOpen(false);
    showToast(
      `Ghi nhận thanh toán thành công cho #${selectedOrder.id} - ${selectedOrder.table}: ${selectedOrder.grandTotal.toLocaleString('vi-VN')} ₫`,
      'success'
    );
  };

  const handleConfirmVoid = () => {
    if (!selectedOrder) return;
    onOrdersChange((prev) => prev.filter((ord) => ord.id !== selectedOrder.id));
    setIsVoidModalOpen(false);
    showToast(
      `Đã hủy đơn hàng #${selectedOrder.id} (${selectedOrder.table}) theo quy trình đối soát BR-006`,
      'error'
    );
  };

  const handlePrintDraftReceipt = () => {
    showToast(`Đã gửi lệnh in tạm tính cho ${selectedOrder.table} tới máy in nhiệt quầy thu ngân`, 'info');
  };

  const handleCreateNewOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd: LiveOrder = {
      id: `ORD-${Math.floor(1050 + Math.random() * 50)}`,
      table: newOrderTable,
      guests: Number(newOrderGuests),
      status: 'pending',
      statusBadge: 'Chờ duyệt món mới',
      statusBadgeClass: 'bg-error-container text-on-error-container',
      createdAt: new Date().toLocaleTimeString('vi-VN'),
      totalAmount: 450000,
      serverName: 'Nguyễn Minh Quân',
      serverCode: 'NV-001',
      warningText: 'Vừa tạo từ POS',
      location: 'Khu Vực Trong Nhà',
      items: [
        {
          stt: '01',
          name: 'Phở Bò Đặc Biệt',
          quantity: 2,
          price: 85000,
          total: 170000,
          kdsStatus: 'Chờ gửi KDS',
          modifierText: '↳ Không hành lá'
        },
        {
          stt: '02',
          name: 'Trà Đào Cam Sả',
          quantity: 2,
          price: 45000,
          total: 90000,
          kdsStatus: 'Chờ gửi KDS'
        }
      ],
      subtotal: 260000,
      serviceCharge: 13000,
      vat: 21840,
      grandTotal: 294840,
      logs: [
        {
          time: new Date().toLocaleTimeString('vi-VN'),
          title: 'Tạo đơn hàng mới (F-003)',
          description: `Nhân viên NV-001 mở bàn ${newOrderTable} cho ${newOrderGuests} khách.`,
          isCurrent: true
        }
      ]
    };

    onOrdersChange((prev) => [newOrd, ...prev]);
    setSelectedOrderId(newOrd.id);
    setIsNewOrderModalOpen(false);
    showToast(`Đã tạo thành công đơn hàng #${newOrd.id} cho ${newOrd.table}`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title Header & Shift Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
            Quản Lý Đơn Hàng &amp; Điều Phối (F-003)
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Theo dõi tiến độ đơn, phân bổ trạm KDS và đối soát thanh toán trực tiếp
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Shift telemetry block */}
          <div className="hidden sm:flex items-center gap-3 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-surface-container-high/50 text-xs">
            <div className="flex flex-col">
              <span className="font-tabular-data text-[10px] uppercase text-on-surface-variant">Tổng đơn ca</span>
              <span className="font-tabular-data font-bold text-on-surface">42 đơn</span>
            </div>
            <div className="h-6 w-px bg-surface-container" />
            <div className="flex flex-col">
              <span className="font-tabular-data text-[10px] uppercase text-on-surface-variant">Doanh thu tạm tính</span>
              <span className="font-tabular-data font-bold text-secondary">28.450.000 ₫</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewOrderModalOpen(true)}
            className="min-h-[40px] px-4 rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Đơn Tại Bàn (F-003)</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Orders Queue List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container-high/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-tabular-data text-xs uppercase font-bold text-on-surface">
                Hàng Đợi Hoạt Động ({orders.length})
              </span>
              <span className="font-tabular-data text-[11px] text-secondary font-semibold">
                Auto-sync OK
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'pending', label: 'Chờ duyệt' },
                { id: 'cooking', label: 'Đang nấu' },
                { id: 'ready', label: 'Sẵn sàng' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveQueueTab(tab.id as any)}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded transition-colors cursor-pointer ${
                    activeQueueTab === tab.id
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn, tên bàn, nhân viên..."
                className="w-full h-9 pl-8 pr-3 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none border border-surface-container"
              />
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredOrders.map((ord) => {
              const isSelected = selectedOrderId === ord.id;
              const isPending = ord.status === 'pending';

              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-surface-container-lowest shadow-xs ${
                    isSelected
                      ? 'border-secondary ring-1 ring-secondary/40 bg-surface-container-low/40'
                      : 'border-surface-container-high/60 hover:bg-surface-container-low/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-sm text-on-surface">
                        {ord.table}
                      </span>
                      {ord.isVip && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">
                          VIP
                        </span>
                      )}
                      <span className="font-tabular-data text-xs text-on-surface-variant">
                        ({ord.guests} khách)
                      </span>
                    </div>

                    <span className="font-tabular-data text-xs font-bold text-on-surface">
                      {ord.grandTotal.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container/50">
                    <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                      <span className="font-tabular-data font-semibold">#{ord.id}</span>
                      <span>•</span>
                      <span className="font-tabular-data">{ord.createdAt}</span>
                    </div>

                    <span className={`text-[10px] font-tabular-data font-bold px-2 py-0.5 rounded-full ${ord.statusBadgeClass}`}>
                      {ord.statusBadge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-on-surface-variant">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-outline" />
                      <span>{ord.serverName}</span>
                    </div>
                    {ord.warningText && (
                      <span className="text-error font-medium flex items-center gap-0.5 text-[10px]">
                        <Clock className="w-2.5 h-2.5" />
                        {ord.warningText}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Order Workbench (8 cols) */}
        {selectedOrder ? (
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 p-5 space-y-5">
            {/* Workbench Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container/60 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-xl text-on-surface">
                    {selectedOrder.table}
                  </span>
                  <span className="font-tabular-data text-xs font-bold px-2.5 py-1 rounded bg-primary text-on-primary">
                    #{selectedOrder.id}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded bg-surface-container text-on-surface-variant flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-outline" />
                    <span>{selectedOrder.location}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1.5 font-tabular-data">
                  <span>Giờ tạo: {selectedOrder.createdAt}</span>
                  <span>•</span>
                  <span>Phục vụ: {selectedOrder.serverName} ({selectedOrder.serverCode})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-lg font-tabular-data text-xs font-bold ${selectedOrder.statusBadgeClass}`}>
                  {selectedOrder.statusBadge}
                </span>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="overflow-x-auto rounded-lg border border-surface-container">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-on-surface-variant font-tabular-data border-b border-surface-container">
                  <tr>
                    <th className="py-2.5 px-3 uppercase font-semibold">STT</th>
                    <th className="py-2.5 px-3 uppercase font-semibold">Tên món &amp; Modifier</th>
                    <th className="py-2.5 px-3 uppercase font-semibold text-center">SL</th>
                    <th className="py-2.5 px-3 uppercase font-semibold text-right">Đơn giá</th>
                    <th className="py-2.5 px-3 uppercase font-semibold text-right">Thành tiền</th>
                    <th className="py-2.5 px-3 uppercase font-semibold text-center">KDS Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  {selectedOrder.items.map((it) => (
                    <tr key={it.stt} className="hover:bg-surface-container-low/40">
                      <td className="py-3 px-3 font-tabular-data text-on-surface-variant font-bold">
                        {it.stt}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-sm">{it.name}</span>
                          {it.modifierText && (
                            <span className="font-tabular-data text-[11px] text-on-tertiary-container mt-0.5 font-medium">
                              {it.modifierText}
                            </span>
                          )}
                          {it.note && (
                            <span className="font-tabular-data text-[10px] text-on-surface-variant italic mt-0.5">
                              {it.note}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-tabular-data font-bold text-sm">
                        {it.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-tabular-data text-on-surface">
                        {it.price.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="py-3 px-3 text-right font-tabular-data font-bold text-on-surface">
                        {it.total.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-tabular-data text-[10px] px-2 py-0.5 rounded font-semibold ${
                            it.kdsStatus === 'Hoàn tất'
                              ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                              : it.kdsStatus === 'Đang nấu'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {it.kdsStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {selectedOrder.items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                        Đơn chưa có danh sách món chi tiết. Bấm "Tùy biến món" để bổ sung.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Summary Breakdown */}
            <div className="bg-surface-container-low p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Tạm tính tiền món:</span>
                <span className="font-tabular-data font-semibold text-on-surface">
                  {selectedOrder.subtotal.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Phí dịch vụ nhà hàng (5%):</span>
                <span className="font-tabular-data text-on-surface">
                  {selectedOrder.serviceCharge.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Thuế giá trị gia tăng VAT (8%):</span>
                <span className="font-tabular-data text-on-surface">
                  {selectedOrder.vat.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-surface-container text-sm font-bold text-on-surface">
                <span className="uppercase font-headline">TỔNG THANH TOÁN (NET):</span>
                <span className="font-tabular-data text-xl text-secondary">
                  {selectedOrder.grandTotal.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrintDraftReceipt}
                className="min-h-[44px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-on-surface-variant" />
                <span>In Tạm Tính</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVoidModalOpen(true)}
                className="min-h-[44px] rounded-lg bg-error-container hover:bg-error hover:text-on-error text-on-error-container text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Hủy / Trả Món (BR-006)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDispatchToKitchen(selectedOrder.id)}
                className="min-h-[44px] rounded-lg bg-primary hover:bg-inverse-surface text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-4 h-4 text-secondary-fixed" />
                <span>CHUYỂN BẾP (F-006)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="min-h-[44px] rounded-lg bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <CreditCard className="w-4 h-4" />
                <span>GHI NHẬN THANH TOÁN (F-012)</span>
              </button>
            </div>

            {/* Timeline Audit Logs */}
            {selectedOrder.logs && selectedOrder.logs.length > 0 && (
              <div className="pt-2 border-t border-surface-container/60 space-y-2">
                <span className="font-tabular-data text-xs text-on-surface-variant uppercase font-bold block">
                  Nhật Ký Vận Hành Thời Gian Thực (Audit Log)
                </span>
                <div className="space-y-2">
                  {selectedOrder.logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <span className="font-tabular-data text-[11px] text-on-surface-variant shrink-0 w-16">
                        {log.time}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{log.title}</span>
                        <span className="text-on-surface-variant text-[11px]">{log.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-on-surface-variant bg-surface-container-lowest rounded-xl border border-dashed border-surface-container">
            Vui lòng chọn một đơn hàng từ danh sách bên trái
          </div>
        )}
      </div>

      {/* MODAL: Ghi nhận thanh toán (F-012) */}
      {isPaymentModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline font-bold text-base text-on-surface">
                Thu Ngân &amp; Đối Soát Thanh Toán (F-012)
              </h3>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-surface-container-low p-3.5 rounded-lg space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Bàn thanh toán:</span>
                <span className="font-bold text-on-surface">{selectedOrder.table} ({selectedOrder.id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Số lượng khách:</span>
                <span className="font-semibold text-on-surface">{selectedOrder.guests} Khách</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-surface-container">
                <span className="font-bold text-on-surface">Cần thu:</span>
                <span className="font-tabular-data font-bold text-lg text-secondary">
                  {selectedOrder.grandTotal.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-secondary bg-secondary-fixed text-on-secondary-fixed-variant'
                    : 'border-surface-container bg-surface-container-low text-on-surface'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Tiền mặt</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border cursor-pointer ${
                  paymentMethod === 'transfer'
                    ? 'border-secondary bg-secondary-fixed text-on-secondary-fixed-variant'
                    : 'border-surface-container bg-surface-container-low text-on-surface'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Chuyển khoản VietQR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-secondary bg-secondary-fixed text-on-secondary-fixed-variant'
                    : 'border-surface-container bg-surface-container-low text-on-surface'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Quẹt thẻ POS</span>
              </button>
            </div>

            {paymentMethod === 'cash' && (
              <div className="space-y-2 text-xs">
                <label className="font-semibold text-on-surface block">Tiền khách đưa (VND):</label>
                <input
                  type="number"
                  step="10000"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container font-tabular-data font-bold text-sm"
                />
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-on-surface-variant">Tiền thừa trả khách:</span>
                  <span className="font-tabular-data font-bold text-sm text-secondary">
                    {Math.max(0, cashReceived - selectedOrder.grandTotal).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="min-h-[40px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleCompletePayment}
                className="min-h-[40px] rounded-lg bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-bold text-xs cursor-pointer shadow-xs"
              >
                Xác nhận đã thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Hủy / Trả Món (BR-006) */}
      {isVoidModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-5 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2 text-error">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-headline font-bold text-sm">
                  Đối Soát Hủy Đơn (BR-006)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVoidModalOpen(false)}
                className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Theo quy chuẩn BR-006: Việc hủy đơn hàng đã nhận phải có lý do đối soát và được lưu vết nhật ký quản lý để kiểm toán cuối ca.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold block">Lý do hủy đơn:</label>
              <select
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container"
              >
                <option value="Khách yêu cầu hủy trước khi vào bếp">Khách yêu cầu hủy trước khi vào bếp</option>
                <option value="Nhân viên tạo nhầm số lượng / món">Nhân viên tạo nhầm số lượng / món</option>
                <option value="Khách chuyển bàn khác">Khách chuyển bàn khác</option>
                <option value="Sự cố kỹ thuật thiết bị POS">Sự cố kỹ thuật thiết bị POS</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsVoidModalOpen(false)}
                className="min-h-[40px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold cursor-pointer"
              >
                Giữ đơn hàng
              </button>
              <button
                type="button"
                onClick={handleConfirmVoid}
                className="min-h-[40px] rounded-lg bg-error hover:bg-error/90 text-on-error text-xs font-bold cursor-pointer"
              >
                Xác nhận Hủy Đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tạo Đơn Tại Bàn (F-003) */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-5 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Mở Bàn &amp; Tạo Đơn Tại Bàn (F-003)
              </h3>
              <button
                type="button"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewOrderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Chọn số bàn:</label>
                <input
                  type="text"
                  required
                  value={newOrderTable}
                  onChange={(e) => setNewOrderTable(e.target.value)}
                  placeholder="Ví dụ: Bàn 15, Bàn VIP-3..."
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Số lượng khách:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={newOrderGuests}
                  onChange={(e) => setNewOrderGuests(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="min-h-[40px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-lg bg-primary hover:bg-inverse-surface text-on-primary text-xs font-bold cursor-pointer"
                >
                  Khởi tạo bàn &amp; Chọn món
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
