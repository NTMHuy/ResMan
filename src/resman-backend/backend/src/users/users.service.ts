import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../database/prisma.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, username: true, email: true, isActive: true, lastLoginAt: true, createdAt: true,
          role: { select: { id: true, code: true, name: true } },
          employee: { select: { employeeCode: true, fullName: true, phone: true } },
        },
      }),
      this.prisma.user.count(),
    ]);
    return {
      data: users.map((user) => ({
        ...user,
        id: user.id.toString(),
        role: { ...user.role, id: user.role.id.toString() },
      })),
      pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
  }

  async create(dto: CreateUserDto) {
    const role = await this.prisma.role.findUnique({ where: { code: dto.roleCode } });
    if (!role) throw new NotFoundException("Vai trò không tồn tại");
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username.trim(),
          email: dto.email?.trim().toLowerCase() || null,
          passwordHash: await bcrypt.hash(dto.password, 12),
          roleId: role.id,
          employee: {
            create: {
              employeeCode: dto.employeeCode.trim().toUpperCase(),
              fullName: dto.fullName.trim(),
              phone: dto.phone?.trim() || null,
            },
          },
        },
        select: {
          id: true, username: true, email: true, isActive: true, createdAt: true,
          role: { select: { id: true, code: true, name: true } },
          employee: { select: { id: true, employeeCode: true, fullName: true, phone: true } },
        },
      });
      return {
        ...user,
        id: user.id.toString(),
        role: { ...user.role, id: user.role.id.toString() },
        employee: user.employee ? { ...user.employee, id: user.employee.id.toString() } : null,
      };
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        throw new ConflictException("Username, email hoặc mã nhân viên đã tồn tại");
      }
      throw error;
    }
  }
}
