import type { MenuRepository } from '@/src/repositories/interfaces/MenuRepository';
import type {
  CreateCategoryInput,
  CreateMenuItemInput,
  DishStatus,
  MenuCategory,
  MenuFilterParams,
  MenuItem,
  UpdateCategoryInput,
  UpdateMenuItemInput,
} from '@/src/features/menu/types/menu.types';
import type { ApiResponse } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';

export class ApiMenuRepository implements MenuRepository {
  async getCategories(): Promise<MenuCategory[]> {
    const { data } = await apiClient.get<ApiResponse<MenuCategory[]>>('/menu/categories');
    return data.data;
  }

  async createCategory(input: CreateCategoryInput): Promise<MenuCategory> {
    const { data } = await apiClient.post<ApiResponse<MenuCategory>>('/menu/categories', input);
    return data.data;
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<MenuCategory> {
    const { data } = await apiClient.patch<ApiResponse<MenuCategory>>(`/menu/categories/${id}`, input);
    return data.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/menu/categories/${id}`);
  }

  async getMenuItems(params?: MenuFilterParams): Promise<MenuItem[]> {
    const { data } = await apiClient.get<ApiResponse<MenuItem[]>>('/menu/items', { params });
    return data.data;
  }

  async getMenuItemById(id: string): Promise<MenuItem> {
    const { data } = await apiClient.get<ApiResponse<MenuItem>>(`/menu/items/${id}`);
    return data.data;
  }

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
    const { data } = await apiClient.post<ApiResponse<MenuItem>>('/menu/items', input);
    return data.data;
  }

  async updateMenuItem(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
    const { data } = await apiClient.patch<ApiResponse<MenuItem>>(`/menu/items/${id}`, input);
    return data.data;
  }

  async deleteMenuItem(id: string): Promise<void> {
    await apiClient.delete(`/menu/items/${id}`);
  }

  async toggleMenuItemStatus(id: string, nextStatus: DishStatus): Promise<MenuItem> {
    const { data } = await apiClient.patch<ApiResponse<MenuItem>>(`/menu/items/${id}/status`, {
      status: nextStatus,
    });
    return data.data;
  }
}
