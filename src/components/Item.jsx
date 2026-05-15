import { Link } from "react-router-dom";
import "./Item.css";

const Item = ({ product }) => {
  const { id, nombre, precio, categoria, imagen, stock } = product;

  return (
    <article className="product-card">
      <img src={imagen} alt={nombre} />
      <div className="product-card-body">
        <span className="product-category">{categoria}</span>
        <h3>{nombre}</h3>
        <p className={stock === 0 ? "stock-badge out-of-stock" : "stock-badge"}>
          {stock === 0 ? "Agotado" : `Stock: ${stock}`}
        </p>
        <div className="product-meta">
          <span className="product-price">${precio.toLocaleString()}</span>
        </div>
        <Link to={`/producto/${id}`} className="product-card-link">
          Ver detalle
        </Link>
      </div>
    </article>
  );
};

export default Item;