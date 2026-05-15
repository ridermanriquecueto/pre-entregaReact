import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home-page">
      <div className="home-hero">
        <div>
          <span className="eyebrow">SportRyder</span>
          <h1>Entrena con estilo y potencia.</h1>
          <p>
            SportRyder reúne zapatillas, ropa y accesorios deportivos pensados para tu mejor rendimiento.
            Encontrá todo lo necesario para tus entrenamientos, con stock listo y entregas rápidas.
          </p>
          <div className="home-actions">
            <Link to="/productos" className="button-primary">
              Ver catálogo completo
            </Link>
            <Link to="/carrito" className="button-outline">
              Ver carrito
            </Link>
          </div>
        </div>
        <div className="home-preview">
          <img
            src="https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=900"
            alt="Entrenamiento deportivo con equipo profesional"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;