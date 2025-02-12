import { useEffect } from "react";

const FullScreenComponent = () => {
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand(); // Делаем приложение полноэкранным
      tg.init(); // Инициализация WebApp
    }
  }, []);

  return null; // Этот компонент не будет рендерить ничего на странице
};

export default FullScreenComponent;