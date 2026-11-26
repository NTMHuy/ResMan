import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { CreateGuestOrderItemsDto } from "./dto/create-guest-order-items.dto.js";
import { UpdateOrderItemNoteDto } from "./dto/update-order-item-note.dto.js";
import { UpdateOrderItemsStatusDto } from "./dto/update-order-items-status.dto.js";
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

  @Post(":orderId/items")
  @Permissions("orders:create-item")
  addItems(
    @Param("orderId", ParseIntPipe) orderId: number,
    @Body() dto: CreateGuestOrderItemsDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.orders.addStaffItems(BigInt(orderId), dto.items, BigInt(user.id));
  }

  @Patch(":orderId/items/status")
  @Permissions("kitchen:update-item")
  updateOrderItemsStatus(
    @Param("orderId", ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderItemsStatusDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.orders.updateOrderItemsStatus(BigInt(orderId), dto.status, dto.reason, BigInt(user.id));
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
