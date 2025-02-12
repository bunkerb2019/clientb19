import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";

const Cocktail = () => {
  return (
    <div>
      <h1>🍸 Cocktail</h1>
      <div className="product-container">
      {products.cocktail.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Cocktail;