import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "../utils/queryKeys";
import { getDoc } from "firebase/firestore";
import { getNavigationDoc } from "../utils/firebaseDoc";
import { NavigationItem } from "../utils/types";

const useNavigationConfig = () => {
  const queryFn = useCallback(async () => {
    const docRef = getNavigationDoc();
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return (docSnap.data().categories as NavigationItem[]) ?? [];
    }
    return [] as NavigationItem[];
  }, []);

  return useQuery<NavigationItem[]>({
    queryKey: queryKeys.navigationConfig(),
    queryFn,
  });
};

export default useNavigationConfig;