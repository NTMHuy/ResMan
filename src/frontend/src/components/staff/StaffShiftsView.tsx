import React, { useState } from 'react';
import { 
  BadgeCheck, 
  Users, 
  Clock, 
  ShieldCheck, 
  Search, 
  Plus, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  X,
  MapPin
} from 'lucide-react';
import type { StaffMember } from '../../types';
interface StaffShiftsViewProps {
  staff: StaffMember[];
  onStaffChange: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const StaffShiftsView: React.FC<StaffShiftsViewProps> = ({
  staff,
  onStaffChange,
  showToast
}) => {
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Swap Modal
  const [isSwapModalOpen, setIsSwapModalOpen] = useState<boolean>(false);
  const [selectedStaffToSwap, setSelectedStaffToSwap] = useState<StaffMember | null>(null);
  const [swapTargetRole, setSwapTargetRole] = useState<string>('Bàn 01 - 06 (Khu Sân Vườn)');

  // Add Staff Modal
  const [isAddStaffOpen, setIsAddStaffOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newRole, setNewRole] = useState<StaffMember['role']>('server');
  const [newShift, setNewShift] = useState<string>('Ca Sáng (06:00 - 14:00)');
  const [newStation, setNewStation] = useState<string>('Tầng 1 - Khu Trong Nhà');

  // Permission Matrix Modal
  const [permissionStaff, setPermissionStaff] = useState<StaffMember | null>(null);

  const filteredStaff = staff.filter((s) => {
    if (activeRoleFilter !== 'ALL' && s.role !== activeRoleFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.code.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const initials = newName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(-2)
      .toUpperCase();

    const newMember: StaffMember = {
      code: `NV-0${staff.length + 10}`,
      name: newName.trim(),
      initials: initials || 'NV',
      email: `${newName.toLowerCase().replace(/\s+/g, '.')}@resman.vn`,
      role: newRole,
      roleTitle:
        newRole === 'manager'
          ? 'Quản Lý Ca Trực'
          : newRole === 'server'
          ? 'Nhân Viên Order'
          : newRole === 'kitchen'
          ? 'Đầu Bếp KDS'
          : 'Thủ Kho Tiếp Vận',
      shift: newShift,
      shiftHoursLeft: 'Còn 08h 00m',
      station: newStation,
      status: 'Đang làm việc',
      statusType: 'active'
    };

    onStaffChange((prev) => [newMember, ...prev]);
    setIsAddStaffOpen(false);
    setNewName('');
    showToast(`Đã thêm nhân viên mới "${newMember.name}" (${newMember.code}) vào hệ thống`, 'success');
  };

  const handleConfirmSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffToSwap) return;

    onStaffChange((prev) =>
      prev.map((s) =>
        s.code === selectedStaffToSwap.code
          ? { ...s, station: swapTargetRole }
          : s
      )
    );

    setIsSwapModalOpen(false);
    showToast(`Đã điều chuyển trạm trực của ${selectedStaffToSwap.name} sang: ${swapTargetRole}`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
            Quản Lý Nhân Viên &amp; Phân Bổ Ca Trực (F-013)
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Phân quyền vai trò (Role-based access), điều phối khu vực phục vụ và giám sát chấm công
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedStaffToSwap(staff[1]);
              setIsSwapModalOpen(true);
            }}
            className="min-h-[40px] px-3.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-4 h-4 text-on-surface-variant" />
            <span>Đổi Ca Khẩn Cấp</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddStaffOpen(true)}
            className="min-h-[40px] px-4 rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Nhân Viên Mới</span>
          </button>
        </div>
      </div>

      {/* Headcount Status Banner & Station Readiness */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            <span className="font-headline font-bold text-sm text-on-surface">
              Quân Số Ca Sáng Đang Đi Làm: 18 / 22 Nhân Viên (82%)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-tabular-data">
            <span className="text-on-surface-variant">
              Bàn &amp; Thu ngân: <strong className="text-on-surface">8</strong>
            </span>
            <span>•</span>
            <span className="text-on-surface-variant">
              Bếp KDS: <strong className="text-on-surface">6</strong>
            </span>
            <span>•</span>
            <span className="text-on-surface-variant">
              Kho tiếp vận: <strong className="text-on-surface">4</strong>
            </span>
          </div>
        </div>

        <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
          <div className="w-[82%] h-full bg-secondary rounded-full" />
        </div>
      </div>

      {/* Filter Tabs & Roster Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/60 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Role Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'manager', label: 'Quản lý / Thu ngân' },
              { id: 'server', label: 'Phục vụ bàn / POS' },
              { id: 'kitchen', label: 'Bếp KDS' },
              { id: 'inventory', label: 'Tiếp vận kho' }
            ].map((rf) => {
              const count =
                rf.id === 'ALL'
                  ? staff.length
                  : staff.filter((s) => s.role === rf.id).length;
              const isActive = activeRoleFilter === rf.id;

              return (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => setActiveRoleFilter(rf.id)}
                  className={`min-h-[36px] px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span>{rf.label}</span>
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

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên nhân viên, mã NV..."
              className="w-full h-9 pl-8 pr-3 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none border border-surface-container"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto rounded-lg border border-surface-container">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-tabular-data border-b border-surface-container">
              <tr>
                <th className="py-2.5 px-3 uppercase font-semibold">Mã &amp; Họ tên</th>
                <th className="py-2.5 px-3 uppercase font-semibold">Vai trò &amp; Phân quyền</th>
                <th className="py-2.5 px-3 uppercase font-semibold">Ca trực</th>
                <th className="py-2.5 px-3 uppercase font-semibold">Khu vực / Trạm</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-center">Trạng thái ca</th>
                <th className="py-2.5 px-3 uppercase font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container/60">
              {filteredStaff.map((s) => (
                <tr key={s.code} className="hover:bg-surface-container-low/40">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary text-on-primary font-tabular-data font-bold text-xs flex items-center justify-center shrink-0">
                        {s.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface text-sm">{s.name}</span>
                        <span className="font-tabular-data text-[11px] text-on-surface-variant">
                          {s.code} • {s.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                      <span className="font-semibold text-on-surface">{s.roleTitle}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="text-on-surface font-medium">{s.shift}</span>
                      <span className="font-tabular-data text-[11px] text-secondary font-semibold">
                        {s.shiftHoursLeft}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-on-surface">
                      <MapPin className="w-3.5 h-3.5 text-outline shrink-0" />
                      <span>{s.station}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-tabular-data text-[11px] font-semibold ${
                        s.statusType === 'active'
                          ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                          : s.statusType === 'ready'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.statusType === 'active'
                            ? 'bg-secondary'
                            : s.statusType === 'ready'
                            ? 'bg-secondary'
                            : 'bg-outline'
                        }`}
                      />
                      {s.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPermissionStaff(s)}
                        className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Quyền hạn
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStaffToSwap(s);
                          setIsSwapModalOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Điều trạm
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Đổi Ca & Điều Phối Trạm */}
      {isSwapModalOpen && selectedStaffToSwap && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Điều Chuyển Trạm Trực Ca Nhanh
              </h3>
              <button
                type="button"
                onClick={() => setIsSwapModalOpen(false)}
                className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSwap} className="space-y-3 text-xs">
              <div className="bg-surface-container-low p-3 rounded-lg space-y-1">
                <span className="text-on-surface-variant">Nhân sự:</span>
                <div className="font-bold text-on-surface text-sm">
                  {selectedStaffToSwap.name} ({selectedStaffToSwap.code})
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Hiện tại: {selectedStaffToSwap.station}
                </span>
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Chọn trạm/khu vực trực mới:
                </label>
                <select
                  value={swapTargetRole}
                  onChange={(e) => setSwapTargetRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container"
                >
                  <option value="Bàn 01 - 06 (Khu Sân Vườn)">Bàn 01 - 06 (Khu Sân Vườn)</option>
                  <option value="Bàn 07 - 14 (Khu Trong Nhà)">Bàn 07 - 14 (Khu Trong Nhà)</option>
                  <option value="Phòng VIP 01 - 03 (Tầng 2)">Phòng VIP 01 - 03 (Tầng 2)</option>
                  <option value="Trạm Bếp Nóng KDS-H1">Trạm Bếp Nóng KDS-H1</option>
                  <option value="Trạm Bếp Lạnh & Pha Chế">Trạm Bếp Lạnh &amp; Pha Chế</option>
                  <option value="Quầy Thu Ngân Trung Tâm">Quầy Thu Ngân Trung Tâm</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSwapModalOpen(false)}
                  className="min-h-[40px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-bold cursor-pointer shadow-xs"
                >
                  Xác nhận điều trạm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Thêm nhân viên */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Thêm Nhân Viên Mới (F-013)
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Họ và tên (*):</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Gia Bảo"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Vai trò chính:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container"
                  >
                    <option value="server">Phục vụ / POS</option>
                    <option value="kitchen">Bếp KDS</option>
                    <option value="inventory">Tiếp vận kho</option>
                    <option value="manager">Quản lý ca</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Ca làm việc:</label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container"
                  >
                    <option value="Ca Sáng (06:00 - 14:00)">Ca Sáng (06:00 - 14:00)</option>
                    <option value="Ca Chiều (14:00 - 22:00)">Ca Chiều (14:00 - 22:00)</option>
                    <option value="Ca Đêm (22:00 - 06:00)">Ca Đêm (22:00 - 06:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Khu vực / Trạm phân công:</label>
                <input
                  type="text"
                  value={newStation}
                  onChange={(e) => setNewStation(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="min-h-[40px] rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-bold cursor-pointer"
                >
                  Tạo hồ sơ nhân viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ma trận phân quyền (RBAC Matrix) */}
      {permissionStaff && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-surface-container">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div>
                <h3 className="font-headline font-bold text-sm text-on-surface">
                  Phân Quyền Vai Trò (RBAC Matrix)
                </h3>
                <span className="text-xs text-on-surface-variant">
                  {permissionStaff.name} ({permissionStaff.roleTitle})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPermissionStaff(null)}
                className="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'F-001/F-002 Chỉnh sửa Menu & Giá', granted: permissionStaff.role === 'manager' },
                { name: 'F-003 Mở bàn & Tạo Order', granted: true },
                { name: 'F-006 Chuyển lệnh bếp KDS', granted: true },
                { name: 'F-008 Báo xong vé bếp (Bump)', granted: permissionStaff.role === 'kitchen' || permissionStaff.role === 'manager' },
                { name: 'F-010 Điều chỉnh tồn kho & Kiểm kê', granted: permissionStaff.role === 'inventory' || permissionStaff.role === 'manager' },
                { name: 'F-012 Thu ngân & In hóa đơn đỏ', granted: permissionStaff.role === 'manager' || permissionStaff.role === 'server' },
                { name: 'BR-006 Duyệt hủy đơn / Giảm giá', granted: permissionStaff.role === 'manager' }
              ].map((perm, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-surface-container">
                  <span className="text-on-surface">{perm.name}</span>
                  {perm.granted ? (
                    <span className="text-secondary font-semibold flex items-center gap-1 font-tabular-data text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Cho phép
                    </span>
                  ) : (
                    <span className="text-on-surface-variant font-medium flex items-center gap-1 font-tabular-data text-[11px]">
                      <X className="w-3.5 h-3.5 text-outline" />
                      Khóa
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPermissionStaff(null)}
              className="w-full min-h-[40px] rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-bold text-xs cursor-pointer"
            >
              Đóng ma trận quyền
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
