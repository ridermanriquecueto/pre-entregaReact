// src/components/Footer.jsx
export const Footer = () => {
  const team = [
    {
      nombre: "Rider Manrique",
      rol: "Dev Backend",
      avatar: "https://i.pravatar.cc/260?img=12",
    },
    {
      nombre: "Luisa H",
      rol: "Diseño UI",
      avatar: "https://i.pravatar.cc/260?img=24",
    },
    {
      nombre: "Martina Paliza",
      rol: "Soporte Técnico",
      avatar: "https://i.pravatar.cc/260?img=32",
    },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900 font-sans mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Información Institucional */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-white font-black text-lg tracking-wider uppercase">SportRyder</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Proyecto académico de e-commerce con React, Vite, React Router DOM,
            Context API y carrito funcional.
          </p>
          <p className="text-xs text-gray-500 pt-2">
            Contacto: <span className="text-gray-300">info@sportryder.com</span> | La Plata
          </p>
        </div>

        {/* Tarjetas del Staff de Desarrollo */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {team.map((persona) => (
            <div 
              key={persona.nombre} 
              className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex flex-col items-center text-center group"
            >
              <img 
                src={persona.avatar} 
                alt={`Avatar de ${persona.nombre}`} 
                className="w-16 h-16 rounded-full border-2 border-gray-800 object-cover mb-3 group-hover:border-blue-500 transition duration-200"
              />
              <h4 className="text-white font-bold text-sm tracking-tight">{persona.nombre}</h4>
              <p className="text-xs text-blue-400 font-medium mb-3">{persona.rol}</p>
              
              {/* Enlaces Sociales del integrante */}
              <div className="flex gap-3 text-[11px] font-bold text-gray-500">
                <a href="#" className="hover:text-white transition">IG</a>
                <a href="#" className="hover:text-white transition">LN</a>
                <a href="#" className="hover:text-white transition">TW</a>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Franja de Copyright Inferior */}
      <div className="max-w-6xl mx-auto px-4 border-t border-gray-900 mt-8 pt-6 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} SportRyder. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;