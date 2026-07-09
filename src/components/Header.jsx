// src/components/Header.jsx
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 py-4 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <img 
            src={logo} 
            alt="SportRyder" 
            className="w-10 h-10 text-blue-600 group-hover:scale-105 transition duration-200" 
          />
          <div>
            <span className="block font-black text-xl tracking-tight text-gray-900">
              SportRyder
            </span>
            <p className="text-xs text-gray-500 font-medium">
              Ecommerce deportivo con React y Vite
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;