import { useState } from "react";
import "./ProductCard.scss";

interface ProductProps {
  image: string;
  name: string;
  description: string;
  weight: string;
  price: number;
}


const getImagePath = (image: string) => new URL(`/src/assets/${image}`, import.meta.url).href;

const ProductCard = ({ image, name, description, weight, price }: ProductProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
        <p className="product-weight">Вес: {weight} g</p>
        <p className="product-price">Цена: {price} Lei</p>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>&times;</button>
            <img src={getImagePath(image)} alt={name} className="product-image" />
            <h3 className="popup-name">{name}</h3>
            <p className="popup-description">{description}</p>
            <p className="popup-weight">Вес: {weight}</p>
            <p className="popup-price">Цена: {price} Lei</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;