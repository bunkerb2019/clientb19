import { useCallback, useMemo } from "react";
import useMenuItems from "../modules/useMenuItems";
import useCategories from "../modules/useCategories";
import { Order, RandomizerConfig } from "../utils/types";

export const useRandomizerItems = () => {
  const { data: wholeMenu = [] } = useMenuItems();
  const { data: categories = [], isLoading } = useCategories();

  const categoryIdToName = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => c?.id && c?.ru && map.set(c.id, c.ru));
    return map;
  }, [categories]);

  const getItems = useCallback(
    (randomizer?: RandomizerConfig): Order[] => {
      if (!randomizer?.categoryIds?.length) return [];
      const names = randomizer.categoryIds
        .map((id) => categoryIdToName.get(id))
        .filter(Boolean) as string[];
      return wholeMenu.filter((item) => item?.category && names.includes(item.category));
    },
    [wholeMenu, categoryIdToName]
  );

  return { getItems, categoriesLoaded: categories.length > 0, isLoading };
};
