import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "node:crypto";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async open(tableId: number, actorId: bigint) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const table = await tx.diningTable.findUnique({
          where: { id: BigInt(tableId) },
          select: { id: true, code: true, name: true, status: true },
        });
        if (!table) throw new NotFoundException("Không tìm thấy bàn");

        const activeSession = await tx.diningSession.findFirst({
          where: { tableId: table.id, status: "OPEN" },
          select: { id: true },
        });
        if (activeSession || table.status !== "AVAILABLE") {
          throw new ConflictException("Bàn đang có phiên phục vụ");
        }

        const sessionCode = randomBytes(32).toString("hex");
        const orderCode = `ORD-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`;

        const session = await tx.diningSession.create({
          data: {
            tableId: table.id,
            sessionCode,
            status: "OPEN",
            openedBy: actorId,
          },
        });
        const order = await tx.order.create({
          data: {
            orderCode,
            diningSessionId: session.id,
          },
        });

        await tx.diningTable.update({
          where: { id: table.id },
          data: { status: "OCCUPIED" },
        });
        await tx.auditLog.create({
          data: {
            actorId,
            action: "DINING_SESSION_OPENED",
            entityType: "DINING_SESSION",
            entityId: session.id.toString(),
            metadata: { tableId: table.id.toString(), tableCode: table.code, orderId: order.id.toString() },
          },
        });

        return {
          id: session.id.toString(),
          sessionCode: session.sessionCode,
          status: session.status,
          openedAt: session.openedAt,
          table: { id: table.id.toString(), code: table.code, name: table.name, status: "OCCUPIED" },
          order: { id: order.id.toString(), orderCode: order.orderCode },
        };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError &&
          (error.code === "P2002" || error.code === "P2034")) {
        throw new ConflictException("Bàn vừa được mở phiên bởi một thao tác khác. Hãy tải lại danh sách bàn.");
      }
      throw error;
    }
  }

  async getActiveForCustomer(userId: bigint) {
    const device = await this.prisma.tableDevice.findUnique({
      where: { userId },
      select: { diningTableId: true, isActive: true, table: { select: { code: true } } },
    });
    if (!device || !device.isActive) {
      throw new NotFoundException("Tài khoản khách hàng chưa được gán với tablet và bàn hoạt động");
    }
    const session = await this.prisma.diningSession.findFirst({
      where: { tableId: device.diningTableId, status: "OPEN" },
      select: { id: true, table: { select: { code: true } } },
    });
    return session ? { id: session.id.toString(), tableNumber: session.table.code } : null;
  }

  async openForCustomer(userId: bigint) {
    const device = await this.prisma.tableDevice.findUnique({
      where: { userId },
      select: {
        id: true,
        diningTableId: true,
        isActive: true,
        table: { select: { status: true } },
      },
    });

    if (!device || !device.isActive) {
      throw new NotFoundException("Tài khoản khách hàng chưa được gán với tablet và bàn hoạt động");
    }

    // Mở chức năng gọi món nhiều lần không được tạo phiên hoặc order trùng.
    const session =
      device.table.status === "OCCUPIED"
        ? await this.findActiveByTable(device.diningTableId)
        : await this.open(Number(device.diningTableId), userId);

    // Session codes are internal bearer secrets and are never returned to customer tablets.
    const { sessionCode: _sessionCode, ...customerSession } = session;
    return customerSession;
  }

  async findActiveByTable(tableId: bigint) {
    const session = await this.prisma.diningSession.findFirst({
      where: { tableId, status: "OPEN" },
      include: {
        table: { select: { id: true, code: true, name: true, status: true } },
        order: { select: { id: true, orderCode: true, createdAt: true } },
      },
    });
    if (!session) throw new NotFoundException("Bàn hiện không có phiên phục vụ");
    return {
      ...session,
      id: session.id.toString(),
      tableId: session.tableId.toString(),
      openedBy: session.openedBy?.toString() ?? null,
      closedBy: session.closedBy?.toString() ?? null,
      table: { ...session.table, id: session.table.id.toString() },
      order: session.order ? { ...session.order, id: session.order.id.toString() } : null,
    };
  }

  async close(sessionId: bigint, actorId: bigint) {
    return this.prisma.$transaction(async (tx) => {
      const session = await tx.diningSession.findUnique({
        where: { id: sessionId },
        include: {
          table: { select: { id: true, code: true, name: true } },
          order: { select: { payment: true } },
        },
      });
      if (!session) throw new NotFoundException("Không tìm thấy phiên phục vụ");
      if (session.status !== "OPEN") {
        throw new ConflictException("Phiên phục vụ đã được đóng trước đó");
      }
      if (session.order?.payment?.status !== "PAID") {
        throw new ConflictException(
          "Không thể đóng bàn khi chưa thanh toán thành công. Hãy thực hiện thanh toán để hệ thống tự giải phóng bàn.",
        );
      }

      const closed = await tx.diningSession.updateMany({
        where: { id: sessionId, status: "OPEN" },
        data: { status: "CLOSED", closedAt: new Date(), closedBy: actorId },
      });
      if (closed.count !== 1) {
        throw new ConflictException("Phiên vừa được đóng bởi thao tác khác. Hãy tải lại danh sách bàn.");
      }

      await tx.diningTable.update({
        where: { id: session.tableId },
        data: { status: "AVAILABLE" },
      });
      await tx.auditLog.create({
        data: {
          actorId,
          action: "DINING_SESSION_CLOSED",
          entityType: "DINING_SESSION",
          entityId: session.id.toString(),
          metadata: { tableId: session.tableId.toString(), tableCode: session.table.code },
        },
      });

      return {
        id: session.id.toString(),
        status: "CLOSED",
        closedAt: new Date(),
        table: { id: session.table.id.toString(), code: session.table.code, name: session.table.name, status: "AVAILABLE" },
      };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async findById(id: bigint) {
    const session = await this.prisma.diningSession.findUnique({
      where: { id },
      include: {
        table: { select: { id: true, code: true, name: true, status: true } },
        order: {
          include: {
            items: {
              orderBy: { createdAt: "asc" },
              select: {
                id: true, menuItemId: true, itemNameSnapshot: true, quantity: true,
                unitPrice: true, lineTotal: true, note: true, status: true, createdAt: true,
              },
            },
            payment: true,
          },
        },
      },
    });
    if (!session) throw new NotFoundException("Không tìm thấy phiên phục vụ");
    return {
      ...session,
      id: session.id.toString(),
      tableId: session.tableId.toString(),
      openedBy: session.openedBy?.toString() ?? null,
      closedBy: session.closedBy?.toString() ?? null,
      table: { ...session.table, id: session.table.id.toString() },
      order: session.order ? {
        ...session.order,
        id: session.order.id.toString(),
        diningSessionId: session.order.diningSessionId.toString(),
        items: session.order.items.map((item) => ({
          ...item,
          id: item.id.toString(),
          menuItemId: item.menuItemId.toString(),
          unitPrice: item.unitPrice.toString(),
          lineTotal: item.lineTotal.toString(),
        })),
        payment: session.order.payment ? {
          ...session.order.payment,
          id: session.order.payment.id.toString(),
          orderId: session.order.payment.orderId.toString(),
          recordedBy: session.order.payment.recordedBy.toString(),
          amount: session.order.payment.amount.toString(),
        } : null,
      } : null,
    };
  }
}
