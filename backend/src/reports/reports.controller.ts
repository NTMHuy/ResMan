import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { ReportsService } from "./reports.service.js";

@Controller("reports")
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions("reports:read")
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get("overview")
  overview(@Query("from") from?: string, @Query("to") to?: string) {
    return this.reports.overview(from, to);
  }

  @Get("revenue")
  revenue(
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("period") period?: string,
  ) {
    return this.reports.revenue(from, to, period);
  }

  @Get("best-sellers")
  bestSellers(
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("limit") limit?: string,
  ) {
    return this.reports.bestSellers(from, to, limit);
  }

  @Get("orders")
  orders(
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.reports.orders(from, to, page, limit);
  }

  @Get("inventory")
  inventory() {
    return this.reports.inventory();
  }
}
