import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Outlet } from "react-router-dom";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';


const Asia = () => {
  const { t } = useTranslation();
  return (
    <div>
      <span className="category-header"><img src={Icons.asia} alt="Asia" className="icon" />  {t('navigation.asia')}</span>
      
      <div className="product-container">
      <Outlet />
      {products.asia.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Asia;