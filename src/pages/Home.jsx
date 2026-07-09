// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

// Mismo placeholder embebido que Products.jsx: no depende de un servicio
// externo, así que no se rompe si via.placeholder.com falla.
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#e9ecef"/>
      <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="20"
        fill="#6c757d" text-anchor="middle" dominant-baseline="middle">
        Sin imagen
      </text>
    </svg>
  `);

export const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        // FIX: la colección real se llama "productos" (no "products"), y
        // se ordena por el campo real "nombre" (no "name").
        const productsQuery = query(collection(db, "productos"), orderBy("nombre", "asc"), limit(4));
        const snapshot = await getDocs(productsQuery);
        setFeatured(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al cargar destacados:", error);
        setLoadError("No se pudieron cargar los productos destacados.");
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <Container className="my-4">
      <Helmet>
        <title>SportRyder | Inicio</title>
      </Helmet>

      {/* Hero */}
      <div className="bg-dark text-white rounded-4 p-5 mb-5">
        <p className="text-uppercase small mb-2" style={{ letterSpacing: "0.1em", opacity: 0.7 }}>
          Tienda deportiva
        </p>
        <h1 className="display-4 fw-bold">SportRyder</h1>
        <p className="lead mb-4" style={{ maxWidth: "46ch" }}>
          Ropa y equipamiento deportivo para mujer, hombre y todas las edades. Todo lo que
          necesitás para entrenar, en un solo lugar.
        </p>
        <div className="d-flex gap-2">
          <Link className="btn btn-primary btn-lg" to="/productos">
            Ver productos
          </Link>
          <Link className="btn btn-outline-light btn-lg" to="/carrito">
            Ver carrito
          </Link>
        </div>
      </div>

      {/* Destacados */}
      <div className="mb-4">
        <h2>Productos destacados</h2>
        <p className="text-muted">Los productos más recientes de la tienda.</p>
      </div>

      {loadError && <div className="alert alert-danger">{loadError}</div>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : featured.length === 0 ? (
        <div className="text-center text-muted py-5">Todavía no hay productos cargados.</div>
      ) : (
        <Row>
          {featured.map((prod) => (
            <Col key={prod.id} sm={12} md={6} lg={3} className="mb-4">
              <div className="card h-100 p-3 shadow-sm">
                <img
                  src={prod.imagen || FALLBACK_IMAGE}
                  className="card-img-top"
                  alt={prod.nombre || "Producto"}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="card-body d-flex flex-column gap-2">
                  <span className="badge bg-secondary text-white mb-2">{prod.categoria || "Sin categoría"}</span>
                  <h5 className="card-title">{prod.nombre || "Producto"}</h5>
                  <p className="card-text text-muted mb-2">
                    ${Number(prod.precio || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </p>
                  <div className="mt-auto">
                    <Link to={`/productos/${prod.id}`} className="btn btn-primary w-100">
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;