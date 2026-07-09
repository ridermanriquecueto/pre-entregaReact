import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Estado para saber si el usuario es administrador
  const [isAdmin, setIsAdmin] = useState(false);

  // Configuración del email de administración
  const ADMIN_EMAIL = "admin@gmail.com";

  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Lógica de detección de rol:
      // Si el usuario existe y coincide con el mail, es admin.
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      register, 
      login, 
      logout, 
      loading, 
      isAdmin // Exportamos el nuevo estado
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);