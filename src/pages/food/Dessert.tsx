import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Dessert = () => {
  const { t } = useTranslation();

  return (
    <div>
      <span className="category-header"><img src={Icons.dessert} alt="Dessert" className="icon" />  {t('navigation.dessert')}
      </span>
      <div className="product-container">
      {products.dessert.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Dessert;