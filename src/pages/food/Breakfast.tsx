import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Icons } from "../../components/Icons";
const Breakfast = () => {
  return (
    <div>
       <span className="category-header"><img src={Icons.breakfast} alt="Breakfast" className="icon" /> Breakfast</span>
      <div className="product-container">
      {products.breakfast.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Breakfast;