export interface Category {
  id: string;
  parentId: string;
  ru: string;
  ro: string;
  en: string;
  icon: string;
}

export interface NavigationItem {
  id: string;
  ru: string;
  ro: string;
  en: string;
  icon: string;
}

export interface Order {
  id: string;
  name: string;
  description: string;
  weight: number; // У вас weight — это число
  price: number;
  image?: string;
  category: string; // Поле для связи с категорией
  type: string; // Добавьте поле type, если оно используется
}

// Интерфейс для структуры настроек
export interface SettingsData {
  [key: string]: any;
  // Шаг 1: Настройки приветствия
  welcomeText: string;
  welcomeBackground: string;
  companyLogo: string | null;
  welcomeImage: string | null;

  // Шаг 2: Настройки UI
  backgroundColor: string;
  textColor: string;
  navbarColor: string;
  backgroundImage: string | null;

  // Шаг 3: Настройки карточки товара
  cardTextColor: string;
  cardBorderColor: string;
  cardBackgroundColor: string;
  cardBackgroundOpacity: number;
  cardBlur: number;
  placeholderImage: string | null;
}
