import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.scss";
import Logo from "../assets/whitelogo.svg";


const Welcome = () => {
  const [showLogo, setShowLogo] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    
    setTimeout(() => setShowLogo(true), 2000); // Логотип появляется через 2 сек
    setTimeout(() => navigate("/food/hot"), 5000); // Переход через 5 сек
  }, [navigate]);

  return (
    <div className="welcome">
      <svg className="hello-text" viewBox="0 0 500 100">
        <text x="50%" y="50%" textAnchor="middle" dy=".3em">Welcome to</text>
      </svg>
      <img className={showLogo ? "slide-in" : ""} src={Logo} alt="Puer Logo" />
    </div>
  );
};

export default Welcome;