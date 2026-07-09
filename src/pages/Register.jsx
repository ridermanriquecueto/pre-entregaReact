import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Las contraseñas no coinciden.");

    try {
      setError("");
      await register(email, password);
      // Ya autenticado, enviamos directo al home
      navigate("/", { replace: true });
    } catch (err) {
      setError("Error al registrar.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleRegister} className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-white/10">
        <h2 className="text-white text-center text-2xl font-black mb-6">Crear Cuenta</h2>
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        <input type="email" placeholder="Correo" className="w-full p-3 mb-4 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" className="w-full p-3 mb-4 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirmar Contraseña" className="w-full p-3 mb-4 rounded-xl" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-xl">Registrarme</button>
      </form>
    </div>
  );
};