import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../database/prisma.service.js";
import { CreateMenuItemDto, type MenuPricingType } from "./dto/create-menu-item.dto.js";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto.js";
import { QueryMenuItemDto } from "./dto/query-menu-item.dto.js";

@Injectable()
export class MenuItemsService {
  constructor(private readonly prisma: PrismaService) {}

  private resolvePricing(input: {
    pricingType?: MenuPricingType;
    price?: number | null;
    priceUnit?: string | null;
  }, current?: { pricingType: MenuPricingType; price: Prisma.Decimal | null; priceUnit: string | null }) {
    const pricingType = input.pricingType ?? current?.pricingType ?? "FIXED";
    const priceWasProvided = input.price !== undefined;
    let price: Prisma.Decimal | null;

    if (pricingType === "FIXED" || pricingType === "PER_UNIT") {
      const rawPrice = priceWasProvided ? input.price : current?.price?.toString();
      if (rawPrice === undefined || rawPrice === null || !Number.isFinite(Number(rawPrice)) || Number(rawPrice) < 0) {
        throw new BadRequestException(`Loại giá ${pricingType} yêu cầu price là số không âm`);
      }
      price = new Prisma.Decimal(rawPrice);
    } else {
      if (priceWasProvided && input.price !== null) {
        throw new BadRequestException(`Loại giá ${pricingType} phải có price = null`);
      }
      price = null;
    }

    const rawUnit = input.priceUnit !== undefined ? input.priceUnit : current?.priceUnit;
    const priceUnit = pricingType === "FIXED" || pricingType === "PER_UNIT" ? rawUnit?.trim() || null : null;
    if (pricingType === "PER_UNIT" && !priceUnit) {
      throw new BadRequestException("Loại giá PER_UNIT bắt buộc có priceUnit");
    }
    return { pricingType, price, priceUnit };
  }

  async create(dto: CreateMenuItemDto) {
    const categoryId = BigInt(dto.categoryId);
    const category = await this.prisma.menuCategory.findUnique({ where: { id: categoryId } });
    if (!category) throw new NotFoundException("Không tìm thấy danh mục");
    if (!category.isActive) throw new BadRequestException("Không thể tạo món trong danh mục đã ẩn");

    const code = dto.code.trim().toUpperCase();
    const existing = await this.prisma.menuItem.findUnique({ where: { code } });
    if (existing) throw new ConflictException("Mã món ăn đã tồn tại");

    const pricing = this.resolvePricing(dto);
    const item = await this.prisma.menuItem.create({
      data: {
        code,
        name: dto.name.trim(),
        categoryId,
        description: dto.description?.trim() || null,
        ...pricing,
        imageUrl: dto.imageUrl?.trim() || null,
        isActive: dto.isActive ?? true,
        availabilityStatus: dto.availabilityStatus ?? "AVAILABLE",
        availabilityReason: dto.availabilityStatus === "AVAILABLE" ? null :
          dto.availabilityStatus ? dto.availabilityReason?.trim() || "Tạm hết món" : null,
      },
      include: { category: true },
    });
    return this.formatItem(item);
  }

  async findAll(query: QueryMenuItemDto) {
    const { search, categoryId, status, isActive, minPrice, maxPrice,
      page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = query;

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new BadRequestException("minPrice không được lớn hơn maxPrice");
    }

    const normalizedStatus = status === "UNAVAILABLE" ? "MANUAL_UNAVAILABLE" : status;
    const where: Prisma.MenuItemWhereInput = {
      ...(search ? { OR: [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ] } : {}),
      ...(categoryId !== undefined ? { categoryId: BigInt(categoryId) } : {}),
      ...(normalizedStatus ? { availabilityStatus: normalizedStatus } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined ? { price: {
        ...(minPrice !== undefined ? { gte: new Prisma.Decimal(minPrice) } : {}),
        ...(maxPrice !== undefined ? { lte: new Prisma.Decimal(maxPrice) } : {}),
      } } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.menuItem.findMany({
        where,
        include: { category: true },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return {
      data: items.map((item) => this.formatItem(item)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findCustomerMenu(categoryId?: string) {
    if (categoryId !== undefined && (!/^[1-9][0-9]*$/.test(categoryId))) {
      throw new BadRequestException("categoryId phải là số nguyên dương");
    }
    const parsedCategoryId = categoryId === undefined ? undefined : BigInt(categoryId);
    const categories = await this.prisma.menuCategory.findMany({
      where: {
        isActive: true,
        ...(parsedCategoryId !== undefined ? { id: parsedCategoryId } : {}),
        items: { some: { isActive: true, availabilityStatus: "AVAILABLE" } },
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: {
        id: true, code: true, name: true, description: true,
        items: {
          where: { isActive: true, availabilityStatus: "AVAILABLE" },
          orderBy: [{ name: "asc" }, { id: "asc" }],
          select: {
            id: true, code: true, name: true, description: true,
            price: true, pricingType: true, priceUnit: true, imageUrl: true,
          },
        },
      },
    });
    return categories.map((category) => ({
      ...category,
      id: category.id.toString(),
      items: category.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        price: item.price?.toString() ?? null,
      })),
    }));
  }

  async findOne(id: bigint) {
    const item = await this.prisma.menuItem.findUnique({ where: { id }, include: { category: true } });
    if (!item) throw new NotFoundException("Không tìm thấy món ăn");
    return this.formatItem(item);
  }

  async update(id: bigint, dto: UpdateMenuItemDto) {
    const current = await this.ensureExists(id);
    if (dto.code !== undefined) {
      const code = dto.code.trim().toUpperCase();
      const duplicate = await this.prisma.menuItem.findFirst({ where: { code, id: { not: id } } });
      if (duplicate) throw new ConflictException("Mã món ăn đã tồn tại");
    }
    if (dto.categoryId !== undefined) {
      const category = await this.prisma.menuCategory.findUnique({ where: { id: BigInt(dto.categoryId) } });
      if (!category) throw new NotFoundException("Không tìm thấy danh mục");
      if (!category.isActive) throw new BadRequestException("Danh mục đã bị ẩn");
    }

    const pricing = this.resolvePricing(dto, current);
    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        ...(dto.code !== undefined ? { code: dto.code.trim().toUpperCase() } : {}),
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.categoryId !== undefined ? { categoryId: BigInt(dto.categoryId) } : {}),
        ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
        ...pricing,
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl?.trim() || null } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.availabilityStatus !== undefined ? {
          availabilityStatus: dto.availabilityStatus,
          availabilityReason: dto.availabilityStatus === "AVAILABLE" ? null : dto.availabilityReason?.trim() || "Tạm hết món",
        } : {}),
        ...(dto.availabilityReason !== undefined && dto.availabilityStatus === undefined
          ? { availabilityReason: dto.availabilityReason?.trim() || null } : {}),
      },
      include: { category: true },
    });
    return this.formatItem(item);
  }

  async remove(id: bigint) {
    await this.ensureExists(id);
    const orderCount = await this.prisma.orderItem.count({ where: { menuItemId: id } });
    if (orderCount > 0) {
      throw new ConflictException("Món đã phát sinh đơn hàng; hãy ngừng kinh doanh thay vì xóa");
    }
    await this.prisma.menuItem.delete({ where: { id } });
    return { message: "Đã xóa món ăn" };
  }

  async updateStatus(id: bigint, isActive: boolean, availabilityStatus?: string, availabilityReason?: string) {
    await this.ensureExists(id);
    if (availabilityStatus !== undefined && !["AVAILABLE", "MANUAL_UNAVAILABLE"].includes(availabilityStatus)) {
      throw new BadRequestException("Trạng thái khả dụng không hợp lệ");
    }
    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        isActive,
        ...(availabilityStatus !== undefined ? { availabilityStatus } : {}),
        ...(availabilityStatus === "AVAILABLE" ? { availabilityReason: null } :
          availabilityReason !== undefined ? { availabilityReason } : {}),
      },
      include: { category: true },
    });
    return this.formatItem(item);
  }

  async updateImage(id: bigint, imageUrl: string) {
    await this.ensureExists(id);
    const item = await this.prisma.menuItem.update({ where: { id }, data: { imageUrl }, include: { category: true } });
    return this.formatItem(item);
  }

  async deleteImage(id: bigint) {
    await this.ensureExists(id);
    const item = await this.prisma.menuItem.update({ where: { id }, data: { imageUrl: null } });
    return { id: item.id.toString(), imageUrl: null, message: "Đã xóa ảnh món ăn" };
  }

  private async ensureExists(id: bigint) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Không tìm thấy món ăn");
    return item;
  }

  private formatItem(item: any) {
    return {
      ...item,
      id: item.id.toString(),
      categoryId: item.categoryId.toString(),
      price: item.price?.toString() ?? null,
      category: item.category ? { ...item.category, id: item.category.id.toString() } : undefined,
    };
  }
}
