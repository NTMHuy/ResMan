import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../database/prisma.service.js";
import { LoginDto } from "./dto/login.dto.js";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username.trim() },
      include: { role: { include: { permissions: { include: { permission: true } } } }, employee: true },
    });
    if (!user || !user.isActive || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Username hoặc password không chính xác");
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const accessToken = await this.jwt.signAsync({ sub: user.id.toString(), username: user.username });

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: 86400,
      user: {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        role: { id: user.role.id.toString(), code: user.role.code, name: user.role.name },
        employee: user.employee ? {
          id: user.employee.id.toString(),
          employeeCode: user.employee.employeeCode,
          fullName: user.employee.fullName,
          phone: user.employee.phone,
        } : null,
        permissions: user.role.permissions.map(({ permission }) => permission.code),
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
      include: { role: { include: { permissions: { include: { permission: true } } } }, employee: true },
    });
    if (!user || !user.isActive) throw new UnauthorizedException("Tài khoản không tồn tại hoặc đã bị khóa");
    return {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      role: { id: user.role.id.toString(), code: user.role.code, name: user.role.name },
      employee: user.employee ? {
        id: user.employee.id.toString(),
        employeeCode: user.employee.employeeCode,
        fullName: user.employee.fullName,
        phone: user.employee.phone,
      } : null,
      permissions: user.role.permissions.map(({ permission }) => permission.code),
    };
  }
}
