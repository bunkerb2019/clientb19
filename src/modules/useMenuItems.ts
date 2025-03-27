import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Order } from "../utils/types";

const useMenuItems = () => {
  const fetchMenuItems = async () => {
    const menuCollection = collection(db, "menu");
    const snapshot = await getDocs(menuCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  };

  return useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems,
    staleTime: 60 * 60 * 1000, // 1 час кэширования
  });
};

export default useMenuItems;