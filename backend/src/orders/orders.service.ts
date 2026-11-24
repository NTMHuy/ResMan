import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";
import { GuestOrderItemDto } from "./dto/create-guest-order-items.dto.js";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findGuestTables() {
    const fixedCodes = Array.from({ length: 20 }, (_, index) => `T${String(index + 1).padStart(2, "0")}`);
    const tables = await this.prisma.diningTable.findMany({
      where: { code: { in: fixedCodes } },
      orderBy: [{ code: "asc" }, { id: "asc" }],
      select: {
        id: true,
        code: true,
        name: true,
        status: true,
        sessions: {
          where: { status: "OPEN" },
          take: 1,
          select: { id: true },
        },
      },
    });
    return tables.map((table) => ({
      id: table.id.toString(),
      code: table.code,
      name: table.name,
      status: table.sessions.length > 0 ? "OPEN" : "CLOSED",
    }));
  }

  async connectGuestTable(tableId: number) {
    const session = await this.prisma.diningSession.findFirst({
      where: { tableId: BigInt(tableId), status: "OPEN" },
      include: { table: { select: { id: true, code: true, name: true } } },
    });
    if (!session) {
      throw new NotFoundException("Bàn hiện chưa được nhân viên mở phiên");
    }
    return {
      sessionCode: session.sessionCode,
      table: {
        id: session.table.id.toString(),
        code: session.table.code,
        name: session.table.name,
      },
    };
  }

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
                id: true, menuItemId: true, itemNameSnapshot: true, quantity: true, unitPrice: true,
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
      session: { status: session.status, openedAt: session.openedAt },
      table: session.table,
      order: {
        id: session.order.id.toString(),
        orderCode: session.order.orderCode,
        createdAt: session.order.createdAt,
      },
      items: session.order.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        menuItemId: item.menuItemId.toString(),
        unitPrice: item.unitPrice.toString(),
        lineTotal: item.lineTotal.toString(),
      })),
    };
  }

  async addGuestItems(sessionCode: string, requestedItems: GuestOrderItemDto[]) {
    if (!Array.isArray(requestedItems) || requestedItems.length < 1 || requestedItems.length > 30) {
      throw new ConflictException("Mỗi lần gửi đơn phải có từ 1 đến 30 món");
    }
    if (requestedItems.some((item) =>
      !Number.isSafeInteger(item.menuItemId) || item.menuItemId < 1 ||
      !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 99
    )) {
      throw new ConflictException("Thông tin món ăn hoặc số lượng không hợp lệ");
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const session = await tx.diningSession.findUnique({
          where: { sessionCode },
          include: { order: { select: { id: true, orderCode: true } } },
        });
        if (!session || session.status !== "OPEN" || !session.order) {
          throw new NotFoundException("Phiên phục vụ không tồn tại hoặc đã đóng");
        }
        const order = session.order;

        const menuIds = [...new Set(requestedItems.map((item) => BigInt(item.menuItemId)))];
        const menuItems = await tx.menuItem.findMany({
          where: {
            id: { in: menuIds },
            isActive: true,
            availabilityStatus: "AVAILABLE",
            category: { is: { isActive: true } },
          },
          select: { id: true, name: true, price: true },
        });
        const byId = new Map(menuItems.map((item) => [item.id.toString(), item]));
        if (byId.size !== menuIds.length) {
          throw new ConflictException("Một hoặc nhiều món không còn khả dụng. Vui lòng tải lại thực đơn.");
        }

        const created: Array<{ id: string; itemName: string; quantity: number; unitPrice: string; lineTotal: string; note: string | null; status: string; createdAt: Date }> = [];
        for (const requested of requestedItems) {
          const menuItem = byId.get(String(requested.menuItemId));
          if (!menuItem) throw new ConflictException("Món ăn không còn khả dụng");
          const lineTotal = menuItem.price.mul(requested.quantity);
          const item = await tx.orderItem.create({
            data: {
              orderId: order.id,
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
            entityId: order.id.toString(),
            metadata: { sessionId: session.id.toString(), itemIds: created.map((item) => item.id) },
          },
        });

        return { orderCode: order.orderCode, items: created };
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
        const order = session.order;

        const item = await tx.orderItem.findFirst({
          where: { id: itemId, orderId: order.id },
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


  async findActiveOrders() {
    const orders = await this.prisma.order.findMany({
      where: {
        diningSession: { status: "OPEN" },
        items: { some: {} },
      },
      orderBy: { createdAt: "asc" },
      include: {
        diningSession: {
          select: {
            id: true,
            openedAt: true,
            table: { select: { id: true, code: true, name: true } },
          },
        },
        items: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true, itemNameSnapshot: true, quantity: true, unitPrice: true,
            lineTotal: true, note: true, status: true, createdAt: true,
          },
        },
      },
    });
    return orders.map((order) => ({
      id: order.id.toString(),
      orderCode: order.orderCode,
      createdAt: order.createdAt,
      session: {
        id: order.diningSession.id.toString(),
        openedAt: order.diningSession.openedAt,
        table: {
          ...order.diningSession.table,
          id: order.diningSession.table.id.toString(),
        },
      },
      items: order.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        unitPrice: item.unitPrice.toString(),
        lineTotal: item.lineTotal.toString(),
      })),
    }));
  }

  async updateOrderItemsStatus(
    orderId: bigint,
    nextStatus: "ACCEPTED" | "IN_PREPARATION" | "COMPLETED" | "CANCELLED",
    reason: string | undefined,
    actorId: bigint,
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: {
            diningSession: true,
            items: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
          },
        });
        if (!order) throw new NotFoundException("Không tìm thấy đơn hàng");
        if (order.diningSession.status !== "OPEN") {
          throw new ConflictException("Phiên phục vụ đã đóng");
        }

        const activeItems = order.items.filter((item) => item.status !== "CANCELLED");
        if (activeItems.length === 0) {
          throw new ConflictException("Đơn hàng không còn món cần xử lý");
        }

        // A table order may contain old items already cooking and newly-added
        // items still awaiting acceptance. Advance only eligible items.
        if (nextStatus === "IN_PREPARATION") {
          const waiting = activeItems.filter((item) => item.status === "AWAITING_ACCEPTANCE");
          if (waiting.length > 0) {
            throw new ConflictException(
              `Còn ${waiting.length} món chưa được bếp tiếp nhận: ${waiting.map((item) => item.itemNameSnapshot).join(", ")}. Hãy tiếp nhận các món trước.`,
            );
          }
        }

        if (nextStatus === "COMPLETED") {
          const notStarted = activeItems.filter(
            (item) => item.status === "AWAITING_ACCEPTANCE" || item.status === "ACCEPTED",
          );
          if (notStarted.length > 0) {
            throw new ConflictException(
              `Còn ${notStarted.length} món chưa bắt đầu chế biến. Không thể hoàn tất đơn.`,
            );
          }
        }

        if (nextStatus === "CANCELLED") {
          const alreadyStarted = activeItems.filter(
            (item) => item.status === "IN_PREPARATION" || item.status === "COMPLETED",
          );
          if (alreadyStarted.length > 0) {
            throw new ConflictException(
              "Đơn có món đang chế biến hoặc đã hoàn tất. Không thể từ chối/hủy toàn bộ đơn; hãy xử lý các món chưa bắt đầu riêng.",
            );
          }
          if (!reason?.trim()) {
            throw new ConflictException("Vui lòng nhập lý do từ chối hoặc hủy đơn");
          }
        }

        const eligibleStatuses: Record<typeof nextStatus, string[]> = {
          ACCEPTED: ["AWAITING_ACCEPTANCE"],
          IN_PREPARATION: ["ACCEPTED"],
          COMPLETED: ["IN_PREPARATION"],
          CANCELLED: ["AWAITING_ACCEPTANCE", "ACCEPTED"],
        };
        const itemsToUpdate = activeItems.filter((item) =>
          eligibleStatuses[nextStatus].includes(item.status),
        );

        if (itemsToUpdate.length === 0) {
          const alreadyAtOrBeyond: Record<typeof nextStatus, string[]> = {
            ACCEPTED: ["ACCEPTED", "IN_PREPARATION", "COMPLETED"],
            IN_PREPARATION: ["IN_PREPARATION", "COMPLETED"],
            COMPLETED: ["COMPLETED"],
            CANCELLED: [],
          };
          if (
            nextStatus === "CANCELLED" ||
            activeItems.some((item) => !alreadyAtOrBeyond[nextStatus].includes(item.status))
          ) {
            throw new ConflictException("Không có món nào phù hợp để cập nhật trạng thái");
          }
        }

        for (const item of itemsToUpdate) {
          const changed = await tx.orderItem.updateMany({
            where: { id: item.id, status: item.status },
            data: { status: nextStatus },
          });
          if (changed.count !== 1) {
            throw new ConflictException("Có món vừa được cập nhật bởi thao tác khác. Vui lòng tải lại đơn.");
          }
          await tx.orderItemStatusHistory.create({
            data: {
              orderItemId: item.id,
              fromStatus: item.status,
              toStatus: nextStatus,
              reason: reason?.trim() || null,
              actorId,
            },
          });
        }

        if (itemsToUpdate.length > 0) {
          await tx.auditLog.create({
            data: {
              actorId,
              action: nextStatus === "CANCELLED"
                ? "ORDER_STAFF_ORDER_CANCELLED"
                : "ORDER_STAFF_ORDER_STATUS_CHANGED",
              entityType: "ORDER",
              entityId: order.id.toString(),
              metadata: {
                fromStatuses: [...new Set(itemsToUpdate.map((item) => item.status))],
                toStatus: nextStatus,
                reason: reason?.trim() || null,
                itemIds: itemsToUpdate.map((item) => item.id.toString()),
              },
            },
          });
        }

        return {
          id: order.id.toString(),
          orderCode: order.orderCode,
          status: nextStatus,
          updatedItemCount: itemsToUpdate.length,
          remainingAwaitingAcceptance: activeItems.filter(
            (item) => item.status === "AWAITING_ACCEPTANCE" &&
              !itemsToUpdate.some((updated) => updated.id === item.id),
          ).length,
        };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        throw new ConflictException("Đơn hàng vừa được cập nhật. Vui lòng tải lại dữ liệu.");
      }
      throw error;
    }
  }

  async updateItemNote(itemId: bigint, note: string, actorId: bigint) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.findUnique({
        where: { id: itemId },
        include: { order: { include: { diningSession: true } } },
      });
      if (!item) throw new NotFoundException("Không tìm thấy món");
      if (item.order.diningSession.status !== "OPEN") {
        throw new ConflictException("Phiên phục vụ đã đóng");
      }
      if (item.status === "IN_PREPARATION" || item.status === "COMPLETED" || item.status === "CANCELLED") {
        throw new ConflictException("Không thể sửa ghi chú ở trạng thái hiện tại");
      }

      const updated = await tx.orderItem.update({
        where: { id: item.id },
        data: { note: note.trim() || null },
      });
      await tx.auditLog.create({
        data: {
          actorId,
          action: "ORDER_ITEM_NOTE_UPDATED",
          entityType: "ORDER_ITEM",
          entityId: item.id.toString(),
          metadata: { previousNote: item.note, note: updated.note },
        },
      });
      return { id: updated.id.toString(), note: updated.note };
    });
  }

  async cancelByOrderStaff(itemId: bigint, actorId: bigint) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.findUnique({
        where: { id: itemId },
        include: { order: { include: { diningSession: true } } },
      });
      if (!item) throw new NotFoundException("Không tìm thấy món");
      if (item.order.diningSession.status !== "OPEN") {
        throw new ConflictException("Phiên phục vụ đã đóng");
      }
      if (item.status !== "AWAITING_ACCEPTANCE" && item.status !== "ACCEPTED") {
        throw new ConflictException("Nhân viên Order chỉ được hủy món trước khi bếp bắt đầu chế biến");
      }

      const changed = await tx.orderItem.updateMany({
        where: { id: item.id, status: item.status },
        data: { status: "CANCELLED" },
      });
      if (changed.count !== 1) throw new ConflictException("Món vừa được cập nhật bởi thao tác khác");

      await tx.orderItemStatusHistory.create({
        data: {
          orderItemId: item.id,
          fromStatus: item.status,
          toStatus: "CANCELLED",
          reason: "Nhân viên Order hủy món",
          actorId,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId,
          action: "ORDER_STAFF_ITEM_CANCELLED",
          entityType: "ORDER_ITEM",
          entityId: item.id.toString(),
          metadata: { fromStatus: item.status },
        },
      });
      return { id: item.id.toString(), status: "CANCELLED" };
    });
  }

}
