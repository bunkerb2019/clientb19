import { useState } from "react";
import "./ProductCard.scss";
import { useTranslation } from 'react-i18next';
interface ProductProps {
  image: string;
  name: string;
  description: string;
  weight: number;
  price: number;
}


const getImagePath = (image: string) => new URL(`/src/assets/${image}`, import.meta.url).href;

const ProductCard = ({ image, name, description, weight, price }: ProductProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { t } = useTranslation();
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = (event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращает всплытие события клика
    setIsPopupOpen(false);
  };

  return (
    <>
    <div className="product-card" onClick={openPopup}>
      <img src={getImagePath(image)} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <p className="product-description">{description}</p>
      <p className="product-weight">
        {t('product.weight')}: {weight} {t('product.gram')}
      </p>
      <p className="product-price">
        {t('product.price')}: {price} {t('product.currency')}
      </p>
    </div>

    {isPopupOpen && (
      <div className="popup-overlay" onClick={closePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <img src={getImagePath(image)} alt={name} className="product-image" />
            <h3 className="popup-name">{name}</h3>
            <p className="popup-description">{description}</p>
          <p className="popup-weight">
            {t('product.weight')}: {weight}{t('product.gram')}
          </p>
          <p className="popup-price">
            {t('product.price')}: {price} {t('product.currency')}
          </p>
        </div>
      </div>
    )}
  </>
  );
};

export default ProductCard;