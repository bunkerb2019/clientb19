import { useState } from "react";
import "./LanguageSwitcher.scss";

const languages = ["EN", "RU", "RO"];

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState("EN");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setIsOpen(false); // Закрыть меню после выбора
  };

  return (
    <div className="language-switcher-container">
      <button
        className={`language-switcher ${isOpen ? "open" : ""}`}
        onClick={toggleDropdown}
      >
        {language}
      </button>
      <div className={`language-dropdown ${isOpen ? "open" : ""}`}>
        {languages
          .filter((lang) => lang !== language)
          .map((lang) => (
            <button key={lang} onClick={() => changeLanguage(lang)}>
              {lang}
            </button>
          ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;