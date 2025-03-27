import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    debug: false, // Включите для разработки
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ru: {
        translation: {
          // Ваши переводы для русского
        }
      },
      en: {
        translation: {
          // Ваши переводы для английского
        }
      },
      ro: {
        translation: {
          // Ваши переводы для румынского
        }
      }
    }
  });

export default i18n;