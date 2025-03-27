import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { RandomSettings, RandomizerConfig } from "../utils/types";

export const useRandomSettings = () => {
  return useQuery<RandomSettings>({
    queryKey: ['randomSettings'],
    queryFn: async () => {
      try {
        const docRef = doc(db, "settings", "random");
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          console.warn("Random settings document not found");
          return { randomizers: [] };
        }

        const data = docSnap.data();
        
        // Определяем тип для данных из Firestore
        type FirestoreRandomizer = {
          id?: string;
          name?: string;
          slotTitle?: string;
          navigation?: string;
          categoryIds?: unknown;
          active?: unknown;
        };

        // Нормализация данных
        if (!data.randomizers && data.categoryIds) {
          return {
            randomizers: [{
              id: "legacy",
              name: "Default",
              slotTitle: "Randomizer",
              navigation: data.navigation || "1",
              categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : [],
              active: true
            }]
          };
        }

        return {
          randomizers: ((data.randomizers as FirestoreRandomizer[]) || []).map((r): RandomizerConfig => ({
            id: r.id || Date.now().toString(),
            name: r.name || "Unnamed",
            slotTitle: r.slotTitle || "Randomizer",
            navigation: r.navigation || "1",
            categoryIds: Array.isArray(r.categoryIds) ? r.categoryIds : [],
            active: r.active !== false
          }))
        };

      } catch (error) {
        console.error("Error loading random settings:", error);
        return { randomizers: [] };
      }
    },
    staleTime: 60 * 60 * 1000
  });
};