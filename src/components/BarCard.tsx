import { useState } from "react";
import "./ProductCard.scss";

interface ProductProps {
  image?: string;
  name: string;
  description: string;
  weight?: string; // Теперь это необязательное поле
  price: number;
}

const BarCard = ({ image, name, description, weight, price }: ProductProps) => {
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
      {image && <img src={image} alt={name} className="product-image" />}  {/* Показывать картинку, если она есть */}
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        {weight && <p className="product-weight">Объем: {weight} ml</p>} {/* Показываем вес, если он есть */}
        <p className="product-price">Цена: {price} Lei</p>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>
              &times;
            </button>
            {image && <img src={image} alt={name} className="popup-image" />}  {/* Показывать картинку в попапе, если есть */}
            <h3 className="popup-name">{name}</h3>
            <p className="popup-description">{description}</p>
            {weight && <p className="popup-weight">Объем: {weight} ml</p>} {/* Показываем вес в попапе, если он есть */}
            <p className="popup-price">Цена: {price} Lei</p>
          </div>
        </div>
      )}
    </>
  );
};

export default BarCard;