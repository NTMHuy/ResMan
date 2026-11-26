import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Armchair, Plus, RefreshCw, Tablet } from "lucide-react-native";
import { apiClient } from "@/src/services/api/apiClient";
import { useTheme } from "@/src/theme/ThemeContext";
import { useToast } from "@/src/contexts/ToastContext";
import { Card } from "@/src/components/common/Card";
import { Badge } from "@/src/components/common/Badge";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import { ModalDialog } from "@/src/components/common/ModalDialog";
type DiningTable = { id: string; code: string; name: string; status: "AVAILABLE" | "OCCUPIED"; capacity: number | null };

type CustomerAccount = {
  id: string;
  username: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  tableDevice: null | {
    deviceCode: string;
    deviceName: string;
    isActive: boolean;
    table: { code: string; name: string };
  };
};
type CreateForm = {
  username: string;
  password: string;
  email: string;
  deviceCode: string;
  deviceName: string;
};
function unwrap<T>(value: unknown): T {
  if (value && typeof value === "object" && "success" in value && "data" in value) {
    return (value as { data: T }).data;
  }
  return value as T;
}

export function CustomerTabletAccountsPanel() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CreateForm>({ username: "", password: "", email: "", deviceCode: "", deviceName: "" });
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, tablesResponse] = await Promise.all([
        apiClient.get("/users", { params: { page: 1, limit: 100 } }),
        apiClient.get("/tables"),
      ]);
      const usersPayload = unwrap<{ data: Array<CustomerAccount & { role: { code: string } }> }>(usersResponse.data);
      setAccounts((usersPayload.data ?? []).filter((user) => user.role.code === "CUSTOMER"));
      setTables(unwrap<DiningTable[]>(tablesResponse.data) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải tài khoản tablet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const assignedTableIds = useMemo(() => new Set(
    accounts.filter((account) => account.tableDevice).map((account) => {
      const match = tables.find((table) => table.code === account.tableDevice?.table.code);
      return match?.id;
    }).filter((id): id is string => Boolean(id)),
  ), [accounts, tables]);

  const availableTables = tables.filter((table) =>
    table.status === "AVAILABLE" && !assignedTableIds.has(table.id),
  );

  const openCreate = () => {
    setForm({ username: "", password: "", email: "", deviceCode: "", deviceName: "" });
    setSelectedTableId(availableTables[0]?.id ?? null);
    setFormError(null);
    setFormOpen(true);
  };

  const createAccount = async () => {
    setFormError(null);
    if (form.username.trim().length < 3) { setFormError("Tên đăng nhập phải có ít nhất 3 ký tự."); return; }
    if (form.password.length < 12) { setFormError("Mật khẩu phải có ít nhất 12 ký tự."); return; }
    if (form.deviceCode.trim().length < 2 || form.deviceName.trim().length < 2) {
      setFormError("Mã thiết bị và tên thiết bị phải có ít nhất 2 ký tự."); return;
    }
    if (!selectedTableId) { setFormError("Vui lòng chọn bàn chưa được gán tablet."); return; }
    setMutating(true);
    try {
      await apiClient.post("/users", {
        username: form.username.trim(),
        password: form.password,
        ...(form.email.trim() ? { email: form.email.trim().toLowerCase() } : {}),
        roleCode: "CUSTOMER",
        tableId: Number(selectedTableId),
        deviceCode: form.deviceCode.trim(),
        deviceName: form.deviceName.trim(),
      });
      setFormOpen(false);
      showToast("Đã tạo tài khoản tablet", "success", `${form.username.trim()} · ${tables.find((table) => table.id === selectedTableId)?.code ?? ""}`);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Không thể tạo tài khoản tablet.");
    } finally {
      setMutating(false);
    }
  };

  const toggleAccount = async (account: CustomerAccount, isActive: boolean) => {
    setMutating(true);
    try {
      await apiClient.patch(`/users/${account.id}/status`, { isActive });
      showToast(isActive ? "Đã kích hoạt tài khoản tablet" : "Đã khóa tài khoản tablet", isActive ? "success" : "warning", account.username);
      await load();
    } catch (err) {
      showToast("Không thể cập nhật tài khoản", "error", err instanceof Error ? err.message : undefined);
    } finally {
      setMutating(false);
    }
  };

  return (
    <>
      <View style={{ gap: 14 }}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heading, { color: theme.colors.onSurface }]}>Tài khoản khách hàng cho tablet</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Mỗi tài khoản CUSTOMER được gắn cố định với một tablet và một bàn.</Text>
          </View>
          <Button label="Tạo tài khoản tablet" size="sm" leftIcon={<Plus size={15} color={theme.colors.onPrimary} />} onPress={openCreate} disabled={availableTables.length === 0} />
          <Pressable onPress={() => void load()} style={[styles.refresh, { backgroundColor: theme.colors.surfaceLow }]}>
            <RefreshCw size={17} color={theme.colors.onSurface} />
          </Pressable>
        </View>
        {availableTables.length === 0 ? (
          <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>Không có bàn trống chưa gán tablet. Hãy tạo bàn hoặc kiểm tra các tài khoản tablet hiện có.</Text>
        ) : null}
        {loading ? <ActivityIndicator color={theme.colors.primary} /> : null}
        {error ? <Text style={{ color: theme.colors.error }}>{error}</Text> : null}
        {!loading && accounts.length === 0 ? (
          <Card padding="md"><Text style={{ color: theme.colors.onSurfaceVariant }}>Chưa có tài khoản tablet nào.</Text></Card>
        ) : accounts.map((account) => (
          <Card key={account.id} padding="md">
            <View style={styles.accountRow}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
                <Tablet size={20} color={theme.colors.onPrimaryContainer} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.inline}>
                  <Text style={{ color: theme.colors.onSurface, fontWeight: "800" }}>{account.username}</Text>
                  <Badge label={account.isActive ? "Hoạt động" : "Đã khóa"} tone={account.isActive ? "success" : "danger"} />
                </View>
                <View style={styles.inline}>
                  <Armchair size={13} color={theme.colors.secondary} />
                  <Text style={{ color: theme.colors.secondary, fontWeight: "700" }}>
                    {account.tableDevice ? `${account.tableDevice.table.code} · ${account.tableDevice.table.name}` : "Chưa có bàn được gán"}
                  </Text>
                </View>
                <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                  Thiết bị: {account.tableDevice?.deviceName ?? "—"} · Mã: {account.tableDevice?.deviceCode ?? "—"}
                </Text>
                {account.email ? <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>{account.email}</Text> : null}
              </View>
              <View style={styles.switchColumn}>
                <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 11 }}>{account.isActive ? "Đang mở" : "Đã khóa"}</Text>
                <Switch value={account.isActive} onValueChange={(value) => void toggleAccount(account, value)} disabled={mutating} />
              </View>
            </View>
          </Card>
        ))}
      </View>

      <ModalDialog
        visible={formOpen}
        title="Tạo tài khoản tablet"
        subtitle="Tài khoản sẽ đăng nhập mặc định trên tablet được gán với bàn đã chọn."
        onClose={() => { if (!mutating) setFormOpen(false); }}
        maxWidth={560}
        footer={
          <>
            <Button label="Hủy" variant="secondary" onPress={() => setFormOpen(false)} disabled={mutating} />
            <Button label="Tạo tài khoản" onPress={() => void createAccount()} loading={mutating} />
          </>
        }
      >
        <Input label="Tên đăng nhập *" value={form.username} onChangeText={(username) => setForm((v) => ({ ...v, username }))} autoCapitalize="none" placeholder="VD: tablet_t01" />
        <Input label="Mật khẩu ban đầu *" value={form.password} onChangeText={(password) => setForm((v) => ({ ...v, password }))} secureTextEntry placeholder="Tối thiểu 12 ký tự" />
        <Input label="Email (không bắt buộc)" value={form.email} onChangeText={(email) => setForm((v) => ({ ...v, email }))} autoCapitalize="none" keyboardType="email-address" />
        <Input label="Mã thiết bị *" value={form.deviceCode} onChangeText={(deviceCode) => setForm((v) => ({ ...v, deviceCode }))} placeholder="VD: TAB-T01" />
        <Input label="Tên thiết bị *" value={form.deviceName} onChangeText={(deviceName) => setForm((v) => ({ ...v, deviceName }))} placeholder="VD: Tablet bàn T01" />
        <Text style={{ color: theme.colors.onSurface, fontWeight: "700" }}>Chọn bàn trống chưa gán tablet *</Text>
        <ScrollView style={{ maxHeight: 150 }} contentContainerStyle={{ gap: 8 }}>
          {availableTables.map((table) => {
            const active = selectedTableId === table.id;
            return (
              <Pressable key={table.id} onPress={() => setSelectedTableId(table.id)} style={[styles.tableOption, { backgroundColor: active ? theme.colors.secondaryContainer : theme.colors.surfaceLow, borderColor: active ? theme.colors.secondary : theme.colors.border }]}>
                <Text style={{ color: active ? theme.colors.onSecondaryContainer : theme.colors.onSurface, fontWeight: "700" }}>{table.code} · {table.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {formError ? <Text style={{ color: theme.colors.error }}>{formError}</Text> : null}
      </ModalDialog>
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  heading: { fontSize: 17, fontWeight: "800", marginBottom: 4 },
  refresh: { width: 40, height: 40, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  accountRow: { flexDirection: "row", alignItems: "center", gap: 12, flexWrap: "wrap" },
  avatar: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  inline: { flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap" },
  switchColumn: { alignItems: "center", gap: 3 },
  tableOption: { borderWidth: 1, borderRadius: 8, padding: 10 },
});
