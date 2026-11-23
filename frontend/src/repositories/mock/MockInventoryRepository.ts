import type { InventoryRepository } from '@/src/repositories/interfaces/InventoryRepository';
import type {
  CreateIngredientInput,
  Ingredient,
  InventoryFilterParams,
  StockMovement,
  StockOperationInput,
  UpdateIngredientInput,
} from '@/src/features/inventory/types/inventory.types';
import { mockIngredientsData, mockStockMovementsData } from '@/src/data/mock/mockInventory';
import {
  computeStockStatus,
  mockStoreEvents,
  simulateMockNetwork,
  syncMenuAvailabilityFromInventory,
} from '@/src/data/mock/mockStore';

export class MockInventoryRepository implements InventoryRepository {
  async getIngredients(params?: InventoryFilterParams): Promise<Ingredient[]> {
    await simulateMockNetwork();
    const search = params?.search?.trim().toLowerCase() ?? '';
    const status = params?.status;
    const zone = params?.zone;

    return mockIngredientsData
      .filter((ing) => {
        const matchSearch =
          !search ||
          ing.name.toLowerCase().includes(search) ||
          ing.sku.toLowerCase().includes(search) ||
          ing.supplier.toLowerCase().includes(search);
        const matchStatus = !status || status === 'ALL' || ing.status === status;
        const matchZone = !zone || zone === 'ALL' || ing.zone === zone;
        return matchSearch && matchStatus && matchZone;
      })
      .map((i) => ({ ...i }));
  }

  async createIngredient(input: CreateIngredientInput): Promise<Ingredient> {
    await simulateMockNetwork();
    if (input.currentStock < 0) {
      throw new Error('Số lượng tồn kho ban đầu không được âm.');
    }
    const created: Ingredient = {
      id: `ing-${Date.now()}`,
      sku: input.sku.trim().toUpperCase(),
      name: input.name.trim(),
      description: input.description.trim(),
      zone: input.zone,
      unit: input.unit.trim(),
      currentStock: input.currentStock,
      minThreshold: input.minThreshold,
      costPerUnit: input.costPerUnit,
      status: computeStockStatus(input.currentStock, input.minThreshold),
      supplier: input.supplier.trim(),
      updatedAt: new Date().toISOString(),
    };
    mockIngredientsData.unshift(created);
    mockStockMovementsData.unshift({
      id: `mov-${Date.now()}`,
      ingredientId: created.id,
      ingredientSku: created.sku,
      ingredientName: created.name,
      type: 'IMPORT',
      quantityDelta: created.currentStock,
      previousStock: 0,
      newStock: created.currentStock,
      unit: created.unit,
      reason: 'Khởi tạo nguyên liệu mới',
      actorName: 'Nhân viên kho',
      createdAt: created.updatedAt,
    });
    mockStoreEvents.emit();
    return { ...created };
  }

  async updateIngredient(id: string, input: UpdateIngredientInput): Promise<Ingredient> {
    await simulateMockNetwork();
    const target = mockIngredientsData.find((i) => i.id === id);
    if (!target) {
      throw new Error('Không tìm thấy nguyên liệu.');
    }
    if (input.name !== undefined) target.name = input.name.trim();
    if (input.description !== undefined) target.description = input.description.trim();
    if (input.zone !== undefined) target.zone = input.zone;
    if (input.unit !== undefined) target.unit = input.unit.trim();
    if (input.minThreshold !== undefined) target.minThreshold = input.minThreshold;
    if (input.costPerUnit !== undefined) target.costPerUnit = input.costPerUnit;
    if (input.supplier !== undefined) target.supplier = input.supplier.trim();
    target.status = computeStockStatus(target.currentStock, target.minThreshold);
    target.updatedAt = new Date().toISOString();
    mockStoreEvents.emit();
    return { ...target };
  }

  async stockIn(input: StockOperationInput): Promise<Ingredient> {
    await simulateMockNetwork();
    if (input.quantity <= 0) {
      throw new Error('Số lượng nhập kho phải lớn hơn 0.');
    }
    const target = mockIngredientsData.find((i) => i.id === input.ingredientId);
    if (!target) throw new Error('Không tìm thấy nguyên liệu.');

    const previous = target.currentStock;
    const next = Number((previous + input.quantity).toFixed(2));
    target.currentStock = next;
    target.status = computeStockStatus(next, target.minThreshold);
    target.updatedAt = new Date().toISOString();

    mockStockMovementsData.unshift({
      id: `mov-${Date.now()}`,
      ingredientId: target.id,
      ingredientSku: target.sku,
      ingredientName: target.name,
      type: 'IMPORT',
      quantityDelta: input.quantity,
      previousStock: previous,
      newStock: next,
      unit: target.unit,
      reason: input.reason.trim() || 'Nhập hàng bổ sung',
      actorName: input.actorName,
      createdAt: target.updatedAt,
    });

    syncMenuAvailabilityFromInventory(target.id);
    mockStoreEvents.emit();
    return { ...target };
  }

  async adjustStock(input: StockOperationInput): Promise<Ingredient> {
    await simulateMockNetwork();
    if (input.quantity < 0) {
      throw new Error('Tồn kho sau điều chỉnh không được mang giá trị âm.');
    }
    const target = mockIngredientsData.find((i) => i.id === input.ingredientId);
    if (!target) throw new Error('Không tìm thấy nguyên liệu.');

    const previous = target.currentStock;
    const next = Number(input.quantity.toFixed(2));
    const delta = Number((next - previous).toFixed(2));
    target.currentStock = next;
    target.status = computeStockStatus(next, target.minThreshold);
    target.updatedAt = new Date().toISOString();

    mockStockMovementsData.unshift({
      id: `mov-${Date.now()}`,
      ingredientId: target.id,
      ingredientSku: target.sku,
      ingredientName: target.name,
      type: 'ADJUST',
      quantityDelta: delta,
      previousStock: previous,
      newStock: next,
      unit: target.unit,
      reason: input.reason.trim() || 'Điều chỉnh tồn kho',
      actorName: input.actorName,
      createdAt: target.updatedAt,
    });

    syncMenuAvailabilityFromInventory(target.id);
    mockStoreEvents.emit();
    return { ...target };
  }

  async auditStock(input: StockOperationInput): Promise<Ingredient> {
    await simulateMockNetwork();
    if (input.quantity < 0) {
      throw new Error('Số lượng kiểm kê thực tế không được âm.');
    }
    const target = mockIngredientsData.find((i) => i.id === input.ingredientId);
    if (!target) throw new Error('Không tìm thấy nguyên liệu.');

    const previous = target.currentStock;
    const next = Number(input.quantity.toFixed(2));
    const delta = Number((next - previous).toFixed(2));
    target.currentStock = next;
    target.status = computeStockStatus(next, target.minThreshold);
    target.updatedAt = new Date().toISOString();

    mockStockMovementsData.unshift({
      id: `mov-${Date.now()}`,
      ingredientId: target.id,
      ingredientSku: target.sku,
      ingredientName: target.name,
      type: 'AUDIT',
      quantityDelta: delta,
      previousStock: previous,
      newStock: next,
      unit: target.unit,
      reason: input.reason.trim() || 'Kiểm kê kho định kỳ',
      actorName: input.actorName,
      createdAt: target.updatedAt,
    });

    syncMenuAvailabilityFromInventory(target.id);
    mockStoreEvents.emit();
    return { ...target };
  }

  async getMovements(ingredientId?: string): Promise<StockMovement[]> {
    await simulateMockNetwork();
    return mockStockMovementsData
      .filter((m) => !ingredientId || m.ingredientId === ingredientId)
      .map((m) => ({ ...m }));
  }
}
