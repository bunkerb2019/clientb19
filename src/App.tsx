import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import "./App.scss";
// OTHER
import Welcome from "./pages/Welcome";
import Random from "./pages/Random";
import LanguageSwitcher from "./components/LanguageSwitcher";
// FOOD
import Breakfast from "./pages/food/Breakfast";
import Hot from "./pages/food/Hot";
import Salate from "./pages/food/Salate";
import Soup from "./pages/food/Soup";
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

const NavLinks = () => {
  const location = useLocation();

  const getNavLinks = () => {
    if (location.pathname.startsWith("/food")) {
      return (
        <>
          <NavLink to="/food/asia" className="nav-item">
            <img src={Icons.asia} alt="Asia" className="icon" /> Asia
          </NavLink>
          <NavLink to="/food/rolls" className="nav-item">
            <img src={Icons.rolls} alt="Rolls" className="icon" /> Rolls
          </NavLink>
          <NavLink to="/food/breakfast" className="nav-item">
            <img src={Icons.breakfast} alt="Breakfast" className="icon" />{" "}
            Breakfast
          </NavLink>
          <NavLink to="/food/hot" className="nav-item">
            <img src={Icons.hot} alt="Hot" className="icon" />
            Hot
          </NavLink>
          <NavLink to="/food/salate" className="nav-item">
            <img src={Icons.salate} alt="Salate" className="icon" />
            Salate
          </NavLink>
          <NavLink to="/food/soup" className="nav-item">
            <img src={Icons.soup} alt="Soup" className="icon" />
            Soup
          </NavLink>

          <NavLink to="/food/dessert" className="nav-item">
            <img src={Icons.dessert} alt="Dessert" className="icon" />
            Dessert
          </NavLink>
        </>
      );
    } else if (location.pathname.startsWith("/bar")) {
      return (
        <>
          <NavLink to="/bar/cocktail" className="nav-item">
            <img src={Icons.cocktail} alt="Cocktail" className="icon" />
            Cocktail
          </NavLink>
          <NavLink to="/bar/champagne" className="nav-item">
            <img src={Icons.champagne} alt="Champagne&Wine" className="icon" />
            Champagne & Wine
          </NavLink>
          <NavLink to="/bar/alcohol" className="nav-item">
            <img src={Icons.alcohol} alt="Alcohol" className="icon" />
            Alcohol
          </NavLink>
          <NavLink to="/bar/drinks" className="nav-item">
            <img src={Icons.drinks} alt="Drinks" className="icon" />
            Drinks
          </NavLink>
          <NavLink to="/bar/hotdrinks" className="nav-item">
            <img src={Icons.hotdrinks} alt="Hot Drinks" className="icon" /> Hot
            Drinks
          </NavLink>
        </>
      );
    }
  };

  return <div className="sub-nav">{getNavLinks()}</div>;
};

const App = () => {
  return (
    <Router>
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
              <Route path="/food/salate" element={<Salate />} />
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
              FOOD
            </NavLink>
            <NavLink to="/bar/cocktail" className="nav-item">
              <img src={Icons.bar} alt="Bar" className="icon" />
              BAR
            </NavLink>
            <NavLink to="/random" className="nav-item">
              <img src={Icons.random} alt="Random" className="icon" />
              RANDOM
            </NavLink>
          </nav>
          <NavLinks />
        </>
      </div>
    </Router>
  );
};

export default App;
