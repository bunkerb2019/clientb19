import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';


const Salad = () => {
  const { t } = useTranslation();

  return (
    <div>
      <span className="category-header"><img src={Icons.salad} alt="Salad" className="icon" />  {t('navigation.salad')}
      </span>
      <div className="product-container">
      {products.salad.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Salad;