import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const Header = () => {
  return (
    <header className="site-header">
      <Link to="/" className="brand-link">
        <img src={logo} alt="SportRyder" className="brand-logo" />
        <div>
          <span className="brand-name">SportRyder</span>
          <p className="brand-tag">Ecommerce deportivo con React y Vite</p>
        </div>
      </Link>
    </header>
  );
};

export default Header;