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

type ApiIngredient = {
  id: string;
  code: string;
  name: string;
  category: string | null;
  unit: string;
  lowStockThreshold: string | null;
  note: string | null;
  isActive: boolean;
  quantityOnHand: string;
  isLowStock: boolean;
  updatedAt: string;
};

type ApiMovement = {
  id: string;
  ingredient: { id: string; code: string; name: string; unit: string };
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantityDelta: string;
  reason: string;
  referenceCode: string | null;
  createdAt: string;
  actor: { id: string; username: string; fullName: string | null };
};

function unwrap<T>(value: ApiResponse<T> | T): T {
  return value && typeof value === 'object' && 'data' in value
    ? (value as ApiResponse<T>).data
    : (value as T);
}

function toIngredient(source: ApiIngredient): Ingredient {
  const currentStock = Number(source.quantityOnHand);
  const minThreshold = source.lowStockThreshold === null ? 0 : Number(source.lowStockThreshold);
  const zone = source.category === 'HOT_KITCHEN_COLD' || source.category === 'BAR_PANTRY'
    ? source.category
    : 'MAIN_COOLER';
  return {
    id: String(source.id),
    sku: source.code,
    name: source.name,
    description: source.note ?? '',
    zone,
    unit: source.unit,
    currentStock,
    minThreshold,
    costPerUnit: 0,
    status: source.isLowStock ? 'LOW_STOCK' : 'IN_STOCK',
    supplier: '',
    updatedAt: source.updatedAt,
  };
}

export class ApiInventoryRepository implements InventoryRepository {
  async getIngredients(params?: InventoryFilterParams): Promise<Ingredient[]> {
    const response = await apiClient.get<ApiResponse<ApiIngredient[]> | ApiIngredient[]>(
      '/inventory/ingredients',
      { params: { search: params?.search } },
    );
    let ingredients = unwrap(response.data).map(toIngredient);
    if (params?.status && params.status !== 'ALL') {
      ingredients = ingredients.filter((item) => item.status === params.status);
    }
    if (params?.zone && params.zone !== 'ALL') {
      ingredients = ingredients.filter((item) => item.zone === params.zone);
    }
    return ingredients;
  }

  async createIngredient(input: CreateIngredientInput): Promise<Ingredient> {
    const response = await apiClient.post<ApiResponse<ApiIngredient> | ApiIngredient>(
      '/inventory/ingredients',
      {
        code: input.sku,
        name: input.name,
        category: input.zone,
        unit: input.unit,
        lowStockThreshold: String(input.minThreshold),
        note: input.description || null,
      },
    );
    const created = unwrap(response.data);
    if (input.currentStock > 0) {
      await apiClient.post(
        `/inventory/ingredients/${created.id}/stock-in`,
        { quantity: String(input.currentStock), reason: 'Tồn đầu kỳ khi tạo nguyên liệu' },
      );
    }
    const refreshed = await apiClient.get<ApiResponse<ApiIngredient[]> | ApiIngredient[]>(
      '/inventory/ingredients',
      { params: { search: input.sku } },
    );
    const found = unwrap(refreshed.data).find((item) => item.id === created.id);
    return toIngredient(found ?? {
      id: created.id, code: created.code, name: created.name, category: input.zone,
      unit: created.unit, lowStockThreshold: String(input.minThreshold), note: input.description,
      isActive: true, quantityOnHand: String(input.currentStock), isLowStock: false,
      updatedAt: new Date().toISOString(),
    });
  }

  async updateIngredient(id: string, input: UpdateIngredientInput): Promise<Ingredient> {
    await apiClient.patch(`/inventory/ingredients/${id}`, {
      name: input.name,
      category: input.zone,
      unit: input.unit,
      lowStockThreshold: input.minThreshold === undefined ? undefined : String(input.minThreshold),
      note: input.description,
    });
    const response = await apiClient.get<ApiResponse<ApiIngredient[]> | ApiIngredient[]>(
      '/inventory/ingredients',
    );
    const updated = unwrap(response.data).find((item) => item.id === id);
    if (!updated) throw new Error('Không tìm thấy nguyên liệu sau khi cập nhật.');
    return toIngredient(updated);
  }

  async stockIn(input: StockOperationInput): Promise<Ingredient> {
    await apiClient.post(`/inventory/ingredients/${input.ingredientId}/stock-in`, {
      quantity: String(input.quantity),
      reason: input.reason,
    });
    return this.getIngredient(input.ingredientId);
  }

  async adjustStock(input: StockOperationInput): Promise<Ingredient> {
    await apiClient.post(`/inventory/ingredients/${input.ingredientId}/count`, {
      actualQuantity: String(input.quantity),
      note: input.reason,
    });
    return this.getIngredient(input.ingredientId);
  }

  async auditStock(input: StockOperationInput): Promise<Ingredient> {
    return this.adjustStock(input);
  }

  private async getIngredient(id: string): Promise<Ingredient> {
    const response = await apiClient.get<ApiResponse<ApiIngredient[]> | ApiIngredient[]>(
      '/inventory/ingredients',
    );
    const ingredient = unwrap(response.data).find((item) => item.id === id);
    if (!ingredient) throw new Error('Không tìm thấy nguyên liệu.');
    return toIngredient(ingredient);
  }

  async getMovements(ingredientId?: string): Promise<StockMovement[]> {
    const [movementResponse, ingredientResponse] = await Promise.all([
      apiClient.get<ApiResponse<ApiMovement[]> | ApiMovement[]>('/inventory/movements', {
        params: ingredientId ? { ingredientId } : undefined,
      }),
      apiClient.get<ApiResponse<ApiIngredient[]> | ApiIngredient[]>('/inventory/ingredients'),
    ]);
    const movements = unwrap(movementResponse.data);
    const ingredients = unwrap(ingredientResponse.data);
    const balances = new Map(ingredients.map((item) => [item.id, Number(item.quantityOnHand)]));
    const calculated = movements.map((movement) => {
      const delta = Number(movement.quantityDelta);
      const current = balances.get(movement.ingredient.id) ?? 0;
      const previous = current - delta;
      balances.set(movement.ingredient.id, previous);
      return {
        id: movement.id,
        ingredientId: movement.ingredient.id,
        ingredientSku: movement.ingredient.code,
        ingredientName: movement.ingredient.name,
        type: movement.movementType === 'IN' ? 'IMPORT' : movement.movementType === 'OUT' ? 'EXPORT' : 'ADJUST',
        quantityDelta: delta,
        previousStock: previous,
        newStock: current,
        unit: movement.ingredient.unit,
        reason: movement.reason,
        actorName: movement.actor.fullName || movement.actor.username,
        createdAt: movement.createdAt,
      } satisfies StockMovement;
    });
    return calculated;
  }
}
