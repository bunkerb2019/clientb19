import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";
import { Icons } from "../../components/Icons";

const ChampagneWine = () => {
  return (
    <div>
      <span className="category-header"><img src={Icons.champagne} alt="Champagne&Bar" className="icon" /> Champagne & Bar</span>
      <div className="product-container">
      {products.champanewine.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default ChampagneWine;