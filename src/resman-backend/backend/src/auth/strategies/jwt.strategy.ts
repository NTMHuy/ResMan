import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../database/prisma.service.js";

interface JwtPayload { sub: string; username: string }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    let id: bigint;
    try { id = BigInt(payload.sub); } catch { throw new UnauthorizedException("Token không hợp lệ"); }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, username: true, isActive: true,
        role: { select: { id: true, code: true, name: true, permissions: { select: { permission: { select: { code: true } } } } } },
      },
    });
    if (!user || !user.isActive) throw new UnauthorizedException("Tài khoản không tồn tại hoặc đã bị khóa");

    return {
      id: user.id.toString(),
      username: user.username,
      role: { id: user.role.id.toString(), code: user.role.code, name: user.role.name },
      permissions: user.role.permissions.map((item) => item.permission.code),
    };
  }
}
