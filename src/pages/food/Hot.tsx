import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Icons } from "../../components/Icons";

const Hot = () => {
  return (
    <div>
      <span className="category-header"><img src={Icons.hot} alt="Hot" className="icon" /> Hot</span>
      <div className="product-container">
      {products.hot.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Hot;