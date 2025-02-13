import ProductCard from "../../components/ProductCard";
import products from "../../data/products.json";
import { Icons } from "../../components/Icons";

const Soup = () => {
  return (
    <div>
     <span className="category-header"><img src={Icons.soup} alt="Soup" className="icon" /> Soup</span>
      <div className="product-container">
      {products.soup.map((dish, index) => (
        <ProductCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Soup;