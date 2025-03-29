import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSettings from "../modules/useSettings.ts"; // Укажите правильный путь к хуку
import "./Welcome.scss";

const Welcome = () => {
  const { data: settings, isLoading, error } = useSettings(); // Получаем настройки
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false); // Новое состояние для текста
  const [hideScreen, setHideScreen] = useState(false);
  const navigate = useNavigate();

  // Функция для разбиения текста на строки
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

  // Анимация появления текста и логотипа
  useEffect(() => {
    setTimeout(() => setShowText(true), 500); // Текст появляется через 0.5 секунды
    setTimeout(() => setShowLogo(true), 1000); // Логотип появляется через 1 секунду

    setTimeout(() => {
      setHideScreen(true); // Запуск анимации исчезновения
      setTimeout(() => navigate("/1"), 1000); // Переход через 1 секунду после начала скрытия
    }, 3000);
  }, [navigate]);

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) return <div>Loading...</div>;

  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) return <div>Error loading settings</div>;

  return (
    <div
      className={`welcome ${hideScreen ? "fade-out" : ""}`}
      style={{
        backgroundColor: settings?.welcomeBackground || "#000", // Цвет фона из настроек или по умолчанию
      }}
    >
      <div className="welcome-content">
        <svg 
          className={`hello-text ${showText ? "visible" : ""}`} // Добавляем класс для анимации текста
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
        {settings?.companyLogo && <img
          className={`logo ${showLogo ? "slide-in" : ""}`} // Добавляем класс для анимации логотипа
          src={settings?.companyLogo } // Логотип из настроек или по умолчанию
          alt="Company Logo"
        />}
      </div>
    </div>
  );
};

export default Welcome;
