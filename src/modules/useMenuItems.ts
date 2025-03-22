import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Order } from "../utils/types";

const useMenuItems = () => {
  const fetchMenuItems = async () => {
    const menuCollection = collection(db, "menu");
    const querySnapshot = await getDocs(menuCollection);
    const menuItems: Order[] = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({ id: doc.id, ...doc.data() } as Order);
    });
    return menuItems;
  };

  return useQuery({
    queryKey: ["menuItems"],
    queryFn: fetchMenuItems,
  });
};

export default useMenuItems;