import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, UnauthorizedException } from "@nestjs/common";
import { CreateGuestOrderItemsDto } from "./dto/create-guest-order-items.dto.js";
import { OrdersService } from "./orders.service.js";

@Controller("guest/session")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  private requireSessionCode(sessionCode?: string): string {
    if (!sessionCode || !/^[a-f0-9]{64}$/.test(sessionCode)) {
      throw new UnauthorizedException("Thiếu hoặc sai mã truy cập phiên bàn");
    }
    return sessionCode;
  }

  @Get("tables")
  getGuestTables() {
    return this.orders.findGuestTables();
  }

  @Get()
  getGuestSession(@Headers("x-session-code") sessionCode?: string) {
    return this.orders.getGuestSession(this.requireSessionCode(sessionCode));
  }

  @Delete("items/:itemId")
  cancelItem(
    @Headers("x-session-code") sessionCode: string | undefined,
    @Param("itemId", ParseIntPipe) itemId: number,
  ) {
    return this.orders.cancelGuestItem(this.requireSessionCode(sessionCode), BigInt(itemId));
  }

  @Post("items")
  addItems(
    @Headers("x-session-code") sessionCode: string | undefined,
    @Body() dto: CreateGuestOrderItemsDto,
  ) {
    return this.orders.addGuestItems(this.requireSessionCode(sessionCode), dto.items);
  }
}
