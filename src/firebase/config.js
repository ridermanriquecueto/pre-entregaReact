// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Tus credenciales reales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCksbvnR2oqd0gDyNfHxCxobN3hN8AFxtI",
  authDomain: "mi-tienda-react-4affa.firebaseapp.com",
  projectId: "mi-tienda-react-4affa",
  storageBucket: "mi-tienda-react-4affa.firebasestorage.app",
  messagingSenderId: "542337697954",
  appId: "1:542337697954:web:eaee5a8aec69896c536ffb",
  measurementId: "G-MXP3780S6B"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios para que los use tu AuthContext y componentes
export const db = getFirestore(app);
export const auth = getAuth(app);