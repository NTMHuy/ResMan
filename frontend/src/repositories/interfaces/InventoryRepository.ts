import type {
  CreateIngredientInput,
  Ingredient,
  InventoryCount,
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
  countStock(input: StockOperationInput): Promise<Ingredient>;
  getMovements(ingredientId?: string): Promise<StockMovement[]>;
  getCounts(ingredientId?: string): Promise<InventoryCount[]>;
}
