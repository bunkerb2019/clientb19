import ProductCard from "../../components/ProductCard";
import { Outlet } from "react-router-dom";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Asia = () => {
  const { t } = useTranslation();
  
  // Получаем массив продуктов для текущего языка
  const dishes = t('product.asia', { returnObjects: true });

  return (
    <div>
      <span className="category-header">
        <img src={Icons.asia} alt="Asia" className="icon" />  
        {t('navigation.asia')}
      </span>
      
      <div className="product-container">
        <Outlet />
        {Array.isArray(dishes) && dishes.map((dish, index) => (
          <ProductCard key={index} {...dish} />
        ))}
      </div>
    </div>
  );
};

export default Asia;