/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        expand: () => void;
        initData?: string;
        initDataUnsafe?: any;
        close: () => void;
        sendData: (data: string) => void;
        showPopup: (params: any, callback?: (result: any) => void) => void;
        themeParams?: any;
        [key: string]: any;
      };
    };
  }
}
