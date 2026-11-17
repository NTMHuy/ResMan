import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { UpdateKitchenItemStatusDto } from "./dto/update-kitchen-item-status.dto.js";
import { KitchenService } from "./kitchen.service.js";

@Controller("kitchen")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class KitchenController {
  constructor(private readonly kitchen: KitchenService) {}

  @Get("queue")
  @Permissions("kitchen:read")
  getQueue() {
    return this.kitchen.getQueue();
  }

  @Patch("items/:itemId/status")
  @Permissions("kitchen:update-item")
  updateStatus(
    @Param("itemId", ParseIntPipe) itemId: number,
    @Body() dto: UpdateKitchenItemStatusDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.kitchen.updateStatus(BigInt(itemId), dto.status, dto.reason, BigInt(user.id));
  }
}
