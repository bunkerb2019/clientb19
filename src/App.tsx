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

// Firebase хуки
import useCategories from "./modules/useCategories";
import useNavigationConfig from "./modules/useNavigationConfig";

// Страницы
import Welcome from "./pages/Welcome";
import Random from "./pages/Random";
import CategoryPage from "./pages/CategoryPage";
import CategoryList from "./pages/CategoryList";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const NavItems = () => {
  const { data: navItems = [] } = useNavigationConfig();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink key={item.id} to={`/${item.id}`} className="nav-item">
          <img
            src={item.icon || "/default-icon.png"}
            alt={item.en}
            className="icon"
          />
          {item.en}
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
    <Router>
      <ScrollToTop />
      <div
        className="app"
        style={{
          backgroundColor: settings?.backgroundColor || "#000", // Фон приложения
          color: settings?.textColor || "#fff", // Цвет текста
          "--app-background-color": settings?.backgroundColor || "#000", // CSS-переменная для фона
          "--app-text-color": settings?.textColor || "#fff", // CSS-переменная для текста
          "--navbar-color": settings?.navbarColor || "#000", // CSS-переменная для панели навигации
          "--app-background-image": settings?.backgroundImage
            ? `url(${settings.backgroundImage})`
            : "none", // CSS-переменная для фоновой картинки
        }as React.CSSProperties}
      >
        <div
          className="content"
          style={{
            backgroundImage: settings?.backgroundImage
              ? `url(${settings.backgroundImage})`
              : "none", // Фоновая картинка
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/random" element={<Random />} />
            {navItems.map((nav) => (
              <Route
                key={nav.id}
                path={`/${nav.id}`}
                element={<CategoryList navId={nav.id} />}
              />
            ))}
            <Route path="/category/:categoryId" element={<CategoryPage />} />
          </Routes>
        </div>

        <NavItems />
      </div>
    </Router>
  );
};

export default App;