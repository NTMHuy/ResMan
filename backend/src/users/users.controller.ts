import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto.js";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto.js";
import { UsersService } from "./users.service.js";

@Controller("users")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Permissions("users:read")
  findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.users.findAll(Number(page) || 1, Number(limit) || 20);
  }

  @Post()
  @Permissions("users:create")
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(":id")
  @Permissions("users:update")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.users.update(BigInt(id), dto);
  }

  @Patch(":id/role")
  @Permissions("users:update")
  assignRole(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserRoleDto) {
    return this.users.assignRole(BigInt(id), dto.roleCode);
  }

  @Patch(":id/status")
  @Permissions("users:update")
  updateStatus(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserStatusDto) {
    return this.users.updateStatus(BigInt(id), dto.isActive);
  }
}
