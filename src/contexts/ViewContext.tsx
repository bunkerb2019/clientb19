// src/contexts/ViewContext.tsx
import { createContext, useState, ReactNode } from "react";

export type ViewMode = "grid" | "list";

export interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ViewContext = createContext<ViewContextType | undefined>(
  undefined
);

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <ViewContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewContext.Provider>
  );
};
