import BarCard from "../../components/BarCard";
// import products from "../../data/bar.json";
import { Icons } from "../../components/Icons"; 
import { useTranslation } from 'react-i18next';

const HotDrinks = () => {
  const { t } = useTranslation();
  const dishes = t('bar.hotdrinks', { returnObjects: true });
  return (
    <div>
       <span className="category-header"><img src={Icons.hotdrinks} alt="HotDrinks" className="icon" />  {t('navigation.hotdrinks')}</span>
      <div className="product-container">
      {Array.isArray(dishes) && dishes.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default HotDrinks;