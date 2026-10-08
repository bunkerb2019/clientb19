import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import "./ProductCard.scss";
import useSettings from "../modules/useSettings";
import { useLanguage } from "../contexts/LanguageContext";
import { storageImageUrl } from "../utils/storageImage";
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
  imageVersion?: number;
  category: string;
  type: string;
  viewMode: "grid" | "list"; // Добавлен новый пропс
}

interface ProductPopupProps {
  imageUrl: string;
  name: string | { ru: string; ro?: string; en?: string };
  description: string | { ru: string; ro?: string; en?: string };
  weight?: string;
  weightUnit?: "g" | "ml" | "kg";
  price?: number;
  currency?: "MDL" | "$" | "€";
  id: string;
  isOpen: boolean;
  onClose: () => void;
  isImageLoading: boolean;
  hasImageError: boolean;
  onImageError: () => void;
  onImageLoad: () => void;
  hasImage: boolean;
}

export const ProductPopup: React.FC<ProductPopupProps> = ({
  imageUrl,
  name,
  description,
  weight,
  weightUnit = "g",
  price,
  currency = "$",
  id,
  isOpen,
  onClose,
  isImageLoading,
  hasImageError,
  onImageError,
  onImageLoad,
  hasImage,
}) => {
  const { getText } = useLanguage();
  const { data: settings } = useSettings();

  const localizedName = useMemo(() => getText(name), [getText, name]);
  const localizedDescription = useMemo(
    () => getText(description),
    [getText, description]
  );
  const localizedWeightText = useMemo(
    () =>
      getText({
        ru: "Вес",
        en: "Weight",
        ro: "Greutate",
      }),
    [getText]
  );

  const getWeightUnitText = useCallback(() => {
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
  }, [getText, weightUnit]);

  const localizedPriceText = useMemo(
    () => getText({ ru: "Цена", en: "Price", ro: "Preț" }),
    [getText]
  );

  const displayImageUrl = useMemo(() => {
    if (!hasImage || hasImageError) {
      return settings?.placeholderImage || "";
    }
    return imageUrl;
  }, [hasImage, hasImageError, imageUrl, settings?.placeholderImage]);

  const showSpinner = isImageLoading;

  const ingredients = useMemo(
    () =>
      localizedDescription
        .split("/")
        .map((s) => s.trim())
        .filter(Boolean),
    [localizedDescription]
  );

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  const requestClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        const scrollY = parseInt(document.body.style.top || "0", 10);
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, -scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`sheet-overlay ${isClosing ? "closing" : ""}`}
      onClick={requestClose}
    >
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-image">
          {displayImageUrl && (
            <div
              className="photo-backdrop"
              style={{ backgroundImage: `url("${displayImageUrl}")` }}
            />
          )}
          {showSpinner && (
            <div className="image-loading-animation">
              <div className="spinner"></div>
            </div>
          )}
          {displayImageUrl && (
            <img
              src={displayImageUrl}
              alt={localizedName}
              className="sheet-photo"
              onError={onImageError}
              onLoad={onImageLoad}
              key={`${id}-popup-image`}
              style={{ opacity: isImageLoading ? 0 : 1 }}
            />
          )}
          <button
            className="sheet-close"
            onClick={requestClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="sheet-body">
          <div className="sheet-head">
            <h3 className="sheet-name">{localizedName}</h3>
            {weight && (
              <span className="sheet-pill" title={localizedWeightText}>
                {weight} {getWeightUnitText()}
              </span>
            )}
          </div>

          {ingredients.length > 1 ? (
            <>
              <h4 className="sheet-section">
                {getText({ ru: "Состав", en: "Ingredients", ro: "Ingrediente" })}
              </h4>
              <ul className="sheet-ingredients">
                {ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            localizedDescription && (
              <p className="sheet-description">{localizedDescription}</p>
            )
          )}
        </div>

        <div className="sheet-footer">
          <span>{localizedPriceText}</span>
          <strong>
            {price} {currency}
          </strong>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ProductCard: React.FC<ProductProps> = ({
  image,
  imageVersion,
  name,
  description,
  weight,
  weightUnit = "g",
  price,
  currency = "$",
  id,
  viewMode = "grid", // Значение по умолчанию
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const imageUrl = useMemo(
    () => storageImageUrl(image, imageVersion) ?? "",
    [image, imageVersion]
  );
  const [isImageLoading, setIsImageLoading] = useState<boolean>(!!image);
  const [hasImageError, setHasImageError] = useState<boolean>(!image);
  const { getText } = useLanguage();
  const { data: settings } = useSettings();

  const hasImage = !!image;

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleImageError = useCallback(() => {
    setHasImageError(true);
    setIsImageLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
    setHasImageError(false);
  }, []);

  const localizedName = useMemo(() => getText(name), [getText, name]);
  const localizedDescription = useMemo(
    () => getText(description),
    [getText, description]
  );

  const getWeightUnitText = useCallback(() => {
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
  }, [getText, weightUnit]);

  const displayImageUrl = useMemo(() => {
    if (!hasImage || hasImageError) {
      return settings?.placeholderImage || "";
    }
    return imageUrl;
  }, [hasImage, hasImageError, imageUrl, settings?.placeholderImage]);

  const showSpinner = isImageLoading;
  const showImage = !!displayImageUrl;

  const popup = (
    <ProductPopup
      imageUrl={imageUrl}
      name={name}
      description={description}
      weight={weight}
      weightUnit={weightUnit}
      price={price}
      currency={currency}
      id={id}
      isOpen={isPopupOpen}
      onClose={handleClosePopup}
      isImageLoading={isImageLoading}
      hasImageError={hasImageError}
      onImageError={handleImageError}
      onImageLoad={handleImageLoad}
      hasImage={hasImage}
    />
  );

  if (viewMode === "grid") {
    return (
      <div className="productCard-body">
        <div
          className="product-card grid tile"
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          style={
            {
              "--card-border-color": settings?.cardBorderColor || "#ffffff2e",
            } as React.CSSProperties
          }
        >
          {showSpinner && (
            <div className="image-loading-animation">
              <div className="spinner"></div>
            </div>
          )}
          {showImage && (
            <img
              src={displayImageUrl}
              alt={localizedName}
              className="tile-photo"
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              decoding="async"
              key={`${id}-image`}
              style={{ opacity: isImageLoading ? 0 : 1 }}
            />
          )}
          <div className="tile-shade" />
          <h3 className="tile-name">{localizedName}</h3>
          <div className="tile-badges">
            {weight && (
              <span className="tile-weight">
                {weight} {getWeightUnitText()}
              </span>
            )}
            <span className="tile-price">
              {price} {currency}
            </span>
          </div>
        </div>
        {popup}
      </div>
    );
  }

  const listDescription = localizedDescription
    ?.split("/")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");

  return (
    <div className="productCard-body">
      <div
        className="list-row"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
      >
        <div className="list-photo">
          {showSpinner && (
            <div className="image-loading-animation">
              <div className="spinner"></div>
            </div>
          )}
          {showImage && (
            <img
              src={displayImageUrl}
              alt={localizedName}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              decoding="async"
              key={`${id}-image`}
              style={{ opacity: isImageLoading ? 0 : 1 }}
            />
          )}
        </div>

        <div className="list-info">
          <h3 className="list-name">{localizedName}</h3>
          {listDescription && <p className="list-desc">{listDescription}</p>}
          <div className="list-badges">
            {weight && (
              <span className="list-weight">
                {weight} {getWeightUnitText()}
              </span>
            )}
            <span className="list-price">
              {price} {currency}
            </span>
          </div>
        </div>
      </div>
      {popup}
    </div>
  );
};

export default React.memo(ProductCard);
