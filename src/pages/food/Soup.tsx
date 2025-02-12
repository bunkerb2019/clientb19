import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";

const Soup = () => {
  return (
    <div>
      <h1>🍲 SOUP</h1>
      <div className="product-container">
      {products.soup.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Soup;