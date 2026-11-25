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
import { resolveMenuImageUrl } from "@/src/constants/config";

function unwrapData<T>(value: unknown): T {
  if (value !== null && typeof value === "object" && "data" in value) {
    return (value as { data: T }).data;
  }
  return value as T;
}

function toBackendStatus(status: DishStatus) {
  if (status === "AVAILABLE") {
    return { isActive: true, availabilityStatus: "AVAILABLE", availabilityReason: null };
  }
  if (status === "OUT_OF_STOCK") {
    return { isActive: true, availabilityStatus: "MANUAL_UNAVAILABLE", availabilityReason: "Hết món" };
  }
  return { isActive: false, availabilityStatus: "MANUAL_UNAVAILABLE", availabilityReason: "Ngừng kinh doanh" };
}

function mapMenuItem(item: any): MenuItem {
  let status: DishStatus = "AVAILABLE";
  if (item.isActive === false) status = "INACTIVE";
  else if (item.availabilityStatus === "MANUAL_UNAVAILABLE" || item.availabilityStatus === "UNAVAILABLE") {
    const reason = String(item.availabilityReason ?? "").toLocaleLowerCase("vi");
    status = reason.includes("hết món") || reason.includes("hết hàng") ? "OUT_OF_STOCK" : "INACTIVE";
  }

  return {
    id: String(item.id ?? ""),
    categoryId: String(item.categoryId ?? ""),
    sku: String(item.code ?? item.sku ?? ""),
    name: String(item.name ?? ""),
    description: String(item.description ?? ""),
    price: item.price === null || item.price === undefined ? 0 : Number(item.price),
    pricingType: item.pricingType ?? (item.price == null ? "UNSET" : "FIXED"),
    priceUnit: item.priceUnit ?? null,
    station: item.station ?? "HOT_KITCHEN",
    prepTimeMinutes: Number(item.prepTimeMinutes ?? 10),
    modifiers: Array.isArray(item.modifiers) ? item.modifiers : [],
    linkedIngredientIds: Array.isArray(item.linkedIngredientIds) ? item.linkedIngredientIds : [],
    imageUrl: resolveMenuImageUrl(item.imageUrl),
    status,
    isBestseller: Boolean(item.isBestseller ?? false),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  };
}

function mapCategory(category: any): MenuCategory {
  return {
    id: String(category.id),
    code: category.code,
    name: category.name,
    description: category.description ?? "",
    sortOrder: Number(category.sortOrder ?? 0),
    isActive: category.isActive ?? true,
    itemCount: category.itemCount,
  };
}

function toCategoryId(categoryId: string | number): number {
  const id = Number(categoryId);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error(`Category ID không hợp lệ: ${categoryId}`);
  return id;
}

function makeCategoryCode(name: string): string {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "D").toUpperCase().replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "").slice(0, 40);
}

function toCategoryPayload(input: CreateCategoryInput | UpdateCategoryInput, generateCode = false) {
  const payload: Record<string, unknown> = {};
  if (input.name !== undefined) payload.name = input.name.trim();
  if (input.code !== undefined) payload.code = input.code.trim().toUpperCase();
  else if (generateCode && input.name) payload.code = makeCategoryCode(input.name);
  if (input.description !== undefined) payload.description = input.description;
  if (input.isActive !== undefined) payload.isActive = input.isActive;
  return payload;
}

function toBackendMenuItemPayload(input: CreateMenuItemInput | UpdateMenuItemInput): Record<string, unknown> {
  const source = input as Record<string, unknown>;
  const payload: Record<string, unknown> = {};
  if (source.sku !== undefined) payload.code = source.sku;
  if (source.name !== undefined) payload.name = source.name;
  if (source.categoryId !== undefined) payload.categoryId = toCategoryId(source.categoryId as string | number);
  if (source.description !== undefined) payload.description = source.description;
  if (source.pricingType !== undefined) payload.pricingType = source.pricingType;
  if (source.priceUnit !== undefined) payload.priceUnit = source.priceUnit;
  if (source.price !== undefined) payload.price = source.price;
  if (source.pricingType === "MARKET_PRICE" || source.pricingType === "UNSET") {
    payload.price = null;
    payload.priceUnit = null;
  }
  if (source.status !== undefined) Object.assign(payload, toBackendStatus(source.status as DishStatus));
  if (source.imageUrl !== undefined) payload.imageUrl = source.imageUrl || null;
  return payload;
}

export class ApiMenuRepository implements MenuRepository {
  async getCategories(): Promise<MenuCategory[]> {
    const response = await apiClient.get("/menu-categories");
    const result = unwrapData<any>(response.data);
    return (Array.isArray(result) ? result : []).map(mapCategory);
  }

  async getCategoryById(id: string): Promise<MenuCategory> {
    const response = await apiClient.get(`/menu-categories/${id}`);
    return mapCategory(unwrapData<any>(response.data));
  }

  async createCategory(input: CreateCategoryInput): Promise<MenuCategory> {
    const response = await apiClient.post("/menu-categories", toCategoryPayload(input));
    return mapCategory(unwrapData<any>(response.data));
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<MenuCategory> {
    const response = await apiClient.patch(`/menu-categories/${id}`, toCategoryPayload(input));
    return mapCategory(unwrapData<any>(response.data));
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/menu-categories/${id}`);
  }

  async getMenuItems(params?: MenuFilterParams): Promise<MenuItem[]> {
    const query: Record<string, unknown> = {};
    if (params?.search) query.search = params.search;
    if (params?.categoryId && params.categoryId !== "ALL") query.categoryId = toCategoryId(params.categoryId);
    if (params?.status === "AVAILABLE") query.status = "AVAILABLE";
    if (params?.status === "OUT_OF_STOCK") query.status = "MANUAL_UNAVAILABLE";
    if (params?.status === "INACTIVE") query.isActive = false;

    const response = await apiClient.get("/menu-items", { params: { ...query, page: 1, limit: 1000 } });
    const result = unwrapData<any>(response.data);
    const items = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
    return items.map(mapMenuItem);
  }

  async getMenuItemById(id: string): Promise<MenuItem> {
    const response = await apiClient.get(`/menu-items/${id}`);
    return mapMenuItem(unwrapData<any>(response.data));
  }

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
    const response = await apiClient.post("/menu-items", toBackendMenuItemPayload(input));
    return mapMenuItem(unwrapData<any>(response.data));
  }

  async updateMenuItem(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
    const response = await apiClient.patch(`/menu-items/${id}`, toBackendMenuItemPayload(input));
    return mapMenuItem(unwrapData<any>(response.data));
  }

  async deleteMenuItem(id: string): Promise<void> {
    await apiClient.delete(`/menu-items/${id}`);
  }

  async toggleMenuItemStatus(id: string, nextStatus: DishStatus): Promise<MenuItem> {
    const response = await apiClient.patch(`/menu-items/${id}/status`, toBackendStatus(nextStatus));
    return mapMenuItem(unwrapData<any>(response.data));
  }

  async uploadMenuItemImage(id: string, file: UploadMenuImageInput): Promise<MenuItem> {
    const formData = new FormData();
    if (file.file) formData.append("file", file.file, file.name);
    else formData.append("file", { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);

    const response = await apiClient.post(`/menu-items/${id}/image`, formData, {
      headers: { "Content-Type": undefined },
    });
    return mapMenuItem(unwrapData<any>(response.data));
  }

  async deleteMenuItemImage(id: string): Promise<void> {
    await apiClient.delete(`/menu-items/${id}/image`);
  }
}
