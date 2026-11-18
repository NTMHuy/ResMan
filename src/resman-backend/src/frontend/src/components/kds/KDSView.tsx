import React, { useState } from 'react';
import { 
  Utensils, 
  Flame, 
  Snowflake, 
  Wine, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  History, 
  CheckCircle2, 
  Bell, 
  XCircle, 
  Play, 
  Clock, 
  CornerDownRight, 
  Info,
  X
} from 'lucide-react';
import type { KDSTicket } from '../../types';

interface KDSViewProps {
  tickets: KDSTicket[];
  onTicketsChange: React.Dispatch<React.SetStateAction<KDSTicket[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const KDSView: React.FC<KDSViewProps> = ({
  tickets,
  onTicketsChange,
  showToast
}) => {
  const [activeStation, setActiveStation] = useState<'all' | 'hot' | 'cold' | 'bar'>('all');
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastBumpedTicket, setLastBumpedTicket] = useState<KDSTicket | null>(null);

  // Void Modal State
  const [voidModalOpen, setVoidModalOpen] = useState<boolean>(false);
  const [voidContext, setVoidContext] = useState<{ ticketId: string; itemName: string }>({
    ticketId: '',
    itemName: ''
  });
  const [voidReason, setVoidReason] = useState<string>('het_nguyen_lieu');

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    if (urgentOnly && !ticket.isUrgent) return false;
    if (activeStation !== 'all' && ticket.stationType !== activeStation) return false;
    return true;
  });

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    showToast(next ? 'Đã bật âm thanh còi báo bếp' : 'Đã tắt âm thanh thông báo', 'info');
  };

  const handleToggleUrgentOnly = () => {
    const next = !urgentOnly;
    setUrgentOnly(next);
    showToast(next ? 'Đang bật chế độ lọc: Chỉ vé khẩn cấp' : 'Đã hiển thị lại tất cả các vé', 'info');
  };

  const handleToggleItemCheck = (ticketId: string, itemId: string) => {
    onTicketsChange((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          items: ticket.items.map((item) => {
            if (item.id !== itemId) return item;
            const newDone = !item.isDone;
            return {
              ...item,
              isDone: newDone,
              status: newDone ? 'Đã xong' : 'Đang làm'
            };
          })
        };
      })
    );
  };

  const handleBumpTicket = (ticketId: string) => {
    const ticketToBump = tickets.find((t) => t.id === ticketId);
    if (!ticketToBump) return;

    setLastBumpedTicket(ticketToBump);
    onTicketsChange((prev) => prev.filter((t) => t.id !== ticketId));
    showToast(`Đã hoàn tất vé bếp #${ticketId} (Bump thành công)`, 'success');
  };

  const handleRecall = () => {
    if (!lastBumpedTicket) {
      showToast('Chưa có vé bếp nào vừa hoàn thành để hoàn tác', 'info');
      return;
    }
    onTicketsChange((prev) => [lastBumpedTicket, ...prev]);
    showToast(`Đã khôi phục vé bếp #${lastBumpedTicket.id} thành công (BR-008)`, 'success');
    setLastBumpedTicket(null);
  };

  const handleStartPrepTicket = (ticketId: string) => {
    onTicketsChange((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          status: 'Đang nấu',
          colorHeader: 'bg-secondary-container'
        };
      })
    );
    showToast(`Đã chuyển vé #${ticketId} sang trạng thái Đang Nấu Toàn Bộ`, 'success');
  };

  const handleCallServer = (tableNumber: string) => {
    showToast(`Đã gửi tín hiệu chuông gọi phục vụ tới ${tableNumber}`, 'info');
  };

  const openVoidModal = (ticketId: string, itemName: string) => {
    setVoidContext({ ticketId, itemName });
    setVoidModalOpen(true);
  };

  const confirmVoid = () => {
    setVoidModalOpen(false);
    showToast(
      `Đã hủy món "${voidContext.itemName}" trên #${voidContext.ticketId} theo BR-007 (${voidReason}) - Tự động hoàn kho!`,
      'error'
    );
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Top Filter & KDS Operations Bar */}
      <div className="w-full bg-surface-container-lowest shadow-sm rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 border border-surface-container-high/40">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Station selector */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setActiveStation('all');
                showToast('Đã lọc theo trạm: TẤT CẢ BẾP', 'info');
              }}
              className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeStation === 'all'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Tất cả bếp</span>
              <span className={`ml-1 text-[11px] font-tabular-data px-1.5 py-0.5 rounded-full ${
                activeStation === 'all' ? 'bg-white/20 text-on-primary' : 'bg-surface-container-high text-on-surface'
              }`}>
                18
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveStation('hot');
                showToast('Đã lọc theo trạm: BẾP NÓNG', 'info');
              }}
              className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeStation === 'hot'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Bếp Nóng</span>
              <span className={`ml-1 text-[11px] font-tabular-data px-1.5 py-0.5 rounded-full ${
                activeStation === 'hot' ? 'bg-white/20 text-on-primary' : 'bg-surface-container-high text-on-surface'
              }`}>
                11
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveStation('cold');
                showToast('Đã lọc theo trạm: BẾP NGUỘI', 'info');
              }}
              className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeStation === 'cold'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Snowflake className="w-4 h-4" />
              <span>Bếp Nguội</span>
              <span className={`ml-1 text-[11px] font-tabular-data px-1.5 py-0.5 rounded-full ${
                activeStation === 'cold' ? 'bg-white/20 text-on-primary' : 'bg-surface-container-high text-on-surface'
              }`}>
                5
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveStation('bar');
                showToast('Đã lọc theo trạm: QUẦY BAR', 'info');
              }}
              className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeStation === 'bar'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Wine className="w-4 h-4" />
              <span>Quầy Bar</span>
              <span className={`ml-1 text-[11px] font-tabular-data px-1.5 py-0.5 rounded-full ${
                activeStation === 'bar' ? 'bg-white/20 text-on-primary' : 'bg-surface-container-high text-on-surface'
              }`}>
                2
              </span>
            </button>
          </div>

          <div className="h-7 w-px bg-surface-container-high hidden md:block" />

          {/* Counters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span className="font-tabular-data text-on-surface-variant uppercase text-[11px]">Chờ xử lý:</span>
              <span className="font-tabular-data font-bold text-on-surface">12</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
              <span className="font-tabular-data text-on-surface-variant uppercase text-[11px]">Đang nấu:</span>
              <span className="font-tabular-data font-bold text-on-surface">4</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-error-container rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
              <span className="font-tabular-data text-on-error-container font-semibold uppercase text-[11px]">
                Trễ định mức (&gt;15m):
              </span>
              <span className="font-tabular-data font-bold text-on-error-container">2</span>
            </div>
          </div>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleUrgentOnly}
            className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              urgentOnly
                ? 'bg-error text-on-error shadow-xs'
                : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${urgentOnly ? 'text-on-error' : 'text-error'}`} />
            <span>Chỉ vé khẩn cấp</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSound}
            title={soundEnabled ? 'Tắt còi bếp' : 'Bật còi bếp'}
            className="min-h-[40px] min-w-[40px] rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-secondary" />
            ) : (
              <VolumeX className="w-4 h-4 text-on-surface-variant" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRecall}
            title="BR-008: Khôi phục vé vừa hoàn thành"
            className="min-h-[40px] px-3 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Hoàn tác (Recall)</span>
          </button>
        </div>
      </div>

      {/* Ticket Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        {filteredTickets.map((ticket) => {
          const isUrgent = ticket.isUrgent;
          const isTakeaway = ticket.orderType === 'TAKEAWAY';
          const isCooking = ticket.status === 'Đang nấu';

          return (
            <div
              key={ticket.id}
              className={`bg-surface-container-lowest rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all ${
                isUrgent ? 'border-error/40 ring-1 ring-error/20' : 'border-surface-container-high/60'
              }`}
            >
              {/* Card Header Strip */}
              <div
                className={`px-3 py-2 flex items-center justify-between text-white ${
                  isUrgent
                    ? 'bg-error text-on-error'
                    : isTakeaway
                    ? 'bg-secondary-container text-on-secondary-container'
                    : isCooking
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-container-high text-on-surface'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isUrgent && <AlertTriangle className="w-4 h-4 text-on-error animate-pulse" />}
                  <span className="font-tabular-data text-xs font-bold">#{ticket.id}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-tabular-data font-bold ${
                      isUrgent
                        ? 'bg-white/20 text-on-error'
                        : isTakeaway
                        ? 'bg-white/20 text-on-secondary-container'
                        : 'bg-surface-container-lowest text-on-surface'
                    }`}
                  >
                    {ticket.tableNumber}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-tabular-data text-sm font-bold">
                    {ticket.timeElapsed}
                  </span>
                </div>
              </div>

              {/* Subheader info strip */}
              <div className="px-3 py-1 bg-surface-container-high/30 flex items-center justify-between border-b border-surface-container/50">
                <span className="font-tabular-data text-[11px] text-on-surface-variant uppercase">
                  {ticket.orderTypeLabel}
                </span>
                {ticket.slaDelayText ? (
                  <span className="font-tabular-data text-[11px] text-on-error-container font-semibold bg-error-container px-2 py-0.5 rounded-full">
                    {ticket.slaDelayText}
                  </span>
                ) : (
                  <span className="font-tabular-data text-[11px] text-secondary font-semibold bg-secondary-fixed px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Utensils className="w-2.5 h-2.5" />
                    <span>{ticket.status}</span>
                  </span>
                )}
              </div>

              {/* Items Recipe Rows */}
              <div className="p-3 flex-1 space-y-2">
                {ticket.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItemCheck(ticket.id, item.id)}
                    className={`p-2.5 rounded-lg border border-surface-container-high/40 bg-surface-container-low/60 cursor-pointer select-none transition-all ${
                      item.isDone ? 'opacity-70 bg-surface-container-high/30' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={item.isDone}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleItemCheck(ticket.id, item.id);
                          }}
                          className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-secondary shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-tabular-data text-sm font-bold text-on-surface">
                              {item.quantity}x
                            </span>
                            <span
                              className={`text-sm text-on-surface font-semibold ${
                                item.isDone ? 'line-through text-on-surface-variant' : ''
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          {item.modifiers && (
                            <div className="mt-1 text-on-tertiary-container bg-tertiary-fixed/30 px-2 py-0.5 rounded font-tabular-data text-[10px] font-bold flex items-center gap-1">
                              <CornerDownRight className="w-3 h-3 shrink-0" />
                              <span>{item.modifiers}</span>
                            </div>
                          )}

                          {item.note && (
                            <div className="mt-1 text-on-surface-variant font-tabular-data text-[11px] flex items-center gap-1">
                              <CornerDownRight className="w-3 h-3 text-outline shrink-0" />
                              <span>{item.note}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className={`font-tabular-data text-[10px] px-2 py-0.5 rounded whitespace-nowrap ${
                          item.isDone
                            ? 'text-secondary bg-surface-container-highest font-semibold'
                            : 'text-on-surface-variant bg-surface-container-high'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}

                {ticket.id === 'ORD-1044' && (
                  <div className="p-2 rounded-lg bg-surface-container-high/30 flex items-center gap-2 text-on-surface-variant">
                    <Info className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-[11px]">
                      BR-008: Chạm trực tiếp vào món để chuyển trạng thái Chờ -&gt; Đang làm -&gt; Đã xong.
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 pt-0 flex flex-col gap-2 border-t border-surface-container/40 mt-1">
                <div className="grid grid-cols-2 gap-1.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleCallServer(ticket.tableNumber)}
                    className="min-h-[36px] px-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-secondary" />
                    <span>Gọi phục vụ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openVoidModal(ticket.id, ticket.items[0]?.name || 'Món ăn')
                    }
                    className="min-h-[36px] px-2 rounded-lg bg-error-container hover:bg-error hover:text-on-error text-on-error-container text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Hủy món BR-007</span>
                  </button>
                </div>

                {ticket.id === 'ORD-1044' && ticket.status !== 'Đang nấu' ? (
                  <button
                    type="button"
                    onClick={() => handleStartPrepTicket(ticket.id)}
                    className="w-full min-h-[44px] rounded-lg bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-xs cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>BẮT ĐẦU NẤU TOÀN BỘ</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBumpTicket(ticket.id)}
                    className="w-full min-h-[44px] rounded-lg bg-primary hover:bg-inverse-surface text-on-primary text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary-fixed" />
                    <span>BÁO XONG VÉ BẾP (BUMP)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTickets.length === 0 && (
        <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-dashed border-surface-container-high flex flex-col items-center justify-center gap-3">
          <CheckCircle2 className="w-12 h-12 text-secondary" />
          <h3 className="font-headline font-bold text-base text-on-surface">
            Trạm bếp đã hoàn tất sạch vé!
          </h3>
          <p className="text-xs text-on-surface-variant max-w-sm">
            Hiện không có vé nào ở trạm {activeStation.toUpperCase()}. Các đơn mới từ POS sẽ tự động hiển thị tức thì qua WebSocket Real-time.
          </p>
        </div>
      )}

      {/* MODAL: Hủy Món (BR-007) */}
      {voidModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 border border-surface-container">
            <div className="flex items-center justify-between pb-1 border-b border-surface-container">
              <div className="flex items-center gap-2 text-error">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-headline font-bold text-base">
                  Xác nhận Hủy Món (BR-007)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVoidModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-surface-container-low p-3 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Số vé KDS:</span>
                <span className="font-tabular-data font-bold text-on-surface">
                  #{voidContext.ticketId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tên món yêu cầu hủy:</span>
                <span className="font-semibold text-on-surface">
                  {voidContext.itemName}
                </span>
              </div>
              <p className="font-tabular-data text-[11px] text-on-surface-variant pt-1 border-t border-surface-container/60">
                Theo quy trình BR-007: Khi bếp hủy món, hệ thống tự động hoàn kho nguyên liệu (Inventory Restore) và gửi cảnh báo đến màn hình POS thu ngân.
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-tabular-data text-xs text-on-surface font-semibold block">
                Lý do hủy món:
              </label>
              <select
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none border border-surface-container"
              >
                <option value="het_nguyen_lieu">86 - Hết nguyên vật liệu tươi</option>
                <option value="khach_doi_mon">Khách đổi món trước khi nấu</option>
                <option value="loi_che_bien">Lỗi thao tác chế biến / hỏng nguyên liệu</option>
                <option value="trung_don">Bị tạo trùng đơn từ POS</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVoidModalOpen(false)}
                className="min-h-[40px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold cursor-pointer"
              >
                Đóng &amp; Giữ lại
              </button>
              <button
                type="button"
                onClick={confirmVoid}
                className="min-h-[40px] rounded-lg bg-error hover:bg-error/90 text-on-error text-xs font-bold cursor-pointer"
              >
                Xác nhận Hủy Món
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
