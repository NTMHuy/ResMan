import { Controller, Get, Query } from "@nestjs/common";
import { MenuService } from "./menu.service.js";

@Controller("menu")
export class MenuController {
  constructor(private readonly menu: MenuService) {}

  @Get()
  findGuestMenu(@Query("categoryId") categoryId?: string) {
    return this.menu.findGuestMenu(categoryId);
  }
}
