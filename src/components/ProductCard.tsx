import { useState } from "react";
import "./ProductCard.scss";
import { useTranslation } from 'react-i18next';
interface ProductProps {
  image: string;
  name: string;
  description: string;
  weight?: string;
  price: number;
}


const ProductCard = ({ image, name, description, weight, price }: ProductProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { t } = useTranslation();

  
  const imagePath = image.startsWith("http") ? image : new URL(`/src/assets/${image}`, import.meta.url).href;

  return (
    <>
      <div className="product-card" onClick={() => setIsPopupOpen(true)}>
        <img src={imagePath} alt={name} className="product-image" />
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
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <img src={imagePath} alt={name} className="popup-image" />
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