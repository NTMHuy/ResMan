import { Module } from "@nestjs/common";
import { MenuItemsController } from "./menu-items.controller.js";
import { GuestMenuController } from "./guest-menu.controller.js";
import { MenuItemsService } from "./menu-items.service.js";

@Module({
  controllers: [MenuItemsController, GuestMenuController],
  providers: [MenuItemsService],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}
