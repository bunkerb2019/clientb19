import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";

const Drinks = () => {
  return (
    <div>
      <h1>🔥 Hot</h1>
      <div className="product-container">
      {products.drinks.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Drinks;