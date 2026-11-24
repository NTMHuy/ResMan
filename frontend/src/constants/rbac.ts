import type { AppRoute, UserRole } from "@/src/types/common";

export type Permission =
  | "DASHBOARD_VIEW"
  | "MENU_VIEW"
  | "MENU_CREATE"
  | "MENU_UPDATE"
  | "MENU_DELETE"
  | "MENU_TOGGLE_STATUS"
  | "CUSTOMER_ORDER_VIEW"
  | "CUSTOMER_ORDER_SUBMIT"
  | "ORDER_VIEW"
  | "ORDER_CREATE"
  | "ORDER_ACCEPT"
  | "ORDER_REJECT"
  | "ORDER_UPDATE_STATUS"
  | "ORDER_ADD_ITEM"
  | "ORDER_CANCEL"
  | "ORDER_PAYMENT"
  | "KDS_VIEW"
  | "KDS_ACCEPT_ITEM"
  | "KDS_START_COOKING"
  | "KDS_COMPLETE_ITEM"
  | "KDS_BUMP_TICKET"
  | "INVENTORY_VIEW"
  | "INVENTORY_CREATE"
  | "INVENTORY_UPDATE"
  | "INVENTORY_STOCK_IN"
  | "INVENTORY_ADJUST"
  | "INVENTORY_AUDIT"
  | "EMPLOYEE_VIEW"
  | "EMPLOYEE_CREATE"
  | "EMPLOYEE_UPDATE"
  | "EMPLOYEE_ASSIGN_ROLE"
  | "EMPLOYEE_TOGGLE_ACTIVE"
  | "REPORT_VIEW";

export interface RouteMeta {
  route: AppRoute;
  label: string;
  shortLabel: string;
  subtitle: string;
}

export const APP_ROUTES_META: Record<AppRoute, RouteMeta> = {
  dashboard: {
    route: "dashboard",
    label: "Tổng quan",
    shortLabel: "Tổng quan",
    subtitle: "Hoạt động nhà hàng",
  },
  menu: {
    route: "menu",
    label: "Thực đơn",
    shortLabel: "Thực đơn",
    subtitle: "Danh mục & Món ăn",
  },
  "customer-order": {
    route: "customer-order",
    label: "Đặt món khách",
    shortLabel: "Đặt món",
    subtitle: "Menu & Giỏ hàng",
  },
  orders: {
    route: "orders",
    label: "Đơn hàng",
    shortLabel: "Đơn hàng",
    subtitle: "Điều phối POS",
  },
  kitchen: {
    route: "kitchen",
    label: "Bếp (KDS)",
    shortLabel: "Bếp KDS",
    subtitle: "Chế biến món",
  },
  inventory: {
    route: "inventory",
    label: "Kho nguyên liệu",
    shortLabel: "Kho",
    subtitle: "Nhập xuất & Kiểm kê",
  },
  employees: {
    route: "employees",
    label: "Nhân sự",
    shortLabel: "Nhân sự",
    subtitle: "Tài khoản & Ca trực",
  },
  reports: {
    route: "reports",
    label: "Báo cáo",
    shortLabel: "Báo cáo",
    subtitle: "Doanh thu & Thống kê",
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  MANAGER: "Quản lý nhà hàng",
  ORDER_STAFF: "Nhân viên phục vụ",
  KITCHEN_STAFF: "Nhân viên bếp",
  INVENTORY_STAFF: "Nhân viên kho",
  GUEST: "Khách hàng",
};

export const ROLE_ALLOWED_ROUTES: Record<UserRole, AppRoute[]> = {
  MANAGER: [
    "dashboard",
    "menu",
    "customer-order",
    "orders",
    "kitchen",
    "inventory",
    "employees",
    "reports",
  ],
  ORDER_STAFF: ["dashboard", "customer-order", "orders", "menu"],
  KITCHEN_STAFF: ["kitchen", "menu", "inventory"],
  INVENTORY_STAFF: ["inventory", "menu"],
  GUEST: ["customer-order"],
};

export const ROLE_DEFAULT_ROUTE: Record<UserRole, AppRoute> = {
  MANAGER: "dashboard",
  ORDER_STAFF: "orders",
  KITCHEN_STAFF: "kitchen",
  INVENTORY_STAFF: "inventory",
  GUEST: "customer-order",
};

/*
 * Đây là permission nội bộ của Frontend.
 * Chỉ dùng làm fallback khi chạy Mock Repository.
 */
export const ROLE_PERMISSIONS: Record<UserRole, ReadonlySet<Permission>> = {
  MANAGER: new Set<Permission>([
    "DASHBOARD_VIEW",
    "MENU_VIEW",
    "MENU_CREATE",
    "MENU_UPDATE",
    "MENU_DELETE",
    "MENU_TOGGLE_STATUS",
    "CUSTOMER_ORDER_VIEW",
    "CUSTOMER_ORDER_SUBMIT",
    "ORDER_VIEW",
    "ORDER_CREATE",
    "ORDER_ACCEPT",
    "ORDER_REJECT",
    "ORDER_UPDATE_STATUS",
    "ORDER_ADD_ITEM",
    "ORDER_CANCEL",
    "ORDER_PAYMENT",
    "KDS_VIEW",
    "KDS_ACCEPT_ITEM",
    "KDS_START_COOKING",
    "KDS_COMPLETE_ITEM",
    "KDS_BUMP_TICKET",
    "INVENTORY_VIEW",
    "INVENTORY_CREATE",
    "INVENTORY_UPDATE",
    "INVENTORY_STOCK_IN",
    "INVENTORY_ADJUST",
    "INVENTORY_AUDIT",
    "EMPLOYEE_VIEW",
    "EMPLOYEE_CREATE",
    "EMPLOYEE_UPDATE",
    "EMPLOYEE_ASSIGN_ROLE",
    "EMPLOYEE_TOGGLE_ACTIVE",
    "REPORT_VIEW",
  ]),

  ORDER_STAFF: new Set<Permission>([
    "DASHBOARD_VIEW",
    "MENU_VIEW",
    "CUSTOMER_ORDER_VIEW",
    "CUSTOMER_ORDER_SUBMIT",
    "ORDER_VIEW",
    "ORDER_CREATE",
    "ORDER_ACCEPT",
    "ORDER_REJECT",
    "ORDER_UPDATE_STATUS",
    "ORDER_ADD_ITEM",
    "ORDER_PAYMENT",
  ]),

  KITCHEN_STAFF: new Set<Permission>([
    "MENU_VIEW",
    "MENU_TOGGLE_STATUS",
    "KDS_VIEW",
    "KDS_ACCEPT_ITEM",
    "KDS_START_COOKING",
    "KDS_COMPLETE_ITEM",
    "KDS_BUMP_TICKET",
    "INVENTORY_VIEW",
  ]),

  INVENTORY_STAFF: new Set<Permission>([
    "MENU_VIEW",
    "INVENTORY_VIEW",
    "INVENTORY_CREATE",
    "INVENTORY_UPDATE",
    "INVENTORY_STOCK_IN",
    "INVENTORY_ADJUST",
    "INVENTORY_AUDIT",
  ]),

  GUEST: new Set<Permission>(["CUSTOMER_ORDER_VIEW", "CUSTOMER_ORDER_SUBMIT"]),
};

/*
 * Mapping từ quyền nội bộ Frontend sang permission code
 * được seed trong backend/src/seed.ts.
 *
 * Không tự tạo permission code mới ở đây.
 */
export const BACKEND_PERMISSION_MAP: Partial<Record<Permission, string[]>> = {
  MENU_VIEW: ["menu:read"],
  MENU_CREATE: ["menu:manage"],
  MENU_UPDATE: ["menu:manage"],
  MENU_DELETE: ["menu:manage"],
  MENU_TOGGLE_STATUS: ["menu:manage"],

  ORDER_VIEW: ["orders:read"],
  ORDER_CREATE: ["orders:create-item"],
  ORDER_ADD_ITEM: ["orders:create-item"],
  ORDER_ACCEPT: ["orders:manage-item"],
  ORDER_REJECT: ["orders:manage-item"],
  ORDER_UPDATE_STATUS: ["orders:manage-item"],
  ORDER_CANCEL: ["orders:manage-item"],

  ORDER_PAYMENT: ["payments:confirm"],

  KDS_VIEW: ["kitchen:read"],
  KDS_ACCEPT_ITEM: ["kitchen:update-item"],
  KDS_START_COOKING: ["kitchen:update-item"],
  KDS_COMPLETE_ITEM: ["kitchen:update-item"],
  KDS_BUMP_TICKET: ["kitchen:update-item"],

  INVENTORY_VIEW: ["inventory:read"],
  INVENTORY_CREATE: ["inventory:manage"],
  INVENTORY_UPDATE: ["inventory:manage"],
  INVENTORY_STOCK_IN: ["inventory:manage"],
  INVENTORY_ADJUST: ["inventory:manage"],
  INVENTORY_AUDIT: ["inventory:count"],

  EMPLOYEE_VIEW: ["users:read"],
  EMPLOYEE_CREATE: ["users:create"],
  EMPLOYEE_UPDATE: ["users:update"],
  EMPLOYEE_ASSIGN_ROLE: ["users:update"],
  EMPLOYEE_TOGGLE_ACTIVE: ["users:update"],

  REPORT_VIEW: ["reports:read"],
};

function normalizeRole(role: unknown): UserRole | null {
  if (typeof role !== "string") return null;

  const normalized = role.trim().toUpperCase();

  const roleMap: Record<string, UserRole> = {
    ADMIN: "MANAGER",
    MANAGER: "MANAGER",
    STAFF: "ORDER_STAFF",
    ORDER_STAFF: "ORDER_STAFF",
    KITCHEN: "KITCHEN_STAFF",
    KITCHEN_STAFF: "KITCHEN_STAFF",
    INVENTORY_STAFF: "INVENTORY_STAFF",
    CUSTOMER: "GUEST",
    GUEST: "GUEST",
  };

  return roleMap[normalized] ?? null;
}

export function canAccessRoute(
  role: UserRole | undefined | null,
  route: AppRoute,
): boolean {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) return false;

  const allowedRoutes = ROLE_ALLOWED_ROUTES[normalizedRole];

  if (!allowedRoutes) return false;

  return allowedRoutes.includes(route);
}

export function hasPermission(
  role: UserRole | undefined | null,
  permission: Permission,
): boolean {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) return false;

  const permissions = ROLE_PERMISSIONS[normalizedRole];

  if (!permissions) return false;

  return permissions.has(permission);
}

export function getDefaultRouteForRole(
  role: UserRole | undefined | null,
): AppRoute {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) return "customer-order";

  return ROLE_DEFAULT_ROUTE[normalizedRole] ?? "customer-order";
}
