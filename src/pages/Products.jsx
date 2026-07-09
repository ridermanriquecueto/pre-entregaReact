// src/pages/Products.jsx
import { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Spinner, Container, Row, Col, Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { FaSearch, FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Placeholder embebido: no depende de un servicio externo, así que no
// se rompe si via.placeholder.com falla (ya lo vimos fallar antes).
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

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const alertTimeoutRef = useRef(null);
  const itemsPerPage = 4; // Ajustable
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(docs);
      } catch (err) {
        // FIX: antes el catch no recibía el error ni lo logueaba, así que
        // era imposible diagnosticar un fallo de conexión real.
        console.error("Error al cargar productos:", err);
        setError("Error al conectar con la base de datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    alertTimeoutRef.current = setTimeout(() => {
      setAlertMessage("");
    }, 2500);
  };

  const handleAddToCart = (prod) => {
    const added = addToCart(prod, 1);
    if (added) {
      showAlert(`"${prod.nombre}" agregado al carrito.`, "success");
    } else {
      showAlert(`No se pudo agregar "${prod.nombre}" al carrito.`, "danger");
    }
  };

  // Filtro de búsqueda en tiempo real
  const filteredProducts = products.filter(
    (prod) =>
      prod.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      prod.categoria?.toLowerCase().includes(search.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>Cargando el catálogo de SportRyder...</p>
      </Container>
    );
  }

  if (error)
    return (
      <Container className="my-5">
        <p className="text-danger">{error}</p>
      </Container>
    );

  return (
    <Container className="my-4">
      <Helmet>
        <title>SportRyder | Productos</title>
      </Helmet>

      {/* Barra de Búsqueda */}
      {/* FIX: el <Form> no tenía onSubmit, así que apretar Enter en el
          input disparaba el submit nativo del navegador y recargaba toda
          la página (perdiendo el estado). El botón de lupa tampoco hacía
          nada porque el filtro ya es en tiempo real vía onChange. */}
      <Form className="d-flex mb-4" onSubmit={(e) => e.preventDefault()}>
        <Form.Control
          type="search"
          placeholder="Buscar equipamiento..."
          className="me-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Buscar productos"
        />
        <Button type="submit" variant="outline-primary" aria-label="Buscar">
          <FaSearch />
        </Button>
      </Form>

      {alertMessage && (
        <div className={`alert alert-${alertType} rounded-4 mb-4`} role="alert">
          {alertMessage}
        </div>
      )}

      {/* Grilla de Productos */}
      {currentItems.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          {filteredProducts.length === 0
            ? "No se encontraron productos con esa búsqueda."
            : "No hay productos para mostrar en esta página."}
        </div>
      ) : (
        <Row>
          {currentItems.map((prod) => (
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
                  <p className="mb-3 text-sm text-muted">Stock: {prod.stock ?? 0}</p>
                  <div className="mt-auto d-grid gap-2">
                    <button type="button" className="btn btn-outline-primary" onClick={() => handleAddToCart(prod)}>
                      <FaCartPlus className="me-2" /> Agregar al carrito
                    </button>
                    <Link to={`/productos/${prod.id}`} className="btn btn-primary">
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 my-4">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
            Anterior
          </Button>
          <span className="align-self-center">
            Página {currentPage} de {totalPages}
          </span>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
            Siguiente
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Products;