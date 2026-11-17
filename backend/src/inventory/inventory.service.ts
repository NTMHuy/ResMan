import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";

type IngredientInput = {
  code?: string;
  name?: string;
  category?: string | null;
  unit?: string;
  lowStockThreshold?: string | null;
  note?: string | null;
  isActive?: boolean;
};

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private parsePositiveId(value: string, field: string): bigint {
    if (!/^[0-9]+$/.test(value) || BigInt(value) < 1n) {
      throw new BadRequestException(`${field} phải là số nguyên dương`);
    }
    return BigInt(value);
  }

  private parseLimit(value?: string): number {
    if (value === undefined) return 50;
    if (!/^[0-9]+$/.test(value)) throw new BadRequestException("limit không hợp lệ");
    const limit = Number(value);
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 200) {
      throw new BadRequestException("limit phải nằm trong khoảng 1 đến 200");
    }
    return limit;
  }

  private decimal(value: string, field: string, allowZero = true): Prisma.Decimal {
    if (!/^[0-9]+(\\.[0-9]{1,3})?$/.test(value)) {
      throw new BadRequestException(`${field} phải là số không âm, tối đa 3 chữ số thập phân`);
    }
    const parsed = new Prisma.Decimal(value);
    if (!allowZero && parsed.lte(0)) throw new BadRequestException(`${field} phải lớn hơn 0`);
    return parsed;
  }

  async listIngredients(search?: string, includeInactive = false) {
    const ingredients = await this.prisma.ingredient.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(search?.trim() ? {
          OR: [
            { code: { contains: search.trim(), mode: "insensitive" } },
            { name: { contains: search.trim(), mode: "insensitive" } },
          ],
        } : {}),
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      include: { balance: true },
    });
    return ingredients.map((ingredient) => {
      const quantity = ingredient.balance?.quantityOnHand ?? new Prisma.Decimal(0);
      const threshold = ingredient.lowStockThreshold;
      return {
        id: ingredient.id.toString(),
        code: ingredient.code,
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
        lowStockThreshold: threshold?.toString() ?? null,
        note: ingredient.note,
        isActive: ingredient.isActive,
        quantityOnHand: quantity.toString(),
        isLowStock: threshold !== null && quantity.lte(threshold),
        updatedAt: ingredient.updatedAt,
      };
    });
  }

  async createIngredient(input: IngredientInput) {
    try {
      const threshold = input.lowStockThreshold == null
        ? null
        : this.decimal(input.lowStockThreshold, "lowStockThreshold");
      const ingredient = await this.prisma.$transaction(async (tx) => {
        const created = await tx.ingredient.create({
          data: {
            code: input.code!.trim().toUpperCase(),
            name: input.name!.trim(),
            category: input.category?.trim() || null,
            unit: input.unit!.trim(),
            lowStockThreshold: threshold,
            note: input.note?.trim() || null,
            balance: { create: { quantityOnHand: new Prisma.Decimal(0) } },
          },
          include: { balance: true },
        });
        await tx.auditLog.create({
          data: {
            action: "INGREDIENT_CREATED",
            entityType: "INGREDIENT",
            entityId: created.id.toString(),
            metadata: { code: created.code, name: created.name },
          },
        });
        return created;
      });
      return {
        id: ingredient.id.toString(),
        code: ingredient.code,
        name: ingredient.name,
        unit: ingredient.unit,
        quantityOnHand: ingredient.balance!.quantityOnHand.toString(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("Mã nguyên liệu đã tồn tại");
      }
      throw error;
    }
  }

  async updateIngredient(ingredientId: bigint, input: IngredientInput) {
    try {
      const data: Prisma.IngredientUpdateInput = {};
      if (input.name !== undefined) data.name = input.name.trim();
      if (input.category !== undefined) data.category = input.category?.trim() || null;
      if (input.unit !== undefined) data.unit = input.unit.trim();
      if (input.lowStockThreshold !== undefined) {
        data.lowStockThreshold = input.lowStockThreshold === null
          ? null
          : this.decimal(input.lowStockThreshold, "lowStockThreshold");
      }
      if (input.note !== undefined) data.note = input.note?.trim() || null;
      if (input.isActive !== undefined) data.isActive = input.isActive;
      const updated = await this.prisma.ingredient.update({
        where: { id: ingredientId },
        data,
      });
      return { id: updated.id.toString(), code: updated.code, name: updated.name, isActive: updated.isActive };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundException("Không tìm thấy nguyên liệu");
      }
      throw error;
    }
  }

  async stockIn(ingredientId: bigint, input: { quantity: string; reason: string; referenceCode?: string }, actorId: bigint) {
    const quantity = this.decimal(input.quantity, "quantity", false);
    try {
      return await this.prisma.$transaction(async (tx) => {
        const ingredient = await tx.ingredient.findUnique({ where: { id: ingredientId } });
        if (!ingredient || !ingredient.isActive) throw new NotFoundException("Không tìm thấy nguyên liệu đang hoạt động");
        const balance = await tx.inventoryBalance.upsert({
          where: { ingredientId },
          create: { ingredientId, quantityOnHand: quantity },
          update: { quantityOnHand: { increment: quantity } },
        });
        const movement = await tx.stockMovement.create({
          data: {
            ingredientId,
            movementType: "STOCK_IN",
            quantityDelta: quantity,
            reason: input.reason.trim(),
            referenceCode: input.referenceCode?.trim() || null,
            createdBy: actorId,
          },
        });
        await tx.auditLog.create({
          data: {
            actorId,
            action: "INVENTORY_STOCK_IN",
            entityType: "INGREDIENT",
            entityId: ingredientId.toString(),
            metadata: { quantity: quantity.toString(), movementId: movement.id.toString() },
          },
        });
        return {
          ingredientId: ingredientId.toString(),
          quantityOnHand: balance.quantityOnHand.toString(),
          movementId: movement.id.toString(),
        };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        throw new ConflictException("Kho vừa được cập nhật. Vui lòng tải lại và thử lại.");
      }
      throw error;
    }
  }

  async recordCount(ingredientId: bigint, input: { actualQuantity: string; note?: string }, actorId: bigint) {
    const actual = this.decimal(input.actualQuantity, "actualQuantity");
    try {
      return await this.prisma.$transaction(async (tx) => {
        const ingredient = await tx.ingredient.findUnique({
          where: { id: ingredientId },
          include: { balance: true },
        });
        if (!ingredient || !ingredient.isActive) throw new NotFoundException("Không tìm thấy nguyên liệu đang hoạt động");
        const previous = ingredient.balance?.quantityOnHand ?? new Prisma.Decimal(0);
        const delta = actual.sub(previous);
        await tx.inventoryBalance.upsert({
          where: { ingredientId },
          create: { ingredientId, quantityOnHand: actual },
          update: { quantityOnHand: actual },
        });
        const record = await tx.inventoryCountRecord.create({
          data: {
            ingredientId,
            actualQuantity: actual,
            countedBy: actorId,
            note: input.note?.trim() || null,
          },
        });
        if (!delta.isZero()) {
          await tx.stockMovement.create({
            data: {
              ingredientId,
              movementType: "COUNT_ADJUSTMENT",
              quantityDelta: delta,
              reason: "Điều chỉnh theo kết quả kiểm kê",
              referenceCode: `COUNT-${record.id}`,
              createdBy: actorId,
            },
          });
        }
        await tx.auditLog.create({
          data: {
            actorId,
            action: "INVENTORY_COUNT_RECORDED",
            entityType: "INGREDIENT",
            entityId: ingredientId.toString(),
            metadata: {
              previousQuantity: previous.toString(),
              actualQuantity: actual.toString(),
              delta: delta.toString(),
              countRecordId: record.id.toString(),
            },
          },
        });
        return {
          ingredientId: ingredientId.toString(),
          previousQuantity: previous.toString(),
          actualQuantity: actual.toString(),
          adjustment: delta.toString(),
          countedAt: record.countedAt,
          countedBy: actorId.toString(),
        };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        throw new ConflictException("Kho vừa được cập nhật. Vui lòng tải lại và kiểm kê lại.");
      }
      throw error;
    }
  }

  async listMovements(ingredientId?: string, limitValue?: string) {
    const where = ingredientId !== undefined
      ? { ingredientId: this.parsePositiveId(ingredientId, "ingredientId") }
      : {};
    const movements = await this.prisma.stockMovement.findMany({
      where,
      take: this.parseLimit(limitValue),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        ingredient: { select: { id: true, code: true, name: true, unit: true } },
        actor: { select: { id: true, username: true, employee: { select: { fullName: true } } } },
      },
    });
    return movements.map((movement) => ({
      id: movement.id.toString(),
      ingredient: { ...movement.ingredient, id: movement.ingredient.id.toString() },
      movementType: movement.movementType,
      quantityDelta: movement.quantityDelta.toString(),
      reason: movement.reason,
      referenceCode: movement.referenceCode,
      createdAt: movement.createdAt,
      actor: {
        id: movement.actor.id.toString(),
        username: movement.actor.username,
        fullName: movement.actor.employee?.fullName ?? null,
      },
    }));
  }

  async listCounts(ingredientId?: string, limitValue?: string) {
    const where = ingredientId !== undefined
      ? { ingredientId: this.parsePositiveId(ingredientId, "ingredientId") }
      : {};
    const records = await this.prisma.inventoryCountRecord.findMany({
      where,
      take: this.parseLimit(limitValue),
      orderBy: [{ countedAt: "desc" }, { id: "desc" }],
      include: {
        ingredient: { select: { id: true, code: true, name: true, unit: true } },
        actor: { select: { id: true, username: true, employee: { select: { fullName: true } } } },
      },
    });
    return records.map((record) => ({
      id: record.id.toString(),
      ingredient: { ...record.ingredient, id: record.ingredient.id.toString() },
      actualQuantity: record.actualQuantity.toString(),
      countedAt: record.countedAt,
      note: record.note,
      actor: {
        id: record.actor.id.toString(),
        username: record.actor.username,
        fullName: record.actor.employee?.fullName ?? null,
      },
    }));
  }
}
