import { useState, useEffect, useRef } from "react";
import "./LanguageSwitcher.scss";

const languages = ["RU", "RO", "EN"];

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("lang") || "RU";
  });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("lang", currentLang);
  }, [currentLang]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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