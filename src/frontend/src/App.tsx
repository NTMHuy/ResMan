/**
 * ResMan - Enterprise Restaurant OS
 * Modular Restaurant Management & Dining Platform
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

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('menu-management');
  const [currentRole, setCurrentRole] = useState<UserRole>('Manager');

  // Core Application Datasets
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [kdsTickets, setKdsTickets] = useState<KDSTicket[]>(INITIAL_KDS_TICKETS);
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>(INITIAL_LIVE_ORDERS);
  const [inventoryItems, setInventoryItems] = useState(INITIAL_INVENTORY_ITEMS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [voidLogs, setVoidLogs] = useState(INITIAL_VOID_LOGS);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, message, type, title };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cross-module integration: Dispatch order to KDS
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

  // Cross-module integration: Customer placed order
  const handleCustomerPlacedOrder = (cartItems: any[], table: string) => {
    const newOrderId = `ORD-${Math.floor(1050 + Math.random() * 50)}`;
    const subtotal = cartItems.reduce((acc, it) => acc + it.quantity * it.menuItem.price, 0);
    const serviceCharge = Math.round(subtotal * 0.05);
    const vat = Math.round(subtotal * 0.08);
    const grandTotal = subtotal + serviceCharge + vat;

    const newOrder: LiveOrder = {
      id: newOrderId,
      table: table,
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
      logs: [
        {
          time: new Date().toLocaleTimeString('vi-VN'),
          title: 'Khách quét QR gọi món',
          description: `Bàn ${table} tự tạo đơn hàng trực tiếp qua điện thoại.`,
          isCurrent: true
        }
      ]
    };

    setLiveOrders((prev) => [newOrder, ...prev]);

    // Also send directly to KDS
    handleSendOrderToKDS(newOrder);
  };

  return (
    <div className="min-h-screen bg-surface flex text-on-surface font-sans antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        branchName="Downtown #04"
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        {/* Top Floating App Header */}
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onTabChange={setActiveTab}
        />

        {/* Scrollable View Canvas */}
        <main className="flex-1 mt-16 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'menu-management' && (
            <MenuCatalogView
              menuItems={menuItems}
              onMenuItemsChange={setMenuItems}
              showToast={showToast}
            />
          )}

          {activeTab === 'customer-ordering' && (
            <CustomerOrderView
              menuItems={menuItems}
              showToast={showToast}
              onPlaceOrder={handleCustomerPlacedOrder}
            />
          )}

          {activeTab === 'order-management' && (
            <LiveOrdersView
              orders={liveOrders}
              onOrdersChange={setLiveOrders}
              showToast={showToast}
              onSendToKDS={handleSendOrderToKDS}
            />
          )}

          {activeTab === 'kitchen-display-system' && (
            <KDSView
              tickets={kdsTickets}
              onTicketsChange={setKdsTickets}
              showToast={showToast}
            />
          )}

          {activeTab === 'inventory-stock' && (
            <InventoryAuditView
              items={inventoryItems}
              onItemsChange={setInventoryItems}
              showToast={showToast}
            />
          )}

          {activeTab === 'employee-management' && (
            <StaffShiftsView
              staff={staff}
              onStaffChange={setStaff}
              showToast={showToast}
            />
          )}

          {activeTab === 'reporting-analytics' && (
            <ReportsTelemetryView
              voidLogs={voidLogs}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
