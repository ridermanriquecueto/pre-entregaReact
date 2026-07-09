// src/components/NavBar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLock, FaSignOutAlt, FaUserShield, FaRunning, FaBars, FaTimes } from "react-icons/fa";
import { CartWidget } from "./CartWidget";

const ADMIN_EMAIL = "admin@gmail.com";

export const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Inicio */}
          <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-wider text-white hover:text-gray-200 transition">
            <FaRunning className="text-blue-500" /> SPORTRYDER
          </Link>

          <button
            type="button"
            onClick={() => setOpenMenu((prev) => !prev)}
            className="sm:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition"
            aria-label={openMenu ? "Cerrar menú" : "Abrir menú"}
          >
            {openMenu ? <FaTimes /> : <FaBars />}
          </button>

          <div className={`flex-col sm:flex-row sm:flex items-center gap-6 text-sm font-semibold w-full sm:w-auto ${openMenu ? "flex" : "hidden"}`}>
            <Link to="/" onClick={() => setOpenMenu(false)} className="hover:text-blue-400 transition">Inicio</Link>
            <Link to="/productos" onClick={() => setOpenMenu(false)} className="hover:text-blue-400 transition">Productos</Link>
            <Link to="/contacto" onClick={() => setOpenMenu(false)} className="hover:text-blue-400 transition">Contacto</Link>
            {!user && (
              <Link to="/registro" onClick={() => setOpenMenu(false)} className="hover:text-blue-400 transition">Registro</Link>
            )}
            <CartWidget />
            {user?.email === ADMIN_EMAIL && (
              <Link
                to="/admin"
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-1.5 bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition"
              >
                <FaUserShield /> Panel Admin
              </Link>
            )}
            {user ? (
              <button
                type="button"
                onClick={async () => {
                  await handleLogout();
                  setOpenMenu(false);
                }}
                className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition cursor-pointer"
              >
                <FaSignOutAlt /> Salir
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition"
              >
                <FaLock size={12} /> Ingreso
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};