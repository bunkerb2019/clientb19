import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Импортируем файлы с переводами
import ru from "../locales/ru.json";
import ro from "../locales/ro.json";
import en from "../locales/en.json";

i18n
  .use(initReactI18next) // передаем i18next в React
  .init({
    resources: {
        ru: { translation: ru },
        ro: { translation: ro },
        en: { translation: en }
      },
    lng: "ru", // язык по умолчанию
    fallbackLng: "ru", // язык, если нужный перевод не найден
    interpolation: {
      escapeValue: false, // не экранировать значения
    },
  });

export default i18n;
