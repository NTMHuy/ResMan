import { Controller, Get, Post, Query, Body, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UsersService } from "./users.service.js";

@Controller("users")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get() @Permissions("users:read")
  findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.users.findAll(Number(page) || 1, Number(limit) || 20);
  }

  @Post() @Permissions("users:create")
  create(@Body() dto: CreateUserDto) { return this.users.create(dto); }
}
