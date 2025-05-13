import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSettings from "../modules/useSettings.ts";
import useNavigationConfig from "../modules/useNavigationConfig.ts";
import "./Welcome.scss";
import LoadingScreen from "../components/LoadingScreen.tsx";

const Welcome = () => {
  const { data: settings, isLoading: loadingSettings, error } = useSettings();
  const { data: navItems, isLoading: loadingNav } = useNavigationConfig();
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [hideScreen, setHideScreen] = useState(false);
  const navigate = useNavigate();

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

  const wrappedText = wrapText(settings?.welcomeText || "Welcome to", 15);

  useEffect(() => {
    if (loadingNav || !navItems?.length) return; // ⛔ ничего не делать, пока грузится

    const timer = setTimeout(() => {
      setShowText(true);
      setShowLogo(true);
    }, 200);

    const redirectTimer = setTimeout(() => {
      setHideScreen(true);

      // 🧠 только после этого — навигация
      setTimeout(() => {
        navigate(`/${navItems[0].id}`); // ✅ сюда только когда точно есть navItems
      }, 1000);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [loadingNav, navItems, navigate]);

  if (loadingSettings || loadingNav) return <LoadingScreen />;
  if (error) return <div>Error loading settings</div>;

  return (
    <div
      className={`welcome ${hideScreen ? "fade-out" : ""}`}
      style={{
        backgroundColor: settings?.welcomeBackground || "#000",
      }}
    >
      <div className="welcome-content">
        <svg
          className={`hello-text ${showText ? "visible" : ""}`}
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
            className={`logo ${showLogo ? "slide-in" : ""}`}
            src={settings?.companyLogo}
            alt="Company Logo"
          />
        )}
      </div>
    </div>
  );
};

export default Welcome;
