import type { MenuRepository } from "@/src/repositories/interfaces/MenuRepository";

import type {
  CreateCategoryInput,
  CreateMenuItemInput,
  DishStatus,
  MenuCategory,
  MenuFilterParams,
  MenuItem,
  UpdateCategoryInput,
  UpdateMenuItemInput,
  UploadMenuImageInput,
} from "@/src/features/menu/types/menu.types";

import {
  mockCategoriesData,
  mockMenuItemsData,
} from "@/src/data/mock/mockMenu";

import {
  mockStoreEvents,
  simulateMockNetwork,
} from "@/src/data/mock/mockStore";

export class MockMenuRepository implements MenuRepository {
  async getCategories(): Promise<MenuCategory[]> {
    await simulateMockNetwork();

    return [...mockCategoriesData].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getCategoryById(id: string): Promise<MenuCategory> {
    await simulateMockNetwork();

    const category = mockCategoriesData.find((item) => item.id === id);

    if (!category) {
      throw new Error("Không tìm thấy danh mục.");
    }

    return { ...category };
  }

  async createCategory(input: CreateCategoryInput): Promise<MenuCategory> {
    await simulateMockNetwork();

    const created: MenuCategory = {
      id: `cat-${Date.now()}`,
      code: input.name.trim().toUpperCase().replace(/\s+/g, "_"),
      name: input.name.trim(),
      description: input.description?.trim(),
      sortOrder: input.sortOrder ?? mockCategoriesData.length + 1,
      isActive: input.isActive ?? true,
      itemCount: 0,
    };

    mockCategoriesData.push(created);
    mockStoreEvents.emit();

    return { ...created };
  }

  async updateCategory(
    id: string,
    input: UpdateCategoryInput,
  ): Promise<MenuCategory> {
    await simulateMockNetwork();

    const target = mockCategoriesData.find((category) => category.id === id);

    if (!target) {
      throw new Error("Không tìm thấy danh mục cần cập nhật.");
    }

    if (input.name !== undefined) {
      target.name = input.name.trim();
    }

    if (input.description !== undefined) {
      target.description = input.description.trim();
    }

    if (input.sortOrder !== undefined) {
      target.sortOrder = input.sortOrder;
    }

    if (input.isActive !== undefined) {
      target.isActive = input.isActive;
    }

    mockStoreEvents.emit();

    return { ...target };
  }

  async deleteCategory(id: string): Promise<void> {
    await simulateMockNetwork();

    const hasItems = mockMenuItemsData.some((item) => item.categoryId === id);

    if (hasItems) {
      throw new Error(
        "Không thể xóa danh mục đang chứa món ăn. Hãy chuyển món sang danh mục khác trước.",
      );
    }

    const index = mockCategoriesData.findIndex(
      (category) => category.id === id,
    );

    if (index === -1) {
      throw new Error("Danh mục không tồn tại.");
    }

    mockCategoriesData.splice(index, 1);
    mockStoreEvents.emit();
  }

  async getMenuItems(params?: MenuFilterParams): Promise<MenuItem[]> {
    await simulateMockNetwork();

    const search = params?.search?.trim().toLowerCase() ?? "";
    const categoryId = params?.categoryId;
    const status = params?.status;

    return mockMenuItemsData
      .filter((item) => {
        const matchSearch =
          !search ||
          item.name.toLowerCase().includes(search) ||
          item.sku.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search);

        const matchCategory =
          !categoryId || categoryId === "ALL" || item.categoryId === categoryId;

        const matchStatus =
          !status || status === "ALL" || item.status === status;

        return matchSearch && matchCategory && matchStatus;
      })
      .map((item) => ({ ...item }));
  }

  async getMenuItemById(id: string): Promise<MenuItem> {
    await simulateMockNetwork();

    const item = mockMenuItemsData.find((menuItem) => menuItem.id === id);

    if (!item) {
      throw new Error("Không tìm thấy món ăn.");
    }

    return { ...item };
  }

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
    await simulateMockNetwork();

    const created: MenuItem = {
      id: `menu-${Date.now()}`,
      sku: input.sku.trim().toUpperCase(),
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      categoryId: input.categoryId,
      station: input.station,
      imageUrl: input.imageUrl,
      status: input.status,
      prepTimeMinutes: input.prepTimeMinutes,
      modifiers: input.modifiers ?? [],
      linkedIngredientIds: input.linkedIngredientIds ?? [],
      isBestseller: false,
      updatedAt: new Date().toISOString(),
    };

    mockMenuItemsData.unshift(created);
    mockStoreEvents.emit();

    return { ...created };
  }

  async updateMenuItem(
    id: string,
    input: UpdateMenuItemInput,
  ): Promise<MenuItem> {
    await simulateMockNetwork();

    const target = mockMenuItemsData.find((item) => item.id === id);

    if (!target) {
      throw new Error("Không tìm thấy món ăn để cập nhật.");
    }

    if (input.sku !== undefined) {
      target.sku = input.sku.trim().toUpperCase();
    }

    if (input.name !== undefined) {
      target.name = input.name.trim();
    }

    if (input.description !== undefined) {
      target.description = input.description.trim();
    }

    if (input.price !== undefined) {
      target.price = input.price;
    }

    if (input.categoryId !== undefined) {
      target.categoryId = input.categoryId;
    }

    if (input.station !== undefined) {
      target.station = input.station;
    }

    if (input.imageUrl !== undefined) {
      target.imageUrl = input.imageUrl;
    }

    if (input.status !== undefined) {
      target.status = input.status;
    }

    if (input.prepTimeMinutes !== undefined) {
      target.prepTimeMinutes = input.prepTimeMinutes;
    }

    if (input.modifiers !== undefined) {
      target.modifiers = input.modifiers;
    }

    if (input.linkedIngredientIds !== undefined) {
      target.linkedIngredientIds = input.linkedIngredientIds;
    }

    target.updatedAt = new Date().toISOString();
    mockStoreEvents.emit();

    return { ...target };
  }

  async deleteMenuItem(id: string): Promise<void> {
    await simulateMockNetwork();

    const index = mockMenuItemsData.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Không tìm thấy món ăn cần xóa.");
    }

    mockMenuItemsData.splice(index, 1);
    mockStoreEvents.emit();
  }

  async toggleMenuItemStatus(
    id: string,
    nextStatus: DishStatus,
  ): Promise<MenuItem> {
    return this.updateMenuItem(id, {
      status: nextStatus,
    });
  }

  async uploadMenuItemImage(
    id: string,
    file: UploadMenuImageInput,
  ): Promise<MenuItem> {
    return this.updateMenuItem(id, {
      imageUrl: file.uri,
    });
  }

  async deleteMenuItemImage(id: string): Promise<void> {
    await this.updateMenuItem(id, {
      imageUrl: "",
    });
  }
}
