// src/components/Layout.jsx
import { NavBar } from "./NavBar"; // 👈 Corregida la B mayúscula para evitar errores en producción
import { Footer } from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Tu menú de navegación premium con Tailwind */}
      <NavBar />
      
      {/* Contenedor principal responsivo */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-6 animate-fadeIn">
        {children}
      </main>
      
      {/* Pie de página */}
      <Footer />
    </div>
  );
};

export default Layout;