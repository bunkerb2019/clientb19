import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useTelegram } from "./components/useTelegram";
import "./App.scss";

// language 
import './utils/i18n';
import { useTranslation } from 'react-i18next';


// OTHER
import Welcome from "./pages/Welcome";
import Random from "./pages/Random";
import LanguageSwitcher from "./components/LanguageSwitcher";
// FOOD
import Breakfast from "./pages/food/Breakfast";
import Hot from "./pages/food/Hot";
import Salad from "./pages/food/Salad.tsx";
import Soup from "./pages/food/Soup";
import Snack from "./pages/food/Snack.js";
import Asia from "./pages/food/Asia";
import Rolls from "./pages/food/Rolls";
import Dessert from "./pages/food/Dessert";
// BAR
import Cocktail from "./pages/drink/Cocktail";
import ChampagneWine from "./pages/drink/ChampagneWine";
import Alcohol from "./pages/drink/Alcohol";
import Drinks from "./pages/drink/Drinks";
import HotDrinks from "./pages/drink/HotDrinks";

// ICONS
import { Icons } from "./components/Icons.tsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};



const NavLinks = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const getNavLinks = () => {
    if (location.pathname.startsWith("/food")) {
      return (
        <>
          <NavLink to="/food/asia" className="nav-item">
            <img src={Icons.asia} alt="Asia" className="icon" /> 
            {t('navigation.asia')}
          </NavLink>
          <NavLink to="/food/rolls" className="nav-item">
            <img src={Icons.rolls} alt="Rolls" className="icon" /> 
            {t('navigation.rolls')}
          </NavLink>
          <NavLink to="/food/breakfast" className="nav-item">
            <img src={Icons.breakfast} alt="Breakfast" className="icon" /> 
            {t('navigation.breakfast')}
          </NavLink>
          <NavLink to="/food/hot" className="nav-item">
            <img src={Icons.hot} alt="Hot" className="icon" />
            {t('navigation.hot')}
          </NavLink>
          <NavLink to="/food/salad" className="nav-item">
            <img src={Icons.salad} alt="Salad" className="icon" />
            {t('navigation.salad')}
          </NavLink>
          <NavLink to="/food/snack" className="nav-item">
            <img src={Icons.snack} alt="Snack" className="icon" />
            {t('navigation.snack')}
          </NavLink>
          <NavLink to="/food/soup" className="nav-item">
            <img src={Icons.soup} alt="Soup" className="icon" />
            {t('navigation.soup')}
          </NavLink>
          <NavLink to="/food/dessert" className="nav-item">
            <img src={Icons.dessert} alt="Dessert" className="icon" />
            {t('navigation.dessert')}
          </NavLink>
        </>
      );
    } else if (location.pathname.startsWith("/bar")) {
      return (
        <>
          <NavLink to="/bar/cocktail" className="nav-item">
            <img src={Icons.cocktail} alt="Cocktail" className="icon" />
            {t('navigation.cocktail')}
          </NavLink>
          <NavLink to="/bar/champagne" className="nav-item">
            <img src={Icons.champagne} alt="Champagne&Wine" className="icon" />
            {t('navigation.champagne')}
          </NavLink>
          <NavLink to="/bar/alcohol" className="nav-item">
            <img src={Icons.alcohol} alt="Alcohol" className="icon" />
            {t('navigation.alcohol')}
          </NavLink>
          <NavLink to="/bar/drinks" className="nav-item">
            <img src={Icons.drinks} alt="Drinks" className="icon" />
            {t('navigation.drinks')}
          </NavLink>
          <NavLink to="/bar/hotdrinks" className="nav-item">
            <img src={Icons.hotdrinks} alt="Hot Drinks" className="icon" /> 
            {t('navigation.hotdrinks')}
          </NavLink>
        </>
      );
    }
  };

  return <div className="sub-nav">{getNavLinks()}</div>;
};

const App = () => {
  const tg = useTelegram();
  console.log(tg); 
  const { t } = useTranslation(); 
  return (
    <Router>
        <ScrollToTop />
      <div className="app">
        <LanguageSwitcher />
        <div className="content">
          <Routes>
            <Route path="/" element={<Welcome />} />

            <>
              {/* FOOD  */}
              <Route path="/food/asia" element={<Asia />} />
              <Route path="/food/rolls" element={<Rolls />} />
              <Route path="/food/breakfast" element={<Breakfast />} />
              <Route path="/food/hot" element={<Hot />} />
              <Route path="/food/salad" element={<Salad />} />
              <Route path="/food/snack" element={<Snack />} />
              <Route path="/food/soup" element={<Soup />} />
              <Route path="/food/dessert" element={<Dessert />} />
              {/* BAR  */}
              <Route path="/bar/cocktail" element={<Cocktail />} />
              <Route path="/bar/champagne" element={<ChampagneWine />} />
              <Route path="/bar/alcohol" element={<Alcohol />} />
              <Route path="/bar/drinks" element={<Drinks />} />
              <Route path="/bar/hotdrinks" element={<HotDrinks />} />

              <Route path="/random" element={<Random />} />
            </>
          </Routes>
        </div>

        <>
        <nav className="bottom-nav">
            <NavLink to="/food/hot" className="nav-item">
              <img src={Icons.food} alt="Food" className="icon" />
              {t('navigation.food')}
            </NavLink>
            <NavLink to="/bar/cocktail" className="nav-item">
              <img src={Icons.bar} alt="Bar" className="icon" />
              {t('navigation.bar')}
            </NavLink>
            <NavLink to="/random" className="nav-item">
              <img src={Icons.random} alt="Random" className="icon" />
              {t('navigation.random')}
            </NavLink>
          </nav>
          <NavLinks />
        </>
      </div>
    </Router>
  );
};

export default App;
