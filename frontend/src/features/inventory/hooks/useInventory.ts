import { useCallback, useEffect, useMemo, useState } from "react";
import { repositories } from "@/src/repositories";
import type {
  CreateIngredientInput,
  Ingredient,
  InventoryCount,
  StockMovement,
  StockStatus,
  StorageZone,
  UpdateIngredientInput,
} from "@/src/features/inventory/types/inventory.types";

export function useInventory() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [counts, setCounts] = useState<InventoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "ALL">("ALL");
  const [zoneFilter, setZoneFilter] = useState<StorageZone | "ALL">("ALL");

  const fetchInventory = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const [ingList, movList, countList] = await Promise.all([
        repositories.inventory.getIngredients(),
        repositories.inventory.getMovements(),
        repositories.inventory.getCounts(),
      ]);
      setIngredients(ingList);
      setMovements(movList);
      setCounts(countList);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tải dữ liệu kho.",
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInventory();
  }, [fetchInventory]);

  const summary = useMemo(() => {
    const inStock = ingredients.filter((i) => i.status === "IN_STOCK").length;
    const lowStock = ingredients.filter((i) => i.status === "LOW_STOCK").length;
    const outOfStock = ingredients.filter(
      (i) => i.status === "OUT_OF_STOCK",
    ).length;
    return {
      total: ingredients.length,
      inStock,
      lowStock,
      outOfStock,
      alertCount: lowStock + outOfStock,
    };
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ingredients.filter((ing) => {
      const matchSearch =
        !q ||
        ing.name.toLowerCase().includes(q) ||
        ing.sku.toLowerCase().includes(q);
      const matchStatus = statusFilter === "ALL" || ing.status === statusFilter;
      const matchZone = zoneFilter === "ALL" || ing.zone === zoneFilter;
      return matchSearch && matchStatus && matchZone;
    });
  }, [ingredients, search, statusFilter, zoneFilter]);

  const createIngredient = useCallback(
    async (input: CreateIngredientInput) => {
      setMutating(true);
      try {
        const created = await repositories.inventory.createIngredient(input);
        await fetchInventory(true);
        return created;
      } finally {
        setMutating(false);
      }
    },
    [fetchInventory],
  );

  const updateIngredient = useCallback(
    async (id: string, input: UpdateIngredientInput) => {
      setMutating(true);
      try {
        const updated = await repositories.inventory.updateIngredient(
          id,
          input,
        );
        await fetchInventory(true);
        return updated;
      } finally {
        setMutating(false);
      }
    },
    [fetchInventory],
  );

  const stockIn = useCallback(
    async (ingredientId: string, quantity: number, reason: string) => {
      setMutating(true);
      try {
        const updated = await repositories.inventory.stockIn({
          ingredientId,
          quantity,
          reason,
        });
        await fetchInventory(true);
        return updated;
      } finally {
        setMutating(false);
      }
    },
    [actorName, fetchInventory],
  );

  const countStock = useCallback(
    async (ingredientId: string, quantity: number, reason: string) => {
      setMutating(true);
      try {
        const updated = await repositories.inventory.countStock({
          ingredientId,
          quantity,
          reason,
        });
        await fetchInventory(true);
        return updated;
      } finally {
        setMutating(false);
      }
    },
    [actorName, fetchInventory],
  );

  const auditStock = useCallback(
    async (ingredientId: string, quantity: number, reason: string) => {
      setMutating(true);
      try {
        const updated = await repositories.inventory.auditStock({
          ingredientId,
          quantity,
          reason,
          actorName,
        });
        await fetchInventory(true);
        return updated;
      } finally {
        setMutating(false);
      }
    },
    [actorName, fetchInventory],
  );

  return {
    ingredients: filteredIngredients,
    movements,
    counts,
    summary,
    loading,
    mutating,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    zoneFilter,
    setZoneFilter,
    reload: () => fetchInventory(false),
    createIngredient,
    updateIngredient,
    stockIn,
    countStock,
  };
}
