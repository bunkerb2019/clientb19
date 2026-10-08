import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const useContactInfo = () => {
  return useQuery({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      const [headerSnap, linksSnap, buttonSnap] = await Promise.all([
        getDoc(doc(db, "contact", "header")),
        getDoc(doc(db, "contact", "links")),
        getDoc(doc(db, "contact", "button")),
      ]);

      const headerData = headerSnap.exists() ? headerSnap.data() : {};
      const buttonData = buttonSnap.exists() ? buttonSnap.data() : null;
      return {
        header: headerData.header || null,
        headerTextColor: headerData.headerTextColor || null,
        links: linksSnap.exists() ? linksSnap.data().links : [],
        button: buttonData?.button || buttonData || null,
      };
    },
  });
};
