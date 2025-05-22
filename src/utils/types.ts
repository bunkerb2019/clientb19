export interface Category {
  id: string;
  parentId: string;
  ru: string;
  ro: string;
  en: string;
  icon: string;
  views?: number;
  lastViewed?: Date;
}

export interface NavigationItem {
  id: string;
  ru: string;
  ro: string;
  en: string;
  icon: string;
  categories: string[];
}

export interface Order {
  id: string;
  name: string | { ru: string; ro?: string; en?: string };
  description: string | { ru: string; ro?: string; en?: string };
  weight?: string;
  price?: number;
  image?: string;
  category: string;
  type: string;
  weightUnit?: "g" | "ml" | "kg";
  currency?: "MDL" | "$" | "€";
  active?: boolean;
  views?: number;
  lastViewed?: Date;
}

export interface SettingsData {
  [key: string]: unknown;
  welcomeText: string;
  welcomeBackground: string;
  companyLogo: string | null;
  welcomeImage: string | null;
  backgroundColor: string;
  textColor: string;
  navbarColor: string;
  backgroundImage: string | null;
  cardTextColor: string;
  cardBorderColor: string;
  cardBackgroundColor: string;
  cardBackgroundOpacity: number;
  cardBlur: number;
  placeholderImage: string | null;
}

export interface RandomizerConfig {
  id: string;
  slotTitle: {
    ru: string;
    ro: string;
    en: string;
  };
  name?: {
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

export interface ViewEvent {
  id?: string;
  type: "product_view" | "category_view";
  categoryId: string;
  productId?: string;
  userId?: string;
  createdAt: Date;
  deviceInfo?: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
  };
}
