import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { ConfirmPaymentDto } from "./dto/confirm-payment.dto.js";
import { PaymentsService } from "./payments.service.js";

@Controller("payments")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post("customer/request")
  @Permissions("payments:request")
  requestForCustomer(@CurrentUser() user: { id: string }) {
    return this.payments.requestForCustomer(BigInt(user.id));
  }

  @Get("requests")
  @Permissions("payments:read")
  listPendingRequests() {
    return this.payments.listPendingRequests();
  }

  @Get("sessions/:sessionId/summary")
  @Permissions("payments:read")
  getSummary(@Param("sessionId", ParseIntPipe) sessionId: number) {
    return this.payments.getSessionSummary(BigInt(sessionId));
  }

  @Post("sessions/:sessionId/confirm")
  @Permissions("payments:confirm")
  confirm(
    @Param("sessionId", ParseIntPipe) sessionId: number,
    @Body() dto: ConfirmPaymentDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.payments.confirmForSession(
      BigInt(sessionId),
      BigInt(user.id),
      dto.paymentMethod,
      dto.transactionRef,
    );
  }
}
