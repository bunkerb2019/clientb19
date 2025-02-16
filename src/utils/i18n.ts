import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Импортируем файлы с переводами
import ru from "../locales/ru.json";
import ro from "../locales/ro.json";
import en from "../locales/en.json";

// Проверяем сохранённый язык в localStorage
const savedLang = localStorage.getItem('i18nextLng');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      ro: { translation: ro },
      en: { translation: en }
    },
    lng: savedLang || "ru", // Используем сохранённый язык или русский по умолчанию
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
  });

// Сохраняем язык при его изменении
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;