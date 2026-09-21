import React, { useState } from 'react';
import { 
  LineChart, 
  TrendingUp, 
  Users, 
  Clock, 
  ShieldAlert, 
  Download, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  DollarSign,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import type { VoidLogItem } from '../../types';
interface ReportsTelemetryViewProps {
  voidLogs: VoidLogItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ReportsTelemetryView: React.FC<ReportsTelemetryViewProps> = ({
  voidLogs,
  showToast
}) => {
  const [timeframe, setTimeframe] = useState<'today' | 'yesterday' | '7days' | 'month'>('today');

  const handleExport = (format: 'CSV' | 'Excel') => {
    showToast(`Đang kết xuất báo cáo doanh thu & đối soát ca định dạng ${format}...`, 'info');
    setTimeout(() => {
      showToast(`Đã tải xuống thành công: ResMan_Shift_Reconciliation_${timeframe}.${format.toLowerCase()}`, 'success');
    }, 600);
  };

  const bestSellers = [
    { rank: 1, name: 'Bò Wagyu Ribeye A5 250g', sold: 24, revenue: 12480000, percent: 29.2 },
    { rank: 2, name: 'Phở Bò Đặc Biệt', sold: 85, revenue: 7225000, percent: 16.9 },
    { rank: 3, name: 'Cơm Tấm Sườn Bì Chả', sold: 68, revenue: 5100000, percent: 11.9 },
    { rank: 4, name: 'Trà Đào Cam Sả', sold: 74, revenue: 3330000, percent: 7.8 },
    { rank: 5, name: 'Salad Cá Hồi Na-uy', sold: 14, revenue: 3360000, percent: 7.8 }
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title & Timeframe Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
            Báo Cáo &amp; Đối Soát Doanh Thu (F-014)
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Phân tích doanh số, tỷ lệ hủy món (BR-006) và hiệu suất vận hành theo ca trực
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
            {[
              { id: 'today', label: 'Hôm nay (Ca hiện tại)' },
              { id: 'yesterday', label: 'Hôm qua' },
              { id: '7days', label: '7 ngày qua' },
              { id: 'month', label: 'Tháng này' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTimeframe(t.id as any);
                  showToast(`Đã lọc dữ liệu theo khoảng thời gian: ${t.label}`, 'info');
                }}
                className={`min-h-[36px] px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  timeframe === t.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleExport('Excel')}
            className="min-h-[40px] px-3.5 rounded-lg bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Đối Soát (Excel)</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial & Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Doanh Thu Thực Nhận (Net)
            </span>
            <div className="font-tabular-data font-bold text-2xl text-on-surface">
              42.68M ₫
            </div>
            <span className="text-[11px] text-secondary font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.2% so với hôm qua
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Tổng Lượt Khách (Covers)
            </span>
            <div className="font-tabular-data font-bold text-2xl text-on-surface">
              184 Khách
            </div>
            <span className="text-[11px] text-on-surface-variant font-medium">
              TB 232.000 ₫ / khách
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Đúng Hạn SLA Bếp (&lt;15m)
            </span>
            <div className="font-tabular-data font-bold text-2xl text-secondary">
              92.4%
            </div>
            <span className="text-[11px] text-secondary font-semibold">
              Mục tiêu ca: &gt;90% (Đạt)
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-tabular-data text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
              Tiền Hủy Món (BR-006 Void)
            </span>
            <div className="font-tabular-data font-bold text-2xl text-error">
              460.000 ₫
            </div>
            <span className="text-[11px] text-error font-medium">
              2 đơn có phê duyệt MGR
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-error-container/60 flex items-center justify-center text-error">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Best Sellers + Void Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top 5 Best Sellers (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container/60">
            <h3 className="font-headline font-bold text-base text-on-surface">
              Top 5 Món Ăn Đóng Góp GMV Cao Nhất
            </h3>
            <span className="font-tabular-data text-xs text-on-surface-variant">
              Tỷ trọng doanh số
            </span>
          </div>

          <div className="space-y-3">
            {bestSellers.map((item) => (
              <div key={item.rank} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-surface-container-low font-tabular-data font-bold text-center text-on-surface leading-5">
                      {item.rank}
                    </span>
                    <span className="font-bold text-on-surface">{item.name}</span>
                    <span className="font-tabular-data text-on-surface-variant">
                      ({item.sold} phần)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-tabular-data">
                    <span className="font-bold text-on-surface">
                      {item.revenue.toLocaleString('vi-VN')} ₫
                    </span>
                    <span className="text-[11px] text-secondary font-semibold w-12 text-right">
                      {item.percent}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${item.percent * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Void / Refund Audit (BR-006) (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container/60">
            <div className="flex items-center gap-1.5 text-error">
              <ShieldAlert className="w-4 h-4" />
              <h3 className="font-headline font-bold text-sm">
                Kiểm Toán Hủy Món (BR-006 Void Audit)
              </h3>
            </div>
            <span className="font-tabular-data text-xs text-on-surface-variant">
              {voidLogs.length} sự vụ
            </span>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Mọi thao tác hủy món sau khi in bếp đều được ghi log bất biến (Immutable Ledger) phục vụ kiểm toán tài chính và chống thất thoát.
          </p>

          <div className="space-y-2.5">
            {voidLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-surface-container-low border border-surface-container space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-tabular-data font-bold text-on-surface">
                    {log.orderId} • {log.table}
                  </span>
                  <span className="font-tabular-data font-bold text-error">
                    -{log.amount.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Lý do: {log.reason}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-surface-container/40 text-[10px] text-on-surface-variant font-tabular-data">
                  <span>Giờ: {log.time}</span>
                  <span className="font-semibold text-on-surface">
                    Duyệt bởi: {log.approvedBy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shift Financial Reconciliation Table (F-014) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-secondary" />
            <h3 className="font-headline font-bold text-base text-on-surface">
              Đối Soát Két Tiền &amp; Chuyển Khoản Theo Ca Trực (Shift Reconciliation)
            </h3>
          </div>
          <span className="font-tabular-data text-xs px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-bold">
            Kiểm quỹ: Khớp 100% (0 ₫ chênh lệch)
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-surface-container">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-tabular-data border-b border-surface-container">
              <tr>
                <th className="py-2.5 px-3 uppercase font-semibold">Ca trực</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-right">Tiền mặt tại két</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-right">VietQR Chuyển khoản</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-right">Thẻ ngân hàng (POS)</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-right font-bold">Tổng doanh số ca</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-center">Trạng thái chốt ca</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container/60">
              <tr className="hover:bg-surface-container-low/40">
                <td className="py-3 px-3 font-semibold text-on-surface">
                  Ca Sáng (06:00 - 14:00)
                </td>
                <td className="py-3 px-3 text-right font-tabular-data">12.450.000 ₫</td>
                <td className="py-3 px-3 text-right font-tabular-data">16.000.000 ₫</td>
                <td className="py-3 px-3 text-right font-tabular-data">4.230.000 ₫</td>
                <td className="py-3 px-3 text-right font-tabular-data font-bold text-secondary">
                  32.680.000 ₫
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-tabular-data text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-secondary" />
                    Đã kiểm quỹ xong
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/40">
                <td className="py-3 px-3 font-semibold text-on-surface">
                  Ca Chiều (14:00 - 22:00)
                </td>
                <td className="py-3 px-3 text-right font-tabular-data">3.800.000 ₫</td>
                <td className="py-3 px-3 text-right font-tabular-data">5.200.000 ₫</td>
                <td className="py-3 px-3 text-right font-tabular-data">1.000.000 ₫</td>
                <td className="py-3 px-3 text-right font-tabular-data font-bold text-on-surface">
                  10.000.000 ₫ (Tạm tính)
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-tabular-data text-[11px] font-semibold">
                    Đang diễn ra ca
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Post-MVP F-015 Roadmap Card */}
      <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-secondary-fixed" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-sm text-on-surface">
              Định Giá Động &amp; Dự Báo Nhu Cầu Nguyên Liệu AI (F-015 Module)
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-tabular-data font-bold text-secondary">
              POST-MVP ROADMAP
            </span>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Thuật toán dự báo theo thời tiết và lịch đặt bàn dự kiến buổi tối sẽ có nhu cầu tăng 28% với các món lẩu và bò áp chảo. Khuyến nghị chuẩn bị trước 12 phần bò Wagyu và 35 phần nạm phở trước 17:30.
          </p>
        </div>
      </div>
    </div>
  );
};
