import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";
import { Icons } from "../../components/Icons";

const Alcohol = () => {
  return (
    <div>
     <span className="category-header"><img src={Icons.alcohol} alt="Alcohol" className="icon" /> Alcohol</span>
      <div className="product-container">
      {products.alcohol.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Alcohol;