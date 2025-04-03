import { useState, useEffect, useCallback, useMemo } from "react";
import "./Random.scss";
import { useRandomSettings } from "../hooks/useRandomSettings";
import useMenuItems from "../modules/useMenuItems";
import useCategories from "../modules/useCategories";
import { Order, RandomizerConfig } from "../utils/types";
import puerlogo from "../assets/puerlogo.svg";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import useSettings from "../modules/useSettings";
import { useLanguage } from "../contexts/LanguageContext";

const Random = () => {
  const { getText } = useLanguage();
  const [positions, setPositions] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [hasSpun, setHasSpun] = useState<boolean[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [popupImageUrl, setPopupImageUrl] = useState<string>("");
  const { data: settings } = useSettings();

  const { data: randomSettings, isLoading, error } = useRandomSettings();

  const { data: wholeMenu = [] } = useMenuItems();
  const { data: categories = [] } = useCategories();

  // Инициализация дефолтных значений
  const defaultSettings = useMemo(
    () => ({
      pageTitle: { ru: "Рандомайзер", ro: "Randomizator", en: "Randomizer" },
      pageDescription: { ru: "", ro: "", en: "" },
      randomizers: [],
    }),
    []
  );

  const currentSettings = randomSettings || defaultSettings;

  // Загрузка изображения для попапа
  useEffect(() => {
    if (selectedItem?.image) {
      const fetchImage = async () => {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, selectedItem.image);
          const url = await getDownloadURL(imageRef);
          setPopupImageUrl(url);
        } catch (error) {
          console.error("Error loading image:", error);
          setPopupImageUrl(settings?.placeholderImage || puerlogo);
        }
      };
      fetchImage();
    }
  }, [selectedItem, settings?.placeholderImage]);

  // Карта соответствия ID категорий их названиям
  const categoryIdToNameMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => {
      if (category?.id && category?.ru) {
        map.set(category.id, category.ru);
      }
    });
    return map;
  }, [categories]);

  // Инициализация позиций
  useEffect(() => {
    if (currentSettings.randomizers) {
      const activeRandomizers = currentSettings.randomizers.filter(
        (r) => r?.active
      );
      setPositions(new Array(activeRandomizers.length).fill(-1));
      setHasSpun(new Array(activeRandomizers.length).fill(false));
    }
  }, [currentSettings.randomizers]); // Зависимость только от randomizers

  // Получение товаров для рандомайзера
  const getItemsForRandomizer = useCallback(
    (randomizer: RandomizerConfig): Order[] => {
      if (!randomizer?.categoryIds?.length) return [];

      const categoryNames = randomizer.categoryIds
        .map((id: string) => categoryIdToNameMap.get(id))
        .filter(Boolean) as string[];

      return wholeMenu.filter(
        (item) => item?.category && categoryNames.includes(item.category)
      );
    },
    [wholeMenu, categoryIdToNameMap]
  );

  // Вращение с плавной анимацией
  const spinSingle = async (index: number, randomizerId: string) => {
    if (isSpinning) return;

    const randomizer = currentSettings.randomizers.find(
      (r) => r?.id === randomizerId
    );
    if (!randomizer) return;

    const items = getItemsForRandomizer(randomizer);
    if (items.length === 0) {
      alert("Нет доступных товаров в выбранных категориях");
      return;
    }

    setIsSpinning(true);
    setHasSpun((prev) => prev.map((val, i) => (i === index ? true : val)));

    // Параметры анимации
    const spinDuration = 2500;
    const startTime = performance.now();
    const spins = Math.floor(Math.random() * 10) + 20;
    let animationFrameId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      const easing =
        progress < 0.9
          ? Math.pow(progress / 0.9, 2)
          : 1 - Math.pow((1 - progress) / 0.1, 4);

      if (progress < 1) {
        const tempPos =
          Math.floor(easing * items.length * spins) % items.length;
        setPositions((prev) =>
          prev.map((pos, i) => (i === index ? tempPos : pos))
        );
        animationFrameId = requestAnimationFrame(animate);
      } else {
        const finalPos = Math.floor(Math.random() * items.length);

        setPositions((prev) =>
          prev.map((pos, i) => (i === index ? finalPos : pos))
        );

        setTimeout(() => {
          setIsSpinning(false);
          setSelectedItem(items[finalPos]);
          setIsPopupVisible(true);
        }, 400);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  };

  const closePopup = useCallback(() => {
    if (isSpinning) return;
    setIsPopupVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  }, [isSpinning]);

  if (isLoading) return <div className="loading">Загрузка...</div>;
  if (error)
    return <div className="error">Ошибка загрузки настроек рандомайзера</div>;
  if (!categories.length)
    return <div className="error">Ошибка загрузки категорий</div>;

  const activeRandomizers =
    currentSettings.randomizers?.filter((r) => r?.active) || [];

  return (
    <div className="slot-machine">
      <h1>{getText(currentSettings.pageTitle, "Рандомайзер")}</h1>
      {currentSettings.pageDescription && (
        <p>{getText(currentSettings.pageDescription)}</p>
      )}

      <div className="slots">
        {activeRandomizers.map((randomizer, index) => {
          const items = getItemsForRandomizer(randomizer);

          return (
            <div className="slot" key={randomizer?.id || index}>
              <h2 className="slot-title">
                {getText(randomizer?.slotTitle, "Случайный выбор")}
              </h2>
              <div className="slot-row">
                <div className="reel">
                  {!hasSpun[index] && <div className="question-mark">?</div>}
                  <div
                    className="reelInner"
                    style={{
                      transform: `translateY(-${positions[index] * 70}px)`,
                    }}
                  >
                    {items.map((item, i) => (
                      <div
                        key={`${randomizer?.id || index}-${i}`}
                        className="symbol"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsPopupVisible(true);
                        }}
                      >
                        {getText(item.name, `Item ${i}`)}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => spinSingle(index, randomizer.id)}
                  disabled={items.length === 0 || isSpinning}
                  className={isSpinning ? "spinning" : ""}
                >
                  {isSpinning ? "..." : "Spin 🎲"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div
          className={`popup-overlay ${isPopupVisible ? "visible" : ""}`}
          onClick={closePopup}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-image-container">
              <img
                src={popupImageUrl || settings?.placeholderImage || puerlogo}
                alt={getText(selectedItem?.name, "Без названия")}
                className="popup-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    settings?.placeholderImage || puerlogo;
                }}
              />
            </div>

            <div className="popup-text-content">
              <h3 className="popup-name">
                {getText(selectedItem?.name, "Без названия")}
              </h3>
              <p className="popup-description">
                {getText(selectedItem?.description)}
              </p>

              <div className="popup-details">
                {selectedItem?.weight && (
                  <p className="popup-weight">
                    {getText({ ru: "Вес", en: "Weight", ro: "Greutate" })}:{" "}
                    {selectedItem.weight}
                    {selectedItem.weightUnit &&
                      getText({
                        ru:
                          selectedItem.weightUnit === "g"
                            ? "г"
                            : selectedItem.weightUnit === "ml"
                            ? "мл"
                            : "кг",
                        en: selectedItem.weightUnit,
                        ro: selectedItem.weightUnit,
                      })}
                  </p>
                )}
                {selectedItem?.price && (
                  <p className="popup-price">
                    {getText({ ru: "Цена", en: "Price", ro: "Preț" })}:{" "}
                    {selectedItem.price}
                    {selectedItem.currency || "$"}
                  </p>
                )}
              </div>
            </div>

            <button className="close-button" onClick={closePopup}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Random;
