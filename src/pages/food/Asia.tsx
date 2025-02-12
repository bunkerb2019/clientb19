import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Outlet } from "react-router-dom";
import { Icons } from "../../components/Icons";
const Asia = () => {
  return (
    <div>
      <span className="category-header"><img src={Icons.asia} alt="Asia" className="icon" /> Asia</span>
      
      <div className="product-container">
      <Outlet />
      {products.asia.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Asia;