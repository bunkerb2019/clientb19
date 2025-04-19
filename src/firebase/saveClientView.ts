import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getApp } from "firebase/app";

const db = getFirestore(getApp());

export const saveViewEvent = async (event: {
  type: 'product_view' | 'category_view';
  categoryId: string;
  productId?: string;
  userId?: string;
  deviceInfo?: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
  };
}) => {
  try {
    await addDoc(collection(db, "views"), {
      ...event,
      createdAt: serverTimestamp(),
      userId: "anonymous", // Можно заменить на реальный ID пользователя
      deviceInfo: {
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        ...event.deviceInfo
      }
    });
  } catch (err) {
    console.error("View tracking error:", err);
  }
};

export const saveClientCategoryView = async (categoryId: string, productId?: string) => {
  await saveViewEvent({
    type: productId ? 'product_view' : 'category_view',
    categoryId,
    productId
  });
};