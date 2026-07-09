import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../components/Item.css";

const Cart = () => {
  const { cart, totalQuantity, totalPrice, removeFromCart, addToCart, removeItem, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <section className="cart-page empty-cart">
        <h2>Tu carrito está vacío</h2>
        <Link to="/productos" className="button-primary">Ver productos</Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-summary">
        <h2>Carrito de compras</h2>
        <p>Total: <strong>${totalPrice.toLocaleString()}</strong></p>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <article key={item.id} className="cart-item-card">
            <img
              src={item.imagen || "https://placehold.co/160x120"}
              alt={item.nombre}
              className="cart-item-image"
              onError={(e) => { e.target.src = "https://placehold.co/160x120"; }}
            />
            <div className="cart-item-content">
              <h3>{item.nombre}</h3>
              <p>Precio: <strong>${item.precio.toLocaleString()}</strong></p>
              <div className="cart-item-quantity">
                <button onClick={() => removeFromCart(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item, 1)}>+</button>
              </div>
              <button className="button-outline" onClick={() => removeItem(item.id)}>Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Cart;