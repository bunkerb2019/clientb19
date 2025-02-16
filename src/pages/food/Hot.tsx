import ProductCard from "../../components/ProductCard";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Hot = () => {
  const { t } = useTranslation();
  
  // Получаем данные горячих блюд для текущего языка
  const hotDishes = t('product.hot', { returnObjects: true });

  return (
    <div>
      <span className="category-header">
        <img src={Icons.hot} alt="Hot" className="icon" />  
        {t('navigation.hot')}
      </span>
      
      <div className="product-container">
        {Array.isArray(hotDishes) && hotDishes.map((dish, index) => (
          <ProductCard key={index} {...dish} />
        ))}
      </div>
    </div>
  );
};

export default Hot;