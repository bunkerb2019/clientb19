import BarCard from "../../components/BarCard";
// import products from "../../data/bar.json";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const ChampagneWine = () => {
  const { t } = useTranslation();
  const dishes = t('bar.champanewine', { returnObjects: true });
  return (
    <div>
      <span className="category-header"><img src={Icons.champagne} alt="Champagne&Bar" className="icon" />  {t('navigation.champagne')}
      </span>
      <div className="product-container">
      {Array.isArray(dishes) && dishes.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default ChampagneWine;