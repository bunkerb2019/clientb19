const BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

// Файлы в Storage публичные, поэтому ссылку собираем сами, без запроса getDownloadURL.
// version меняется при замене фото в админке, иначе браузер отдаст старое из кэша (immutable).
export const storageImageUrl = (path?: string | null, version?: number) => {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media`;
  return version ? `${url}&v=${version}` : url;
};

export const preloadImages = (urls: (string | undefined)[]) =>
  Promise.all(
    urls.filter(Boolean).map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src!;
        })
    )
  );
