import type { KitchenStation } from '@/src/types/common';

export type DishStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'INACTIVE';

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
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
  price: number;
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
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateMenuItemInput {
  sku: string;
  name: string;
  description: string;
  price: number;
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
  price?: number;
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
  status?: DishStatus | 'ALL';
}
