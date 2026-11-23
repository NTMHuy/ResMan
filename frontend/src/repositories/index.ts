import { APP_CONFIG } from '@/src/constants/config';
import type { AuthRepository } from '@/src/repositories/interfaces/AuthRepository';
import type { MenuRepository } from '@/src/repositories/interfaces/MenuRepository';
import type { CustomerOrderRepository } from '@/src/repositories/interfaces/CustomerOrderRepository';
import type { OrderRepository } from '@/src/repositories/interfaces/OrderRepository';
import type { KDSRepository } from '@/src/repositories/interfaces/KDSRepository';
import type { InventoryRepository } from '@/src/repositories/interfaces/InventoryRepository';
import type { EmployeeRepository } from '@/src/repositories/interfaces/EmployeeRepository';
import type { ReportRepository } from '@/src/repositories/interfaces/ReportRepository';
import type { DashboardRepository } from '@/src/repositories/interfaces/DashboardRepository';

import { MockAuthRepository } from '@/src/repositories/mock/MockAuthRepository';
import { MockMenuRepository } from '@/src/repositories/mock/MockMenuRepository';
import { MockCustomerOrderRepository } from '@/src/repositories/mock/MockCustomerOrderRepository';
import { MockOrderRepository } from '@/src/repositories/mock/MockOrderRepository';
import { MockKDSRepository } from '@/src/repositories/mock/MockKDSRepository';
import { MockInventoryRepository } from '@/src/repositories/mock/MockInventoryRepository';
import { MockEmployeeRepository } from '@/src/repositories/mock/MockEmployeeRepository';
import { MockReportRepository } from '@/src/repositories/mock/MockReportRepository';
import { MockDashboardRepository } from '@/src/repositories/mock/MockDashboardRepository';

import { ApiAuthRepository } from '@/src/repositories/api/ApiAuthRepository';
import { ApiMenuRepository } from '@/src/repositories/api/ApiMenuRepository';
import { ApiCustomerOrderRepository } from '@/src/repositories/api/ApiCustomerOrderRepository';
import { ApiOrderRepository } from '@/src/repositories/api/ApiOrderRepository';
import { ApiKDSRepository } from '@/src/repositories/api/ApiKDSRepository';
import { ApiInventoryRepository } from '@/src/repositories/api/ApiInventoryRepository';
import { ApiEmployeeRepository } from '@/src/repositories/api/ApiEmployeeRepository';
import { ApiReportRepository } from '@/src/repositories/api/ApiReportRepository';
import { ApiDashboardRepository } from '@/src/repositories/api/ApiDashboardRepository';

const useMock = APP_CONFIG.USE_MOCK_DATA;

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
  auth: useMock ? new MockAuthRepository() : new ApiAuthRepository(),
  menu: useMock ? new MockMenuRepository() : new ApiMenuRepository(),
  customerOrder: useMock ? new MockCustomerOrderRepository() : new ApiCustomerOrderRepository(),
  order: useMock ? new MockOrderRepository() : new ApiOrderRepository(),
  kds: useMock ? new MockKDSRepository() : new ApiKDSRepository(),
  inventory: useMock ? new MockInventoryRepository() : new ApiInventoryRepository(),
  employee: useMock ? new MockEmployeeRepository() : new ApiEmployeeRepository(),
  report: useMock ? new MockReportRepository() : new ApiReportRepository(),
  dashboard: useMock ? new MockDashboardRepository() : new ApiDashboardRepository(),
};
