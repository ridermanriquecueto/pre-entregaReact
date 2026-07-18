import { useState, useEffect } from "react";
import Item from "../components/Item";
import { db } from "../firebase/config";

import { collection, getDocs, query, limit } from "firebase/firestore";
import { Spinner } from "react-bootstrap";

const ItemListContainer = ({ greeting }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductosFromFirebase = async () => {
      try {
        setLoading(true);
        
        
        const productsCollection = collection(db, "productos");
        const q = query(productsCollection, limit(10)); // <-- Aquí está el límite
        
       
        const data = await getDocs(q);
        
       
        const listaProductos = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(listaProductos);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    getProductosFromFirebase();
  }, []); 

  return (
    <section className="item-list-page">
      {/* ... tu renderizado sigue igual ... */}
      <header className="page-header">
        <h2>{greeting || "Catálogo de productos"}</h2>
      </header>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="catalog-grid">
          {productos.map((producto) => (
            <Item key={producto.id} product={producto} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ItemListContainer;