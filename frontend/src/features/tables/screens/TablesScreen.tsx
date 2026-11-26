import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Armchair, RefreshCw } from "lucide-react-native";
import { apiClient } from "@/src/services/api/apiClient";
import { useTheme } from "@/src/theme/ThemeContext";

type DiningTable = {
  id: string;
  code: string;
  name: string;
  status: string;
  sessions?: Array<{ id: string; status: string; openedAt: string }>;
};

function unwrap<T>(value: unknown): T {
  if (value && typeof value === "object" && "data" in value) {
    return (value as { data: T }).data;
  }
  return value as T;
}

export function TablesScreen() {
  const { theme } = useTheme();
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/tables");
      setTables(unwrap<DiningTable[]>(response.data) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách bàn.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadTables(); }, [loadTables]);

  const openTable = async (table: DiningTable) => {
    setBusyId(table.id);
    try {
      await apiClient.post("/sessions", { tableId: Number(table.id) });
      await loadTables();
    } catch (err) {
      Alert.alert("Không thể mở bàn", err instanceof Error ? err.message : "Vui lòng thử lại.");
      await loadTables();
    } finally {
      setBusyId(null);
    }
  };

  const occupiedCount = tables.filter((table) => table.sessions?.length || table.status === "OCCUPIED").length;
  const isOpen = (table: DiningTable) => Boolean(table.sessions?.length) || table.status === "OCCUPIED";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Quản lý bàn</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Mở bàn trống; bàn đang phục vụ chỉ được giải phóng sau thanh toán</Text>
        </View>
        <Pressable onPress={() => void loadTables()} style={[styles.refresh, { backgroundColor: theme.colors.surfaceLow }]}>
          <RefreshCw size={18} color={theme.colors.onSurface} />
        </Pressable>
      </View>

      <View style={[styles.summary, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={{ color: theme.colors.onSurface, fontWeight: "700" }}>Tổng {tables.length} bàn</Text>
        <Text style={{ color: theme.colors.success }}>Đang mở: {occupiedCount}</Text>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Đang đóng: {Math.max(0, tables.length - occupiedCount)}</Text>
      </View>

      {loading ? <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 28 }} /> : null}
      {error ? <Text style={{ color: theme.colors.error }}>{error}</Text> : null}

      <View style={styles.grid}>
        {tables.map((table) => {
          const opened = isOpen(table);
          const busy = busyId === table.id;
          return (
            <Pressable
              key={table.id}
              disabled={busy || loading}
              onPress={() => {
                if (opened) {
                  Alert.alert("Bàn đang phục vụ", "Bàn chỉ được giải phóng sau khi thanh toán thành công. Hãy vào Đơn hàng để thực hiện thanh toán.");
                  return;
                }
                void openTable(table);
              }}
              style={[
                styles.tableCard,
                {
                  backgroundColor: opened ? theme.colors.secondaryContainer : theme.colors.surface,
                  borderColor: opened ? theme.colors.secondary : theme.colors.border,
                  opacity: busy ? 0.6 : 1,
                },
              ]}
            >
              {busy ? <ActivityIndicator color={theme.colors.primary} /> : <Armchair size={25} color={opened ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant} />}
              <Text style={[styles.tableName, { color: opened ? theme.colors.onSecondaryContainer : theme.colors.onSurface }]}>{table.name}</Text>
              <Text style={{ color: opened ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant, fontSize: 12, fontWeight: "700" }}>
                {opened ? "ĐANG PHỤC VỤ · Chờ thanh toán" : "BÀN TRỐNG · Nhấn để mở"}
              </Text>
              {opened && table.sessions?.[0] ? (
                <Text style={{ color: theme.colors.onSecondaryContainer, fontSize: 10 }}>
                  {new Date(table.sessions[0].openedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      {!loading && tables.length === 0 ? (
        <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: "center", marginTop: 20 }}>
          Chưa có bàn. Quản lý cần tạo bàn trong chức năng quản lý bàn.
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16, paddingBottom: 36 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  refresh: { width: 42, height: 42, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  summary: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10, padding: 14, borderWidth: 1, borderRadius: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tableCard: { width: "31%", minWidth: 105, flexGrow: 1, minHeight: 126, padding: 12, borderWidth: 1, borderRadius: 12, alignItems: "center", justifyContent: "center", gap: 7 },
  tableName: { fontSize: 15, fontWeight: "800" },
});
