import { FaEdit, FaTrash } from "react-icons/fa";

export const ProductTable = ({ products, onEdit, onDelete, loading, error, FALLBACK_IMAGE }) => {
  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (error) return <div className="p-6 bg-red-50 text-red-700">{error}</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-[2rem] shadow-sm border border-slate-200">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">N°</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Producto</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Precio</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Stock</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((prod, index) => (
            <tr key={prod.id} className="hover:bg-slate-50">
              <td className="p-4 text-center font-semibold text-slate-400">#{index + 1}</td>
              <td className="p-4 flex items-center gap-3">
                <img src={prod.imagen || FALLBACK_IMAGE} className="w-12 h-12 object-cover rounded-lg" alt="" />
                <span className="font-semibold text-slate-900">{prod.nombre}</span>
              </td>
              <td className="p-4 font-black">${Number(prod.precio).toLocaleString()}</td>
              <td className="p-4">{prod.stock}</td>
              <td className="p-4 text-center flex justify-center gap-2">
                <button onClick={() => onEdit(prod)} className="p-2 bg-slate-100 rounded-lg"><FaEdit /></button>
                <button onClick={() => onDelete(prod)} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};