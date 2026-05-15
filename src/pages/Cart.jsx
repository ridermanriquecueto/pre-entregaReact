import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../components/Item.css";

const Cart = () => {
  const { cart, totalQuantity, totalPrice, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <section className="cart-page empty-cart">
        <div className="empty-cart-graphic" aria-hidden="true">
          <div className="empty-cart-icon">
            <div className="cart-shape"></div>
            <div className="cart-wheel cart-wheel-left"></div>
            <div className="cart-wheel cart-wheel-right"></div>
          </div>
          <div className="empty-cart-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <h2>Tu carrito está vacío</h2>
        <p>Aún no has agregado productos.</p>
        <Link to="/productos" className="button-primary">
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-summary">
        <h2>Carrito de compras</h2>
        <p>Total de artículos: <strong>{totalQuantity}</strong></p>
        <p>Precio total: <strong>${totalPrice.toLocaleString()}</strong></p>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <article key={item.id} className="cart-item-card">
            <div>
              <h3>{item.nombre}</h3>
              <p>Categoría: {item.categoria}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Subtotal: <strong>${(item.precio * item.quantity).toLocaleString()}</strong></p>
            </div>
            <button className="button-outline" onClick={() => removeFromCart(item.id)}>
              Quitar uno
            </button>
          </article>
        ))}
      </div>

      <div className="cart-actions">
        <button className="button-secondary" onClick={clearCart}>
          Vaciar carrito
        </button>
        <Link to="/productos" className="button-primary">
          Seguir comprando
        </Link>
      </div>
    </section>
  );
};

export default Cart;
