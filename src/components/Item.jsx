// src/components/Item.jsx
import { Link } from "react-router-dom";

export const Item = ({ product }) => {
  const { id, nombre, precio, categoria, imagen, stock } = product;

  return (
    <article className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition duration-200 flex flex-col h-full font-sans">
      {/* Contenedor de Imagen */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img 
          src={imagen} 
          alt={nombre} 
          className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-300"
        />
        {/* Badge de Categoría flotante */}
        <span className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
          {categoria}
        </span>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-1 min-h-[3rem]">
          {nombre}
        </h3>
        
        {/* Badge de Stock dinámico */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
            stock === 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}>
            {stock === 0 ? "Agotado" : `Stock: ${stock}`}
          </span>
        </div>

        {/* Precio y Enlace de Acción */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <span className="font-black text-gray-900 text-lg">
            ${precio.toLocaleString("es-AR")}
          </span>
          <Link 
            to={`/item/${id}`} // 👈 Corregido para que coincida con tus rutas de AppRoutes
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Item;