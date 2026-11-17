import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CreateGuestOrderItemsDto } from "./dto/create-guest-order-items.dto.js";
import { OrdersService } from "./orders.service.js";

@Controller("guest/sessions/:sessionCode")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  getGuestSession(@Param("sessionCode") sessionCode: string) {
    return this.orders.getGuestSession(sessionCode);
  }

  @Delete("items/:itemId")
  cancelItem(
    @Param("sessionCode") sessionCode: string,
    @Param("itemId", ParseIntPipe) itemId: number,
  ) {
    return this.orders.cancelGuestItem(sessionCode, BigInt(itemId));
  }

  @Post("items")
  addItems(
    @Param("sessionCode") sessionCode: string,
    @Body() dto: CreateGuestOrderItemsDto,
  ) {
    return this.orders.addGuestItems(sessionCode, dto.items);
  }
}
