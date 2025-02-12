// global.d.ts

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        init: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}

export {};