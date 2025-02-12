import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";

const Salate = () => {
  return (
    <div>
      <h1>🥗 SALATE</h1>
      <div className="product-container">
      {products.salate.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Salate;