import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Armchair, CheckCircle2, Clock, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react-native";
import { apiClient } from "@/src/services/api/apiClient";
import { repositories } from "@/src/repositories";
import { useTheme } from "@/src/theme/ThemeContext";
import { useToast } from "@/src/contexts/ToastContext";
import { ModalDialog } from "@/src/components/common/ModalDialog";
import { Input } from "@/src/components/common/Input";
import { Button } from "@/src/components/common/Button";
import { PermissionGate } from "@/src/components/common/PermissionGate";
import { AddOrderItemModal, PaymentModal } from "@/src/features/orders/components/OrderModals";
import { formatDateTime, formatVND } from "@/src/utils/formatters";
import type { MenuItem } from "@/src/features/menu/types/menu.types";
import type { PaymentMethod } from "@/src/features/orders/types/order.types";

type DiningTable = {
  id: string;
  code: string;
  name: string;
  capacity: number | null;
  status: "AVAILABLE" | "OCCUPIED";
  sessions?: Array<{ id: string; status: string; openedAt: string }>;
  devices?: Array<{ id: string; deviceCode: string; deviceName: string; isActive: boolean }>;
};
type TableForm = { code: string; name: string; capacity: string };
type SessionItem = {
  id: string;
  itemNameSnapshot: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  note: string | null;
  status: "AWAITING_ACCEPTANCE" | "ACCEPTED" | "IN_PREPARATION" | "COMPLETED" | "CANCELLED";
  createdAt: string;
};
type ActiveSession = {
  id: string;
  status: "OPEN" | "CLOSED";
  openedAt: string;
  table: { id: string; code: string; name: string; status: string };
  order: null | {
    id: string;
    orderCode: string;
    items: SessionItem[];
    payment: null | { status: string; amount: string };
  };
};
type PaymentRequest = {
  id: string;
  sessionId: string;
  requestedAt: string;
  table: { id?: string; code: string; name: string };
  orderId: string | null;
  totalAmount: string;
};
function unwrap<T>(value: unknown): T {
  if (value && typeof value === "object" && "data" in value) return (value as { data: T }).data;
  return value as T;
}
const ITEM_STATUS: Record<SessionItem["status"], { label: string; color: "success" | "warning" | "info" | "danger" | "neutral" }> = {
  AWAITING_ACCEPTANCE: { label: "Chờ bếp tiếp nhận", color: "neutral" },
  ACCEPTED: { label: "Bếp đã tiếp nhận", color: "info" },
  IN_PREPARATION: { label: "Đang chế biến", color: "warning" },
  COMPLETED: { label: "Hoàn thiện", color: "success" },
  CANCELLED: { label: "Đã hủy", color: "danger" },
};

export function TablesScreen() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DiningTable | null>(null);
  const [form, setForm] = useState<TableForm>({ code: "", name: "", capacity: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [availableItems, setAvailableItems] = useState<MenuItem[]>([]);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DiningTable | null>(null);
  const [openSessionTarget, setOpenSessionTarget] = useState<DiningTable | null>(null);
  const [deletingTable, setDeletingTable] = useState(false);

  const loadTables = useCallback(async (silent = false) => {
    if (!silent) { setLoading(true); setError(null); }
    try {
      const response = await apiClient.get("/tables");
      setTables(unwrap<DiningTable[]>(response.data) ?? []);
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : "Không thể tải danh sách bàn.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const loadPaymentRequests = useCallback(async () => {
    try {
      const response = await apiClient.get("/payments/requests");
      setPaymentRequests(unwrap<PaymentRequest[]>(response.data) ?? []);
    } catch {
      // Payment requests are supplementary; keep the table list usable if this endpoint is unavailable.
    }
  }, []);

  useEffect(() => {
    void loadTables();
    void loadPaymentRequests();
    const timer = setInterval(() => {
      void loadTables(true);
      void loadPaymentRequests();
    }, 5000);
    return () => clearInterval(timer);
  }, [loadTables, loadPaymentRequests]);

  const loadSessionDetail = useCallback(async (table: DiningTable) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const activeResponse = await apiClient.get(`/sessions/table/${table.id}/active`);
      const active = unwrap<{ id: string }>(activeResponse.data);
      const detailResponse = await apiClient.get(`/sessions/${active.id}`);
      const detail = unwrap<ActiveSession>(detailResponse.data);
      if (!detail.order) throw new Error("Phiên bàn chưa có đơn hàng được khởi tạo.");
      setSelectedSession(detail);
      try {
        const menu = await repositories.menu.getMenuItems({ status: "AVAILABLE" });
        setAvailableItems(menu.filter((item) => item.price > 0 && item.pricingType !== "MARKET_PRICE" && item.pricingType !== "UNSET"));
      } catch {
        setAvailableItems([]);
      }
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Không thể tải chi tiết bàn.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const openTable = async (table: DiningTable) => {
    setBusyId(table.id);
    try {
      await apiClient.post("/sessions", { tableId: Number(table.id) });
      await loadTables(true);
      await loadSessionDetail(table);
    } catch (err) {
      Alert.alert("Không thể mở bàn", err instanceof Error ? err.message : "Vui lòng thử lại.");
      await loadTables(true);
    } finally {
      setBusyId(null);
    }
  };

  const handleTablePress = (table: DiningTable) => {
    const opened = Boolean(table.sessions?.length) || table.status === "OCCUPIED";
    if (opened) void loadSessionDetail(table);
    else setOpenSessionTarget(table);
  };

  const confirmOpenTable = async () => {
    if (!openSessionTarget) return;
    const table = openSessionTarget;
    setOpenSessionTarget(null);
    await openTable(table);
  };

  const beginCreate = () => {
    setEditing(null); setForm({ code: "", name: "", capacity: "" }); setFormError(null); setFormOpen(true);
  };
  const beginEdit = (table: DiningTable) => {
    if (table.status === "OCCUPIED") { Alert.alert("Không thể sửa bàn", "Không thể thay đổi thông tin bàn đang có khách."); return; }
    setEditing(table); setForm({ code: table.code, name: table.name, capacity: table.capacity == null ? "" : String(table.capacity) }); setFormError(null); setFormOpen(true);
  };
  const saveTable = async () => {
    const code = form.code.trim().toUpperCase(), name = form.name.trim();
    const capacity = form.capacity.trim() ? Number(form.capacity) : undefined;
    if (!code || !name) { setFormError("Mã bàn và tên bàn không được để trống."); return; }
    if (capacity !== undefined && (!Number.isInteger(capacity) || capacity < 1 || capacity > 100)) {
      setFormError("Sức chứa phải là số nguyên từ 1 đến 100."); return;
    }
    setSaving(true); setFormError(null);
    try {
      const payload = { code, name, ...(capacity === undefined ? {} : { capacity }) };
      if (editing) await apiClient.patch(`/tables/${editing.id}`, payload);
      else await apiClient.post("/tables", payload);
      setFormOpen(false); await loadTables();
    } catch (err) { setFormError(err instanceof Error ? err.message : "Không thể lưu thông tin bàn."); }
    finally { setSaving(false); }
  };
  const deleteTable = (table: DiningTable) => {
    if (table.status === "OCCUPIED") {
      showToast("Không thể xóa bàn", "warning", "Bàn đang có khách.");
      return;
    }
    if (table.devices?.length) {
      showToast("Không thể xóa bàn", "warning", "Hãy xóa tài khoản tablet hoặc gỡ liên kết thiết bị trước.");
      return;
    }
    setDeleteTarget(table);
  };

  const confirmDeleteTable = async () => {
    if (!deleteTarget) return;
    setDeletingTable(true);
    try {
      await apiClient.delete(`/tables/${deleteTarget.id}`);
      showToast("Đã xóa bàn", "success", `${deleteTarget.code} · ${deleteTarget.name}`);
      setDeleteTarget(null);
      await loadTables();
    } catch (err) {
      showToast("Không thể xóa bàn", "error", err instanceof Error ? err.message : "Bàn có thể đã có lịch sử phiên.");
    } finally {
      setDeletingTable(false);
    }
  };

  const addOrderItem = async (input: { menuItemId: string; quantity: number; note: string }) => {
    const orderId = selectedSession?.order?.id;
    if (!orderId) throw new Error("Không tìm thấy đơn hàng của bàn.");
    const menuItemId = Number(input.menuItemId);
    if (!Number.isSafeInteger(menuItemId) || menuItemId < 1) throw new Error("Mã món ăn không hợp lệ.");
    setMutating(true);
    try {
      await apiClient.post(`/orders/${orderId}/items`, {
        items: [{ menuItemId, quantity: input.quantity, note: input.note.trim() }],
      });
      const table = tables.find((item) => item.id === selectedSession.table.id);
      if (table) await loadSessionDetail(table);
      await loadTables(true);
    } finally {
      setMutating(false);
    }
  };

  const confirmPayment = async (method: PaymentMethod) => {
    if (!selectedSession) throw new Error("Không tìm thấy phiên phục vụ.");
    setMutating(true);
    try {
      const response = await apiClient.post(`/payments/sessions/${selectedSession.id}/confirm`, { paymentMethod: method });
      const result = unwrap<{ payment: { status: string }; session: { status: string } }>(response.data);
      if (result.payment.status !== "PAID" || result.session.status !== "CLOSED") {
        throw new Error("Backend chưa xác nhận thanh toán và đóng phiên.");
      }
      setPaymentOpen(false);
      setSelectedSession(null);
      await loadTables(true);
      await loadPaymentRequests();
      Alert.alert("Thanh toán thành công", "Đã ghi nhận thanh toán và chuyển bàn về trạng thái trống.");
    } finally {
      setMutating(false);
    }
  };

  useEffect(() => {
    if (!selectedSession?.id) return;
    let active = true;
    const refreshSelectedSession = async () => {
      try {
        const response = await apiClient.get(`/sessions/${selectedSession.id}`);
        const latest = unwrap<ActiveSession>(response.data);
        if (!active) return;
        if (latest.status === "OPEN") {
          setSelectedSession(latest);
        } else {
          setSelectedSession(null);
          void loadTables(true);
        }
      } catch {
        // Preserve the currently displayed details during temporary network failures.
      }
    };
    const timer = setInterval(() => void refreshSelectedSession(), 5000);
    return () => { active = false; clearInterval(timer); };
  }, [selectedSession?.id]);

  const occupiedCount = tables.filter((table) => table.sessions?.length || table.status === "OCCUPIED").length;
  const isOpen = (table: DiningTable) => Boolean(table.sessions?.length) || table.status === "OCCUPIED";
  const currentOrder = selectedSession?.order;
  const chargeableItems = currentOrder?.items.filter((item) => item.status !== "CANCELLED") ?? [];
  const totalAmount = chargeableItems.reduce((sum, item) => sum + Number(item.lineTotal), 0);
  const canConfirmPayment = Boolean(currentOrder && currentOrder.items.every((item) => item.status !== "AWAITING_ACCEPTANCE") && !currentOrder.payment);
  const selectedPaymentRequest = useMemo(
    () => paymentRequests.find((request) => request.sessionId === selectedSession?.id),
    [paymentRequests, selectedSession?.id],
  );

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>Quản lý bàn</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Chọn bàn trống để mở phiên hoặc bàn đang phục vụ để xem món đã gọi</Text>
          </View>
          <PermissionGate permission="TABLES_MANAGE">
            <Button label="Thêm bàn" size="sm" leftIcon={<Plus size={15} color={theme.colors.onPrimary} />} onPress={beginCreate} />
          </PermissionGate>
          <Pressable onPress={() => { void loadTables(); void loadPaymentRequests(); }} style={[styles.refresh, { backgroundColor: theme.colors.surfaceLow }]}>
            <RefreshCw size={18} color={theme.colors.onSurface} />
          </Pressable>
        </View>
        <View style={[styles.summary, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={{ color: theme.colors.onSurface, fontWeight: "700" }}>Tổng {tables.length} bàn</Text>
          <Text style={{ color: theme.colors.success }}>Đang phục vụ: {occupiedCount}</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Đang trống: {Math.max(0, tables.length - occupiedCount)}</Text>
        </View>
        {loading ? <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 28 }} /> : null}
        {error ? <Text style={{ color: theme.colors.error }}>{error}</Text> : null}
        <View style={styles.grid}>
          {tables.map((table) => {
            const opened = isOpen(table), busy = busyId === table.id;
            const request = paymentRequests.find((item) => item.table.code === table.code);
            return (
              <View key={table.id} style={[styles.tableCard, { backgroundColor: opened ? theme.colors.secondaryContainer : theme.colors.surface, borderColor: request ? theme.colors.warning : opened ? theme.colors.secondary : theme.colors.border }]}>
                <Pressable disabled={busy || loading} onPress={() => handleTablePress(table)} style={styles.tableMain}>
                  {busy ? <ActivityIndicator color={theme.colors.primary} /> : request ? <Clock size={25} color={theme.colors.warning} /> : <Armchair size={25} color={opened ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant} />}
                  <Text style={[styles.tableName, { color: opened ? theme.colors.onSecondaryContainer : theme.colors.onSurface }]}>{table.name}</Text>
                  <Text style={{ color: request ? theme.colors.warning : opened ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant, fontSize: 12, fontWeight: "700" }}>
                    {request ? "KHÁCH YÊU CẦU THANH TOÁN" : opened ? "ĐANG PHỤC VỤ · Nhấn để xem" : "BÀN TRỐNG · Nhấn để mở"}
                  </Text>
                  <Text style={{ color: opened ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant, fontSize: 11 }}>
                    {table.code}{table.capacity ? ` · ${table.capacity} chỗ` : ""}
                  </Text>
                </Pressable>
                <PermissionGate permission="TABLES_MANAGE">
                  <View style={styles.actions}>
                    <Pressable onPress={() => beginEdit(table)} disabled={opened} style={[styles.iconButton, { opacity: opened ? 0.35 : 1, backgroundColor: theme.colors.surfaceLow }]}>
                      <Pencil size={15} color={theme.colors.secondary} />
                    </Pressable>
                    <Pressable onPress={() => deleteTable(table)} disabled={opened} style={[styles.iconButton, { opacity: opened ? 0.35 : 1, backgroundColor: theme.colors.surfaceLow }]}>
                      <Trash2 size={15} color={theme.colors.error} />
                    </Pressable>
                  </View>
                </PermissionGate>
              </View>
            );
          })}
        </View>
        {!loading && tables.length === 0 ? <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: "center", marginTop: 20 }}>Chưa có bàn. Quản lý có thể tạo bàn mới.</Text> : null}
      </ScrollView>

      <ModalDialog
        visible={Boolean(openSessionTarget)}
        title="Xác nhận mở phiên phục vụ"
        subtitle={openSessionTarget ? `Bạn muốn mở phiên mới cho ${openSessionTarget.name} (${openSessionTarget.code})?` : undefined}
        onClose={() => { if (!busyId) setOpenSessionTarget(null); }}
        footer={
          <>
            <Button label="Hủy" variant="secondary" onPress={() => setOpenSessionTarget(null)} disabled={Boolean(busyId)} />
            <Button label="Xác nhận mở phiên" onPress={() => void confirmOpenTable()} loading={Boolean(busyId)} />
          </>
        }
      >
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          Hệ thống sẽ tạo phiên phục vụ và đơn hàng cho bàn này. Bạn có thể thêm món ngay sau khi phiên được mở.
        </Text>
      </ModalDialog>

      <ModalDialog
        visible={detailLoading || Boolean(selectedSession) || Boolean(detailError)}
        title={selectedSession ? `Chi tiết ${selectedSession.table.code} · ${selectedSession.order?.orderCode ?? ""}` : "Đang tải chi tiết bàn"}
        subtitle={selectedSession ? `Mở phiên lúc ${formatDateTime(selectedSession.openedAt)}` : "Đang lấy thông tin phiên phục vụ"}
        onClose={() => { if (!detailLoading) { setSelectedSession(null); setDetailError(null); } }}
        maxWidth={760}
        footer={selectedSession ? (
          <>
            <Button label="Đóng" variant="secondary" onPress={() => setSelectedSession(null)} disabled={mutating} />
            <PermissionGate permission="ORDER_ADD_ITEM">
              <Button label="Gọi thêm món" onPress={() => setAddItemOpen(true)} disabled={mutating || Boolean(currentOrder?.payment)} />
            </PermissionGate>
            {canConfirmPayment ? (
              <PermissionGate permission="ORDER_PAYMENT">
                <Button label="Xác nhận đã nhận tiền" variant="success" onPress={() => setPaymentOpen(true)} disabled={mutating} />
              </PermissionGate>
            ) : null}
          </>
        ) : undefined}
      >
        {detailLoading && !selectedSession ? <ActivityIndicator color={theme.colors.primary} /> : null}
        {detailError ? <Text style={{ color: theme.colors.error }}>{detailError}</Text> : null}
        {selectedSession && currentOrder ? (
          <View style={{ gap: 12 }}>
            {selectedPaymentRequest ? (
              <View style={[styles.paymentRequestBanner, { backgroundColor: theme.colors.warningContainer }]}>
                <Clock size={18} color={theme.colors.onWarningContainer} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.onWarningContainer, fontWeight: "800" }}>Khách đang yêu cầu thanh toán</Text>
                  <Text style={{ color: theme.colors.onWarningContainer }}>Gửi lúc {formatDateTime(selectedPaymentRequest.requestedAt)} · Kiểm tra món và đến bàn nhận tiền.</Text>
                </View>
              </View>
            ) : null}
            <View style={styles.detailSummary}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>Tình trạng phiên</Text>
              <Text style={{ color: theme.colors.onSurface, fontWeight: "800" }}>Đang phục vụ</Text>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>Số món: {currentOrder.items.length}</Text>
            </View>
            {currentOrder.items.length === 0 ? (
              <Text style={{ color: theme.colors.onSurfaceVariant }}>Khách chưa gọi món nào trong phiên này.</Text>
            ) : currentOrder.items.map((item) => {
              const status = ITEM_STATUS[item.status];
              return (
                <View key={item.id} style={[styles.detailItem, { backgroundColor: theme.colors.surfaceLow, borderColor: theme.colors.border }]}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ color: theme.colors.onSurface, fontWeight: "700" }}>{item.quantity} × {item.itemNameSnapshot}</Text>
                    {item.note ? <Text style={{ color: theme.colors.onSurfaceVariant }}>Ghi chú: {item.note}</Text> : null}
                    <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>Gọi lúc {formatDateTime(item.createdAt)}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 5 }}>
                    <Text style={{ color: theme.colors.onSurface, fontWeight: "700" }}>{formatVND(Number(item.lineTotal))}</Text>
                    <Text style={{ color: status.color === "success" ? theme.colors.success : status.color === "warning" ? theme.colors.warning : status.color === "danger" ? theme.colors.error : theme.colors.secondary, fontSize: 12, fontWeight: "700" }}>{status.label}</Text>
                  </View>
                </View>
              );
            })}
            <View style={[styles.totalBox, { borderColor: theme.colors.border }]}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>Tổng tiền cần thu (không tính món đã hủy)</Text>
              <Text style={{ color: theme.colors.secondary, fontSize: 22, fontWeight: "900" }}>{formatVND(totalAmount)}</Text>
              {!canConfirmPayment && !currentOrder.payment ? <Text style={{ color: theme.colors.warning, fontSize: 12 }}>Chưa thể xác nhận thanh toán: vẫn còn món chờ bếp tiếp nhận.</Text> : null}
              {currentOrder.payment ? <Text style={{ color: theme.colors.success }}>Đơn đã thanh toán.</Text> : null}
            </View>
          </View>
        ) : null}
      </ModalDialog>

      <AddOrderItemModal
        visible={addItemOpen}
        orderNumber={currentOrder?.orderCode ?? ""}
        availableItems={availableItems}
        loading={mutating}
        onClose={() => setAddItemOpen(false)}
        onSubmit={async (input) => {
          await addOrderItem(input);
          setAddItemOpen(false);
          Alert.alert("Đã gọi thêm món", "Món mới đã được gửi đến bếp.");
        }}
      />
      <PaymentModal
        visible={paymentOpen}
        orderNumber={currentOrder?.orderCode ?? ""}
        totalAmount={totalAmount}
        loading={mutating}
        onClose={() => setPaymentOpen(false)}
        onConfirm={confirmPayment}
      />

      <ModalDialog
        visible={Boolean(deleteTarget)}
        title="Xác nhận xóa bàn"
        subtitle={deleteTarget ? `Bạn sắp xóa ${deleteTarget.code} · ${deleteTarget.name}.` : undefined}
        onClose={() => { if (!deletingTable) setDeleteTarget(null); }}
        footer={
          <>
            <Button label="Hủy" variant="secondary" onPress={() => setDeleteTarget(null)} disabled={deletingTable} />
            <Button label="Xóa bàn" variant="danger" onPress={() => void confirmDeleteTable()} loading={deletingTable} />
          </>
        }
      >
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          Chỉ bàn chưa có phiên phục vụ và chưa được gán thiết bị mới có thể xóa. Dữ liệu lịch sử được giữ nguyên.
        </Text>
      </ModalDialog>

      <ModalDialog visible={formOpen} title={editing ? "Cập nhật bàn" : "Tạo bàn mới"} subtitle="Mã bàn phải duy nhất trong nhà hàng." onClose={() => setFormOpen(false)} footer={
        <>
          <Button label="Hủy" variant="secondary" onPress={() => setFormOpen(false)} disabled={saving} />
          <Button label={editing ? "Lưu thay đổi" : "Tạo bàn"} onPress={() => void saveTable()} loading={saving} />
        </>
      }>
        <Input label="Mã bàn *" value={form.code} onChangeText={(code) => setForm((v) => ({ ...v, code }))} placeholder="VD: T01" autoCapitalize="characters" />
        <Input label="Tên bàn *" value={form.name} onChangeText={(name) => setForm((v) => ({ ...v, name }))} placeholder="VD: Bàn số 01" />
        <Input label="Sức chứa (không bắt buộc)" value={form.capacity} onChangeText={(capacity) => setForm((v) => ({ ...v, capacity }))} keyboardType="number-pad" placeholder="VD: 4" />
        {formError ? <Text style={{ color: theme.colors.error }}>{formError}</Text> : null}
      </ModalDialog>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16, paddingBottom: 36 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  refresh: { width: 42, height: 42, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  summary: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10, padding: 14, borderWidth: 1, borderRadius: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tableCard: { width: "31%", minWidth: 125, flexGrow: 0, flexShrink: 0, minHeight: 160, padding: 10, borderWidth: 1, borderRadius: 12, gap: 8 },
  tableMain: { alignItems: "center", justifyContent: "center", gap: 7, flex: 1, minHeight: 105 },
  tableName: { fontSize: 15, fontWeight: "800" },
  actions: { flexDirection: "row", justifyContent: "center", gap: 8, paddingTop: 6 },
  iconButton: { width: 34, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  paymentRequestBanner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 10 },
  detailSummary: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, padding: 12, borderRadius: 10, backgroundColor: "#00000008" },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderWidth: 1, borderRadius: 10 },
  totalBox: { borderTopWidth: 1, paddingTop: 12, gap: 6, alignItems: "flex-end" },
});
