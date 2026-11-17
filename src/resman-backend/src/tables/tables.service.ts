import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  private createCode(prefix: string): string {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  }

  private serializeTable<T extends {
    id: bigint;
    sessions?: Array<{
      id: bigint;
      order?: { id: bigint; orderCode: string } | null;
    }>;
  }>(table: T) {
    return {
      ...table,
      id: table.id.toString(),
      sessions: table.sessions?.map((session) => ({
        ...session,
        id: session.id.toString(),
        order: session.order
          ? { ...session.order, id: session.order.id.toString() }
          : null,
      })),
    };
  }

  async findAll() {
    const tables = await this.prisma.diningTable.findMany({
      orderBy: { code: 'asc' },
      include: {
        sessions: {
          where: { status: 'OPEN' },
          select: {
            id: true,
            sessionCode: true,
            status: true,
            openedAt: true,
            order: {
              select: { id: true, orderCode: true },
            },
          },
        },
      },
    });

    return tables.map((table) => this.serializeTable(table));
  }

  async findById(id: bigint) {
    const table = await this.prisma.diningTable.findUnique({
      where: { id },
      include: {
        sessions: {
          where: { status: 'OPEN' },
          select: {
            id: true,
            sessionCode: true,
            status: true,
            openedAt: true,
            order: {
              select: { id: true, orderCode: true },
            },
          },
        },
      },
    });

    if (!table) {
      throw new NotFoundException('Không tìm thấy bàn');
    }

    return this.serializeTable(table);
  }

  async create(dto: CreateTableDto) {
    const code = dto.code.trim().toUpperCase();
    const existing = await this.prisma.diningTable.findUnique({
      where: { code },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('Mã bàn đã tồn tại');
    }

    const table = await this.prisma.diningTable.create({
      data: {
        code,
        name: dto.name.trim(),
        capacity: dto.capacity,
      },
    });

    return { ...table, id: table.id.toString() };
  }

  async update(id: bigint, dto: UpdateTableDto) {
    const existing = await this.prisma.diningTable.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy bàn');
    }

    const data = {
      ...(dto.code !== undefined
        ? { code: dto.code.trim().toUpperCase() }
        : {}),
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
    };

    try {
      const table = await this.prisma.diningTable.update({
        where: { id },
        data,
      });
      return { ...table, id: table.id.toString() };
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Mã bàn đã tồn tại');
      }
      throw error;
    }
  }

  async remove(id: bigint) {
    const table = await this.prisma.diningTable.findUnique({
      where: { id },
      include: {
        _count: {
          select: { sessions: true, devices: true },
        },
      },
    });

    if (!table) {
      throw new NotFoundException('Không tìm thấy bàn');
    }

    if (table._count.sessions > 0 || table._count.devices > 0) {
      throw new ConflictException(
        'Không thể xóa bàn đã có lịch sử phiên hoặc thiết bị được gán',
      );
    }

    await this.prisma.diningTable.delete({ where: { id } });
    return { message: 'Đã xóa bàn' };
  }

  async openSession(tableId: bigint, openedBy: string, note?: string) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const table = await tx.diningTable.findUnique({
          where: { id: tableId },
          select: { id: true, code: true, name: true, status: true },
        });

        if (!table) {
          throw new NotFoundException('Không tìm thấy bàn');
        }

        const updated = await tx.diningTable.updateMany({
          where: { id: tableId, status: 'AVAILABLE' },
          data: { status: 'OCCUPIED' },
        });

        if (updated.count !== 1) {
          throw new ConflictException('Bàn hiện không ở trạng thái trống');
        }

        const session = await tx.diningSession.create({
          data: {
            tableId,
            sessionCode: this.createCode('SES'),
            status: 'OPEN',
            openedBy: BigInt(openedBy),
            order: {
              create: {
                orderCode: this.createCode('ORD'),
                note: note?.trim() || null,
              },
            },
          },
          include: {
            table: {
              select: { id: true, code: true, name: true, status: true },
            },
            order: {
              select: { id: true, orderCode: true, note: true },
            },
          },
        });

        return session;
      });

      return {
        ...result,
        id: result.id.toString(),
        table: { ...result.table, id: result.table.id.toString() },
        order: { ...result.order, id: result.order.id.toString() },
        openedBy: result.openedBy?.toString() ?? null,
      };
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Bàn đã có phiên đang hoạt động');
      }
      throw error;
    }
  }

  async getCurrentSession(tableId: bigint) {
    const session = await this.prisma.diningSession.findFirst({
      where: { tableId, status: 'OPEN' },
      include: {
        table: {
          select: { id: true, code: true, name: true, status: true },
        },
        order: {
          select: { id: true, orderCode: true, note: true },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Bàn hiện không có phiên đang hoạt động');
    }

    return {
      ...session,
      id: session.id.toString(),
      table: { ...session.table, id: session.table.id.toString() },
      order: session.order
        ? { ...session.order, id: session.order.id.toString() }
        : null,
      openedBy: session.openedBy?.toString() ?? null,
      closedBy: session.closedBy?.toString() ?? null,
    };
  }
}
