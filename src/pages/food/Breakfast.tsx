import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";

const Breakfast = () => {
  return (
    <div>
      <h1> 🍳Breakfast</h1>
      <div className="product-container">
      {products.breakfast.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Breakfast;