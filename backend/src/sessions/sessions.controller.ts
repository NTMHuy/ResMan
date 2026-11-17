import { Controller, Get, Param, ParseIntPipe, Post, Body, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { OpenSessionDto } from "./dto/open-session.dto.js";
import { SessionsService } from "./sessions.service.js";

@Controller("sessions")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Post()
  @Permissions("sessions:open")
  open(@Body() dto: OpenSessionDto, @CurrentUser() user: { id: string }) {
    return this.sessions.open(dto.tableId, BigInt(user.id));
  }

  @Get("table/:tableId/active")
  @Permissions("tables:read")
  findActiveByTable(@Param("tableId", ParseIntPipe) tableId: number) {
    return this.sessions.findActiveByTable(BigInt(tableId));
  }

  @Get(":id")
  @Permissions("orders:read")
  findById(@Param("id", ParseIntPipe) id: number) {
    return this.sessions.findById(BigInt(id));
  }
}
