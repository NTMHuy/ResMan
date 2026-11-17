import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";
import { GuestOrderItemDto } from "./dto/create-guest-order-items.dto.js";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getGuestSession(sessionCode: string) {
    const session = await this.prisma.diningSession.findUnique({
      where: { sessionCode },
      include: {
        table: { select: { code: true, name: true } },
        order: {
          include: {
            items: {
              orderBy: { createdAt: "asc" },
              select: {
                id: true, itemNameSnapshot: true, quantity: true, unitPrice: true,
                lineTotal: true, note: true, status: true, createdAt: true,
              },
            },
          },
        },
      },
    });
    if (!session || session.status !== "OPEN" || !session.order) {
      throw new NotFoundException("Phiên phục vụ không tồn tại hoặc đã đóng");
    }
    return {
      session: { code: session.sessionCode, status: session.status, openedAt: session.openedAt },
      table: session.table,
      items: session.order.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        unitPrice: item.unitPrice.toString(),
        lineTotal: item.lineTotal.toString(),
      })),
    };
  }

  async addGuestItems(sessionCode: string, requestedItems: GuestOrderItemDto[]) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const session = await tx.diningSession.findUnique({
          where: { sessionCode },
          include: { order: { select: { id: true, orderCode: true } } },
        });
        if (!session || session.status !== "OPEN" || !session.order) {
          throw new NotFoundException("Phiên phục vụ không tồn tại hoặc đã đóng");
        }

        const menuIds = [...new Set(requestedItems.map((item) => BigInt(item.menuItemId)))];
        const menuItems = await tx.menuItem.findMany({
          where: {
            id: { in: menuIds },
            isActive: true,
            availabilityStatus: "AVAILABLE",
            category: { isActive: true },
          },
          select: { id: true, name: true, price: true },
        });
        const byId = new Map(menuItems.map((item) => [item.id.toString(), item]));
        if (byId.size !== menuIds.length) {
          throw new ConflictException("Một hoặc nhiều món không còn khả dụng. Vui lòng tải lại thực đơn.");
        }

        const created = [];
        for (const requested of requestedItems) {
          const menuItem = byId.get(String(requested.menuItemId));
          if (!menuItem) throw new ConflictException("Món ăn không còn khả dụng");
          const lineTotal = new Prisma.Decimal(menuItem.price).mul(requested.quantity);
          const item = await tx.orderItem.create({
            data: {
              orderId: session.order.id,
              menuItemId: menuItem.id,
              itemNameSnapshot: menuItem.name,
              quantity: requested.quantity,
              unitPrice: menuItem.price,
              lineTotal,
              note: requested.note?.trim() || null,
              status: "AWAITING_ACCEPTANCE",
            },
          });
          await tx.orderItemStatusHistory.create({
            data: {
              orderItemId: item.id,
              fromStatus: null,
              toStatus: "AWAITING_ACCEPTANCE",
              reason: "Khách gửi yêu cầu gọi món",
            },
          });
          created.push({
            id: item.id.toString(),
            itemName: item.itemNameSnapshot,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            lineTotal: item.lineTotal.toString(),
            note: item.note,
            status: item.status,
            createdAt: item.createdAt,
          });
        }

        await tx.auditLog.create({
          data: {
            action: "GUEST_ORDER_ITEMS_CREATED",
            entityType: "ORDER",
            entityId: session.order.id.toString(),
            metadata: { sessionId: session.id.toString(), itemIds: created.map((item) => item.id) },
          },
        });

        return { orderCode: session.order.orderCode, items: created };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        throw new ConflictException("Phiên vừa thay đổi. Vui lòng tải lại và thử lại.");
      }
      throw error;
    }
  }

  async cancelGuestItem(sessionCode: string, itemId: bigint) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const session = await tx.diningSession.findUnique({
          where: { sessionCode },
          include: { order: { select: { id: true } } },
        });
        if (!session || session.status !== "OPEN" || !session.order) {
          throw new NotFoundException("Phiên phục vụ không tồn tại hoặc đã đóng");
        }

        const item = await tx.orderItem.findFirst({
          where: { id: itemId, orderId: session.order.id },
        });
        if (!item) throw new NotFoundException("Không tìm thấy món trong phiên này");
        if (item.status !== "AWAITING_ACCEPTANCE") {
          throw new ConflictException("Chỉ có thể hủy món trước khi bếp tiếp nhận");
        }

        const updated = await tx.orderItem.update({
          where: { id: item.id },
          data: { status: "CANCELLED" },
        });
        await tx.orderItemStatusHistory.create({
          data: {
            orderItemId: item.id,
            fromStatus: item.status,
            toStatus: "CANCELLED",
            reason: "Khách hủy món trước khi bếp tiếp nhận",
          },
        });
        await tx.auditLog.create({
          data: {
            action: "GUEST_ORDER_ITEM_CANCELLED",
            entityType: "ORDER_ITEM",
            entityId: item.id.toString(),
            metadata: { sessionId: session.id.toString() },
          },
        });
        return { id: updated.id.toString(), status: updated.status };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        throw new ConflictException("Món vừa được cập nhật. Vui lòng tải lại trạng thái món.");
      }
      throw error;
    }
  }

}
