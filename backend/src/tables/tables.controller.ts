import { Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, Body, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { CreateTableDto } from "./dto/create-table.dto.js";
import { UpdateTableDto } from "./dto/update-table.dto.js";
import { TablesService } from "./tables.service.js";

@Controller("tables")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TablesController {
  constructor(private readonly tables: TablesService) {}

  @Get() @Permissions("tables:read")
  findAll() { return this.tables.findAll(); }

  @Get(":id") @Permissions("tables:read")
  findById(@Param("id", ParseIntPipe) id: number) { return this.tables.findById(BigInt(id)); }

  @Post() @Permissions("tables:manage")
  create(@Body() dto: CreateTableDto) { return this.tables.create(dto); }

  @Patch(":id") @Permissions("tables:manage")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTableDto) {
    return this.tables.update(BigInt(id), dto);
  }

  @Delete(":id") @Permissions("tables:manage")
  remove(@Param("id", ParseIntPipe) id: number) { return this.tables.remove(BigInt(id)); }
}
