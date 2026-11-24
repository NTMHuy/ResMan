import { useCallback, useEffect, useMemo, useState } from "react";

import { repositories } from "@/src/repositories";
import { mockStoreEvents } from "@/src/data/mock/mockStore";
import { DISH_IMAGE_PRESETS } from "@/src/data/mock/mockMenu";

import type {
  CreateCategoryInput,
  CreateMenuItemInput,
  DishStatus,
  MenuCategory,
  MenuItem,
  UpdateCategoryInput,
  UpdateMenuItemInput,
  UploadMenuImageInput,
} from "@/src/features/menu/types/menu.types";

export const MENU_IMAGE_PRESETS: Array<{
  label: string;
  url: string;
}> = [
  { label: "Phở Bò", url: DISH_IMAGE_PRESETS.PHO_BO },
  { label: "Cơm Tấm", url: DISH_IMAGE_PRESETS.COM_TAM },
  { label: "Gỏi Cuốn", url: DISH_IMAGE_PRESETS.GOI_CUON },
  { label: "Wagyu Steak", url: DISH_IMAGE_PRESETS.WAGYU_STEAK },
  { label: "Trà Đào", url: DISH_IMAGE_PRESETS.TRA_DAO },
];

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

export function useMenu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  const [allItemsCount, setAllItemsCount] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
  });

  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState<DishStatus | "ALL">(
    "ALL",
  );

  const fetchMenu = useCallback(async (silent = false): Promise<void> => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const [categoryList, menuItems] = await Promise.all([
        repositories.menu.getCategories(),
        repositories.menu.getMenuItems(),
      ]);

      setCategories(categoryList);
      setItems(menuItems);

      const available = menuItems.filter(
        (item) => item.status === "AVAILABLE",
      ).length;

      setAllItemsCount({
        total: menuItems.length,
        available,
        unavailable: menuItems.length - available,
      });

      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải dữ liệu thực đơn."));
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchMenu();

    // Mock repository phát sự kiện sau khi dữ liệu thay đổi.
    // API repository không phụ thuộc sự kiện này.
    const unsubscribe = mockStoreEvents.subscribe(() => {
      void fetchMenu(true);
    });

    return unsubscribe;
  }, [fetchMenu]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchSearch =
        !query ||
        String(item.name ?? "")
          .toLowerCase()
          .includes(query) ||
        String(item.sku ?? "")
          .toLowerCase()
          .includes(q) ||
        String(item.description ?? "")
          .toLowerCase()
          .includes(q);
      const matchCategory =
        selectedCategoryId === "ALL" || item.categoryId === selectedCategoryId;

      const matchStatus =
        selectedStatus === "ALL" || item.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [items, search, selectedCategoryId, selectedStatus]);

  const createCategory = useCallback(
    async (input: CreateCategoryInput) => {
      setMutating(true);

      try {
        const created = await repositories.menu.createCategory(input);

        await fetchMenu(true);

        return created;
      } finally {
        setMutating(false);
      }
    },
    [fetchMenu],
  );

  const updateCategory = useCallback(
    async (id: string, input: UpdateCategoryInput) => {
      setMutating(true);

      try {
        const updated = await repositories.menu.updateCategory(id, input);

        await fetchMenu(true);

        return updated;
      } finally {
        setMutating(false);
      }
    },
    [fetchMenu],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      setMutating(true);

      try {
        await repositories.menu.deleteCategory(id);

        if (selectedCategoryId === id) {
          setSelectedCategoryId("ALL");
        }

        await fetchMenu(true);
      } finally {
        setMutating(false);
      }
    },
    [fetchMenu, selectedCategoryId],
  );

  const createMenuItem = useCallback(
    async (input: CreateMenuItemInput) => {
      setMutating(true);

      try {
        const created = await repositories.menu.createMenuItem(input);

        await fetchMenu(true);

        return created;
      } finally {
        setMutating(false);
      }
    },
    [fetchMenu],
  );

  const updateMenuItem = useCallback(
    async (id: string, input: UpdateMenuItemInput) => {
      setMutating(true);

      try {
        const updated = await repositories.menu.updateMenuItem(id, input);

        await fetchMenu(true);

        return updated;
      } finally {
        setMutating(false);
      }
    },
    [fetchMenu],
  );

  const deleteMenuItem = useCallback(
    async (id: string) => {
      setMutating(true);

      try {
        await repositories.menu.deleteMenuItem(id);
        await fetchMenu(true);
      } finally {
        setMutating(false);
      }
    },
    [fetchMenu],
  );

  const toggleMenuItemStatus = useCallback(
    async (id: string, nextStatus: DishStatus) => {
      setMutating(true);

      try {
        const updated = await repositories.menu.toggleMenuItemStatus(
          id,
          nextStatus,
        );

        await fetchMenu(true);

        return updated;
      } finally {
        setMutating(false);
      }
    },
    [fetchMenu],
  );

  const uploadMenuItemImage = useCallback(
    async (id: string, file: UploadMenuImageInput) => {
      setMutating(true);

      try {
        const updated = await repositories.menu.uploadMenuItemImage(id, file);

        await fetchMenu(true);

        return updated;
      } finally {
        setMutating(false);
      }
    },
    [fetchMenu],
  );

  const deleteMenuItemImage = useCallback(
    async (id: string) => {
      setMutating(true);

      try {
        await repositories.menu.deleteMenuItemImage(id);
        await fetchMenu(true);
      } finally {
        setMutating(false);
      }
    },
    [fetchMenu],
  );

  const reload = useCallback(() => {
    return fetchMenu(false);
  }, [fetchMenu]);

  return {
    categories,
    items: filteredItems,
    allItemsCount,
    loading,
    mutating,
    error,

    search,
    setSearch,

    selectedCategoryId,
    setSelectedCategoryId,

    selectedStatus,
    setSelectedStatus,

    imagePresets: MENU_IMAGE_PRESETS,

    reload,

    createCategory,
    updateCategory,
    deleteCategory,

    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemStatus,

    uploadMenuItemImage,
    deleteMenuItemImage,
  };
}
