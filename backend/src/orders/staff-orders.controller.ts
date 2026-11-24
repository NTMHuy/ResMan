import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { UpdateOrderItemNoteDto } from "./dto/update-order-item-note.dto.js";
import { OrdersService } from "./orders.service.js";

@Controller("orders")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StaffOrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get("active")
  @Permissions("orders:read")
  findActive() {
    return this.orders.findActiveOrders();
  }

  @Patch("items/:itemId/note")
  @Permissions("orders:manage-item")
  updateNote(
    @Param("itemId", ParseIntPipe) itemId: number,
    @Body() dto: UpdateOrderItemNoteDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.orders.updateItemNote(BigInt(itemId), dto.note, BigInt(user.id));
  }

  @Delete("items/:itemId")
  @Permissions("orders:manage-item")
  cancelItem(
    @Param("itemId", ParseIntPipe) itemId: number,
    @CurrentUser() user: { id: string },
  ) {
    return this.orders.cancelByOrderStaff(BigInt(itemId), BigInt(user.id));
  }
}
