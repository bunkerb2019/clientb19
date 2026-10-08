import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RandomSpin.scss";
import { useRandomSettings } from "../hooks/useRandomSettings";
import { useRandomizerItems } from "../hooks/useRandomizerItems";
import { useLanguage } from "../contexts/LanguageContext";
import useSettings from "../modules/useSettings";
import { preloadImages, storageImageUrl } from "../utils/storageImage";
import { ProductPopup } from "../components/ProductCard";
import { Order } from "../utils/types";
import spinSound from "../assets/victorabdo-spin-232536.mp3";
import soundOnIcon from "../assets/soundOnWhite.svg";
import soundOffIcon from "../assets/soundOffWhite.svg";
import logoIcon from "../assets/logo.png";

const CARD_W = 230;
const CARD_H = 300;
const RADIUS = 720;
const STEP_DEG = 25; // угол между карточками на колесе
const TICK_RADIUS = RADIUS + 165;
const TICKS_PER_STEP = 4;
const STAGE_H = 400; // высота и ширина, под которые рассчитано колесо при scale = 1
const STAGE_W = 400;
const VISIBLE = 3;
const FILLERS = 30;
const POOL_SIZE = 12;
const DURATION = 4500;
const RAD = Math.PI / 180;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randomRun = (items: Order[], n: number) =>
  Array.from({ length: n }, () => pick(items));

const useItemImage = (item?: Order | null) => {
  const { data: settings } = useSettings();
  const fallback = settings?.placeholderImage || logoIcon;
  const url = storageImageUrl(item?.image, item?.imageVersion);
  return { src: url || fallback, isFallback: !url };
};

const SpinCard = ({
  item,
  active,
  style,
}: {
  item: Order;
  active: boolean;
  style: React.CSSProperties;
}) => {
  const { getText } = useLanguage();
  const { src, isFallback } = useItemImage(item);
  return (
    <div
      className={`spin-card ${active ? "active" : ""}`}
      style={{ width: CARD_W, height: CARD_H, ...style }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className={isFallback ? "fallback" : ""}
      />
      <div className="spin-card-shade" />
      <div className="spin-card-name">{getText(item.name)}</div>
      {item.price != null && (
        <div className="spin-card-price">
          {item.price} {item.currency || "MDL"}
        </div>
      )}
    </div>
  );
};

// точка на колесе относительно якоря (самой левой точки дуги карточек)
const onWheel = (radius: number, deg: number) => ({
  x: RADIUS - radius * Math.cos(deg * RAD),
  y: radius * Math.sin(deg * RAD),
});

const RandomSpin = () => {
  const { randomizerId } = useParams<{ randomizerId: string }>();
  const navigate = useNavigate();
  const { getText } = useLanguage();
  const { data: settings, isLoading } = useRandomSettings({
    onSuccess: () => {},
  });
  const { getItems } = useRandomizerItems();

  const randomizer = settings?.randomizers?.find((r) => r.id === randomizerId);
  const items = useMemo(() => getItems(randomizer), [getItems, randomizer]);
  // колесо крутит только небольшой набор с заранее загруженными фото, а не грузит 30 новых картинок за спин
  const pool = useMemo(
    () => [...items].sort(() => Math.random() - 0.5).slice(0, POOL_SIZE),
    [items]
  );

  useEffect(() => {
    preloadImages(pool.map((i) => storageImageUrl(i.image, i.imageVersion)));
  }, [pool]);

  const [reel, setReel] = useState<Order[]>([]);
  const [rot, setRot] = useState(VISIBLE);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Order | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timers = useRef<number[]>([]);
  const frame = useRef(0);
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!stage) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(height / STAGE_H, width / STAGE_W));
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, [stage]);

  const { src: winnerUrl } = useItemImage(winner);

  useEffect(() => {
    audioRef.current = new Audio(spinSound);
    audioRef.current.volume = 0.5;
    const pending = timers.current;
    return () => {
      audioRef.current?.pause();
      pending.forEach(clearTimeout);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  useEffect(() => {
    if (pool.length && !reel.length) {
      setReel(randomRun(pool, VISIBLE * 2 + 1));
      setRot(VISIBLE);
    }
  }, [pool, reel.length]);

  const spin = () => {
    if (spinning || !items.length) return;
    const win = pick(items);
    preloadImages([storageImageUrl(win.image, win.imageVersion)]);
    const from = Math.round(rot);
    const target = from + FILLERS;

    const next = reel.slice();
    while (next.length <= target + VISIBLE) next.push(pick(pool));
    next[target] = win;

    setReel(next);
    setSpinning(true);
    setWinner(null);

    if (!muted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setRot(from + (target - from) * easeOut(t));
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      setSpinning(false);
      setWinner(win);
      navigator.vibrate?.(40);
      timers.current.push(window.setTimeout(() => setPopupOpen(true), 700));
    };
    frame.current = requestAnimationFrame(tick);
  };

  if (isLoading) return <div className="loading">Загрузка...</div>;
  if (!randomizer) return <div className="error">Рандомайзер не найден</div>;

  const center = Math.round(rot);
  const cards = [];
  for (let i = center - VISIBLE; i <= center + VISIBLE; i++) {
    const item = reel[i];
    if (!item) continue;
    const d = i - rot;
    const deg = d * STEP_DEG;
    const { x, y } = onWheel(RADIUS, deg);
    const dist = Math.abs(d);
    cards.push(
      <SpinCard
        key={i}
        item={item}
        active={!spinning && dist < 0.01}
        style={{
          transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${-deg}deg) scale(${
            1 - Math.min(dist, 2) * 0.14
          })`,
          opacity: Math.max(0, 1 - dist * 0.55),
          zIndex: 10 - Math.round(dist),
        }}
      />,
    );
  }

  const ticks = [];
  const tickRot = rot * TICKS_PER_STEP;
  const tickDeg = STEP_DEG / TICKS_PER_STEP;
  for (let t = Math.floor(tickRot) - 14; t <= Math.ceil(tickRot) + 14; t++) {
    const deg = (t - tickRot) * tickDeg;
    const { x, y } = onWheel(TICK_RADIUS, deg);
    ticks.push(
      <span
        key={t}
        className={`wheel-tick ${t % TICKS_PER_STEP === 0 ? "major" : ""}`}
        style={{
          transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${-deg}deg)`,
          opacity: Math.max(0, 1 - Math.abs(deg) / 40),
        }}
      />,
    );
  }

  return (
    <div className="spin-page">
      <div className="spin-head">
        <button
          className="spin-round"
          onClick={() => navigate("/3")}
          aria-label="Назад"
        >
          ‹
        </button>
        <h1>{getText(randomizer.slotTitle, "Случайный выбор")}</h1>
        <button
          className={`spin-round ${muted ? "muted" : ""}`}
          onClick={() => setMuted(!muted)}
          aria-label={muted ? "Включить звук" : "Выключить звук"}
        >
          <img src={muted ? soundOffIcon : soundOnIcon} alt="" />
        </button>
      </div>

      <p className="spin-sub">
        {winner
          ? getText({
              ru: "Сегодня для тебя",
              ro: "Astăzi pentru tine",
              en: "Today for you",
            })
          : getText({
              ru: "Испытай удачу",
              ro: "Încearcă-ți norocul",
              en: "Try your luck",
            })}
      </p>

      <div className="spin-stage" ref={setStage}>
        <div className="wheel-anchor" style={{ transform: `scale(${scale})` }}>
          {ticks}
          <span
            className="wheel-marker"
            style={{
              transform: `translate(${RADIUS - TICK_RADIUS - 26}px, -50%)`,
            }}
          />
          {cards}
        </div>
      </div>

      <button
        className="spin-btn"
        onClick={spin}
        disabled={spinning || !items.length}
      >
        {spinning
          ? "..."
          : winner
            ? getText({ ru: "Ещё раз", ro: "Încă o dată", en: "Again" })
            : "SPIN"}
      </button>

      <div className="spin-result-slot">
        {winner && !spinning && (
          <button className="spin-result" onClick={() => setPopupOpen(true)}>
            {getText(winner.name)} ›
          </button>
        )}
      </div>

      {winner && (
        <ProductPopup
          imageUrl={winnerUrl}
          name={winner.name}
          description={winner.description}
          weight={winner.weight}
          weightUnit={winner.weightUnit}
          price={winner.price}
          currency={winner.currency}
          id={winner.id}
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          isImageLoading={false}
          hasImageError={false}
          onImageError={() => {}}
          onImageLoad={() => {}}
          hasImage
        />
      )}
    </div>
  );
};

export default React.memo(RandomSpin);
