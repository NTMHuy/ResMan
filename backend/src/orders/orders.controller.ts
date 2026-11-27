import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { CreateGuestOrderItemsDto } from "./dto/create-guest-order-items.dto.js";
import { OrdersService } from "./orders.service.js";

@Controller("customer/session")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  @Permissions("customer:session:read")
  getCustomerSession(@CurrentUser() user: { id: string }) {
    return this.orders.getCustomerSession(BigInt(user.id));
  }

  @Delete("items/:itemId")
  @Permissions("customer:order:cancel-item")
  cancelItem(
    @CurrentUser() user: { id: string },
    @Param("itemId", ParseIntPipe) itemId: number,
  ) {
    return this.orders.cancelCustomerItem(BigInt(user.id), BigInt(itemId));
  }

  @Post("items")
  @Permissions("customer:order:create-item")
  addItems(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateGuestOrderItemsDto,
  ) {
    return this.orders.addCustomerItems(BigInt(user.id), dto.items);
  }
}
