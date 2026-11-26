import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Armchair, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react-native";
import { apiClient } from "@/src/services/api/apiClient";
import { useTheme } from "@/src/theme/ThemeContext";
import { ModalDialog } from "@/src/components/common/ModalDialog";
import { Input } from "@/src/components/common/Input";
import { Button } from "@/src/components/common/Button";
import { PermissionGate } from "@/src/components/common/PermissionGate";

type DiningTable = {
  id: string;
  code: string;
  name: string;
  capacity: number | null;
  status: string;
  sessions?: Array<{ id: string; status: string; openedAt: string }>;
};
type TableForm = { code: string; name: string; capacity: string };
function unwrap<T>(value: unknown): T {
  if (value && typeof value === "object" && "data" in value) return (value as { data: T }).data;
  return value as T;
}

export function TablesScreen() {
  const { theme } = useTheme();
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DiningTable | null>(null);
  const [form, setForm] = useState<TableForm>({ code: "", name: "", capacity: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadTables = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await apiClient.get("/tables");
      setTables(unwrap<DiningTable[]>(response.data) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách bàn.");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadTables(); }, [loadTables]);

  const openTable = async (table: DiningTable) => {
    setBusyId(table.id);
    try { await apiClient.post("/sessions", { tableId: Number(table.id) }); await loadTables(); }
    catch (err) { Alert.alert("Không thể mở bàn", err instanceof Error ? err.message : "Vui lòng thử lại."); await loadTables(); }
    finally { setBusyId(null); }
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
    if (table.status === "OCCUPIED") { Alert.alert("Không thể xóa bàn", "Bàn đang có khách."); return; }
    Alert.alert("Xóa bàn", `Bạn có chắc muốn xóa ${table.code} - ${table.name}? Bàn đã có lịch sử phiên hoặc thiết bị gán sẽ không thể xóa.`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => {
        void (async () => {
          setBusyId(table.id);
          try { await apiClient.delete(`/tables/${table.id}`); await loadTables(); }
          catch (err) { Alert.alert("Không thể xóa bàn", err instanceof Error ? err.message : "Vui lòng thử lại."); }
          finally { setBusyId(null); }
        })();
      }},
    ]);
  };
  const occupiedCount = tables.filter((table) => table.sessions?.length || table.status === "OCCUPIED").length;
  const isOpen = (table: DiningTable) => Boolean(table.sessions?.length) || table.status === "OCCUPIED";

  return (
    <>
      <ScrollView style={{ flex:  1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>Quản lý bàn</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Quản lý danh sách bàn và trạng thái phục vụ</Text>
          </View>
          <PermissionGate permission="TABLES_MANAGE">
            <Button label="Thêm bàn" size="sm" leftIcon={<Plus size={15} color={theme.colors.onPrimary} />} onPress={beginCreate} />
          </PermissionGate>
          <Pressable onPress={() => void loadTables()} style={[styles.refresh, { backgroundColor: theme.colors.surfaceLow }]}>
            <RefreshCw size={18} color={theme.colors.onSurface} />
          </Pressable>
        </View>
        <View style={[styles.summary, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={{ color: theme.colors.onSurface, fontWeight: "700" }}>Tổng {tables.length} bàn</Text>
          <Text style={{ color: theme.colors.success }}>Đang mở: {occupiedCount}</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Đang trống: {Math.max(0, tables.length - occupiedCount)}</Text>
        </View>
        {loading ? <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 28 }} /> : null}
        {error ? <Text style={{ color: theme.colors.error }}>{error}</Text> : null}
        <View style={styles.grid}>
          {tables.map((table) => {
            const opened = isOpen(table), busy = busyId === table.id;
            return (
              <View key={table.id} style={[styles.tableCard, { backgroundColor: opened ? theme.colors.secondaryContainer : theme.colors.surface, borderColor: opened ? theme.colors.secondary : theme.colors.border }]}>
                <Pressable disabled={busy || loading} onPress={() => opened
                  ? Alert.alert("Bàn đang phục vụ", "Bàn chỉ được giải phóng sau khi thanh toán thành công.")
                  : void openTable(table)} style={styles.tableMain}>
                  {busy ? <ActivityIndicator color={theme.colors.primary} /> : <Armchair size={25} color={opened ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant} />}
                  <Text style={[styles.tableName, { color: opened ? theme.colors.onSecondaryContainer : theme.colors.onSurface }]}>{table.name}</Text>
                  <Text style={{ color: opened ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant, fontSize: 12, fontWeight: "700" }}>
                    {opened ? "ĐANG PHỤC VỤ" : "BÀN TRỐNG · Nhấn để mở"}
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
  tableCard: { width: "31%", minWidth: 125, flexGrow: 1, minHeight: 160, padding: 10, borderWidth: 1, borderRadius: 12, gap: 8 },
  tableMain: { alignItems: "center", justifyContent: "center", gap: 7, flex: 1, minHeight: 105 },
  tableName: { fontSize: 15, fontWeight: "800" },
  actions: { flexDirection: "row", justifyContent: "center", gap: 8, paddingTop: 6 },
  iconButton: { width: 34, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});
