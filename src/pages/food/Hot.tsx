import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';


const Hot = () => {
  const { t } = useTranslation();

  return (
    <div>
      <span className="category-header"><img src={Icons.hot} alt="Hot" className="icon" />  {t('navigation.hot')}
      </span>
      <div className="product-container">
      {products.hot.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Hot;