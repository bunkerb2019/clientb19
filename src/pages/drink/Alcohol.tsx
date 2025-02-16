import BarCard from "../../components/BarCard";
// import products from "../../data/bar.json";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Alcohol = () => {
  const { t } = useTranslation();
  const dishes = t('bar.alcohol', { returnObjects: true });
  return (
    <div>
     <span className="category-header"><img src={Icons.alcohol} alt="Alcohol" className="icon" />  {t('navigation.alcohol')}
     </span>
      <div className="product-container">
      {Array.isArray(dishes) && dishes.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Alcohol;