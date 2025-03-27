import { useState, useEffect, useCallback, useMemo } from "react";
import "./Random.scss";
import { useRandomSettings } from "../hooks/useRandomSettings";
import useMenuItems from "../modules/useMenuItems";
import useCategories from "../modules/useCategories";
import { Order, RandomizerConfig } from "../utils/types";
import puerlogo from "../assets/puerlogo.svg";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useTranslation } from "react-i18next";
import useSettings from "../modules/useSettings";

const Random = () => {
  const { t } = useTranslation();
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
    categories.forEach(category => {
      map.set(category.id, category.ru);
    });
    return map;
  }, [categories]);

  // Инициализация позиций
  useEffect(() => {
    if (randomSettings?.randomizers) {
      const activeRandomizers = randomSettings.randomizers.filter(r => r.active);
      setPositions(Array(activeRandomizers.length).fill(-1));
      setHasSpun(Array(activeRandomizers.length).fill(false));
    }
  }, [randomSettings]);

  // Получение товаров для рандомайзера
  const getItemsForRandomizer = useCallback((randomizer: RandomizerConfig): Order[] => {
    if (!randomizer.categoryIds?.length) return [];

    const categoryNames = randomizer.categoryIds
      .map(id => categoryIdToNameMap.get(id))
      .filter(Boolean);
    
    return wholeMenu.filter(item => 
      categoryNames.includes(item.category)
    );
  }, [wholeMenu, categoryIdToNameMap]);

  // Вращение с плавной анимацией
  const spinSingle = async (index: number, randomizerId: string) => {
    if (isSpinning) return;
    
    const randomizer = randomSettings?.randomizers?.find(r => r.id === randomizerId);
    if (!randomizer) return;
  
    const items = getItemsForRandomizer(randomizer);
    if (items.length === 0) {
      alert(t("random.no_items"));
      return;
    }
  
    setIsSpinning(true);
    setHasSpun(prev => prev.map((val, i) => i === index ? true : val));
  
    // Параметры анимации
    const spinDuration = 2500;
    const startTime = performance.now();
    const spins = Math.floor(Math.random() * 10) + 20; // Случайное количество полных вращений
    let animationFrameId: number;
  
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Сложная функция замедления в конце
      const easing = progress < 0.9 
        ? Math.pow(progress / 0.9, 2)  // Быстрое начало
        : 1 - Math.pow((1 - progress) / 0.1, 4);  // Медленная остановка
      
      if (progress < 1) {
        // Случайное перемещение по элементам
        const tempPos = Math.floor(easing * items.length * spins) % items.length;
        setPositions(prev => prev.map((pos, i) => 
          i === index ? tempPos : pos
        ));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Финальная случайная позиция
        const finalPos = Math.floor(Math.random() * items.length);
        
        // Точная остановка
        setPositions(prev => prev.map((pos, i) => 
          i === index ? finalPos : pos
        ));
        
        // Задержка для визуального эффекта остановки
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
    if (isSpinning) return; // Блокируем закрытие во время анимации
    setIsPopupVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  }, [isSpinning]);

  if (isLoading) return <div className="loading">{t("common.loading")}</div>;
  if (error) return <div className="error">{t("random.load_error")}</div>;
  if (!categories.length) return <div className="error">{t("categories.load_error")}</div>;

  const activeRandomizers = randomSettings?.randomizers?.filter(r => r.active) || [];

  return (
    <div className="slot-machine">
      <h1>🎰 {t("random.slotmachine")}</h1>
      <p>{t("random.rules")}</p>

      <div className="slots">
        {activeRandomizers.map((randomizer, index) => {
          const items = getItemsForRandomizer(randomizer);
          
          return (
            <div className="slot" key={randomizer.id}>
              <h2 className="slot-title">{randomizer.slotTitle}</h2>
              <div className="slot-row">
                <div className="reel">
                  {!hasSpun[index] && <div className="question-mark">?</div>}
                  <div
                    className="reelInner"
                    style={{ transform: `translateY(-${positions[index] * 70}px)` }}
                  >
                    {items.map((item, i) => (
                      <div
                        key={`${randomizer.id}-${i}`}
                        className="symbol"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsPopupVisible(true);
                        }}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => spinSingle(index, randomizer.id)}
                  disabled={items.length === 0 || isSpinning}
                  className={isSpinning ? "spinning" : ""}
                >
                  {isSpinning ? "..." : t("random.spin")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className={`popup-overlay ${isPopupVisible ? "visible" : ""}`} onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-image-container">
              <img
                src={popupImageUrl || settings?.placeholderImage || puerlogo}
                alt={selectedItem.name}
                className="popup-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = settings?.placeholderImage || puerlogo;
                }}
              />
            </div>
            
            <div className="popup-text-content">
              <h3 className="popup-name">{selectedItem.name}</h3>
              <p className="popup-description">{selectedItem.description}</p>
              
              <div className="popup-details">
                {selectedItem.weight && (
                  <p className="popup-weight">
                    {t("product.weight")}: {selectedItem.weight} {t("product.gram")}
                  </p>
                )}
                <p className="popup-price">
                  {t("product.price")}: {selectedItem.price} {t("product.currency")}
                </p>
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