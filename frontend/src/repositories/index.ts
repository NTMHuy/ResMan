import type { AuthRepository } from "@/src/repositories/interfaces/AuthRepository";
import type { MenuRepository } from "@/src/repositories/interfaces/MenuRepository";
import type { CustomerOrderRepository } from "@/src/repositories/interfaces/CustomerOrderRepository";
import type { OrderRepository } from "@/src/repositories/interfaces/OrderRepository";
import type { KDSRepository } from "@/src/repositories/interfaces/KDSRepository";
import type { InventoryRepository } from "@/src/repositories/interfaces/InventoryRepository";
import type { EmployeeRepository } from "@/src/repositories/interfaces/EmployeeRepository";
import type { ReportRepository } from "@/src/repositories/interfaces/ReportRepository";
import type { DashboardRepository } from "@/src/repositories/interfaces/DashboardRepository";

import { ApiAuthRepository } from "@/src/repositories/api/ApiAuthRepository";
import { ApiMenuRepository } from "@/src/repositories/api/ApiMenuRepository";
import { ApiCustomerOrderRepository } from "@/src/repositories/api/ApiCustomerOrderRepository";
import { ApiOrderRepository } from "@/src/repositories/api/ApiOrderRepository";
import { ApiKDSRepository } from "@/src/repositories/api/ApiKDSRepository";
import { ApiInventoryRepository } from "@/src/repositories/api/ApiInventoryRepository";
import { ApiEmployeeRepository } from "@/src/repositories/api/ApiEmployeeRepository";
import { ApiReportRepository } from "@/src/repositories/api/ApiReportRepository";
import { ApiDashboardRepository } from "@/src/repositories/api/ApiDashboardRepository";

/** Runtime registry: all application features use the real backend API. */
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
  auth: new ApiAuthRepository(),
  menu: new ApiMenuRepository(),
  customerOrder: new ApiCustomerOrderRepository(),
  order: new ApiOrderRepository(),
  kds: new ApiKDSRepository(),
  inventory: new ApiInventoryRepository(),
  employee: new ApiEmployeeRepository(),
  report: new ApiReportRepository(),
  dashboard: new ApiDashboardRepository(),
};
