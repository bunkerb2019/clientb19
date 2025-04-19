import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Order } from "../utils/types";

const useMenuItems = (options: { onlyActive?: boolean, trackViews?: boolean } = {}) => {
  const { onlyActive = true, trackViews = true } = options;

  const fetchMenuItems = async () => {
    let menuQuery;
    
    if (onlyActive) {
      menuQuery = query(
        collection(db, "menu"),
        where("active", "==", true)
      );
    } else {
      menuQuery = collection(db, "menu");
    }

    const snapshot = await getDocs(menuQuery);

    // Обновляем счетчики просмотров, если требуется
    if (trackViews && onlyActive) {
      await Promise.all(
        snapshot.docs.map(async (doc) => {
          try {
            await updateDoc(doc.ref, {
              views: increment(1),
              lastViewed: serverTimestamp(),
            });
          } catch (error) {
            console.error(`Error updating view count for ${doc.id}:`, error);
          }
        })
      );
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Приводим Firestore Timestamp к Date
      lastViewed: doc.data().lastViewed?.toDate()
    } as unknown as Order));
  };

  return useQuery({
    queryKey: ['menuItems', { onlyActive, trackViews }],
    queryFn: fetchMenuItems,
    staleTime: 60 * 60 * 1000, // 1 час кэширования
  });
};

export default useMenuItems;