import { NavLink } from "react-router-dom";
import CartWidget from "./CartWidget";
import "./NavBar.css";

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Inicio</NavLink>
        <NavLink to="/productos" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Productos</NavLink>
        <NavLink to="/contacto" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Contacto</NavLink>
        <NavLink to="/carrito" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Carrito</NavLink>
      </div>
      <CartWidget />
    </nav>
  );
};

export default Navbar;
