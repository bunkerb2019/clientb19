import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { RandomSettings, RandomizerConfig } from "../utils/types";

export const useRandomSettings = () => {
  return useQuery<RandomSettings>({
    queryKey: ['randomSettings'],
    queryFn: async () => {
      const docRef = doc(db, "settings", "random");
      const docSnap = await getDoc(docRef);
      
      // Дефолтные настройки
      const defaultSettings = {
        pageTitle: { ru: "Рандомайзер", ro: "Randomizator", en: "Randomizer" },
        pageDescription: { ru: "", ro: "", en: "" },
        randomizers: []
      };

      if (!docSnap.exists()) {
        return defaultSettings;
      }

      const data = docSnap.data();
      
      // Нормализация рандомайзеров
      const normalizeRandomizer = (r: RandomizerConfig): RandomizerConfig => {
        // Для обратной совместимости: если есть name, но нет slotTitle - используем name
        const titleSource = r.slotTitle || r.name || { ru: "Случайный выбор" };
        
        return {
          id: r.id || Date.now().toString(),
          slotTitle: {
            ru: titleSource.ru || "Случайный выбор",
            ro: titleSource.ro || titleSource.ru || "Случайный выбор",
            en: titleSource.en || titleSource.ru || "Случайный выбор"
          },
          navigation: r.navigation || "1",
          categoryIds: Array.isArray(r.categoryIds) ? r.categoryIds : [],
          active: r.active !== false
        };
      };

      // Конвертация старого формата (когда были только categoryIds)
      if (data.categoryIds && !data.randomizers) {
        return {
          ...defaultSettings,
          randomizers: [normalizeRandomizer({
            id: "default",
            name: { ru: "Случайный выбор", ro: "Alegere aleatorie", en: "Random choice" },
            navigation: data.navigation,
            categoryIds: data.categoryIds,
            active: true,
            slotTitle: {
              ru: "",
              ro: "",
              en: ""
            }
          })]
        };
      }
      
      // Нормализация текущего формата
      return {
        pageTitle: data.pageTitle || defaultSettings.pageTitle,
        pageDescription: data.pageDescription || defaultSettings.pageDescription,
        randomizers: Array.isArray(data.randomizers) 
          ? data.randomizers.map(normalizeRandomizer)
          : []
      };
    },
    staleTime: 60 * 60 * 1000 // 1 hour cache
  });
};