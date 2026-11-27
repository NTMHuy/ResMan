import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";

type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER";

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async requestForCustomer(userId: bigint) {
    const device = await this.prisma.tableDevice.findUnique({
      where: { userId },
      select: { diningTableId: true, isActive: true },
    });
    if (!device || !device.isActive) {
      throw new NotFoundException("Tài khoản khách hàng chưa được gán với tablet và bàn hoạt động");
    }
    const session = await this.prisma.diningSession.findFirst({
      where: { tableId: device.diningTableId, status: "OPEN" },
      select: { id: true },
    });
    if (!session) throw new ConflictException("Bàn chưa có phiên gọi món đang hoạt động");
    const existingPayment = await this.prisma.payment.findFirst({
      where: { order: { is: { diningSessionId: session.id } } },
      select: { id: true },
    });
    if (existingPayment) throw new ConflictException("Phiên này đã được thanh toán");
    const existingRequest = await this.prisma.paymentRequest.findUnique({
      where: { diningSessionId: session.id },
    });
    if (existingRequest?.status === "PENDING") {
      return {
        id: existingRequest.id.toString(),
        status: existingRequest.status,
        requestedAt: existingRequest.requestedAt,
      };
    }
    const request = await this.prisma.paymentRequest.upsert({
      where: { diningSessionId: session.id },
      create: { diningSessionId: session.id, status: "PENDING" },
      update: { status: "PENDING", requestedAt: new Date(), resolvedAt: null },
    });
    return { id: request.id.toString(), status: request.status, requestedAt: request.requestedAt };
  }

  async listPendingRequests() {
    const requests = await this.prisma.paymentRequest.findMany({
      where: { status: "PENDING", diningSession: { status: "OPEN" } },
      orderBy: { requestedAt: "asc" },
      include: {
        diningSession: {
          include: {
            table: { select: { id: true, code: true, name: true } },
            order: { include: { items: { orderBy: { createdAt: "asc" } } } },
          },
        },
      },
    });
    return requests.map((request) => {
      const order = request.diningSession.order;
      const items = order?.items ?? [];
      const totalAmount = items
        .filter((item) => item.status !== "CANCELLED")
        .reduce((total, item) => total.add(item.lineTotal), new Prisma.Decimal(0));
      return {
        id: request.id.toString(),
        requestedAt: request.requestedAt,
        sessionId: request.diningSession.id.toString(),
        table: request.diningSession.table,
        orderId: order?.id.toString() ?? null,
        orderCode: order?.orderCode ?? null,
        totalAmount: totalAmount.toString(),
        items: items.map((item) => ({
          id: item.id.toString(),
          name: item.itemNameSnapshot,
          quantity: item.quantity,
          status: item.status,
          lineTotal: item.lineTotal.toString(),
        })),
      };
    });
  }

  async confirmForSession(
    sessionId: bigint,
    actorId: bigint,
    paymentMethod?: PaymentMethod,
    transactionRef?: string,
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const session = await tx.diningSession.findUnique({
          where: { id: sessionId },
          include: {
            table: { select: { id: true, code: true, name: true, status: true } },
            order: {
              include: {
                items: {
                  select: {
                    id: true,
                    itemNameSnapshot: true,
                    quantity: true,
                    unitPrice: true,
                    lineTotal: true,
                    status: true,
                  },
                },
                payment: true,
              },
            },
          },
        });
        if (!session || !session.order) {
          throw new NotFoundException("Không tìm thấy phiên phục vụ");
        }
        if (session.status !== "OPEN") {
          throw new ConflictException("Phiên phục vụ đã được đóng");
        }
        if (session.order.payment) {
          throw new ConflictException("Đơn hàng đã được thanh toán");
        }

        const notYetReceived = session.order.items.filter(
          (item) => item.status === "AWAITING_ACCEPTANCE",
        );
        if (notYetReceived.length > 0) {
          throw new ConflictException(
            `Chưa thể thanh toán: còn ${notYetReceived.length} món đang chờ bếp tiếp nhận: ${notYetReceived.map((item) => item.itemNameSnapshot).join(", ")}. Hãy tiếp nhận hoặc hủy các món này trước.`,
          );
        }

        const amount = session.order.items
          .filter((item) => item.status !== "CANCELLED")
          .reduce(
            (total, item) => total.add(item.lineTotal),
            new Prisma.Decimal(0),
          );

        const payment = await tx.payment.create({
          data: {
            orderId: session.order.id,
            amount,
            paymentMethod: paymentMethod ?? null,
            transactionRef: transactionRef?.trim() || null,
            status: "PAID",
            recordedBy: actorId,
          },
        });

        await tx.paymentRequest.updateMany({
          where: { diningSessionId: session.id, status: "PENDING" },
          data: { status: "COMPLETED", resolvedAt: new Date() },
        });

        const closedAt = new Date();
        const closed = await tx.diningSession.updateMany({
          where: { id: session.id, status: "OPEN" },
          data: { status: "CLOSED", closedAt, closedBy: actorId },
        });
        if (closed.count !== 1) {
          throw new ConflictException("Phiên vừa được đóng bởi một thao tác khác");
        }

        const tableUpdated = await tx.diningTable.updateMany({
          where: { id: session.table.id, status: "OCCUPIED" },
          data: { status: "AVAILABLE" },
        });
        if (tableUpdated.count !== 1) {
          throw new ConflictException("Không thể cập nhật trạng thái bàn. Vui lòng kiểm tra lại.");
        }

        await tx.auditLog.create({
          data: {
            actorId,
            action: "PAYMENT_CONFIRMED_AND_SESSION_CLOSED",
            entityType: "DINING_SESSION",
            entityId: session.id.toString(),
            metadata: {
              orderId: session.order.id.toString(),
              paymentId: payment.id.toString(),
              amount: amount.toString(),
              paymentMethod: payment.paymentMethod,
              tableId: session.table.id.toString(),
            },
          },
        });

        return {
          session: {
            id: session.id.toString(),
            status: "CLOSED",
            closedAt: closedAt.toISOString(),
            table: {
              id: session.table.id.toString(),
              code: session.table.code,
              name: session.table.name,
              status: "AVAILABLE",
            },
          },
          payment: {
            id: payment.id.toString(),
            orderId: payment.orderId.toString(),
            amount: payment.amount.toString(),
            paymentMethod: payment.paymentMethod,
            transactionRef: payment.transactionRef,
            status: payment.status,
            paidAt: payment.paidAt,
          },
        };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError &&
          (error.code === "P2002" || error.code === "P2034")) {
        throw new ConflictException("Thanh toán hoặc đóng phiên vừa được xử lý ở một thao tác khác. Hãy tải lại dữ liệu.");
      }
      throw error;
    }
  }

  async getSessionSummary(sessionId: bigint) {
    const session = await this.prisma.diningSession.findUnique({
      where: { id: sessionId },
      include: {
        table: { select: { id: true, code: true, name: true } },
        order: {
          include: {
            items: {
              orderBy: { createdAt: "asc" },
              select: {
                id: true,
                itemNameSnapshot: true,
                quantity: true,
                unitPrice: true,
                lineTotal: true,
                status: true,
              },
            },
            payment: true,
          },
        },
      },
    });
    if (!session || !session.order) {
      throw new NotFoundException("Không tìm thấy phiên phục vụ");
    }

    const chargeableItems = session.order.items.filter(
      (item) => ["ACCEPTED", "IN_PREPARATION", "COMPLETED"].includes(item.status),
    );
    const amount = chargeableItems.reduce(
      (total, item) => total.add(item.lineTotal),
      new Prisma.Decimal(0),
    );
    const pendingItems = session.order.items.filter(
      (item) => item.status === "AWAITING_ACCEPTANCE",
    );

    return {
      session: {
        id: session.id.toString(),
        status: session.status,
        openedAt: session.openedAt,
        closedAt: session.closedAt,
        table: { ...session.table, id: session.table.id.toString() },
      },
      order: {
        id: session.order.id.toString(),
        orderCode: session.order.orderCode,
      },
      items: session.order.items.map((item) => ({
        id: item.id.toString(),
        itemName: item.itemNameSnapshot,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        lineTotal: item.lineTotal.toString(),
        status: item.status,
      })),
      totalAmount: amount.toString(),
      canConfirmPayment: session.status === "OPEN" && !session.order.payment && pendingItems.length === 0,
      blockingItems: pendingItems.map((item) => ({
        id: item.id.toString(),
        itemName: item.itemNameSnapshot,
        status: item.status,
      })),
      payment: session.order.payment ? {
        id: session.order.payment.id.toString(),
        amount: session.order.payment.amount.toString(),
        paymentMethod: session.order.payment.paymentMethod,
        status: session.order.payment.status,
        paidAt: session.order.payment.paidAt,
      } : null,
    };
  }
}
