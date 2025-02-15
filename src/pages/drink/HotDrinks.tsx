import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";
import { Icons } from "../../components/Icons"; 
import { useTranslation } from 'react-i18next';

const HotDrinks = () => {
  const { t } = useTranslation();
  return (
    <div>
       <span className="category-header"><img src={Icons.hotdrinks} alt="HotDrinks" className="icon" />  {t('navigation.hotdrinks')}</span>
      <div className="product-container">
      {products.hotdrinks.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default HotDrinks;