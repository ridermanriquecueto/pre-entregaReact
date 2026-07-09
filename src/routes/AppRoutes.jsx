// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import { Home } from "../pages/Home";
import { Products } from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { AdminDashboard } from "../pages/AdminDashboard";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/productos/:id" element={<ProductDetail />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* ADMIN PROTEGIDO */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* REDIRECCIÓN GENERAL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};