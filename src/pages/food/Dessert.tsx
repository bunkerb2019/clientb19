import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Icons } from "../../components/Icons";

const Dessert = () => {
  return (
    <div>
      <span className="category-header"><img src={Icons.dessert} alt="Dessert" className="icon" /> Dessert</span>
      <div className="product-container">
      {products.dessert.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Dessert;