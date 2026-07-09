// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth(); // Asumo que ya tienes 'isAdmin' en tu AuthContext
  const location = useLocation();

  if (loading) return <div>Cargando...</div>;

  // 1. Si no hay usuario, redirigir al login guardando la ruta a la que quería ir
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Si se requiere ser admin y el usuario no lo es, redirigir al home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // 3. Si todo es correcto, renderizar el contenido
  return children;
};