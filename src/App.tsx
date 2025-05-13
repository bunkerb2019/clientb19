import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useTelegram } from "./components/useTelegram";
import useSettings from "./modules/useSettings";
import "./App.scss";

// Translation
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

// Firebase hooks
import useCategories from "./modules/useCategories";
import useNavigationConfig from "./modules/useNavigationConfig";

// Pages
import Random from "./pages/Random";
import CategoryPage from "./pages/CategoryPage";
import CategoryList from "./pages/CategoryList";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ImagesProvider from "./providers/ImagesProvider";
import Welcome from "./pages/Welcome";

const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse r, g, b values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
};

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
        <NavLink
          key={item.id}
          to={`/${item.id}`}
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
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

  // Get data through hooks
  const { data: categories = [] } = useCategories();
  const { data: navItems = [] } = useNavigationConfig();
  const { data: settings } = useSettings();

  console.log({ categories });

  // Convert navbar color to RGB format
  const navbarColor = settings?.navbarColor || "#000000";
  const navbarRgb = hexToRgb(navbarColor);
  const navbarOpacity = settings?.navbarOpacity ?? 1;

  return (
    <LanguageProvider>
      <ImagesProvider>
        <Router>
          <ScrollToTop />
          <div
            className="app"
            style={
              {
                "--app-background-color":
                  settings?.backgroundColor || "#000000",
                "--background-opacity": settings?.BackgroundOpacity ?? 1,
                "--app-text-color": settings?.textColor || "#ffffff",
                "--navbar-text-active-color":
                  settings?.navbarTextColor || "#f7b946",
                "--navbar-color": navbarColor,
                "--navbar-color-rgb": navbarRgb,
                "--navbar-opacity": navbarOpacity,
                "--app-background-image": settings?.backgroundImage
                  ? `url(${settings.backgroundImage})`
                  : "none",
              } as React.CSSProperties
            }
          >
            {typeof settings?.uiLogo === "string" && (
              <img src={settings.uiLogo} alt="UI Logo" className="ui-logo" />
            )}
            <LanguageSwitcher />

            <div className="content">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/3" element={<Random />} />
                {navItems.length > 0 &&
                  navItems.map((nav) => (
                    <Route
                      key={nav.id}
                      path={`/${nav.id}`}
                      element={<CategoryList navId={nav.id} />}
                    />
                  ))}
                <Route
                  path="/category/:categoryId"
                  element={<CategoryPage />}
                />
                <Route path="*" element={<Welcome />} />{" "}
                {/* fallback для любых неизвестных маршрутов */}
              </Routes>
            </div>

            <NavItems />
          </div>
        </Router>
      </ImagesProvider>
    </LanguageProvider>
  );
};

export default App;
