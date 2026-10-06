/**
 * ResMan - Restaurant Management & Dining Platform
 *
 * The frontend uses the same business capabilities with different
 * presentation shells for each role/device.
 */

import React, { useState } from 'react';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_KDS_TICKETS,
  INITIAL_LIVE_ORDERS,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_STAFF,
  INITIAL_VOID_LOGS
} from './data/mockData';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/Toast';
import type { ToastMessage } from './components/layout/Toast';
import { MenuCatalogView } from './components/menu/MenuCatalogView';
import { CustomerOrderView } from './components/customer/CustomerOrderView';
import { LiveOrdersView } from './components/orders/LiveOrdersView';
import { KDSView } from './components/kds/KDSView';
import { InventoryAuditView } from './components/inventory/InventoryAuditView';
import { StaffShiftsView } from './components/staff/StaffShiftsView';
import { ReportsTelemetryView } from './components/reports/ReportsTelemetryView';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import type { ActiveTab, UserRole, KDSTicket, LiveOrder } from './types';

const DEFAULT_TAB_BY_ROLE: Record<UserRole, ActiveTab> = {
  Manager: 'reporting-analytics',
  'Order Staff': 'order-management',
  'Kitchen / KDS': 'kitchen-display-system',
  Inventory: 'inventory-stock',
  'Customer View': 'customer-ordering'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(DEFAULT_TAB_BY_ROLE.Manager);
  const [currentRole, setCurrentRole] = useState<UserRole>('Manager');

  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [kdsTickets, setKdsTickets] = useState<KDSTicket[]>(INITIAL_KDS_TICKETS);
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>(INITIAL_LIVE_ORDERS);
  const [inventoryItems, setInventoryItems] = useState(INITIAL_INVENTORY_ITEMS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [voidLogs] = useState(INITIAL_VOID_LOGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setActiveTab(DEFAULT_TAB_BY_ROLE[role]);
  };

  const handleSendOrderToKDS = (order: LiveOrder) => {
    const newTicket: KDSTicket = {
      id: order.id,
      tableNumber: order.table.toUpperCase(),
      orderType: order.isVip ? 'VIP' : 'DINE_IN',
      orderTypeLabel: order.isVip ? 'VIP Ưu tiên' : 'Tại bàn (Dine-in)',
      timeElapsed: '00:01',
      isUrgent: false,
      status: 'Đang nấu',
      stationType: 'hot',
      colorHeader: 'bg-secondary-container',
      items: order.items.map((it, idx) => ({
        id: `${order.id}-${idx}`,
        name: it.name,
        quantity: it.quantity,
        modifiers: it.modifierText,
        note: it.note,
        status: 'Đang làm',
        isDone: false
      }))
    };

    setKdsTickets((prev) => [newTicket, ...prev]);
  };

  const handleCustomerPlacedOrder = (cartItems: any[], table: string) => {
    const newOrderId = `ORD-${Math.floor(1050 + Math.random() * 50)}`;
    const subtotal = cartItems.reduce((acc, it) => acc + it.quantity * it.menuItem.price, 0);
    const serviceCharge = Math.round(subtotal * 0.05);
    const vat = Math.round(subtotal * 0.08);
    const grandTotal = subtotal + serviceCharge + vat;

    const newOrder: LiveOrder = {
      id: newOrderId,
      table,
      guests: 2,
      status: 'pending',
      statusBadge: 'Khách vừa gửi từ QR',
      statusBadgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant',
      createdAt: new Date().toLocaleTimeString('vi-VN'),
      totalAmount: subtotal,
      serverName: 'Tự phục vụ QR',
      serverCode: 'QR-ONLINE',
      warningText: 'Mới nhận',
      location: 'Khu Vực Trong Nhà',
      items: cartItems.map((c, idx) => ({
        stt: String(idx + 1).padStart(2, '0'),
        name: c.menuItem.name,
        modifierText: c.selectedModifiers.join(' • '),
        note: c.note,
        quantity: c.quantity,
        price: c.menuItem.price,
        total: c.quantity * c.menuItem.price,
        kdsStatus: 'Chờ gửi KDS'
      })),
      subtotal,
      serviceCharge,
      vat,
      grandTotal,
      logs: [{
        time: new Date().toLocaleTimeString('vi-VN'),
        title: 'Khách quét QR gọi món',
        description: `Bàn ${table} tự tạo đơn hàng trực tiếp.`,
        isCurrent: true
      }]
    };

    setLiveOrders((prev) => [newOrder, ...prev]);
    handleSendOrderToKDS(newOrder);
  };

  const isCustomer = currentRole === 'Customer View';

  return (
    <div className={`min-h-screen bg-surface text-on-surface font-sans antialiased selection:bg-secondary-container selection:text-on-secondary-container ${
      isCustomer ? '' : 'flex'
    }`}>
      {!isCustomer && (
        <Sidebar
          activeTab={activeTab}
          currentRole={currentRole}
          onTabChange={setActiveTab}
          branchName="Downtown #04"
        />
      )}

      <div className={`flex-1 flex flex-col min-w-0 ${isCustomer ? '' : 'lg:pl-64'}`}>
        <Header
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onTabChange={setActiveTab}
        />

        <main className={`flex-1 mt-16 w-full mx-auto ${isCustomer ? 'max-w-none p-0' : 'max-w-[1600px] p-6'}`}>
          {activeTab === 'menu-management' && (
            <MenuCatalogView menuItems={menuItems} onMenuItemsChange={setMenuItems} showToast={showToast} />
          )}

          {activeTab === 'customer-ordering' && (
            <CustomerOrderView menuItems={menuItems} showToast={showToast} onPlaceOrder={handleCustomerPlacedOrder} />
          )}

          {activeTab === 'order-management' && (
            <LiveOrdersView orders={liveOrders} onOrdersChange={setLiveOrders} showToast={showToast} onSendToKDS={handleSendOrderToKDS} />
          )}

          {activeTab === 'kitchen-display-system' && (
            <KDSView tickets={kdsTickets} onTicketsChange={setKdsTickets} showToast={showToast} />
          )}

          {activeTab === 'inventory-stock' && (
            <InventoryAuditView items={inventoryItems} onItemsChange={setInventoryItems} showToast={showToast} />
          )}

          {activeTab === 'employee-management' && (
            <StaffShiftsView staff={staff} onStaffChange={setStaff} showToast={showToast} />
          )}

          {activeTab === 'reporting-analytics' && (
            <ManagerDashboard orders={liveOrders} inventoryItems={inventoryItems} staff={staff} showToast={showToast} />
          )}
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
