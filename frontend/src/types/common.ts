export type UserRole =
  | "MANAGER"
  | "ORDER_STAFF"
  | "KITCHEN_STAFF"
  | "INVENTORY_STAFF"
  | "GUEST";

export type AppRoute =
  | "dashboard"
  | "menu"
  | "customer-order"
  | "tables"
  | "orders"
  | "kitchen"
  | "inventory"
  | "employees"
  | "reports";

export type KitchenStation = "HOT_KITCHEN" | "COLD_KITCHEN" | "BAR";

export interface AuthUser {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;

  station?: string;
  shift?: string;

  isActive: boolean;
  avatarInitials: string;
  createdAt: string;

  // Permission code thực tế do Backend trả về.
  permissions?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: string;
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export type ReportPeriod = "DAY" | "WEEK" | "MONTH";
