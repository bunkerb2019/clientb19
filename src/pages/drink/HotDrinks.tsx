import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";
import { Icons } from "../../components/Icons"; 

const HotDrinks = () => {
  return (
    <div>
       <span className="category-header"><img src={Icons.hotdrinks} alt="HotDrinks" className="icon" /> Hot Drinks</span>
      <div className="product-container">
      {products.hotdrinks.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default HotDrinks;