export interface Category {
  items: never[];
  id: string;
  parentId: string;
  ru: string;
  ro: string;
  en: string;
  icon: string;
}

export interface NavigationItem {
  categories: unknown;
  id: string;
  ru: string;
  ro: string;
  en: string;
  icon: string;
}

export interface Order {
  id: string;
  name: string | { ru: string; ro?: string; en?: string };
  description: string | { ru: string; ro?: string; en?: string };
  weight?: number;
  price?: number;
  image?: string;
  category: string;
  type?: string;
}

// Интерфейс для структуры настроек
export interface SettingsData {
  [key: string]: unknown;
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


// types.ts
export interface RandomizerConfig {
  id: string;
  slotTitle: {  // основное поле для отображаемого названия
    ru: string;
    ro: string;
    en: string;
  };
  name?: {  // делаем необязательным, если не используется
    ru: string;
    ro: string;
    en: string;
  };
  navigation: string;
  categoryIds: string[];
  active: boolean;
}

export interface RandomSettings {
  pageTitle: {
    ru: string;
    ro: string;
    en: string;
  };
  pageDescription: {
    ru: string;
    ro: string;
    en: string;
  };
  randomizers: RandomizerConfig[];
}