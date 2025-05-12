import { createContext, useContext, useState } from 'react';

export type Language = 'ru' | 'ro' | 'en';

type TextObject = { ru: string; ro?: string; en?: string };

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  getText: (text: string | TextObject | undefined, fallback?: string) => string;
}>({
  language: 'ru',
  setLanguage: () => {},
  getText: (text, fallback = '') => 
    typeof text === 'string' ? text : 
    text ? text.ru || fallback : fallback
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru');
  
  const getText = (
    text: string | TextObject | undefined, 
    fallback: string = ''
  ) => {
    if (!text) return fallback;
    if (typeof text === 'string') return text;
    return text[language] || text.ru || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getText }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);