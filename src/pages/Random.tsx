import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./Random.scss";
import { useRandomSettings } from "../hooks/useRandomSettings";
import useMenuItems from "../modules/useMenuItems";
import useCategories from "../modules/useCategories";
import { Order, RandomizerConfig } from "../utils/types";
import logo from "../assets/logo.svg";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import useSettings from "../modules/useSettings";
import { useLanguage } from "../contexts/LanguageContext";
import spinSound from "../assets/spin.wav";

const Random = () => {
  const { getText } = useLanguage();
  const [positions, setPositions] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [hasSpun, setHasSpun] = useState<boolean[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [popupImageUrl, setPopupImageUrl] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [hasImageError, setHasImageError] = useState<boolean>(false);
  const { data: settings } = useSettings();

  const spinAudioRef = useRef<HTMLAudioElement | null>(null);

  const { data: randomSettings, isLoading, error } = useRandomSettings();
  const { data: wholeMenu = [] } = useMenuItems();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    spinAudioRef.current = new Audio(spinSound);
    spinAudioRef.current.volume = 0.5;

    return () => {
      if (spinAudioRef.current) {
        spinAudioRef.current.pause();
        spinAudioRef.current = null;
      }
    };
  }, []);

  const defaultSettings = useMemo(
    () => ({
      pageTitle: { ru: "Рандомайзер", ro: "Randomizator", en: "Randomizer" },
      pageDescription: { ru: "", ro: "", en: "" },
      randomizers: [],
    }),
    []
  );

  const currentSettings = randomSettings || defaultSettings;

  const handleImageError = useCallback(() => {
    setHasImageError(true);
    setIsImageLoading(false);
    setPopupImageUrl(settings?.placeholderImage || logo);
  }, [settings?.placeholderImage]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
    setHasImageError(false);
  }, []);

  useEffect(() => {
    if (selectedItem?.image) {
      setIsImageLoading(true);
      setHasImageError(false);
      
      const fetchImage = async () => {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, selectedItem.image);
          const url = await getDownloadURL(imageRef);
          setPopupImageUrl(url);
        } catch (error) {
          console.error("Error loading image:", error);
          handleImageError();
        }
      };
      fetchImage();
    } else {
      setPopupImageUrl(settings?.placeholderImage || logo);
      setIsImageLoading(false);
      setHasImageError(false);
    }
  }, [selectedItem, settings?.placeholderImage, handleImageError]);

  const categoryIdToNameMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => {
      if (category?.id && category?.ru) {
        map.set(category.id, category.ru);
      }
    });
    return map;
  }, [categories]);

  useEffect(() => {
    if (currentSettings.randomizers) {
      const activeRandomizers = currentSettings.randomizers.filter(
        (r) => r?.active
      );
      setPositions(new Array(activeRandomizers.length).fill(-1));
      setHasSpun(new Array(activeRandomizers.length).fill(false));
    }
  }, [currentSettings.randomizers]);

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

    try {
      if (spinAudioRef.current) {
        spinAudioRef.current.currentTime = 0;
        await spinAudioRef.current.play().catch(console.error);
      }
    } catch (e) {
      console.error("Audio error:", e);
    }

    const spinDuration = 4000;
    const startTime = performance.now();
    const spins = Math.floor(Math.random() * 10) + 25;
    const finalPos = Math.floor(Math.random() * items.length);
    let animationFrameId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      let easing;
      if (progress < 0.5) {
        easing = Math.pow(progress / 0.5, 1.5);
      } else if (progress < 0.8) {
        easing = 0.5 + 0.3 * ((progress - 0.5) / 0.3);
      } else {
        easing = 0.8 + 0.2 * (1 - Math.pow(1 - (progress - 0.8) / 0.2, 3));
      }

      if (progress < 1) {
        const rotationFactor =
          easing < 0.8
            ? easing * items.length * spins
            : 0.8 * items.length * spins + (easing - 0.8) * 10;

        const tempPos = Math.floor(rotationFactor % items.length);
        setPositions((prev) =>
          prev.map((pos, i) => (i === index ? tempPos : pos))
        );
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setPositions((prev) =>
          prev.map((pos, i) => (i === index ? finalPos : pos))
        );

        setTimeout(() => {
          setIsSpinning(false);
          setSelectedItem(items[finalPos]);
          setIsPopupVisible(true);
        }, 500);
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

  const shouldShowImage = !!selectedItem?.image && !hasImageError;
  const finalImageUrl = shouldShowImage ? popupImageUrl : settings?.placeholderImage || logo;

  return (
    <div className="slot-machine">
      <h1>{getText(currentSettings.pageTitle, "Рандомайзер")}</h1>
      {currentSettings.pageDescription && (
        <p>{getText(currentSettings.pageDescription)}</p>
      )}

      <div className="slots">
        {activeRandomizers.map((randomizer, index) => {
          const items = getItemsForRandomizer(randomizer);
          const currentPosition = positions[index];
          const isCurrentSpinning = isSpinning && hasSpun[index];

          return (
            <div className="slot" key={randomizer?.id || index}>
              <h2 className="slot-title">
                {getText(randomizer?.slotTitle, "Случайный выбор")}
              </h2>
              <div className="slot-row">
                <div className="reel">
                  {!hasSpun[index] && <div className="question-mark">?</div>}
                  <div
                    className={`reelInner ${
                      isCurrentSpinning ? "spinning" : ""
                    }`}
                    style={{
                      transform: `translateY(-${currentPosition * 70}px)`,
                      transition: isCurrentSpinning
                        ? "none"
                        : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    {items.map((item, i) => (
                      <div
                        key={`${randomizer?.id || index}-${i}`}
                        className="symbol"
                        onClick={() => {
                          if (!isSpinning) {
                            setSelectedItem(item);
                            setIsPopupVisible(true);
                          }
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
                  <span>Spin 🎲</span>
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
              {isImageLoading && shouldShowImage && (
                <div className="image-loading-animation">
                  <div className="spinner"></div>
                </div>
              )}
              <img
                src={finalImageUrl}
                alt={getText(selectedItem?.name, "Без названия")}
                className={`popup-image ${isImageLoading ? 'loading' : ''} ${hasImageError ? 'error' : ''}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{ opacity: isImageLoading ? 0 : 1 }}
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