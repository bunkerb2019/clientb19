import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";
import { Icons } from "../../components/Icons";

const Cocktail = () => {
  return (
    <div>
      <span className="category-header"><img src={Icons.cocktail} alt="Cocktail" className="icon" /> Cocktail</span>
      <div className="product-container">
      {products.cocktail.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Cocktail;