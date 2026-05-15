import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../components/Item.css";
import productosJSON from "../data/productos.json";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const [alertMessage, setAlertMessage] = useState("");
  const alertTimeoutRef = useRef(null);

  const product = productosJSON.find((item) => String(item.id) === String(id));

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  if (!product) {
    return (
      <section className="loading-screen">
        <h2>No se encontró el producto.</h2>
        <Link to="/productos" className="button-outline">
          Volver a productos
        </Link>
      </section>
    );
  }

  const handleAddToCart = () => {
    const existingItem = cart.find((item) => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const availableStock = product.stock - currentQuantity;

    if (availableStock <= 0) {
      setAlertMessage("No hay stock disponible para este producto.");
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
      alertTimeoutRef.current = setTimeout(() => {
        setAlertMessage("");
        alertTimeoutRef.current = null;
      }, 2000);
      return;
    }

    const added = addToCart(product, 1);
    if (added) {
      setAlertMessage(`Se agregó "${product.nombre}" al carrito.`);
    } else {
      setAlertMessage("No se pudo agregar el producto (stock insuficiente).");
    }

    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    alertTimeoutRef.current = setTimeout(() => {
      setAlertMessage("");
      alertTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <section className="detail-page">
      <div className="detail-image">
        <img src={product.imagen} alt={product.nombre} />
      </div>
      <div className="detail-info">
        <span className="detail-category">{product.categoria}</span>
        <h1>{product.nombre}</h1>
        <p>{product.descripcion}</p>
        <p className="detail-price">${product.precio.toLocaleString()}</p>
        <p className="detail-stock">Stock disponible: {product.stock}</p>
        <div className="detail-actions">
          <button className="button-primary" onClick={handleAddToCart}>
            Agregar al carrito
          </button>
          <Link to="/productos" className="button-outline">
            Volver al catálogo
          </Link>
        </div>
        {alertMessage && (
          <div className={`product-alert ${alertMessage.includes("No hay stock") || alertMessage.includes("No se pudo") ? "error-alert" : "success-alert"}`}>
            {alertMessage}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
