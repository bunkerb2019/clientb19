import { useState, useEffect } from "react";
import "./Random.scss";
import { useTranslation } from 'react-i18next';

interface DataType {
  bar: {
    cocktail: Array<{ name: string; description: string }>;
  };
  product: {
    asia: Array<{ name: string; description: string }>;
    rolls: Array<{ name: string; description: string }>;
    salad: Array<{ name: string; description: string }>;
  };
  hookah: {
    flavour: Array<{ name: string; description: string }>;
  };
}

const Random = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<DataType | null>(null);
  const [positions, setPositions] = useState([-1, -1, -1]);
  const [selectedItem, setSelectedItem] = useState<{ name: string; description: string } | null>(null);
  const [hasSpun, setHasSpun] = useState([false, false, false]);

  useEffect(() => {
    const loadData = async (lang: string) => {
      try {
        const localizedData = await import(`../../src/locales/${lang}.json`);
        setData({
          bar: localizedData.default.bar,
          product: localizedData.default.product,
          hookah: localizedData.default.hookah
        });
      } catch (e) {
        const defaultData = await import(`../../src/locales/en.json`);
        setData({
          bar: defaultData.default.bar,
          product: defaultData.default.product,
          hookah: defaultData.default.hookah
        });
      }
    };

    loadData(i18n.language);
  }, [i18n.language]);

  if (!data) return <div>Loading...</div>;

  // Получаем данные из локализованного JSON
  const barItems = data.bar.cocktail;
  const foodItems = [
    ...data.product.asia,
    ...data.product.rolls,
    ...data.product.salad,
  ];
  const hookahItems = data.hookah.flavour;

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
      <h1>🎰  {t('random.slotmachine')} </h1>
      <p> {t('random.rules')}</p>

      <div className="slots">
        {/* BAR Slot */}
        <div className="slot">
          <h2 className="slot-title"> {t('navigation.bar')}</h2>
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
            <button onClick={() => spinSingle(0, "bar")}> {t('random.spin')} 🎲</button>
          </div>
        </div>

        {/* FOOD Slot */}
        <div className="slot">
          <h2 className="slot-title">{t('navigation.food')}</h2>
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
            <button onClick={() => spinSingle(1, "food")}> {t('random.spin')} 🎲</button>
          </div>
        </div>

        {/* HOOKAH Slot */}
        <div className="slot">
          <h2 className="slot-title">{t('navigation.hookah')}</h2>
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
            <button onClick={() => spinSingle(2, "hookah")}> {t('random.spin')} 🎲</button>
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