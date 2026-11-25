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

import { apiClient } from "@/src/services/api/apiClient";

/**
 * Backend có thể trả về:
 * - Dữ liệu trực tiếp
 * - { data: ... }
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
 * Backend/PostgreSQL:
 * AVAILABLE
 * MANUAL_UNAVAILABLE
 *
 * isActive được quản lý riêng.
 */
function toBackendStatus(status: DishStatus) {
  switch (status) {
    case "AVAILABLE":
      return {
        isActive: true,
        availabilityStatus: "AVAILABLE",
        availabilityReason: null,
      };

    case "OUT_OF_STOCK":
      return {
        isActive: true,
        availabilityStatus: "MANUAL_UNAVAILABLE",
        availabilityReason: "Hết món",
      };

    case "INACTIVE":
      return {
        isActive: false,
        availabilityStatus: "MANUAL_UNAVAILABLE",
        availabilityReason: "Ngừng kinh doanh",
      };

    default:
      return {
        isActive: true,
        availabilityStatus: "AVAILABLE",
        availabilityReason: null,
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
  } else if (item.availabilityStatus === "MANUAL_UNAVAILABLE") {
    const reason = String(item.availabilityReason ?? "").toLowerCase();

    status =
      reason.includes("hết món") || reason.includes("hết hàng")
        ? "OUT_OF_STOCK"
        : "INACTIVE";
  }

  return {
    ...item,

    id: String(item.id ?? ""),
    categoryId: String(item.categoryId ?? ""),

    sku: String(item.sku ?? item.code ?? ""),
    name: String(item.name ?? ""),
    description: String(item.description ?? ""),
    price: Number(item.price ?? 0),

    station: item.station ?? "HOT_KITCHEN",
    prepTimeMinutes: Number(item.prepTimeMinutes ?? 10),
    modifiers: Array.isArray(item.modifiers) ? item.modifiers : [],
    linkedIngredientIds: Array.isArray(item.linkedIngredientIds)
      ? item.linkedIngredientIds
      : [],

    imageUrl: String(item.imageUrl ?? ""),

    status,

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

  // =====================================================
  // MENU ITEM IMAGE
  // =====================================================

  async uploadMenuItemImage(
    id: string,
    file: UploadMenuImageInput,
  ): Promise<MenuItem> {
    const formData = new FormData();

    if (file.file) {
      formData.append("file", file.file, file.name);
    } else {
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as unknown as Blob);
    }

    const response = await apiClient.post(`/menu-items/${id}/image`, formData, {
      headers: { "Content-Type": undefined },
    });

    return mapMenuItem(unwrapData<any>(response.data));
  }

  async deleteMenuItemImage(id: string): Promise<void> {
    await apiClient.delete(`/menu-items/${id}/image`);
  }
}
