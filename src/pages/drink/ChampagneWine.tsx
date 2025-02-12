import BarCard from "../../components/BarCard";
import products from "../../data/bar.json";

const ChampagneWine = () => {
  return (
    <div>
      <h1>🍾 Champagne & Wine</h1>
      <div className="product-container">
      {products.champanewine.map((dish, index) => (
        <BarCard key={index} {...dish} />
      ))}
      </div>
    </div>
  );
};

export default ChampagneWine;