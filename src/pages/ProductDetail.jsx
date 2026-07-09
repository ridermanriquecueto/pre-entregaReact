import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import "../components/Item.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cart } = useCart();

  const [product, setProduct] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const alertTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "productos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error al obtener producto:", error);
      }
    };

    fetchProduct();

    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [id]);

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
      setAlertMessage("No hay stock disponible.");

      clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = setTimeout(() => setAlertMessage(""), 2000);

      return;
    }

    const added = addToCart(product, 1);

    setAlertMessage(
      added
        ? `Se agregó "${product.nombre}" al carrito.`
        : "No se pudo agregar el producto."
    );

    clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => setAlertMessage(""), 2000);
  };

  return (
    <section className="detail-page">
      <div className="detail-image">
        <img src={product.imagen || "https://via.placeholder.com/700x500"} alt={product.nombre || "Producto"} />
      </div>

      <div className="detail-info">
        <span className="detail-category">{product.categoria || "Sin categoría"}</span>
        <h1>{product.nombre || "Producto"}</h1>
        <p>{product.descripcion || "Descripción no disponible."}</p>
        <p className="detail-price">
          ${Number(product.precio || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </p>
        <p className="detail-stock">
          Stock disponible: {product.stock ?? 0}
        </p>

        <div className="detail-actions">
          <button
            className="button-primary"
            onClick={handleAddToCart}
            disabled={Number(product.stock) <= 0}
          >
            {Number(product.stock) > 0 ? "Agregar al carrito" : "Sin stock"}
          </button>

          <Link to="/productos" className="button-outline">
            Volver al catálogo
          </Link>
        </div>

        {alertMessage && (
          <div className="product-alert">
            {alertMessage}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;