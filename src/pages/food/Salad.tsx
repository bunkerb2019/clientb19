import ProductCard from "../../components/ProductCard";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Salad = () => {
  const { t } = useTranslation();
  
  // Получаем данные салатов для текущего языка
  const salads = t('product.salad', { returnObjects: true });

  return (
    <div>
      <span className="category-header">
        <img src={Icons.salad} alt="Salad" className="icon" />  
        {t('navigation.salad')}
      </span>
      
      <div className="product-container">
        {Array.isArray(salads) && salads.map((salad, index) => (
          <ProductCard key={index} {...salad} />
        ))}
      </div>
    </div>
  );
};

export default Salad;