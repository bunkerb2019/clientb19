import { useState } from "react";
import "./Random.scss";
import BarJson from "../../src/data/bar.json";
import Products from "../../src/data/products.json";
import Hookah from "../../src/data/hookah.json";

const barItems = BarJson.cocktail;
const foodItems = [
  ...Products.asia,
  ...Products.rolls,
  ...Products.salate,
];
const hookahItems = Hookah.flavour;

const Random = () => {
  const [positions, setPositions] = useState([-1, -1, -1]);
  const [selectedItem, setSelectedItem] = useState<{ name: string; description: string } | null>(null);
  const [hasSpun, setHasSpun] = useState([false, false, false]);

  const spinSingle = (index: number, category: string) => {
    const items = category === "bar" 
      ? barItems 
      : category === "food" 
      ? foodItems 
      : hookahItems;

    setHasSpun(prev => prev.map((val, i) => i === index ? true : val));
    setPositions(prev => prev.map((pos, i) => 
      i === index ? Math.floor(Math.random() * items.length) : pos
    ));
  };

  return (
    <div className="slot-machine">
      <h1>🎰 SLOT MACHINE </h1>
      <p>Rules: click the spin button for a random product at the Puer Lounge</p>

      <div className="slots">
        {/* BAR Slot */}
        <div className="slot">
          <h2 className="slot-title">BAR</h2>
          <div className="slot-row">
            <div className="reel">
              {!hasSpun[0] && <div className="question-mark">?</div>}
              <div
                className="reelInner"
                style={{ transform: `translateY(-${positions[0] * 80}px)` }}
              >
                {barItems.map((item, i) => (
                  <div key={i} className="symbol" onClick={() => setSelectedItem(item)}>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => spinSingle(0, "bar")}>SPIN 🎲</button>
          </div>
        </div>

        {/* FOOD Slot */}
        <div className="slot">
          <h2 className="slot-title">FOOD</h2>
          <div className="slot-row">
            <div className="reel">
              {!hasSpun[1] && <div className="question-mark">?</div>}
              <div
                className="reelInner"
                style={{ transform: `translateY(-${positions[1] * 80}px)` }}
              >
                {foodItems.map((item, i) => (
                  <div key={i} className="symbol" onClick={() => setSelectedItem(item)}>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => spinSingle(1, "food")}>SPIN 🎲</button>
          </div>
        </div>

        {/* HOOKAH Slot */}
        <div className="slot">
          <h2 className="slot-title">HOOKAH</h2>
          <div className="slot-row">
            <div className="reel">
              {!hasSpun[2] && <div className="question-mark">?</div>}
              <div
                className="reelInner"
                style={{ transform: `translateY(-${positions[2] * 80}px)` }}
              >
                {hookahItems.map((item, i) => (
                  <div key={i} className="symbol" onClick={() => setSelectedItem(item)}>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => spinSingle(2, "hookah")}>SPIN 🎲</button>
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="popup" onClick={() => setSelectedItem(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.description}</p>
            <button onClick={() => setSelectedItem(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Random;