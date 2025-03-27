import { useState, useEffect, useRef } from "react";
import "./LanguageSwitcher.scss";
import { useTranslation } from 'react-i18next';

const languages = ["ru", "ro", "en"];

const LanguageSwitcher = () => {
  const {t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("lang") || "ru";
  });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("lang", currentLang);
  }, [currentLang]);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "ru";
    i18n.changeLanguage(savedLang); // Устанавливаем язык в i18n
    setCurrentLang(savedLang);
  }, [i18n]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang); // Это самое важное изменение!
    setCurrentLang(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div className="lang-container" ref={containerRef}>
      <div 
        className={`main-lang ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLang}
      </div>
      
      <div className={`lang-list ${isOpen ? "open" : ""}`}>
        {languages.filter(l => l !== currentLang).map((lang) => (
          <div
            key={lang}
            className="lang-item"
            onClick={() => {
              setCurrentLang(lang);
              setIsOpen(false);
              changeLanguage(lang);
            }}
          >
            {lang}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;