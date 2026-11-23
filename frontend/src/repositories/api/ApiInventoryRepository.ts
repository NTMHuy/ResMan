import type { InventoryRepository } from '@/src/repositories/interfaces/InventoryRepository';
import type {
  CreateIngredientInput,
  Ingredient,
  InventoryFilterParams,
  StockMovement,
  StockOperationInput,
  UpdateIngredientInput,
} from '@/src/features/inventory/types/inventory.types';
import type { ApiResponse } from '@/src/types/common';
import { apiClient } from '@/src/services/api/apiClient';

export class ApiInventoryRepository implements InventoryRepository {
  async getIngredients(params?: InventoryFilterParams): Promise<Ingredient[]> {
    const { data } = await apiClient.get<ApiResponse<Ingredient[]>>('/inventory/ingredients', {
      params,
    });
    return data.data;
  }

  async createIngredient(input: CreateIngredientInput): Promise<Ingredient> {
    const { data } = await apiClient.post<ApiResponse<Ingredient>>('/inventory/ingredients', input);
    return data.data;
  }

  async updateIngredient(id: string, input: UpdateIngredientInput): Promise<Ingredient> {
    const { data } = await apiClient.patch<ApiResponse<Ingredient>>(
      `/inventory/ingredients/${id}`,
      input
    );
    return data.data;
  }

  async stockIn(input: StockOperationInput): Promise<Ingredient> {
    const { data } = await apiClient.post<ApiResponse<Ingredient>>('/inventory/stock-in', input);
    return data.data;
  }

  async adjustStock(input: StockOperationInput): Promise<Ingredient> {
    const { data } = await apiClient.post<ApiResponse<Ingredient>>('/inventory/adjust', input);
    return data.data;
  }

  async auditStock(input: StockOperationInput): Promise<Ingredient> {
    const { data } = await apiClient.post<ApiResponse<Ingredient>>('/inventory/audit', input);
    return data.data;
  }

  async getMovements(ingredientId?: string): Promise<StockMovement[]> {
    const { data } = await apiClient.get<ApiResponse<StockMovement[]>>('/inventory/movements', {
      params: ingredientId ? { ingredientId } : undefined,
    });
    return data.data;
  }
}
