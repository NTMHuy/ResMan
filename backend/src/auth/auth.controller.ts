import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { CurrentUser } from "./decorators/current-user.decorator.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  profile(@CurrentUser() user: { id: string }) { return this.auth.getProfile(user.id); }
}
