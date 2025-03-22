import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "../utils/queryKeys";
import { getDoc } from "firebase/firestore";
import { getSettingsDoc } from "../utils/firebaseDoc";
import { SettingsData } from "../utils/types";

const useSettings = () => {
  const queryFn = useCallback(async () => {
    const docRef = getSettingsDoc();
    const docSnap = await getDoc(docRef);

    return docSnap.data() as SettingsData;
  }, []);

  return useQuery({
    queryKey: queryKeys.settings(),
    queryFn,
  });
};

export default useSettings;
