import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";

type KitchenStatus = "ACCEPTED" | "IN_PREPARATION" | "COMPLETED" | "CANCELLED";

@Injectable()
export class KitchenService {
  constructor(private readonly prisma: PrismaService) {}

  async getQueue() {
    const items = await this.prisma.orderItem.findMany({
      where: {
        status: { in: ["AWAITING_ACCEPTANCE", "ACCEPTED", "IN_PREPARATION"] },
        order: { diningSession: { status: "OPEN" } },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      include: {
        order: {
          select: {
            orderCode: true,
            diningSession: {
              select: { table: { select: { id: true, code: true, name: true } } },
            },
          },
        },
      },
    });
    return items.map((item) => ({
      id: item.id.toString(),
      orderCode: item.order.orderCode,
      table: {
        ...item.order.diningSession.table,
        id: item.order.diningSession.table.id.toString(),
      },
      itemName: item.itemNameSnapshot,
      quantity: item.quantity,
      note: item.note,
      status: item.status,
      createdAt: item.createdAt,
    }));
  }

  async updateStatus(itemId: bigint, nextStatus: KitchenStatus, reason: string | undefined, actorId: bigint) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const item = await tx.orderItem.findUnique({
          where: { id: itemId },
          include: { order: { include: { diningSession: true } } },
        });
        if (!item) throw new NotFoundException("Không tìm thấy món");
        if (item.order.diningSession.status !== "OPEN") {
          throw new ConflictException("Phiên phục vụ đã đóng");
        }

        const allowed: Record<string, string[]> = {
          AWAITING_ACCEPTANCE: ["ACCEPTED", "CANCELLED"],
          ACCEPTED: ["IN_PREPARATION", "CANCELLED"],
          IN_PREPARATION: ["COMPLETED", "CANCELLED"],
        };
        if (!allowed[item.status]?.includes(nextStatus)) {
          throw new ConflictException(`Không thể chuyển món từ ${item.status} sang ${nextStatus}`);
        }
        if (nextStatus === "CANCELLED" && !reason?.trim()) {
          throw new ConflictException("Bếp phải nhập lý do khi hủy món");
        }

        const changed = await tx.orderItem.updateMany({
          where: { id: item.id, status: item.status },
          data: { status: nextStatus },
        });
        if (changed.count !== 1) throw new ConflictException("Món vừa được cập nhật bởi thao tác khác");

        await tx.orderItemStatusHistory.create({
          data: {
            orderItemId: item.id,
            fromStatus: item.status,
            toStatus: nextStatus,
            reason: reason?.trim() || null,
            actorId,
          },
        });
        await tx.auditLog.create({
          data: {
            actorId,
            action: nextStatus === "CANCELLED" ? "KITCHEN_ORDER_ITEM_CANCELLED" : "KITCHEN_ORDER_ITEM_STATUS_CHANGED",
            entityType: "ORDER_ITEM",
            entityId: item.id.toString(),
            metadata: { fromStatus: item.status, toStatus: nextStatus, reason: reason?.trim() || null },
          },
        });
        return { id: item.id.toString(), status: nextStatus };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        throw new ConflictException("Món vừa được cập nhật. Vui lòng tải lại hàng đợi bếp.");
      }
      throw error;
    }
  }
}
