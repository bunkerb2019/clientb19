import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";

const HotDrinks = () => {
  return (
    <div>
      <h1>🔥 Hot Drinks</h1>
      <div className="product-container">
      {products.hotdrinks.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default HotDrinks;