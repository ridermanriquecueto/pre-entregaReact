const Footer = () => {
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
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <h3>SportRyder</h3>
          <p>
            Proyecto académico de e-commerce con React, Vite, React Router DOM,
            Context API y carrito funcional.
          </p>
          <p>Contacto: info@sportryder.com | La Plata</p>
        </div>
      </div>

      <div className="team-cards">
        {team.map((persona) => (
          <div key={persona.nombre} className="team-card">
            <img src={persona.avatar} alt={`Avatar de ${persona.nombre}`} />
            <h4>{persona.nombre}</h4>
            <p>{persona.rol}</p>
            <div className="team-links">
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;