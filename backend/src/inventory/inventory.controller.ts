import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { CreateIngredientDto } from "./dto/create-ingredient.dto.js";
import { InventoryCountDto } from "./dto/inventory-count.dto.js";
import { StockInDto } from "./dto/stock-in.dto.js";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto.js";
import { InventoryService } from "./inventory.service.js";

@Controller("inventory")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get("ingredients")
  @Permissions("inventory:read")
  listIngredients(@Query("search") search?: string, @Query("includeInactive") includeInactive?: string) {
    return this.inventory.listIngredients(search, includeInactive === "true");
  }

  @Post("ingredients")
  @Permissions("inventory:manage")
  createIngredient(@Body() dto: CreateIngredientDto, @CurrentUser() user: { id: string }) {
    return this.inventory.createIngredient(dto, BigInt(user.id));
  }

  @Patch("ingredients/:ingredientId")
  @Permissions("inventory:manage")
  updateIngredient(
    @Param("ingredientId", ParseIntPipe) ingredientId: number,
    @Body() dto: UpdateIngredientDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.inventory.updateIngredient(BigInt(ingredientId), dto, BigInt(user.id));
  }

  @Post("ingredients/:ingredientId/stock-in")
  @Permissions("inventory:manage")
  stockIn(
    @Param("ingredientId", ParseIntPipe) ingredientId: number,
    @Body() dto: StockInDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.inventory.stockIn(BigInt(ingredientId), dto, BigInt(user.id));
  }

  @Post("ingredients/:ingredientId/count")
  @Permissions("inventory:count")
  count(
    @Param("ingredientId", ParseIntPipe) ingredientId: number,
    @Body() dto: InventoryCountDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.inventory.recordCount(BigInt(ingredientId), dto, BigInt(user.id));
  }

  @Get("movements")
  @Permissions("inventory:read")
  movements(@Query("ingredientId") ingredientId?: string, @Query("limit") limit?: string) {
    return this.inventory.listMovements(ingredientId, limit);
  }

  @Get("counts")
  @Permissions("inventory:read")
  counts(@Query("ingredientId") ingredientId?: string, @Query("limit") limit?: string) {
    return this.inventory.listCounts(ingredientId, limit);
  }
}
