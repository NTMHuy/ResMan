export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export type StorageZone = 'HOT_KITCHEN_COLD' | 'MAIN_COOLER' | 'BAR_PANTRY';

export type StockMovementType = 'IMPORT' | 'EXPORT' | 'ADJUST' | 'AUDIT';

export interface Ingredient {
  id: string;
  sku: string;
  name: string;
  description: string;
  zone: StorageZone;
  unit: string;
  currentStock: number;
  minThreshold: number;
  status: StockStatus;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  ingredientId: string;
  ingredientSku: string;
  ingredientName: string;
  type: StockMovementType;
  quantityDelta: number;
  previousStock: number;
  newStock: number;
  unit: string;
  reason: string;
  actorName: string;
  createdAt: string;
}

export interface CreateIngredientInput {
  sku: string;
  name: string;
  description: string;
  zone: StorageZone;
  unit: string;
  currentStock: number;
  minThreshold: number;
}

export interface UpdateIngredientInput {
  name?: string;
  description?: string;
  zone?: StorageZone;
  unit?: string;
  minThreshold?: number;
  costPerUnit?: number;
  supplier?: string;
}

export interface StockOperationInput {
  ingredientId: string;
  quantity: number;
  reason: string;
  actorName: string;
}

export interface InventoryFilterParams {
  search?: string;
  status?: StockStatus | 'ALL';
  zone?: StorageZone | 'ALL';
}
