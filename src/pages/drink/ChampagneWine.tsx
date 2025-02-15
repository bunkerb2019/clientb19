import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const ChampagneWine = () => {
  const { t } = useTranslation();

  return (
    <div>
      <span className="category-header"><img src={Icons.champagne} alt="Champagne&Bar" className="icon" />  {t('navigation.champagne')}
      </span>
      <div className="product-container">
      {products.champanewine.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default ChampagneWine;