import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.scss";
import Logo from "../assets/whitepuer.svg";

const Welcome = () => {
  const [showLogo, setShowLogo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowLogo(true), 1500); // Логотип появляется с эффектом
    setTimeout(() => navigate("/food/hot"), 4000); // Переход на главную страницу
  }, [navigate]);

  return (
    <div className="welcome">
      <svg className="welcome-text" viewBox="0 0 500 100">
        <text x="50%" y="50%" text-anchor="middle" dy=".3em">Welcome to</text>
      </svg>
      <img className={showLogo ? "slide-in" : ""} src={Logo} alt="Puer Logo" />
    </div>
  );
};

export default Welcome;