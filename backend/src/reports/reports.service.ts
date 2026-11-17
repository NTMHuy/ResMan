import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";

type DateRange = { gte?: Date; lt?: Date };

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private dateRange(from?: string, to?: string): DateRange {
    const range: DateRange = {};
    if (from !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) {
        throw new BadRequestException("from phải có định dạng YYYY-MM-DD");
      }
      const start = new Date(`${from}T00:00:00+07:00`);
      if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== from) {
        throw new BadRequestException("from không phải ngày hợp lệ");
      }
      range.gte = start;
    }
    if (to !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(to)) {
        throw new BadRequestException("to phải có định dạng YYYY-MM-DD");
      }
      const end = new Date(`${to}T00:00:00+07:00`);
      if (Number.isNaN(end.getTime()) || end.toISOString().slice(0, 10) !== to) {
        throw new BadRequestException("to không phải ngày hợp lệ");
      }
      end.setUTCDate(end.getUTCDate() + 1);
      range.lt = end;
    }
    if (range.gte && range.lt && range.gte >= range.lt) {
      throw new BadRequestException("from không được sau to");
    }
    return range;
  }

  private boundedNumber(value: string | undefined, fallback: number, max: number, field: string): number {
    if (value === undefined) return fallback;
    if (!/^[0-9]+$/.test(value)) throw new BadRequestException(`${field} không hợp lệ`);
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > max) {
      throw new BadRequestException(`${field} phải nằm trong khoảng 1 đến ${max}`);
    }
    return parsed;
  }

  async overview(from?: string, to?: string) {
    const paidAt = this.dateRange(from, to);
    const [aggregate, payments] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { status: "PAID", paidAt },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      this.prisma.payment.findMany({
        where: { status: "PAID", paidAt },
        select: {
          order: {
            select: {
              items: {
                where: { status: { not: "CANCELLED" } },
                select: { quantity: true },
              },
            },
          },
        },
      }),
    ]);
    const itemsSold = payments.reduce(
      (total, payment) => total + payment.order.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    );
    return {
      from: from ?? null,
      to: to ?? null,
      revenue: (aggregate._sum.amount ?? new Prisma.Decimal(0)).toString(),
      paidOrderCount: aggregate._count._all,
      itemsSold,
    };
  }

  async revenue(from?: string, to?: string, period?: string) {
    const grouping = period ?? "day";
    if (grouping !== "day" && grouping !== "month") {
      throw new BadRequestException("period chỉ nhận day hoặc month");
    }
    const payments = await this.prisma.payment.findMany({
      where: { status: "PAID", paidAt: this.dateRange(from, to) },
      select: { amount: true, paidAt: true },
      orderBy: { paidAt: "asc" },
    });
    const buckets = new Map<string, { revenue: Prisma.Decimal; paymentCount: number }>();
    for (const payment of payments) {
      const key = grouping === "month"
        ? new Date(payment.paidAt.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 7)
        : new Date(payment.paidAt.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const current = buckets.get(key) ?? { revenue: new Prisma.Decimal(0), paymentCount: 0 };
      current.revenue = current.revenue.add(payment.amount);
      current.paymentCount += 1;
      buckets.set(key, current);
    }
    return {
      period: grouping,
      from: from ?? null,
      to: to ?? null,
      data: [...buckets.entries()].map(([date, value]) => ({
        date,
        revenue: value.revenue.toString(),
        paymentCount: value.paymentCount,
      })),
    };
  }

  async bestSellers(from?: string, to?: string, limitValue?: string) {
    const limit = this.boundedNumber(limitValue, 10, 100, "limit");
    const payments = await this.prisma.payment.findMany({
      where: { status: "PAID", paidAt: this.dateRange(from, to) },
      select: {
        order: {
          select: {
            items: {
              where: { status: { not: "CANCELLED" } },
              select: { itemNameSnapshot: true, quantity: true, lineTotal: true },
            },
          },
        },
      },
    });
    const totals = new Map<string, { quantity: number; revenue: Prisma.Decimal }>();
    for (const payment of payments) {
      for (const item of payment.order.items) {
        const current = totals.get(item.itemNameSnapshot) ?? {
          quantity: 0,
          revenue: new Prisma.Decimal(0),
        };
        current.quantity += item.quantity;
        current.revenue = current.revenue.add(item.lineTotal);
        totals.set(item.itemNameSnapshot, current);
      }
    }
    return [...totals.entries()]
      .map(([itemName, value]) => ({
        itemName,
        quantitySold: value.quantity,
        revenue: value.revenue.toString(),
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold || Number(b.revenue) - Number(a.revenue))
      .slice(0, limit);
  }

  async orders(from?: string, to?: string, pageValue?: string, limitValue?: string) {
    const page = this.boundedNumber(pageValue, 1, 1000000, "page");
    const limit = this.boundedNumber(limitValue, 20, 100, "limit");
    const where = { createdAt: this.dateRange(from, to) };
    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          diningSession: {
            select: {
              sessionCode: true,
              openedAt: true,
              closedAt: true,
              table: { select: { code: true, name: true } },
            },
          },
          items: {
            orderBy: { createdAt: "asc" },
            select: {
              itemNameSnapshot: true,
              quantity: true,
              unitPrice: true,
              lineTotal: true,
              status: true,
            },
          },
          payment: {
            select: { amount: true, paymentMethod: true, status: true, paidAt: true },
          },
        },
      }),
    ]);
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: orders.map((order) => ({
        id: order.id.toString(),
        orderCode: order.orderCode,
        createdAt: order.createdAt,
        table: order.diningSession.table,
        session: {
          code: order.diningSession.sessionCode,
          openedAt: order.diningSession.openedAt,
          closedAt: order.diningSession.closedAt,
        },
        items: order.items.map((item) => ({
          itemName: item.itemNameSnapshot,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          lineTotal: item.lineTotal.toString(),
          status: item.status,
        })),
        payment: order.payment ? {
          amount: order.payment.amount.toString(),
          paymentMethod: order.payment.paymentMethod,
          status: order.payment.status,
          paidAt: order.payment.paidAt,
        } : null,
      })),
    };
  }

  async inventory() {
    const ingredients = await this.prisma.ingredient.findMany({
      where: { isActive: true },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      include: { balance: true },
    });
    const rows = ingredients.map((ingredient) => {
      const quantity = ingredient.balance?.quantityOnHand ?? new Prisma.Decimal(0);
      const threshold = ingredient.lowStockThreshold;
      return {
        id: ingredient.id.toString(),
        code: ingredient.code,
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
        quantityOnHand: quantity.toString(),
        lowStockThreshold: threshold?.toString() ?? null,
        isLowStock: threshold !== null && quantity.lte(threshold),
      };
    });
    return {
      ingredientCount: rows.length,
      lowStockCount: rows.filter((item) => item.isLowStock).length,
      lowStockItems: rows.filter((item) => item.isLowStock),
      ingredients: rows,
    };
  }
}
