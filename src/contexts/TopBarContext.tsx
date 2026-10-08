import { createContext, ReactNode, useContext, useEffect } from "react";

export const TopBarTitleContext = createContext<(title: ReactNode) => void>(
  () => {}
);

export const useTopBarTitle = (title: ReactNode, deps: unknown[]) => {
  const setTitle = useContext(TopBarTitleContext);
  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
