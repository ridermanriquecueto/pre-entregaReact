// src/pages/ItemListContainer.jsx (o la ruta donde lo tengas)
import { useState, useEffect } from "react";
import Item from "../components/Item";
import { db } from "../firebase/config"; // Importamos tu base de datos real
import { collection, getDocs } from "firebase/firestore";
import { Spinner } from "react-bootstrap"; // Por si querés usar un cargando

const ItemListContainer = ({ greeting }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductosFromFirebase = async () => {
      try {
        setLoading(true);
        // 1. Apuntamos a la colección "productos" de tu Firestore
        const productsCollection = collection(db, "productos");
        
        // 2. Traemos todos los documentos
        const data = await getDocs(productsCollection);
        
        // 3. Los mapeamos guardando el ID y los campos de cada producto
        const listaProductos = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(listaProductos);
      } catch (error) {
        console.error("Error al cargar los productos en la tienda:", error);
      } finally {
        setLoading(false);
      }
    };

    getProductosFromFirebase();
  }, []); // Se ejecuta una sola vez al cargar la página

  return (
    <section className="item-list-page">
      <header className="page-header">
        <h2>{greeting || "Catálogo de productos"}</h2>
        <p>Compra equipos deportivos con un carrito activo y navegación rápida.</p>
      </header>

      {/* Si está cargando, mostramos un aviso. Si no, renderizamos las tarjetas */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p style={{ color: "#d1d5db", marginTop: "10px" }}>Cargando catálogo oficial...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center my-5">
          <p style={{ color: "#d1d5db" }}>No hay productos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="catalog-grid">
          {productos.map((producto) => (
            // Pasamos el producto de Firebase a tu componente Item original
            <Item key={producto.id} product={producto} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ItemListContainer;