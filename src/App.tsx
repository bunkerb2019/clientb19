import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useSettings from "./modules/useSettings";
import { ViewProvider } from "./contexts/ViewContext";
import "./App.scss";

// Translation
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

// Firebase hooks
// import useCategories from "./modules/useCategories";
import useNavigationConfig from "./modules/useNavigationConfig";

// Pages
import Random from "./pages/Random";
import RandomSpin from "./pages/RandomSpin";
import CategoryPage from "./pages/CategoryPage";
import CategoryList from "./pages/CategoryList";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Welcome from "./pages/Welcome";
import { useTrackView } from "./hooks/useTrackView.ts";
import React from "react";
import ViewSwitcher from "./components/ViewSwitcher.tsx";
import Page4 from "./pages/ContactInfo.tsx";
import { TopBarTitleContext } from "./contexts/TopBarContext.tsx";
// import { useContactInfo } from "./hooks/useContactInfo";
import { useTelegram } from "./components/useTelegram.tsx";

const hexToRgb = (hex: string) => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!document.querySelector(".popup-overlay.visible")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return null;
};

const NavItems = React.memo(() => {
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
          <span className="text">{getText(item)}</span>
        </NavLink>
      ))}
    </nav>
  );
});

const App = () => {
  const todayDate = new Date().toISOString().split("T")[0];

  useTrackView(todayDate);
  useTelegram();

  // const { data: categories = [] } = useCategories();
  const { data: navItems = [] } = useNavigationConfig();
  const { data: settings } = useSettings();

  const [showWelcome, setShowWelcome] = useState(true);

  const backgroundColorRgb = useMemo(
    () => hexToRgb(settings?.backgroundColor || "#000000"),
    [settings?.backgroundColor]
  );

  const navbarColor = settings?.navbarColor || "#000000";

  const navbarRgb = useMemo(() => hexToRgb(navbarColor), [navbarColor]);

  const navbarOpacity = settings?.navbarOpacity ?? 1;

  const appStyle = useMemo(
    () => ({
      "--app-background-color-rgb": backgroundColorRgb,
      "--background-opacity": settings?.BackgroundOpacity ?? 0.88,
      "--app-text-color": settings?.textColor || "#ffffff",
      "--navbar-text-active-color": settings?.navbarTextColor || "#f7b946",
      "--navbar-color": navbarColor,
      "--navbar-color-rgb": navbarRgb,
      "--navbar-opacity": navbarOpacity,
      overflowX: "hidden",
      "--app-background-image": settings?.backgroundImage
        ? `url(${settings.backgroundImage})`
        : "none",
    }),
    [
      backgroundColorRgb,
      navbarColor,
      navbarRgb,
      navbarOpacity,
      settings?.BackgroundOpacity,
      settings?.textColor,
      settings?.navbarTextColor,
      settings?.backgroundImage,
    ]
  );

  const [topBarTitle, setTopBarTitle] = useState<React.ReactNode>(null);

  // const { data: contact, isLoading, error } = useContactInfo();
  // console.log("contact", contact, "isLoading", isLoading, "error", error);

  return (
    <LanguageProvider>
        <ViewProvider>
          <TopBarTitleContext.Provider value={setTopBarTitle}>
          <Router>
            <ScrollToTop />
            <div className="app" style={appStyle as React.CSSProperties}>
              {typeof settings?.uiLogo === "string" && (
                <img src={settings.uiLogo} alt="UI Logo" className="ui-logo" />
              )}
              <header className="top-bar">
                <ViewSwitcher />
                <div className="top-bar-title">{topBarTitle}</div>
                <LanguageSwitcher />
              </header>

              <div className="content">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Welcome
                        showWelcome={showWelcome}
                        setShowWelcome={setShowWelcome}
                      />
                    }
                  />
                  <Route path="/3" element={<Random />} />
                  <Route path="/random/:randomizerId" element={<RandomSpin />} />
                  {navItems.map((nav) => (
                    <Route
                      key={nav.id}
                      path={`/${nav.id}`}
                      element={
                        nav.id === "4" ? (
                          <Page4 />
                        ) : (
                          <CategoryList navId={nav.id} />
                        )
                      }
                    />
                  ))}
                  <Route
                    path="/category/:categoryId"
                    element={<CategoryPage />}
                  />
                  <Route
                    path="*"
                    element={
                      <Welcome
                        showWelcome={showWelcome}
                        setShowWelcome={setShowWelcome}
                      />
                    }
                  />
                </Routes>
              </div>

              <NavItems />
            </div>
          </Router>
          </TopBarTitleContext.Provider>
        </ViewProvider>
    </LanguageProvider>
  );
};

export default React.memo(App);
