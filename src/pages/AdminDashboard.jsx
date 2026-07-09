// src/pages/AdminDashboard.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Modal, Spinner } from "react-bootstrap";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaSearch,
  FaExclamationTriangle,
  FaCameraRetro,
  FaArrowLeft,
  FaUpload,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

// Categorías predefinidas para el selector. Si en algún momento necesitás
// agregar más, es el único lugar donde hay que tocar.
const AVAILABLE_CATEGORIES = [
  "Indumentaria",
  "Zapatillas",
  "Accesorios",
  "Equipamiento de gimnasio",
  "Suplementos",
  "Ofertas",
];

// Respaldo de imagen embebido: no depende de un servicio externo, así
// que no se rompe si via.placeholder.com (u otro) falla.
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
      <rect width="150" height="150" fill="#e2e8f0"/>
      <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="12"
        fill="#64748b" text-anchor="middle" dominant-baseline="middle">
        Sin imagen
      </text>
    </svg>
  `);

// Se define fuera del componente para que sea una referencia ESTABLE.
// Si se define adentro, se crea un objeto nuevo en cada render, lo que
// hace que useCallback/useEffect se disparen en bucle infinito.
const productsCollection = collection(db, "productos");

export const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const alertTimeoutRef = useRef(null);

  // Estados del Formulario (Garantizamos tipos correctos desde el inicio)
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idEdicion, setIdEdicion] = useState(null);

  // NUEVO: controla si se ve el formulario o solo la lista. Arranca en
  // false: por defecto se ve únicamente la lista de productos.
  const [showForm, setShowForm] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => setAlertMessage(""), 4500);
  };

  const clearAlert = () => {
    setAlertMessage("");
    clearTimeout(alertTimeoutRef.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  // FIX: "source.unsplash.com" (la API vieja de Unsplash) fue discontinuada
  // por Unsplash y ya no devuelve imágenes. Picsum sigue funcionando y da
  // una imagen distinta y estable por cada texto de búsqueda (seed).
  const generateImageUrl = () => {
    const seed = nombre.trim() || categoria.trim() || "sports";
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/400`;
  };

  // Convierte la imagen elegida desde el dispositivo a base64 y la guarda
  // en el mismo campo "imagen" que la URL (Firestore la guarda como texto).
  // Nota: para imágenes grandes conviene subir a un storage (Firebase
  // Storage, Cloudinary, etc.) en vez de guardar el base64 directo en el
  // documento, pero esto ya te destraba la carga desde la PC.
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showAlert("⚠️ El archivo elegido no es una imagen.", "error");
      return;
    }
    if (file.size > 1024 * 1024) {
      showAlert("⚠️ La imagen pesa más de 1MB. Elegí una más liviana.", "error");
      return;
    }

    setImageLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImagen(reader.result || "");
      setImageLoading(false);
    };
    reader.onerror = () => {
      showAlert("❌ No se pudo leer el archivo.", "error");
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDocs(productsCollection);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setError(null);
    } catch (err) {
      console.error("Error al leer Firestore:", err);
      setError("Error al sincronizar con Firebase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
    };

    loadProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setIdEdicion(null);
    setNombre("");
    setPrecio("");
    setStock("");
    setImagen("");
    setCategoria("");
    setDescripcion("");
  };

  const filteredProducts = products.filter((prod) =>
    prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lista ordenada alfabéticamente por nombre para que se vea prolija.
  const sortedProducts = [...filteredProducts].sort((a, b) =>
    (a.nombre || "").localeCompare(b.nombre || "", "es")
  );

  const totalProducts = products.length;
  const lowStockCount = products.filter((prod) => Number(prod.stock) > 0 && Number(prod.stock) <= 5).length;
  const outOfStockCount = products.filter((prod) => Number(prod.stock) === 0).length;

  const handleOpenCreateForm = () => {
    clearAlert();
    resetForm();
    setShowForm(true);
  };

  const handleEditSetup = (product) => {
    clearAlert();
    setIdEdicion(product.id);
    setNombre(product.nombre || "");
    setPrecio(product.precio || "");
    setStock(product.stock || "");
    setImagen(product.imagen || "");
    setCategoria(product.categoria || "");
    setDescripcion(product.descripcion || "");
    setShowForm(true);
  };

  const handleCancelForm = () => {
    clearAlert();
    resetForm();
    setShowForm(false);
  };

  // ENVÍO DEL FORMULARIO CON INTERCEPCIÓN DE ERRORES
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[handleSubmit] disparado", { nombre, precio, stock, categoria, imagen: imagen?.slice(0, 30) });
    clearAlert();

    if (!nombre.trim()) {
      console.log("[handleSubmit] bloqueado: falta nombre");
      showAlert("⚠️ El nombre es obligatorio.", "error");
      return;
    }
    if (!precio || Number(precio) <= 0) {
      console.log("[handleSubmit] bloqueado: precio inválido", precio);
      showAlert("⚠️ El precio debe ser mayor a 0.", "error");
      return;
    }
    if (stock === "" || Number(stock) < 0) {
      console.log("[handleSubmit] bloqueado: stock inválido", stock);
      showAlert("⚠️ El stock no puede ser negativo.", "error");
      return;
    }

    // Fallback de imagen por si no ponen URL válida o la dejan vacía
    const urlImagenValida = imagen.trim().startsWith("http") || imagen.trim().startsWith("data:")
      ? imagen.trim()
      : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"; // Foto de zapatilla por defecto

    const itemData = {
      nombre: nombre.trim(),
      precio: Number(precio),
      stock: Number(stock),
      imagen: urlImagenValida,
      categoria: categoria.trim() || "Sin categoría",
      descripcion: descripcion.trim() || "Descripción no disponible.",
    };

    console.log("[handleSubmit] validación OK, escribiendo en Firestore...", itemData);

    try {
      if (idEdicion === null) {
        console.log("[handleSubmit] creando documento nuevo en colección 'productos'");
        const ref = await addDoc(productsCollection, itemData);
        console.log("[handleSubmit] documento creado con id:", ref.id);
        await fetchProducts();
        console.log("[handleSubmit] fetchProducts terminó, productos en estado:", products.length);
        resetForm();
        setShowForm(false);
        showAlert(`✅ Producto "${itemData.nombre}" creado con éxito.`, "success");
      } else {
        console.log("[handleSubmit] actualizando documento:", idEdicion);
        const productDoc = doc(db, "productos", idEdicion);
        await updateDoc(productDoc, itemData);
        await fetchProducts();
        resetForm();
        setShowForm(false);
        showAlert(`📝 Producto "${itemData.nombre}" actualizado con éxito.`, "success");
      }
    } catch (err) {
      console.error("[handleSubmit] ERROR al guardar en Firestore:", err.code, err.message, err);
      showAlert(`❌ Error en Firebase: ${err.message}`, "error");
    }
  };

  const handleDeleteTrigger = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        const productDoc = doc(db, "productos", productToDelete.id);
        await deleteDoc(productDoc);
        setShowDeleteModal(false);
        setProductToDelete(null);
        await fetchProducts();
        showAlert(`🗑️ Producto "${productToDelete.nombre}" eliminado.`, "success");
      } catch (err) {
        console.error("Error al borrar de Firestore:", err);
        showAlert("❌ No se pudo eliminar el producto.", "error");
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <Helmet>
        <title>SportRyder | Panel de Control</title>
      </Helmet>

      {/* ---------- CABECERA + ESTADÍSTICAS (siempre visible) ---------- */}
      <div className="max-w-6xl w-full mx-auto mb-8">
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-[0_20px_120px_rgba(15,23,42,0.12)]">
          <div className="bg-slate-950/95 px-6 py-7 sm:px-8 sm:py-9 text-white backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                  Control Interno
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">Gestión exclusiva de inventario</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                  Actualizá stock, precios e imágenes al instante con sincronización directa en Firebase.
                </p>
              </div>
              {/* El botón de "Nuevo Producto" solo aparece cuando estamos viendo la lista */}
              {!showForm && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                  <button
                    onClick={handleOpenCreateForm}
                    className="inline-flex items-center gap-2 rounded-3xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
                  >
                    <FaPlus size={14} /> Nuevo Producto
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 sm:p-8 bg-slate-900/95">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Total de Productos</p>
              <p className="mt-4 text-3xl font-black text-white">{totalProducts}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Bajo stock</p>
              <p className="mt-4 text-3xl font-black text-white">{lowStockCount}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Sin stock</p>
              <p className="mt-4 text-3xl font-black text-white">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {alertMessage && (
        <div
          className={`max-w-6xl mx-auto mb-6 rounded-3xl border px-5 py-4 ${
            alertType === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : alertType === "error"
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : "bg-sky-50 border-sky-200 text-sky-900"
          }`}
        >
          {alertMessage}
        </div>
      )}

      {/* ---------- FORMULARIO O LISTA: NUNCA LOS DOS A LA VEZ ---------- */}
      <div className="max-w-6xl w-full mx-auto mb-6">
        {showForm ? (
          // ---------- VISTA: SOLO FORMULARIO ----------
          <div className="max-w-2xl mx-auto rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400" />
            <div className="p-6 border-b border-slate-200 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancelForm}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                aria-label="Volver a la lista"
              >
                <FaArrowLeft size={13} />
              </button>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                {idEdicion ? <FaEdit size={16} /> : <FaPlus size={16} />}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Panel Admin</p>
                <h3 className="text-xl font-black text-slate-900">{idEdicion ? "Editar Producto" : "Nuevo Producto"}</h3>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nombre *</label>
                    <input
                      type="text"
                      className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Ej. Conjunto Encaje Sport"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Categoría</label>
                    <select
                      className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      <option value="">Selecciona una categoría</option>
                      {AVAILABLE_CATEGORIES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Precio ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="0.00"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Stock *</label>
                    <input
                      type="number"
                      className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Descripción</label>
                  <textarea
                    rows="3"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Descripción breve del producto"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Imagen del producto</label>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4 items-start">
                    <div className="space-y-3">
                      <input
                        type="url"
                        className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="https://link-de-la-foto.com/imagen.jpg"
                        value={imagen.startsWith("data:") ? "" : imagen}
                        onChange={(e) => setImagen(e.target.value)}
                      />
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <label className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer">
                          <FaUpload /> Subir desde mi PC
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const nextImage = generateImageUrl();
                            setImagen(nextImage);
                            showAlert("Imagen generada según el producto. Guardá para aplicar.", "success");
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                        >
                          <FaCameraRetro /> Generar imagen
                        </button>
                      </div>
                      {imageLoading && <p className="text-[11px] text-slate-500">Procesando imagen...</p>}
                      <p className="text-[11px] text-slate-500">
                        Pegá una URL, subí un archivo (máx. 1MB) o generá una imagen automática.
                      </p>
                    </div>
                    <div className="w-full sm:w-[140px] h-[140px] rounded-3xl border border-dashed border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center">
                      {imagen ? (
                        <img
                          src={imagen}
                          alt="Vista previa"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-[11px] text-slate-400 text-center px-2">Vista previa</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Limpiar
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
                  >
                    {idEdicion ? "Guardar cambios" : "Crear producto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          // ---------- VISTA: SOLO LISTA ----------
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-1">
              <div className="relative max-w-md w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-3xl pl-12 pr-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-4 focus:ring-slate-200"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="text-sm text-slate-500">
                Resultados: <span className="font-semibold text-slate-900">{filteredProducts.length}</span>
              </p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Listado de productos</p>
                    <h3 className="text-xl font-black text-slate-900">Productos</h3>
                    <p className="text-sm text-slate-500">Editá o eliminá productos directamente desde esta tabla.</p>
                  </div>
                  <div className="text-sm text-slate-500">
                    Total de resultados: <span className="font-semibold text-slate-900">{filteredProducts.length}</span>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner animation="border" variant="dark" className="mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Sincronizando con Firebase...</p>
                </div>
              ) : error ? (
                <div className="p-6 bg-red-50 text-red-700 flex items-center gap-3 m-4 rounded-xl">
                  <FaExclamationTriangle />
                  <span className="text-sm font-semibold">{error}</span>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">No hay productos que coincidan con la búsqueda.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse align-middle">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center w-16">N°</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase w-24">Vista</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Detalles</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Precio</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Stock</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center w-48">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedProducts.map((prod, index) => (
                        <tr key={prod.id} className="bg-white hover:bg-slate-50/80 transition">
                          <td className="p-4 text-center text-sm font-semibold text-slate-400">#{index + 1}</td>
                          <td className="p-4">
                            <img
                              src={prod.imagen || FALLBACK_IMAGE}
                              alt={prod.nombre}
                              className="w-14 h-14 object-cover rounded-3xl border border-slate-200 shadow-sm"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = FALLBACK_IMAGE;
                              }}
                            />
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-900 block text-base">{prod.nombre}</span>
                            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">
                              {prod.categoria || "Sin categoría"}
                            </span>
                            <span className="text-xs uppercase tracking-[0.12em] text-slate-400 block mt-1">
                              ID: {prod.id.slice(0, 8)}...
                            </span>
                          </td>
                          <td className="p-4 font-black text-slate-900">
                            ${Number(prod.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                prod.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {prod.stock} unidades
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleEditSetup(prod)}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-950/5 hover:bg-slate-950/10 text-slate-700 rounded-2xl text-xs font-semibold transition border border-slate-200"
                              >
                                <FaEdit /> Editar
                              </button>
                              <button
                                onClick={() => handleDeleteTrigger(prod)}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-xs font-semibold transition"
                              >
                                <FaTrash /> Borrar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL BORRAR */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <div className="p-5 font-sans">
          <h3 className="text-base font-black text-red-600 mb-2">¿Confirmar eliminación?</h3>
          <p className="text-gray-600 text-sm mb-5">
            Estás por borrar <strong>{productToDelete?.nombre}</strong> del catálogo de Firebase.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 px-4 py-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition"
            >
              Confirmar Borrado
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};