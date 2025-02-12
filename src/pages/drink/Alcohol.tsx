import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";

const Alcohol = () => {
  return (
    <div>
      <h1>🧊 Alcohol</h1>
      <div className="product-container">
      {products.alcohol.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default Alcohol;