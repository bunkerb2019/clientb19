import { useState, useEffect } from "react";
import "./ProductCard.scss";
import { useTranslation } from "react-i18next";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import useSettings from "../modules/useSettings"; // Импортируем хук для настроек

interface ProductProps {
  image: string;
  name: string;
  description: string;
  weight?: string;
  price: number;
}

const ProductCard = ({
  image,
  name,
  description,
  weight,
  price,
}: ProductProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string>("");
  const { data: settings } = useSettings(); // Загружаем настройки

  const fetchImageUrl = async (imagePath: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    return await getDownloadURL(imageRef);
  };

  // Загружаем URL изображения при монтировании компонента
  useEffect(() => {
    if (image) {
      fetchImageUrl(image)
        .then((url) => setImageUrl(url))
        .catch((error) => console.error("Error fetching image URL:", error));
    }
  }, [image]);

  // Стили для карточки товара
  const cardStyle = {
    backgroundColor: settings?.cardBackgroundColor || "rgba(0, 0, 0, 0.88)",
    borderColor: settings?.cardBorderColor || "#ffffff89",
    color: settings?.cardTextColor || "#fff",
    opacity: settings?.cardBackgroundOpacity || 1,
    backdropFilter: `blur(${settings?.cardBlur || 0}px)`,
  };

  // Стили для попапа
  const popupStyle = {
    backgroundColor: settings?.cardBackgroundColor || "rgba(0, 0, 0, 0.9)",
    borderColor: settings?.cardBorderColor || "#ffffff89",
    color: settings?.cardTextColor || "#fff",
    opacity: settings?.cardBackgroundOpacity || 1,
    backdropFilter: `blur(${settings?.cardBlur || 0}px)`,
  };

  return (
    <>
      <div
        className="product-card"
        style={cardStyle}
        onClick={() => setIsPopupOpen(true)}
      >
        <img
          src={imageUrl || settings?.placeholderImage || "/default-image.png"} // Заглушка из настроек или локальная
          alt={name}
          className="product-image"
        />
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        {weight && (
          <p className="product-weight">
            {t("product.weight")}: {weight} {t("product.gram")}
          </p>
        )}
        <p className="product-price">
          {t("product.price")}: {price} {t("product.currency")}
        </p>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div
            className="popup-content"
            style={popupStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl || settings?.placeholderImage || "/default-image.png"} // Заглушка из настроек или локальная
              alt={name}
              className="popup-image"
            />
            <h3 className="popup-name">{name}</h3>
            <p className="popup-description">{description}</p>
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
      )}
    </>
  );
};

export default ProductCard;