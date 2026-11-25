import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { MenuItemsService } from "./menu-items.service.js";

/**
 * Public read-only menu for customer ordering.
 * Business data and pricing rules are owned by MenuItemsService.
 */
@Controller("menu-items/customer")
export class GuestMenuController {
  constructor(private readonly menuItems: MenuItemsService) {}

  @Get()
  findCustomerMenu(@Query("categoryId") categoryId?: string) {
    return this.menuItems.findCustomerMenu(categoryId);
  }
}
