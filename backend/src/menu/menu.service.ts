import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";
import { CreateMenuCategoryDto } from "./dto/create-menu-category.dto.js";
import { UpdateMenuCategoryDto } from "./dto/update-menu-category.dto.js";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto.js";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto.js";

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  private id(value: string): bigint {
    if (!/^[1-9][0-9]*$/.test(value)) throw new BadRequestException("ID không hợp lệ");
    return BigInt(value);
  }

  private price(value: string): Prisma.Decimal {
    if (!/^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/.test(value)) {
      throw new BadRequestException("Giá phải là số không âm, tối đa 2 chữ số thập phân");
    }
    return new Prisma.Decimal(value);
  }

  private async audit(actorId: bigint, action: string, entityType: string, entityId: bigint, metadata: Prisma.InputJsonValue) {
    await this.prisma.auditLog.create({
      data: { actorId, action, entityType, entityId: entityId.toString(), metadata },
    });
  }

  async findGuestMenu(categoryId?: string) {
    if (categoryId !== undefined && (!/^[0-9]+$/.test(categoryId) || BigInt(categoryId) < 1n)) {
      throw new BadRequestException("categoryId phải là số nguyên dương");
    }
    const parsedCategoryId = categoryId !== undefined ? BigInt(categoryId) : undefined;
    const categories = await this.prisma.menuCategory.findMany({
      where: {
        isActive: true,
        ...(parsedCategoryId !== undefined ? { id: parsedCategoryId } : {}),
        items: { some: { isActive: true, availabilityStatus: "AVAILABLE" } },
      },
      orderBy: { name: "asc" },
      select: {
        id: true, code: true, name: true, description: true,
        items: {
          where: { isActive: true, availabilityStatus: "AVAILABLE" },
          orderBy: { name: "asc" },
          select: { id: true, code: true, name: true, description: true, price: true, pricingType: true, priceUnit: true, imageUrl: true },
        },
      },
    });
    return categories.map((category) => ({
      ...category,
      id: category.id.toString(),
      items: category.items.map((item) => ({ ...item, id: item.id.toString(), price: item.price?.toString() ?? null })),
    }));
  }

  async listManagement() {
    const categories = await this.prisma.menuCategory.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      include: { items: { orderBy: [{ name: "asc" }, { id: "asc" }] } },
    });
    return categories.map((category) => ({
      ...category, id: category.id.toString(),
      items: category.items.map((item) => ({ ...item, id: item.id.toString(), categoryId: item.categoryId.toString(), price: item.price.toString() })),
    }));
  }

  async createCategory(dto: CreateMenuCategoryDto, actorId: bigint) {
    try {
      const category = await this.prisma.menuCategory.create({
        data: { code: dto.code.trim().toUpperCase(), name: dto.name.trim(), description: dto.description?.trim() || null },
      });
      await this.audit(actorId, "MENU_CATEGORY_CREATED", "MENU_CATEGORY", category.id, { code: category.code, name: category.name });
      return { ...category, id: category.id.toString() };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new ConflictException("Mã danh mục đã tồn tại");
      throw error;
    }
  }

  async updateCategory(id: bigint, dto: UpdateMenuCategoryDto, actorId: bigint) {
    try {
      const category = await this.prisma.menuCategory.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
          ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        },
      });
      await this.audit(actorId, "MENU_CATEGORY_UPDATED", "MENU_CATEGORY", id, { changedFields: Object.keys(dto) });
      return { ...category, id: category.id.toString() };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") throw new NotFoundException("Không tìm thấy danh mục");
      throw error;
    }
  }

  async createItem(dto: CreateMenuItemDto, actorId: bigint) {
    const categoryId = BigInt(dto.categoryId);
    const category = await this.prisma.menuCategory.findFirst({ where: { id: categoryId, isActive: true } });
    if (!category) throw new NotFoundException("Danh mục không tồn tại hoặc đã bị ẩn");
    try {
      const item = await this.prisma.menuItem.create({
        data: {
          categoryId, code: dto.code.trim().toUpperCase(), name: dto.name.trim(),
          description: dto.description?.trim() || null, price: this.price(dto.price),
          imageUrl: dto.imageUrl?.trim() || null,
        },
      });
      await this.audit(actorId, "MENU_ITEM_CREATED", "MENU_ITEM", item.id, { code: item.code, name: item.name });
      return { ...item, id: item.id.toString(), categoryId: item.categoryId.toString(), price: item.price.toString() };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new ConflictException("Mã món ăn đã tồn tại");
      throw error;
    }
  }

  async updateItem(id: bigint, dto: UpdateMenuItemDto, actorId: bigint) {
    if (dto.categoryId !== undefined) {
      const category = await this.prisma.menuCategory.findFirst({ where: { id: BigInt(dto.categoryId), isActive: true } });
      if (!category) throw new NotFoundException("Danh mục không tồn tại hoặc đã bị ẩn");
    }
    try {
      const item = await this.prisma.menuItem.update({
        where: { id },
        data: {
          ...(dto.categoryId !== undefined ? { categoryId: BigInt(dto.categoryId) } : {}),
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
          ...(dto.price !== undefined ? { price: this.price(dto.price) } : {}),
          ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl?.trim() || null } : {}),
          ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
          ...(dto.availabilityStatus !== undefined ? { availabilityStatus: dto.availabilityStatus, availabilityReason: dto.availabilityStatus === "AVAILABLE" ? null : dto.availabilityReason?.trim() || "Tạm hết món" } : {}),
          ...(dto.availabilityReason !== undefined && dto.availabilityStatus === undefined ? { availabilityReason: dto.availabilityReason?.trim() || null } : {}),
        },
      });
      await this.audit(actorId, "MENU_ITEM_UPDATED", "MENU_ITEM", id, { changedFields: Object.keys(dto) });
      return { ...item, id: item.id.toString(), categoryId: item.categoryId.toString(), price: item.price.toString() };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") throw new NotFoundException("Không tìm thấy món ăn");
      throw error;
    }
  }

  async archiveItem(id: bigint, actorId: bigint) {
    try {
      const item = await this.prisma.menuItem.update({ where: { id }, data: { isActive: false } });
      await this.audit(actorId, "MENU_ITEM_ARCHIVED", "MENU_ITEM", id, { code: item.code });
      return { message: "Đã ẩn món ăn khỏi thực đơn", id: id.toString() };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") throw new NotFoundException("Không tìm thấy món ăn");
      throw error;
    }
  }
}
