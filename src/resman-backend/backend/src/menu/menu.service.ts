import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findGuestMenu(categoryId?: string) {
    if (categoryId !== undefined && (!/^[0-9]+$/.test(categoryId) || BigInt(categoryId) < 1n)) {
      throw new BadRequestException("categoryId phải là số nguyên dương");
    }
    const parsedCategoryId = categoryId !== undefined ? BigInt(categoryId) : undefined;
    const categories = await this.prisma.menuCategory.findMany({
      where: {
        isActive: true,
        ...(parsedCategoryId !== undefined ? { id: parsedCategoryId } : {}),
        items: {
          some: { isActive: true, availabilityStatus: "AVAILABLE" },
        },
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        items: {
          where: { isActive: true, availabilityStatus: "AVAILABLE" },
          orderBy: { name: "asc" },
          select: {
            id: true,
            code: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
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
        price: item.price.toString(),
      })),
    }));
  }
}
