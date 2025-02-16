import ProductCard from "../../components/ProductCard";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Dessert = () => {
  const { t } = useTranslation();
  
  // Получаем данные десертов для текущего языка
  const desserts = t('product.dessert', { returnObjects: true });

  return (
    <div>
      <span className="category-header">
        <img src={Icons.dessert} alt="Dessert" className="icon" />  
        {t('navigation.dessert')}
      </span>
      
      <div className="product-container">
        {Array.isArray(desserts) && desserts.map((dessert, index) => (
          <ProductCard key={index} {...dessert} />
        ))}
      </div>
    </div>
  );
};

export default Dessert;