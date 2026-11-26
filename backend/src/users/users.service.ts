import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../database/prisma.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

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
          tableDevice: { select: { id: true, diningTableId: true, deviceCode: true, deviceName: true, isActive: true, table: { select: { code: true, name: true } } } },
        },
      }),
      this.prisma.user.count(),
    ]);
    return {
      data: users.map((user) => ({
        ...user,
        id: user.id.toString(),
        role: { ...user.role, id: user.role.id.toString() },
        tableDevice: user.tableDevice
          ? {
              ...user.tableDevice,
              id: user.tableDevice.id.toString(),
              diningTableId: user.tableDevice.diningTableId.toString(),
            }
          : null,
      })),
      pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
  }

  async create(dto: CreateUserDto) {
    const role = await this.prisma.role.findUnique({ where: { code: dto.roleCode } });
    if (!role) throw new NotFoundException("Vai trò không tồn tại");

    if (dto.roleCode === "CUSTOMER") {
      if (!dto.tableId || !dto.deviceCode?.trim() || !dto.deviceName?.trim()) {
        throw new BadRequestException(
          "Tài khoản CUSTOMER cần tableId, deviceCode và deviceName để gán tablet với bàn",
        );
      }

      try {
        const created = await this.prisma.$transaction(async (tx) => {
          const table = await tx.diningTable.findUnique({
            where: { id: BigInt(dto.tableId!) },
            select: { id: true, code: true, name: true, status: true },
          });
          if (!table) throw new NotFoundException("Bàn được chọn không tồn tại");
          if (table.status !== "AVAILABLE") {
            throw new ConflictException("Chỉ có thể gán tablet cho bàn đang trống");
          }

          const user = await tx.user.create({
            data: {
              username: dto.username.trim(),
              email: dto.email?.trim().toLowerCase() || null,
              passwordHash: await bcrypt.hash(dto.password, 12),
              roleId: role.id,
            },
            select: {
              id: true,
              username: true,
              email: true,
              isActive: true,
              createdAt: true,
              role: { select: { id: true, code: true, name: true } },
            },
          });

          const device = await tx.tableDevice.create({
            data: {
              userId: user.id,
              diningTableId: table.id,
              deviceCode: dto.deviceCode!.trim(),
              deviceName: dto.deviceName!.trim(),
            },
          });

          return { user, device, table };
        });

        return {
          ...created.user,
          id: created.user.id.toString(),
          role: { ...created.user.role, id: created.user.role.id.toString() },
          tableDevice: {
            id: created.device.id.toString(),
            deviceCode: created.device.deviceCode,
            deviceName: created.device.deviceName,
            isActive: created.device.isActive,
            table: {
              id: created.table.id.toString(),
              code: created.table.code,
              name: created.table.name,
            },
          },
          employee: null,
        };
      } catch (error) {
        if (this.isUniqueViolation(error)) {
          throw new ConflictException(
            "Username, email, deviceCode hoặc bàn đã được gán cho tài khoản khác",
          );
        }
        throw error;
      }
    }

    if (!dto.employeeCode?.trim() || !dto.fullName?.trim()) {
      throw new BadRequestException("Tài khoản nhân viên cần employeeCode và fullName");
    }

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
      if (this.isUniqueViolation(error)) {
        throw new ConflictException("Username, email hoặc mã nhân viên đã tồn tại");
      }
      throw error;
    }
  }

  async update(id: bigint, dto: UpdateUserDto) {
    const current = await this.prisma.user.findUnique({
      where: { id },
      select: { employee: { select: { userId: true } } },
    });
    if (!current) throw new NotFoundException("Tài khoản không tồn tại");

    try {
      await this.prisma.$transaction(async (tx) => {
        if (dto.email !== undefined) {
          await tx.user.update({
            where: { id },
            data: { email: dto.email.trim().toLowerCase() || null },
          });
        }

        const employeeData: { fullName?: string; phone?: string | null } = {};
        if (dto.fullName !== undefined) employeeData.fullName = dto.fullName.trim();
        if (dto.phone !== undefined) employeeData.phone = dto.phone.trim() || null;

        if (current.employee && Object.keys(employeeData).length > 0) {
          await tx.employee.update({ where: { userId: id }, data: employeeData });
        }
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException("Email đã được sử dụng bởi tài khoản khác");
      }
      throw error;
    }

    return this.findById(id);
  }

  async assignRole(id: bigint, roleCode: string) {
    const [user, role] = await Promise.all([
      this.prisma.user.findUnique({ where: { id }, select: { id: true } }),
      this.prisma.role.findUnique({ where: { code: roleCode } }),
    ]);
    if (!user) throw new NotFoundException("Tài khoản không tồn tại");
    if (!role) throw new NotFoundException("Vai trò không tồn tại");
    await this.prisma.user.update({ where: { id }, data: { roleId: role.id } });
    return this.findById(id);
  }

  async updateStatus(id: bigint, isActive: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!user) throw new NotFoundException("Tài khoản không tồn tại");
    await this.prisma.user.update({ where: { id }, data: { isActive } });
    return this.findById(id);
  }

  private async findById(id: bigint) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, username: true, email: true, isActive: true, lastLoginAt: true, createdAt: true,
        role: { select: { id: true, code: true, name: true } },
        employee: { select: { id: true, employeeCode: true, fullName: true, phone: true } },
      },
    });
    if (!user) throw new NotFoundException("Tài khoản không tồn tại");
    return {
      ...user,
      id: user.id.toString(),
      role: { ...user.role, id: user.role.id.toString() },
      employee: user.employee ? { ...user.employee, id: user.employee.id.toString() } : null,
    };
  }

  private isUniqueViolation(error: unknown): boolean {
    return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
  }
}
