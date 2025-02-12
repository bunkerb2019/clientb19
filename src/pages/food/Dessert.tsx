import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";

const Dessert = () => {
  return (
    <div>
      <h1>🍰 Dessert</h1>
      <div className="product-container">
      {products.dessert.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Dessert;