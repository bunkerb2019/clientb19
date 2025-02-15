import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Icons } from "../../components/Icons";
import { useTranslation } from "react-i18next";

const Rolls = () => {
  const { t } = useTranslation();

  return (
    <div>
      <span className="category-header">
        <img src={Icons.rolls} alt="Rolls" className="icon" />{" "}
        {t("navigation.rolls")}
      </span>
      <div className="product-container">
        {products.rolls.map((dish, index) => (
          <ProductCard key={index} {...dish} />
        ))}
      </div>
    </div>
  );
};

export default Rolls;
