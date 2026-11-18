import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service.js";
import { CreateTableDto } from "./dto/create-table.dto.js";
import { UpdateTableDto } from "./dto/update-table.dto.js";

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const tables = await this.prisma.diningTable.findMany({
      orderBy: { code: "asc" },
      include: { sessions: { where: { status: "OPEN" }, select: { id: true, status: true, openedAt: true } } },
    });
    return tables.map((table) => ({
      ...table,
      id: table.id.toString(),
      sessions: table.sessions.map((session) => ({ ...session, id: session.id.toString() })),
    }));
  }

  async findById(id: bigint) {
    const table = await this.prisma.diningTable.findUnique({
      where: { id },
      include: { sessions: { where: { status: "OPEN" }, select: { id: true, status: true, openedAt: true } } },
    });
    if (!table) throw new NotFoundException("Không tìm thấy bàn");
    return {
      ...table,
      id: table.id.toString(),
      sessions: table.sessions.map((session) => ({ ...session, id: session.id.toString() })),
    };
  }

  async create(dto: CreateTableDto) {
    const code = dto.code.trim().toUpperCase();
    try {
      const table = await this.prisma.diningTable.create({
        data: { code, name: dto.name.trim(), capacity: dto.capacity },
      });
      return { ...table, id: table.id.toString() };
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        throw new ConflictException("Mã bàn đã tồn tại");
      }
      throw error;
    }
  }

  async update(id: bigint, dto: UpdateTableDto) {
    const exists = await this.prisma.diningTable.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new NotFoundException("Không tìm thấy bàn");
    try {
      const table = await this.prisma.diningTable.update({
        where: { id },
        data: {
          ...(dto.code !== undefined ? { code: dto.code.trim().toUpperCase() } : {}),
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
        },
      });
      return { ...table, id: table.id.toString() };
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        throw new ConflictException("Mã bàn đã tồn tại");
      }
      throw error;
    }
  }

  async remove(id: bigint) {
    const table = await this.prisma.diningTable.findUnique({
      where: { id },
      include: { _count: { select: { sessions: true, devices: true } } },
    });
    if (!table) throw new NotFoundException("Không tìm thấy bàn");
    if (table._count.sessions || table._count.devices) {
      throw new ConflictException("Không thể xóa bàn đã có lịch sử phiên hoặc thiết bị được gán");
    }
    await this.prisma.diningTable.delete({ where: { id } });
    return { message: "Đã xóa bàn" };
  }
}
