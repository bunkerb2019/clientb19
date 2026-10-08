import { useEffect } from "react";

export const useTelegram = () => {
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (!tg) return;
    // SDK бросает ошибку на методы, которых нет в версии клиента, поэтому проверяем версию
    const atLeast = (v: string) => tg.isVersionAtLeast?.(v) ?? false;
    try {
      tg.ready?.();
      tg.expand?.();
      // полный экран только на телефонах: в Telegram Desktop он займёт всё окно
      if (["ios", "android"].includes(tg.platform) && atLeast("8.0")) {
        tg.requestFullscreen?.();
      }
      if (atLeast("7.7")) tg.disableVerticalSwipes?.();
      if (atLeast("6.2")) tg.enableClosingConfirmation?.();
    } catch (err) {
      console.warn("Telegram WebApp init:", err);
    }
  }, [tg]);

  return tg;
};
