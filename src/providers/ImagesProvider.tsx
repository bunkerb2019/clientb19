import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { ReactNode, useCallback, useState } from "react";
import { createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ImagesContext = createContext({ getDownloadUrl: () => {} } as {
  getDownloadUrl: (imageUrl?: string) => Promise<string | undefined>;
});

const ImagesProvider = ({ children }: { children: ReactNode }) => {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  );

  const getDownloadUrl = useCallback(
    async (imageUrl?: string) => {
      if (!imageUrl) return;

      if (images[imageUrl]) {
        return images[imageUrl];
      }

      if (loadingImages[imageUrl]) return;

      try {
        setLoadingImages((obj) => ({ ...obj, [imageUrl]: true }));
        const storage = getStorage();
        const imageRef = ref(storage, imageUrl);
        const url = await getDownloadURL(imageRef);
        setImages((obj) => ({ ...obj, [imageUrl]: url }));
        return url;
      } catch (error) {
        console.error("Error loading image:", error);
      } finally {
        setLoadingImages((obj) => ({ ...obj, [imageUrl]: false }));
      }
    },
    [images, loadingImages]
  );

  return (
    <ImagesContext.Provider value={{ getDownloadUrl }}>
      {children}
    </ImagesContext.Provider>
  );
};

export default ImagesProvider;
