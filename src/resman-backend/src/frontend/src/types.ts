export type ActiveTab = 
  | 'menu-management'
  | 'customer-ordering'
  | 'order-management'
  | 'kitchen-display-system'
  | 'inventory-stock'
  | 'employee-management'
  | 'reporting-analytics';

export type UserRole = 'Manager' | 'Order Staff' | 'Kitchen / KDS' | 'Inventory' | 'Customer View';

export interface MenuItem {
  id: string; // e.g. 'MN-001'
  name: string;
  category: 'APPETIZER' | 'MAIN' | 'DESSERT' | 'BEVERAGE';
  categoryLabel: string;
  station: 'Bếp Nóng' | 'Bếp Nguội' | 'Quầy Bar' | 'Bếp Nướng Than';
  price: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'INACTIVE';
  statusLabel: string;
  image: string;
  description: string;
  inventoryLinks: {
    name: string;
    amount: string;
  }[];
  modifiers: string[];
  outOfStockReason?: string;
}

export interface KDSRowItem {
  id: string;
  name: string;
  quantity: number;
  modifiers?: string;
  note?: string;
  status: 'Chờ' | 'Đang chờ' | 'Đang làm' | 'Đang xào' | 'Chờ múc' | 'Chưa chiên' | 'Chờ trộn' | 'Chờ chiên' | 'Đã xong' | string;
  isDone: boolean;
}

export interface KDSTicket {
  id: string; // e.g. 'ORD-1042'
  tableNumber: string; // e.g. 'BÀN 04' or 'MANG VỀ'
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'VIP';
  orderTypeLabel: string;
  timeElapsed: string; // e.g. '14:20'
  isUrgent?: boolean;
  slaDelayText?: string;
  status: 'Chờ nhận đơn' | 'Đang nấu' | 'Trễ SLA';
  stationType: 'hot' | 'cold' | 'bar';
  items: KDSRowItem[];
  colorHeader: string;
}

export interface LiveOrderItem {
  stt: string;
  name: string;
  modifierText?: string;
  note?: string;
  quantity: number;
  price: number;
  total: number;
  kdsStatus: 'Chờ gửi KDS' | 'Pha Chế Bar' | 'Đang nấu' | 'Hoàn tất';
}

export interface LiveOrder {
  id: string; // 'ORD-1042'
  table: string; // 'Bàn 04'
  guests: number;
  isVip?: boolean;
  status: 'pending' | 'cooking' | 'ready' | 'completed';
  statusBadge: string;
  statusBadgeClass: string;
  createdAt: string;
  totalAmount: number;
  serverName: string;
  serverCode: string;
  warningText?: string;
  items: LiveOrderItem[];
  subtotal: number;
  serviceCharge: number;
  vat: number;
  grandTotal: number;
  location: string;
  logs: {
    time: string;
    title: string;
    description: string;
    isCurrent?: boolean;
  }[];
}

export interface InventoryItem {
  sku: string; // SKU-0091
  name: string;
  zone: 'BEP_NONG' | 'KHO_MAT' | 'PHA_CHE';
  zoneLabel: string;
  unit: string;
  currentStock: number;
  minStock: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  updatedAt: string;
  usageDesc: string;
  tag?: string;
}

export interface StaffMember {
  code: string; // NV-001
  name: string;
  initials: string;
  email: string;
  role: 'manager' | 'server' | 'kitchen' | 'inventory';
  roleTitle: string;
  shift: string;
  shiftHoursLeft: string;
  station: string;
  status: 'Đang làm việc' | 'Đang phục vụ (Bàn 04, 07)' | 'Sẵn sàng nhận bàn' | 'Đang trực KDS' | 'Đang kiểm kê F-010' | 'Nghỉ ca (Chuẩn bị vào ca)';
  statusType: 'active' | 'ready' | 'break';
}

export interface VoidLogItem {
  id: string;
  orderId: string;
  table: string;
  amount: number;
  reason: string;
  time: string;
  approvedBy: string;
}
