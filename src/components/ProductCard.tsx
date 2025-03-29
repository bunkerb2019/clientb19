import { useState, useEffect, useCallback } from "react";
import "./ProductCard.scss";
import { useTranslation } from "react-i18next";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import useSettings from "../modules/useSettings";
import { hexToRgb } from "../utils/hexToRGB";

interface ProductProps {
  id: string;
  name: string;
  description: string;
  weight?: number; // Сделал необязательным, так как в коде есть проверка на его наличие
  price: number;
  image?: string;
  category: string;
  type: string;
  // Убрал key, так как он не используется в компоненте (key используется React при маппинге списков)
}

const ProductCard: React.FC<ProductProps> = ({
  image,
  name,
  description,
  weight,
  price,
  id,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const { t } = useTranslation();
  const { data: settings } = useSettings();

  const handleCardClick = useCallback((e) => {
    console.log("Card clicked", e);
    e.stopPropagation(); // предотвращаем всплытие
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
  return (
    <>
      {/* Product Card */}
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
            alt={name}
            className="product-image"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          {weight && (
            <p className="product-weight">
              {t("product.weight")}: {weight} {t("product.gram")}
            </p>
          )}
          <p className="product-price">
            {t("product.price")}: {price} {t("product.currency")}
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
                alt={name}
                className="popup-image"
                onError={handleImageError}
              />
            </div>

            <div className="popup-text-content">
              <h3 id="popup-title" className="popup-name">
                {name}
              </h3>
              <p className="popup-description">{description}</p>

              <div className="popup-details">
                {weight && (
                  <p className="popup-weight">
                    {t("product.weight")}: {weight} {t("product.gram")}
                  </p>
                )}
                <p className="popup-price">
                  {t("product.price")}: {price} {t("product.currency")}
                </p>
              </div>
            </div>

            <button
              className="close-button"
              onClick={handleClosePopup}
              aria-label={t("product.closePopup")}
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
