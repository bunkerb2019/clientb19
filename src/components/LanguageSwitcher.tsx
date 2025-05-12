import { useState, useEffect, useRef } from "react";
import "./LanguageSwitcher.scss";
import { Language, useLanguage } from "../contexts/LanguageContext";

const languages = [
  { code: 'ru', label: 'RU' },
  { code: 'ro', label: 'RO' },
  { code: 'en', label: 'EN' }
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];
  const otherLangs = languages.filter(l => l.code !== language);

  return (
    <div className="lang-container" ref={containerRef}>
      <div 
        className={`lang-switcher ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="main-lang">
          {currentLang.label}
        </div>
        <div className={`lang-list ${isOpen ? "open" : ""}`}>
          {otherLangs.map((lang) => (
            <div
              key={lang.code}
              className="lang-item"
              onClick={(e) => {
                e.stopPropagation(); // чтобы не срабатывал клик по родителю
                setLanguage(lang.code as Language);
                setIsOpen(false);
              }}
            >
              {lang.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;