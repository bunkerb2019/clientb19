import ProductCard from "../../components/ProductCard";
import { Icons } from "../../components/Icons";
import { useTranslation } from "react-i18next";

const Snack = () => {
  const { t } = useTranslation();
  
  // Получаем данные закусок для текущего языка
  const snacks = t('product.snack', { returnObjects: true });

  return (
    <div>
      <span className="category-header">
        <img src={Icons.snack} alt="Snack" className="icon" />{" "}
        {t("navigation.snack")}
      </span>
      <div className="product-container">
        {Array.isArray(snacks) && snacks.map((snack, index) => (
          <ProductCard key={index} {...snack} />
        ))}
      </div>
    </div>
  );
};

export default Snack;