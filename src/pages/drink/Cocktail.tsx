import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";
import { Icons } from "../../components/Icons";
import { useTranslation } from 'react-i18next';

const Cocktail = () => {
  const { t } = useTranslation();
  return (
    <div>
      <span className="category-header"><img src={Icons.cocktail} alt="Cocktail" className="icon" />  {t('navigation.cocktail')}
      </span>
      <div className="product-container">
      {products.cocktail.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Cocktail;