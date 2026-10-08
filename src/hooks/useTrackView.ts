import { useEffect, useRef } from "react";
import { doc, increment, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.ts";

export const useTrackView = (dateStr: string) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    setDoc(
      doc(db, "statistics", "app-views"),
      { views: { [dateStr]: increment(1) } },
      { merge: true }
    ).catch((err) => console.error("Ошибка при обновлении views:", err));
  }, [dateStr]);
};
