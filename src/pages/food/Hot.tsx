import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";

const Hot = () => {
  return (
    <div>
      <h1>🥩 HOT</h1>
      <div className="product-container">
      {products.hot.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Hot;