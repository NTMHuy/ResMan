import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../database/prisma.service.js";

import { CreateMenuCategoryDto } from "./dto/create-menu-category.dto.js";
import { UpdateMenuCategoryDto } from "./dto/update-menu-category.dto.js";
import { QueryMenuCategoryDto } from "./dto/query-menu-category.dto.js";

@Injectable()
export class MenuCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateMenuCategoryDto) {
    const code = dto.code.trim().toUpperCase();
    const name = dto.name.trim();
    const existing = await this.prisma.menuCategory.findFirst({
      where: { OR: [{ code }, { name }] },
    });

    if (existing) {
      throw new ConflictException("Category code or name already exists");
    }

    const category = await this.prisma.menuCategory.create({
      data: {
        code,
        name,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });

    return this.formatCategory(category);
  }

  // GET ALL
  async findAll(query: QueryMenuCategoryDto) {
    const categories = await this.prisma.menuCategory.findMany({
      where: {
        ...(query.search && {
          OR: [
            {
              name: {
                contains: query.search,
                mode: "insensitive",
              },
            },
            {
              code: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          ],
        }),

        ...(query.isActive !== undefined && {
          isActive: query.isActive,
        }),
      },

      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return categories.map((category) => ({
      ...category,
      id: category.id.toString(),
      itemCount: category._count.items,
      _count: undefined,
    }));
  }

  // GET DETAIL
  async findOne(id: bigint) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return {
      ...category,
      id: category.id.toString(),
      items: category.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        categoryId: item.categoryId.toString(),
        price: item.price?.toString() ?? null,
      })),
    };
  }

  // UPDATE
  async update(id: bigint, dto: UpdateMenuCategoryDto) {
    await this.ensureExists(id);

    const code = dto.code?.trim().toUpperCase();
    const name = dto.name?.trim();
    if (code || name) {
      const duplicate = await this.prisma.menuCategory.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(code ? [{ code }] : []),
            ...(name ? [{ name }] : []),
          ],
        },
      });

      if (duplicate) {
        throw new ConflictException("Category code or name already exists");
      }
    }

    const category = await this.prisma.menuCategory.update({
      where: { id },
      data: {
        ...(code !== undefined ? { code } : {}),
        ...(name !== undefined ? { name } : {}),
        ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });

    return this.formatCategory(category);
  }

  // DELETE
  async remove(id: bigint) {
    await this.ensureExists(id);

    const itemCount = await this.prisma.menuItem.count({
      where: { categoryId: id },
    });

    if (itemCount > 0) {
      throw new ConflictException(
        "Cannot delete category because it contains menu items",
      );
    }

    await this.prisma.menuCategory.delete({
      where: { id },
    });

    return {
      message: "Category deleted successfully",
    };
  }

  private async ensureExists(id: bigint) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  private formatCategory(category: any) {
    return {
      ...category,
      id: category.id.toString(),
    };
  }
}
