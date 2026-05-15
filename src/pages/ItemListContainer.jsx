import Item from "../components/Item";
import productosJSON from "../data/productos.json";

const ItemListContainer = ({ greeting }) => {
  return (
    <section className="item-list-page">
      <header className="page-header">
        <h2>{greeting || "Catálogo de productos"}</h2>
        <p>Compra equipos deportivos con un carrito activo y navegación rápida.</p>
      </header>

      <div className="catalog-grid">
        {productosJSON.map((producto) => (
          <Item key={producto.id} product={producto} />
        ))}
      </div>
    </section>
  );
};

export default ItemListContainer;