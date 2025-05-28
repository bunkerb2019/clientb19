import { useState, useEffect, useCallback } from "react";
import "./ProductCard.scss";
import useSettings from "../modules/useSettings";
import { hexToRgb } from "../utils/hexToRGB";
import { useLanguage } from "../contexts/LanguageContext";
import useImageDownload from "../providers/hooks/useImageDownload";
import React from "react";

interface ProductProps {
  id: string;
  name: string | { ru: string; ro?: string; en?: string };
  description: string | { ru: string; ro?: string; en?: string };
  weight?: string;
  weightUnit?: "g" | "ml" | "kg";
  price?: number;
  currency?: "MDL" | "$" | "€";
  image?: string;
  category: string;
  type: string;
}

const ProductCard: React.FC<ProductProps> = ({
  image,
  name,
  description,
  weight,
  weightUnit = "g",
  price,
  currency = "$",
  id,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [hasImageError, setHasImageError] = useState<boolean>(false);
  const { getText } = useLanguage();
  const { data: settings } = useSettings();

  useEffect(() => {
    if (isPopupOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        const scrollY = parseInt(document.body.style.top || '0');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, -scrollY);
      };
    }
  }, [isPopupOpen]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = settings?.placeholderImage || "";
      setHasImageError(true);
      setIsImageLoading(false);
    },
    [settings?.placeholderImage]
  );

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
    setHasImageError(false);
  }, []);

  const { getDownloadUrl } = useImageDownload();

  const loadImage = useCallback(
    async (currentImage: string | undefined) => {
      if (!currentImage) {
        setImageUrl(settings?.placeholderImage || "");
        setIsImageLoading(false);
        setHasImageError(false);
        return;
      }

      setIsImageLoading(true);
      setHasImageError(false);

      try {
        const url = await getDownloadUrl(currentImage);
        setImageUrl(url ?? settings?.placeholderImage ?? "");
      } catch (error) {
        console.error("Error loading image:", error);
        setImageUrl(settings?.placeholderImage || "");
        setHasImageError(true);
      } finally {
        setIsImageLoading(false);
      }
    },
    [getDownloadUrl, settings?.placeholderImage]
  );

  useEffect(() => {
    setImageUrl("");
    loadImage(image);
  }, [image, loadImage]);

  const RGB = hexToRgb(settings?.cardBackgroundColor || "#000000");

  const localizedName = getText(name);
  const localizedDescription = getText(description);
  const localizedWeightText = getText({
    ru: "Вес",
    en: "Weight",
    ro: "Greutate",
  });

  const getWeightUnitText = () => {
    switch (weightUnit) {
      case "g":
        return getText({ ru: "г", en: "g", ro: "g" });
      case "ml":
        return getText({ ru: "мл", en: "ml", ro: "ml" });
      case "kg":
        return getText({ ru: "кг", en: "kg", ro: "kg" });
      default:
        return getText({ ru: "г", en: "g", ro: "g" });
    }
  };

  const localizedPriceText = getText({ ru: "Цена", en: "Price", ro: "Preț" });

  // Определяем, нужно ли вообще показывать изображение
  const shouldShowImage = !!image && !hasImageError;
  const finalImageUrl = shouldShowImage ? imageUrl : settings?.placeholderImage || "";

  return (
    <>
      <div
        className="product-card"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        style={
          {
            "--card-background-color": `${RGB?.r}, ${RGB?.g},${RGB?.b}`,
            "--card-background-opacity": settings?.cardBackgroundOpacity || 1,
            "--card-blur": settings?.cardBlur
              ? `${settings.cardBlur}px`
              : "0px",
            "--card-border-color": settings?.cardBorderColor || "#ffffff89",
            "--card-text-color": settings?.cardTextColor || "#fff",
          } as React.CSSProperties
        }
      >
        <div className="image-container">
          {isImageLoading && shouldShowImage && (
            <div className="image-loading-animation">
              {/* Здесь может быть ваш лоадер */}
              <div className="spinner"></div>
            </div>
          )}
          <img
            src={finalImageUrl}
            alt={localizedName}
            className={`product-image ${isImageLoading ? 'loading' : ''} ${hasImageError ? 'error' : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
            key={`${id}-image`}
            style={{ opacity: isImageLoading ? 0 : 1 }}
          />
        </div>
        <h3 className="product-name">{localizedName}</h3>
        <p className="product-description">{localizedDescription}</p>
        <div className="product-footer">
          {weight && (
            <p className="product-weight">
              {localizedWeightText}: {weight} {getWeightUnitText()}
            </p>
          )}
          <p className="product-price">
            {localizedPriceText}: {price} {currency}
          </p>
        </div>
      </div>

      {isPopupOpen && (
        <div
          className={`popup-overlay ${isPopupOpen ? "visible" : ""}`}
          onClick={handleClosePopup}
        >
          <div
            className="popup-content popup-opened"
            onClick={(e) => e.stopPropagation()}
            style={
              {
                "--card-background-color": `${RGB?.r}, ${RGB?.g},${RGB?.b}`,
                "--card-background-opacity":
                  settings?.cardBackgroundOpacity || 1,
                "--card-blur": settings?.cardBlur
                  ? `${settings.cardBlur}px`
                  : "0px",
                "--card-border-color": settings?.cardBorderColor || "#ffffff89",
                "--card-text-color": settings?.cardTextColor || "#fff",
              } as React.CSSProperties
            }
          >
            <div className="popup-image-container">
              {isImageLoading && shouldShowImage && (
                <div className="image-loading-animation">
                  {/* Здесь может быть ваш лоадер */}
                  <div className="spinner"></div>
                </div>
              )}
              <img
                src={finalImageUrl}
                alt={localizedName}
                className={`popup-image ${isImageLoading ? 'loading' : ''} ${hasImageError ? 'error' : ''}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                key={`${id}-popup-image`}
                style={{ opacity: isImageLoading ? 0 : 1 }}
              />
            </div>

            <div className="popup-text-content">
              <h3 className="popup-name">{localizedName}</h3>
              <p className="popup-description">{localizedDescription}</p>

              <div className="popup-details">
                {weight && (
                  <p className="popup-weight">
                    {localizedWeightText}: {weight} {getWeightUnitText()}
                  </p>
                )}
                <p className="popup-price">
                  {localizedPriceText}: {price} {currency}
                </p>
              </div>
            </div>

            <button className="close-button" onClick={handleClosePopup}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ProductCard);