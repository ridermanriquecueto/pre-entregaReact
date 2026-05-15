// src/components/CartWidget.jsx
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartWidget = () => {
  const { totalQuantity } = useCart();

  return (
    <Link to="/carrito" className="cart-widget">
      <span>🛒</span>
      <span className="cart-count">{totalQuantity}</span>
    </Link>
  );
};

export default CartWidget;