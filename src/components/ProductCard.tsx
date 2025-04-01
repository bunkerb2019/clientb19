import { useState, useEffect, useCallback } from "react";
import "./ProductCard.scss";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import useSettings from "../modules/useSettings";
import { hexToRgb } from "../utils/hexToRGB";
import { useLanguage } from "../contexts/LanguageContext";

interface ProductProps {
  id: string;
  name: string | { ru: string; ro?: string; en?: string };
  description: string | { ru: string; ro?: string; en?: string };
  weight?: number;
  weightUnit?: 'g' | 'ml' | 'kg';
  price: number;
  currency?: 'MDL' | '$' | '€';
  image?: string;
  category: string;
  type: string;
}

const ProductCard: React.FC<ProductProps> = ({
  image,
  name,
  description,
  weight,
  weightUnit = 'g',
  price,
  currency = '$',
  id,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const { getText } = useLanguage();
  const { data: settings } = useSettings();

  const handleCardClick = useCallback((e) => {
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
    },
    [settings?.placeholderImage]
  );

  const loadImage = useCallback(async () => {
    if (!image) {
      setImageUrl(settings?.placeholderImage || "");
      return;
    }

    try {
      const storage = getStorage();
      const imageRef = ref(storage, image);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);

      const img = document.getElementById(`${id}-img`);
      if (img) img.setAttribute("src", url);
    } catch (error) {
      console.error("Error loading image:", error);
      setImageUrl(settings?.placeholderImage || "");
    }
  }, [image, id, settings?.placeholderImage]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const RGB = hexToRgb(settings?.cardBackgroundColor);
  
  // Получаем локализованные тексты
  const localizedName = getText(name);
  const localizedDescription = getText(description);
  const localizedWeightText = getText({ ru: "Вес", en: "Weight", ro: "Greutate" });
  
  // Функция для получения локализованного текста единицы измерения
  const getWeightUnitText = () => {
    switch(weightUnit) {
      case 'g': return getText({ ru: "г", en: "g", ro: "g" });
      case 'ml': return getText({ ru: "мл", en: "ml", ro: "ml" });
      case 'kg': return getText({ ru: "кг", en: "kg", ro: "kg" });
      default: return getText({ ru: "г", en: "g", ro: "g" });
    }
  };

  const localizedPriceText = getText({ ru: "Цена", en: "Price", ro: "Preț" });

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
          <img
            src={settings?.placeholderImage}
            id={`${id}-img`}
            alt={localizedName}
            className="product-image"
            onError={handleImageError}
            loading="lazy"
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

      {/* Popup */}
      {isPopupOpen && (
        <div
          className={`popup-overlay ${isPopupOpen ? "visible" : ""}`}
          onClick={handleClosePopup}
        >
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
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
            <div className="popup-image-container">
              <img
                src={imageUrl || settings?.placeholderImage}
                alt={localizedName}
                className="popup-image"
                onError={handleImageError}
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

            <button
              className="close-button"
              onClick={handleClosePopup}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;