import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // 1. Importa useLocation
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // 2. Captura la ubicación actual desde donde vino el usuario
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // Si no venía de una ruta protegida, va a "/"

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
      
      // 3. Redirige a la ruta guardada (from)
      navigate(from, { replace: true });
    } catch {
      setError("Credenciales incorrectas. Verificá el correo y la contraseña.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleFormSubmit} className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-white/10">
        <h2 className="text-white text-center text-2xl font-black mb-6">Acceso</h2>
        
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        
        <input 
          type="email" 
          placeholder="Correo" 
          className="w-full p-3 mb-4 rounded-xl bg-slate-950 border border-slate-700 text-white" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          className="w-full p-3 mb-4 rounded-xl bg-slate-950 border border-slate-700 text-white" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded-xl font-bold">
          Ingresar
        </button>
        
        <p className="text-slate-400 mt-4 text-sm text-center">
          ¿No tenés cuenta? <Link to="/registro" className="text-sky-300 hover:underline">Registrate</Link>
        </p>
      </form>
    </div>
  );
};