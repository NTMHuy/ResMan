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

export interface MenuRepository {
  getCategories(): Promise<MenuCategory[]>;
  getCategoryById(id: string): Promise<MenuCategory>;
  createCategory(input: CreateCategoryInput): Promise<MenuCategory>;
  updateCategory(id: string, input: UpdateCategoryInput): Promise<MenuCategory>;
  deleteCategory(id: string): Promise<void>;

  getMenuItems(params?: MenuFilterParams): Promise<MenuItem[]>;
  getMenuItemById(id: string): Promise<MenuItem>;
  createMenuItem(input: CreateMenuItemInput): Promise<MenuItem>;
  updateMenuItem(id: string, input: UpdateMenuItemInput): Promise<MenuItem>;
  deleteMenuItem(id: string): Promise<void>;
  toggleMenuItemStatus(id: string, nextStatus: DishStatus): Promise<MenuItem>;

  uploadMenuItemImage(
    id: string,
    file: UploadMenuImageInput,
  ): Promise<MenuItem>;
  deleteMenuItemImage(id: string): Promise<void>;
}
