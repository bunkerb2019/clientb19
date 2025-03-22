import { doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const getCategoriesDoc = () => {
  return doc(db, "settings", "categories");
};

export const getNavigationDoc = () => {
  return doc(db, "settings", "navigation");
};

export const getSettingsDoc = () => {
  return doc(db, "settings", "default");
};
