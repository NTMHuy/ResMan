import { APP_CONFIG } from "@/src/constants/config";

import type { AuthRepository } from "@/src/repositories/interfaces/AuthRepository";
import type { MenuRepository } from "@/src/repositories/interfaces/MenuRepository";
import type { CustomerOrderRepository } from "@/src/repositories/interfaces/CustomerOrderRepository";
import type { OrderRepository } from "@/src/repositories/interfaces/OrderRepository";
import type { KDSRepository } from "@/src/repositories/interfaces/KDSRepository";
import type { InventoryRepository } from "@/src/repositories/interfaces/InventoryRepository";
import type { EmployeeRepository } from "@/src/repositories/interfaces/EmployeeRepository";
import type { ReportRepository } from "@/src/repositories/interfaces/ReportRepository";
import type { DashboardRepository } from "@/src/repositories/interfaces/DashboardRepository";

import { MockAuthRepository } from "@/src/repositories/mock/MockAuthRepository";
import { MockMenuRepository } from "@/src/repositories/mock/MockMenuRepository";
import { MockCustomerOrderRepository } from "@/src/repositories/mock/MockCustomerOrderRepository";
import { MockOrderRepository } from "@/src/repositories/mock/MockOrderRepository";
import { MockKDSRepository } from "@/src/repositories/mock/MockKDSRepository";
import { MockInventoryRepository } from "@/src/repositories/mock/MockInventoryRepository";
import { MockEmployeeRepository } from "@/src/repositories/mock/MockEmployeeRepository";
import { MockReportRepository } from "@/src/repositories/mock/MockReportRepository";
import { MockDashboardRepository } from "@/src/repositories/mock/MockDashboardRepository";

import { ApiAuthRepository } from "@/src/repositories/api/ApiAuthRepository";
import { ApiMenuRepository } from "@/src/repositories/api/ApiMenuRepository";
import { ApiCustomerOrderRepository } from "@/src/repositories/api/ApiCustomerOrderRepository";
import { ApiOrderRepository } from "@/src/repositories/api/ApiOrderRepository";
import { ApiKDSRepository } from "@/src/repositories/api/ApiKDSRepository";
import { ApiInventoryRepository } from "@/src/repositories/api/ApiInventoryRepository";
import { ApiEmployeeRepository } from "@/src/repositories/api/ApiEmployeeRepository";
import { ApiReportRepository } from "@/src/repositories/api/ApiReportRepository";
import { ApiDashboardRepository } from "@/src/repositories/api/ApiDashboardRepository";

const useMockData = APP_CONFIG.USE_MOCK_DATA;
const useMockCustomerOrder = APP_CONFIG.USE_MOCK_CUSTOMER_ORDER;
const useMockAuth = APP_CONFIG.USE_MOCK_AUTH;
// Mock data is never used in production builds, even if an env flag is accidentally enabled.
const useMockMenu = __DEV__ && APP_CONFIG.USE_MOCK_MENU;

export const repositories: {
  auth: AuthRepository;
  menu: MenuRepository;
  customerOrder: CustomerOrderRepository;
  order: OrderRepository;
  kds: KDSRepository;
  inventory: InventoryRepository;
  employee: EmployeeRepository;
  report: ReportRepository;
  dashboard: DashboardRepository;
} = {
  auth: useMockAuth ? new MockAuthRepository() : new ApiAuthRepository(),

  menu: useMockMenu ? new MockMenuRepository() : new ApiMenuRepository(),

  customerOrder: useMockCustomerOrder
    ? new MockCustomerOrderRepository()
    : new ApiCustomerOrderRepository(),

  order: useMockData ? new MockOrderRepository() : new ApiOrderRepository(),

  kds: useMockData ? new MockKDSRepository() : new ApiKDSRepository(),

  inventory: useMockData
    ? new MockInventoryRepository()
    : new ApiInventoryRepository(),

  employee: useMockData
    ? new MockEmployeeRepository()
    : new ApiEmployeeRepository(),

  report: useMockData ? new MockReportRepository() : new ApiReportRepository(),

  dashboard: useMockData
    ? new MockDashboardRepository()
    : new ApiDashboardRepository(),
};
