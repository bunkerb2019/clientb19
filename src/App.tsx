import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useTelegram } from "./components/useTelegram";
import useSettings from "./modules/useSettings"; // Импортируем хук для настроек
import "./App.scss";

// перевод
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";


// Firebase хуки
import useCategories from "./modules/useCategories";
import useNavigationConfig from "./modules/useNavigationConfig";

// Страницы
import Welcome from "./pages/Welcome";
import Random from "./pages/Random";
import CategoryPage from "./pages/CategoryPage";
import CategoryList from "./pages/CategoryList";
import LanguageSwitcher from "./components/LanguageSwitcher";



const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const NavItems = () => {
  const { data: navItems = [] } = useNavigationConfig();
  const { getText } = useLanguage();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink key={item.id} to={`/${item.id}`} className="nav-item">
          <img
            src={item.icon || "/default-icon.png"}
            alt={getText(item)}
            className="icon"
          />
          {getText(item)}
        </NavLink>
      ))}
    </nav>
  );
};

const App = () => {
  const tg = useTelegram();
  console.log("Telegram Object:", tg);

  // Получаем данные через хуки
  const { data: categories = [] } = useCategories();
  const { data: navItems = [] } = useNavigationConfig();
  const { data: settings } = useSettings(); // Загружаем настройки

  console.log({ categories });

  return (
    <LanguageProvider>
    <Router>
      <ScrollToTop />
      <div
        className="app"
        style={
          {
            "--app-background-color": settings?.backgroundColor || "#000",
            "--app-text-color": settings?.textColor || "#fff",
            "--navbar-color": settings?.navbarColor || "#000",
            "--app-background-image": settings?.backgroundImage
              ? `url(${settings.backgroundImage})`
              : "none",
          } as React.CSSProperties
        }
      >
        <LanguageSwitcher/>

        <div className="content">
          <Routes>

            <Route path="/" element={<Welcome />} />
            <Route path="/3" element={<Random />} />
            {navItems.map((nav) => (
              <Route
                key={nav.id}
                path={`/${nav.id}`}
                element={<CategoryList navId={nav.id}/>}
              />
            ))}
            <Route path="/category/:categoryId" element={<CategoryPage />} />
          </Routes>
        </div>

        <NavItems />
      </div>
    </Router>
    </LanguageProvider>
  );
};

export default App;