import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSettings from "../modules/useSettings.ts"; // Укажите правильный путь к хуку
import Logo from "../assets/demoversionpuerlogo.svg"; // Логотип по умолчанию
import "./Welcome.scss";

const Welcome = () => {
  const { data: settings, isLoading, error } = useSettings(); // Получаем настройки
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false); // Новое состояние для текста
  const [hideScreen, setHideScreen] = useState(false);
  const navigate = useNavigate();

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

  // Логируем настройки для отладки
  console.log("Settings:", settings);

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
          <text x="50%" y="50%" textAnchor="middle" dy=".3em">
            {settings?.welcomeText || "Welcome to"} {/* Текст приветствия из настроек или по умолчанию */}
          </text>
        </svg>
        <img
          className={`logo ${showLogo ? "slide-in" : ""}`} // Добавляем класс для анимации логотипа
          src={settings?.companyLogo || Logo} // Логотип из настроек или по умолчанию
          alt="Company Logo"
        />
      </div>
    </div>
  );
};

export default Welcome;