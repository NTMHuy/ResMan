import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

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
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          username: true,
          email: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          role: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          employee: {
            select: {
              employeeCode: true,
              fullName: true,
              phone: true,
            },
          },
        },
      }),

      this.prisma.user.count(),
    ]);

    return {
      data: users.map((user) => ({
        ...user,
        id: user.id.toString(),
        role: {
          ...user.role,
          id: user.role.id.toString(),
        },
      })),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: BigInt(id),
      },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        employee: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      id: user.id.toString(),
      role: {
        ...user.role,
        id: user.role.id.toString(),
      },
      employee: user.employee
        ? {
            ...user.employee,
            id: user.employee.id.toString(),
            userId: user.employee.userId.toString(),
          }
        : null,
    };
  }
}
