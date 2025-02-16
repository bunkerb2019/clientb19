import ProductCard from "../../components/ProductCard";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Breakfast = () => {
  const { t } = useTranslation();
  
  // Получаем данные для текущего языка
  const dishes = t('product.breakfast', { returnObjects: true });

  return (
    <div>
      <span className="category-header">
        <img src={Icons.breakfast} alt="Breakfast" className="icon" />  
        {t('navigation.breakfast')}
      </span>
      
      <div className="product-container">
        {Array.isArray(dishes) && dishes.map((dish, index) => (
          <ProductCard key={index} {...dish} />
        ))}
      </div>
    </div>
  );
};

export default Breakfast;