// src/hooks/useView.ts
import { useContext } from "react";
import { ViewContextType, ViewContext } from "../contexts/ViewContext";

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
};