// src/components/CartWidget.jsx
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // Un ícono más profesional que el emoji tradicional

export const CartWidget = () => {
  // Traemos la cantidad total real desde tu contexto global
  const { totalQuantity } = useCart();

  return (
    <Link 
      to="/carrito" 
      className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition relative p-2 rounded-lg hover:bg-gray-800/50 font-sans"
    >
      {/* Ícono del carrito */}
      <FaShoppingCart className="text-lg" />
      
      <span className="text-sm font-medium hidden sm:inline">Carrito</span>
      
      {/* Burbuja de notificación dinámica */}
      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-scaleIn">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartWidget;