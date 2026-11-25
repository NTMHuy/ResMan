import type { KitchenStation } from "@/src/types/common";

export type DishStatus = "AVAILABLE" | "OUT_OF_STOCK" | "INACTIVE";
export type MenuPricingType = "FIXED" | "PER_UNIT" | "MARKET_PRICE" | "UNSET";

export interface MenuCategory {
  id: string;
  code?: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  itemCount?: number;
}

export interface DishModifierOption {
  id: string;
  label: string;
  extraPrice: number;
}

export interface MenuItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  /** Customer cart uses zero for non-orderable MARKET_PRICE/UNSET items. */
  price: number;
  pricingType?: MenuPricingType;
  priceUnit?: string | null;
  categoryId: string;
  station: KitchenStation;
  imageUrl: string;
  status: DishStatus;
  modifiers: DishModifierOption[];
  linkedIngredientIds: string[];
  prepTimeMinutes: number;
  isBestseller?: boolean;
  updatedAt: string;
}

export interface CreateCategoryInput {
  code?: string;
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  code?: string;
  name?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateMenuItemInput {
  sku: string;
  name: string;
  description: string;
  price?: number | null;
  pricingType?: MenuPricingType;
  priceUnit?: string | null;
  categoryId: string;
  station: KitchenStation;
  imageUrl: string;
  status: DishStatus;
  prepTimeMinutes: number;
  modifiers?: DishModifierOption[];
  linkedIngredientIds?: string[];
}

export interface UpdateMenuItemInput {
  sku?: string;
  name?: string;
  description?: string;
  price?: number | null;
  pricingType?: MenuPricingType;
  priceUnit?: string | null;
  categoryId?: string;
  station?: KitchenStation;
  imageUrl?: string;
  status?: DishStatus;
  prepTimeMinutes?: number;
  modifiers?: DishModifierOption[];
  linkedIngredientIds?: string[];
}

export interface MenuFilterParams {
  search?: string;
  categoryId?: string;
  status?: DishStatus | "ALL";
}

export interface MenuPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MenuItemsPage {
  data: MenuItem[];
  pagination: MenuPagination;
}

export interface BackendMenuCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendMenuItem {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  description: string | null;
  price: string | number | null;
  pricingType: MenuPricingType;
  priceUnit: string | null;
  imageUrl: string | null;
  availabilityStatus: "AVAILABLE" | "MANUAL_UNAVAILABLE" | string;
  availabilityReason?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: BackendMenuCategory;
}

export interface BackendMenuItemsResponse {
  data: BackendMenuItem[];
  pagination: MenuPagination;
}

export interface UploadMenuImageInput {
  uri: string;
  name: string;
  type: string;
  size?: number;
  file?: Blob;
}
