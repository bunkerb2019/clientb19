import { useEffect } from "react";

export const useTelegram = () => {
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.expand(); // Разворачивает, но не полноэкран
      tg.requestFullscreen?.(); // Запрос на полноэкранный режим (новый метод!)
      tg.enableClosingConfirmation?.(); // По желанию
    }
  }, [tg]);

  return tg;
};