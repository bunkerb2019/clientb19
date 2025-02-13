import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";
import { Icons } from "../../components/Icons";
const Drinks = () => {
  return (
    <div>
       <span className="category-header"><img src={Icons.drinks} alt="Drinks" className="icon" /> Drinks</span>
      <div className="product-container">
      {products.drinks.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Drinks;