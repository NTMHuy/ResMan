import type {
  CreateIngredientInput,
  Ingredient,
  InventoryFilterParams,
  StockMovement,
  StockOperationInput,
  UpdateIngredientInput,
} from '@/src/features/inventory/types/inventory.types';

export interface InventoryRepository {
  getIngredients(params?: InventoryFilterParams): Promise<Ingredient[]>;
  createIngredient(input: CreateIngredientInput): Promise<Ingredient>;
  updateIngredient(id: string, input: UpdateIngredientInput): Promise<Ingredient>;
  stockIn(input: StockOperationInput): Promise<Ingredient>;
  adjustStock(input: StockOperationInput): Promise<Ingredient>;
  auditStock(input: StockOperationInput): Promise<Ingredient>;
  getMovements(ingredientId?: string): Promise<StockMovement[]>;
}
