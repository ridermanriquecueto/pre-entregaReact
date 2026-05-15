import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ItemListContainer from "../pages/ItemListContainer";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Contact from "../pages/Contact";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/productos"
        element={<ItemListContainer greeting="Explora nuestros productos deportivos" />}
      />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/producto/:id" element={<ProductDetail />} />
      <Route path="/carrito" element={<Cart />} />
      <Route
        path="*"
        element={<h2 className="not-found">404 - Página no encontrada</h2>}
      />
    </Routes>
  );
};

export default AppRoutes;
