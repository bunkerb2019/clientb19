import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Order } from "../utils/types";

const useMenuItems = (options: { onlyActive?: boolean } = {}) => {
  const { onlyActive = true } = options;

  const fetchMenuItems = async () => {
    let menuQuery;
    
    if (onlyActive) {
      // Фильтруем только активные товары
      menuQuery = query(
        collection(db, "menu"),
        where("active", "==", true)
      );
    } else {
      // Без фильтрации (для админки)
      menuQuery = collection(db, "menu");
    }

    const snapshot = await getDocs(menuQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  };

  return useQuery({
    queryKey: ['menuItems', { onlyActive }],
    queryFn: fetchMenuItems,
    staleTime: 60 * 60 * 1000, // 1 час кэширования
  });
};

export default useMenuItems;