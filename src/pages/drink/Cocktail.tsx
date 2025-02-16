import BarCard from "../../components/BarCard";
// import products from "../../data/bar.json";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Cocktail = () => {
  const { t } = useTranslation();

  const dishes = t('bar.cocktail', { returnObjects: true });
  return (
    <div>
      <span className="category-header"><img src={Icons.cocktail} alt="Cocktail" className="icon" />  {t('navigation.cocktail')}
      </span>
      <div className="product-container">
      {Array.isArray(dishes) && dishes.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Cocktail;