import ProductCard from "../../components/ProductCard";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Soup = () => {
  const { t } = useTranslation();
  
  // Получаем данные супов для текущего языка
  const soups = t('product.soup', { returnObjects: true });

  return (
    <div>
      <span className="category-header">
        <img src={Icons.soup} alt="Soup" className="icon" />  
        {t('navigation.soup')}
      </span>
      
      <div className="product-container">
        {Array.isArray(soups) && soups.map((soup, index) => (
          <ProductCard key={index} {...soup} />
        ))}
      </div>
    </div>
  );
};

export default Soup;