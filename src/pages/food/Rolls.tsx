import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";

const Rolls = () => {
  return (
    <div>
      <h1>🍣 Rolls</h1>
      <div className="product-container">
      {products.rolls.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Rolls;