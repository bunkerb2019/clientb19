import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useSettings from "../modules/useSettings.ts";
import useNavigationConfig from "../modules/useNavigationConfig.ts";
import useMenuItems from "../modules/useMenuItems";
import useCategories from "../modules/useCategories";
import { useContactInfo } from "../hooks/useContactInfo";
import { useRandomSettings } from "../hooks/useRandomSettings";
import { preloadImages, storageImageUrl } from "../utils/storageImage";
import "./Welcome.scss";
import React from "react";

const MIN_SPLASH_MS = 1500;
const MAX_SPLASH_MS = 6000;
const FIRST_SCREEN_DISHES = 8;

interface WelcomeProps {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ showWelcome, setShowWelcome }) => {
  const { data: settings } = useSettings();
  const { data: navItems, isLoading: loadingNav } = useNavigationConfig();
  const [animationStage, setAnimationStage] = useState(0); // 0: начальное, 1: текст, 2: лого, 3: скрытие
  const [logoLoaded, setLogoLoaded] = useState(false);
  const navigate = useNavigate();

  const wrappedText = useMemo(() => {
    const wrapText = (text: string, maxChars: number) => {
      if (!text) return [];
      const words = text.split(" ");
      let line = "";
      const lines = [];

      for (const word of words) {
        if ((line + word).length > maxChars) {
          lines.push(line.trim());
          line = word + " ";
        } else {
          line += word + " ";
        }
      }
      if (line) lines.push(line.trim());
      return lines;
    };

    return wrapText(settings?.welcomeText || "Welcome to", 15);
  }, [settings?.welcomeText]);

  // Пока идёт заставка, грузим данные и картинки первого экрана, чтобы после неё ничего не догружалось
  const { data: dishes } = useMenuItems();
  const { data: categories } = useCategories();
  const { data: contact } = useContactInfo();
  useRandomSettings({ onSuccess: () => {} });
  const [startedAt] = useState(() => Date.now());
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    const cap = setTimeout(() => setAssetsReady(true), MAX_SPLASH_MS);
    return () => clearTimeout(cap);
  }, []);

  useEffect(() => {
    if (assetsReady || !navItems?.length || !categories || !dishes) return;
    const firstNav = navItems[0].id;
    const firstCategory = categories.find((c) => c.parentId === firstNav)?.ru;
    const firstDishes = dishes
      .filter((d) => d.category === firstCategory && d.active !== false)
      .slice(0, FIRST_SCREEN_DISHES);

    preloadImages([
      ...navItems.map((n) => n.icon),
      ...categories.map((c) => c.icon),
      ...firstDishes.map((d) => storageImageUrl(d.image, d.imageVersion)),
      ...((contact?.links ?? []) as { icon: string }[]).map((l) => l.icon),
    ]).then(() => setAssetsReady(true));
  }, [assetsReady, navItems, categories, dishes, contact]);

  useEffect(() => {
    if (loadingNav || !navItems?.length) return;

    const timers = [
      setTimeout(() => setAnimationStage(1), 100), // Показ текста
      setTimeout(() => {
        // Показываем лого только если оно загрузилось
        if (logoLoaded || !settings?.companyLogo) {
          setAnimationStage(2);
        }
      }, 400), // Показ лого
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [loadingNav, navItems, logoLoaded, settings?.companyLogo]);

  useEffect(() => {
    if (!assetsReady || !navItems?.length) return;

    const hideIn = Math.max(0, MIN_SPLASH_MS - (Date.now() - startedAt));
    const timers = [
      setTimeout(() => setAnimationStage(3), hideIn), // Начало скрытия
      setTimeout(() => {
        setShowWelcome(false);
        navigate(`/${navItems[0].id}`);
      }, hideIn + 500), // Переход и скрытие Welcome
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [assetsReady, navItems, navigate, setShowWelcome, startedAt]);

  // Отслеживаем загрузку лого
  useEffect(() => {
    if (settings?.companyLogo && animationStage >= 1) {
      const img = new Image();
      img.onload = () => {
        setLogoLoaded(true);
        // Если лого загрузилось, но мы ещё не показали его, показываем
        if (animationStage === 1) {
          setAnimationStage(2);
        }
      };
      img.src = settings.companyLogo;
    }
  }, [settings?.companyLogo, animationStage]);

  if (!settings || !showWelcome) return null;

  return (
    <div
      className={`welcome ${animationStage >= 3 ? "fade-out" : ""}`}
      style={{ backgroundColor: settings?.welcomeBackground || "#000" }}
    >
      <div className="welcome-content">
        <svg
          className={`hello-text ${animationStage >= 1 ? "visible" : ""}`}
          viewBox="0 0 500 100"
        >
          <text x="50%" y="40%" textAnchor="middle">
            {wrappedText.map((line, index) => (
              <tspan key={index} x="50%" dy={`${index * 1.2}em`}>
                {line}
              </tspan>
            ))}
          </text>
        </svg>

        {settings?.companyLogo && (
          <img
            className={`logo ${animationStage >= 2 ? "slide-in" : ""}`}
            src={settings.companyLogo}
            alt="Company Logo"
            loading="eager"
            onLoad={() => setLogoLoaded(true)}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(Welcome);
