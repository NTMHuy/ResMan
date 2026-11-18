import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { CreateMenuCategoryDto } from "./dto/create-menu-category.dto.js";
import { UpdateMenuCategoryDto } from "./dto/update-menu-category.dto.js";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto.js";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto.js";
import { MenuService } from "./menu.service.js";

interface AuthenticatedRequest { user: { id: string } }

@Controller("menu")
export class MenuController {
  constructor(private readonly menu: MenuService) {}

  @Get()
  findGuestMenu(@Query("categoryId") categoryId?: string) {
    return this.menu.findGuestMenu(categoryId);
  }

  @Get("management")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("menu:manage")
  listManagement() { return this.menu.listManagement(); }

  @Post("categories")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("menu:manage")
  createCategory(@Body() dto: CreateMenuCategoryDto, @Req() req: AuthenticatedRequest) {
    return this.menu.createCategory(dto, BigInt(req.user.id));
  }

  @Patch("categories/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("menu:manage")
  updateCategory(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateMenuCategoryDto, @Req() req: AuthenticatedRequest) {
    return this.menu.updateCategory(BigInt(id), dto, BigInt(req.user.id));
  }

  @Post("items")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("menu:manage")
  createItem(@Body() dto: CreateMenuItemDto, @Req() req: AuthenticatedRequest) {
    return this.menu.createItem(dto, BigInt(req.user.id));
  }

  @Patch("items/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("menu:manage")
  updateItem(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateMenuItemDto, @Req() req: AuthenticatedRequest) {
    return this.menu.updateItem(BigInt(id), dto, BigInt(req.user.id));
  }

  @Delete("items/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("menu:manage")
  archiveItem(@Param("id", ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.menu.archiveItem(BigInt(id), BigInt(req.user.id));
  }
}
