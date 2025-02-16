import ProductCard from "../../components/ProductCard";
import { Icons } from "../../components/Icons";
import { useTranslation } from "react-i18next";

const Rolls = () => {
  const { t } = useTranslation();
  
  // Получаем данные роллов для текущего языка
  const rolls = t('product.rolls', { returnObjects: true });

  return (
    <div>
      <span className="category-header">
        <img src={Icons.rolls} alt="Rolls" className="icon" />{" "}
        {t("navigation.rolls")}
      </span>
      <div className="product-container">
        {Array.isArray(rolls) && rolls.map((roll, index) => (
          <ProductCard key={index} {...roll} />
        ))}
      </div>
    </div>
  );
};

export default Rolls;