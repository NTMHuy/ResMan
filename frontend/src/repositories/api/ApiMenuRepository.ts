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
} from "@/src/features/menu/types/menu.types";

import { apiClient } from "@/src/services/api/apiClient";

/**
 * Backend có thể trả về:
 * - Dữ liệu trực tiếp
 * - { data: ... }
 *
 * Hàm này hỗ trợ cả hai trường hợp.
 */
function unwrapData<T>(responseData: unknown): T {
  if (
    responseData !== null &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as { data: T }).data;
  }

  return responseData as T;
}

/**
 * Chuyển trạng thái Frontend sang Backend.
 *
 * Frontend:
 * AVAILABLE
 * OUT_OF_STOCK
 * INACTIVE
 *
 * Backend:
 * AVAILABLE
 * SOLD_OUT
 * UNAVAILABLE
 */
function toBackendStatus(status: DishStatus) {
  switch (status) {
    case "AVAILABLE":
      return {
        isActive: true,
        availabilityStatus: "AVAILABLE",
      };

    case "OUT_OF_STOCK":
      return {
        isActive: true,
        availabilityStatus: "SOLD_OUT",
      };

    case "INACTIVE":
      return {
        isActive: false,
        availabilityStatus: "UNAVAILABLE",
      };

    default:
      return {
        isActive: true,
        availabilityStatus: "AVAILABLE",
      };
  }
}

/**
 * Chuyển dữ liệu món ăn từ Backend sang Frontend.
 */
function mapMenuItem(item: any): MenuItem {
  let status: DishStatus = "AVAILABLE";

  if (item.isActive === false) {
    status = "INACTIVE";
  } else if (
    item.availabilityStatus === "SOLD_OUT" ||
    item.availabilityStatus === "OUT_OF_STOCK"
  ) {
    status = "OUT_OF_STOCK";
  } else if (item.availabilityStatus === "UNAVAILABLE") {
    status = "INACTIVE";
  }

  return {
    ...item,

    // ID
    id: String(item.id ?? ""),
    categoryId: String(item.categoryId ?? ""),

    // Thông tin món ăn
    sku: String(item.sku ?? item.code ?? ""),
    name: String(item.name ?? ""),
    description: String(item.description ?? ""),
    price: Number(item.price ?? 0),

    // Các trường Backend chưa quản lý
    station: item.station ?? "HOT_KITCHEN",
    prepTimeMinutes: Number(item.prepTimeMinutes ?? 10),
    modifiers: Array.isArray(item.modifiers) ? item.modifiers : [],
    linkedIngredientIds: Array.isArray(item.linkedIngredientIds)
      ? item.linkedIngredientIds
      : [],

    // Hình ảnh
    imageUrl: String(item.imageUrl ?? ""),

    // Trạng thái
    status,

    // Thông tin bổ sung
    isBestseller: Boolean(item.isBestseller ?? false),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  } as MenuItem;
}
/**
 * Chuyển dữ liệu danh mục từ Backend sang Frontend.
 */
function mapCategory(category: any): MenuCategory {
  return {
    ...category,
    id: String(category.id),
  } as MenuCategory;
}

/**
 * Chuyển ID danh mục từ string sang number.
 * Backend Prisma sử dụng ID dạng số.
 */
function toCategoryId(categoryId: string | number): number {
  const id = Number(categoryId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error(`Category ID không hợp lệ: ${categoryId}`);
  }

  return id;
}

/**
 * Chuyển dữ liệu tạo/cập nhật món ăn sang DTO Backend.
 * Không gửi các trường chỉ phục vụ giao diện Frontend.
 */
function toBackendMenuItemPayload(
  input: CreateMenuItemInput | UpdateMenuItemInput,
): Record<string, unknown> {
  const source = input as Record<string, unknown>;

  const payload: Record<string, unknown> = {};

  if (source.sku !== undefined || source.code !== undefined) {
    payload.code = source.code ?? source.sku;
  }

  if (source.name !== undefined) {
    payload.name = source.name;
  }

  if (source.categoryId !== undefined) {
    payload.categoryId = toCategoryId(source.categoryId as string | number);
  }

  if (source.price !== undefined) {
    payload.price = Number(source.price);
  }

  if (source.description !== undefined) {
    payload.description = source.description;
  }

  return payload;
}

export class ApiMenuRepository implements MenuRepository {
  // =====================================================
  // CATEGORY MANAGEMENT
  // =====================================================

  async getCategories(): Promise<MenuCategory[]> {
    const response = await apiClient.get("/menu-categories");

    const categories = unwrapData<any[]>(response.data);

    return (categories ?? []).map(mapCategory);
  }

  async createCategory(input: CreateCategoryInput): Promise<MenuCategory> {
    const response = await apiClient.post("/menu-categories", input);

    return mapCategory(unwrapData<any>(response.data));
  }

  async updateCategory(
    id: string,
    input: UpdateCategoryInput,
  ): Promise<MenuCategory> {
    const response = await apiClient.patch(`/menu-categories/${id}`, input);

    return mapCategory(unwrapData<any>(response.data));
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/menu-categories/${id}`);
  }

  // =====================================================
  // MENU ITEM MANAGEMENT
  // =====================================================

  async getMenuItems(params?: MenuFilterParams): Promise<MenuItem[]> {
    const response = await apiClient.get("/menu-items", {
      params,
    });

    /**
     * Backend trả về:
     * {
     *   data: [...],
     *   pagination: {...}
     * }
     *
     * unwrapData sẽ lấy mảng data.
     */
    const items = unwrapData<any[]>(response.data);

    return (items ?? []).map(mapMenuItem);
  }

  async getMenuItemById(id: string): Promise<MenuItem> {
    const response = await apiClient.get(`/menu-items/${id}`);

    return mapMenuItem(unwrapData<any>(response.data));
  }

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
    const payload = toBackendMenuItemPayload(input);

    const response = await apiClient.post("/menu-items", payload);

    return mapMenuItem(unwrapData<any>(response.data));
  }

  async updateMenuItem(
    id: string,
    input: UpdateMenuItemInput,
  ): Promise<MenuItem> {
    const payload = toBackendMenuItemPayload(input);

    const response = await apiClient.patch(`/menu-items/${id}`, payload);

    return mapMenuItem(unwrapData<any>(response.data));
  }

  async deleteMenuItem(id: string): Promise<void> {
    await apiClient.delete(`/menu-items/${id}`);
  }

  // =====================================================
  // TOGGLE MENU ITEM STATUS
  // =====================================================

  async toggleMenuItemStatus(
    id: string,
    nextStatus: DishStatus,
  ): Promise<MenuItem> {
    const payload = toBackendStatus(nextStatus);

    const response = await apiClient.patch(`/menu-items/${id}/status`, payload);

    return mapMenuItem(unwrapData<any>(response.data));
  }
}
