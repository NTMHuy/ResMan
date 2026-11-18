import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { QueryMenuItemDto } from './dto/query-menu-item.dto';

import { Prisma } from '../generated/prisma/client';

@Injectable()
export class MenuItemsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE MENU ITEM
  async create(dto: CreateMenuItemDto) {
    const categoryId = BigInt(dto.categoryId);

    const category = await this.prisma.menuCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!category.isActive) {
      throw new BadRequestException('Cannot create item in inactive category');
    }

    const existing = await this.prisma.menuItem.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Menu item code already exists');
    }

    const item = await this.prisma.menuItem.create({
      data: {
        code: dto.code.trim(),
        name: dto.name.trim(),
        categoryId,
        description: dto.description,
        price: new Prisma.Decimal(dto.price),
        imageUrl: dto.imageUrl,
      },
      include: {
        category: true,
      },
    });

    return this.formatItem(item);
  }

  // GET MENU ITEMS WITH SEARCH, FILTER, PAGINATION
  async findAll(query: QueryMenuItemDto) {
    const {
      search,
      categoryId,
      status,
      isActive,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    const where: Prisma.MenuItemWhereInput = {
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),

      ...(categoryId !== undefined && {
        categoryId: BigInt(categoryId),
      }),

      ...(status && {
        availabilityStatus: status,
      }),

      ...(isActive !== undefined && {
        isActive,
      }),

      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && {
                gte: new Prisma.Decimal(minPrice),
              }),
              ...(maxPrice !== undefined && {
                lte: new Prisma.Decimal(maxPrice),
              }),
            },
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.menuItem.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),

      this.prisma.menuItem.count({ where }),
    ]);

    return {
      data: items.map((item) => this.formatItem(item)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET DETAIL
  async findOne(id: bigint) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return this.formatItem(item);
  }

  // UPDATE
  async update(id: bigint, dto: UpdateMenuItemDto) {
    await this.ensureExists(id);

    if (dto.code) {
      const duplicate = await this.prisma.menuItem.findFirst({
        where: {
          code: dto.code,
          id: { not: id },
        },
      });

      if (duplicate) {
        throw new ConflictException('Menu item code already exists');
      }
    }

    if (dto.categoryId !== undefined) {
      const category = await this.prisma.menuCategory.findUnique({
        where: {
          id: BigInt(dto.categoryId),
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      if (!category.isActive) {
        throw new BadRequestException('Category is inactive');
      }
    }

    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code.trim() }),
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.categoryId !== undefined && {
          categoryId: BigInt(dto.categoryId),
        }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
        ...(dto.price !== undefined && {
          price: new Prisma.Decimal(dto.price),
        }),
        ...(dto.imageUrl !== undefined && {
          imageUrl: dto.imageUrl,
        }),
      },
      include: {
        category: true,
      },
    });

    return this.formatItem(item);
  }

  // DELETE
  async remove(id: bigint) {
    await this.ensureExists(id);

    const orderCount = await this.prisma.orderItem.count({
      where: {
        menuItemId: id,
      },
    });

    if (orderCount > 0) {
      throw new ConflictException(
        'Cannot delete menu item because it is used in orders. Deactivate it instead.',
      );
    }

    await this.prisma.menuItem.delete({
      where: { id },
    });

    return {
      message: 'Menu item deleted successfully',
    };
  }

  // CHANGE BUSINESS STATUS
  async updateStatus(
    id: bigint,
    isActive: boolean,
    availabilityStatus?: string,
    availabilityReason?: string,
  ) {
    await this.ensureExists(id);

    if (
      availabilityStatus !== undefined &&
      !['AVAILABLE', 'UNAVAILABLE', 'SOLD_OUT'].includes(availabilityStatus)
    ) {
      throw new BadRequestException('Invalid availability status');
    }

    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        isActive,
        ...(availabilityStatus !== undefined && {
          availabilityStatus,
        }),
        ...(availabilityReason !== undefined && {
          availabilityReason,
        }),
      },
      include: {
        category: true,
      },
    });

    return this.formatItem(item);
  }

  // UPDATE IMAGE URL
  async updateImage(id: bigint, imageUrl: string) {
    await this.ensureExists(id);

    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        imageUrl,
      },
      include: {
        category: true,
      },
    });

    return this.formatItem(item);
  }

  // DELETE IMAGE
  async deleteImage(id: bigint) {
    await this.ensureExists(id);

    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        imageUrl: null,
      },
    });

    return {
      id: item.id.toString(),
      imageUrl: null,
      message: 'Image removed successfully',
    };
  }

  private async ensureExists(id: bigint) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return item;
  }

  private formatItem(item: any) {
    return {
      ...item,
      id: item.id.toString(),
      categoryId: item.categoryId.toString(),
      price: item.price.toString(),
      category: item.category
        ? {
            ...item.category,
            id: item.category.id.toString(),
          }
        : undefined,
    };
  }
}
