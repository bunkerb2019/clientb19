import { useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.ts"; // твой конфиг

export const useTrackView = (dateStr: string) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const track = async () => {
      try {
        const ref = doc(db, "statistics", "app-views");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          const current = data.views?.[dateStr] ?? 0;

          await setDoc(
            ref,
            {
              views: {
                ...data.views,
                [dateStr]: current + 1,
              },
            },
            { merge: true }
          );
        } else {
          await setDoc(ref, {
            views: {
              [dateStr]: 1,
            },
          });
        }
      } catch (err) {
        console.error("Ошибка при обновлении views:", err);
      }
    };

    track();
  }, [dateStr]);
};
