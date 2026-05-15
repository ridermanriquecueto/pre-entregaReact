import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ nombre: "", email: "", mensaje: "" });
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.nombre.trim() || !formData.email.trim() || !formData.mensaje.trim()) {
      setStatus("Por favor completa todos los campos antes de enviar.");
      return;
    }

    setStatus("Gracias por tu mensaje. Nos contactaremos contigo pronto.");
    console.log("Formulario de contacto enviado:", formData);
    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <section className="contact-page">
      <header className="page-header">
        <h2>Contacto</h2>
        <p>Escríbenos y te responderemos lo antes posible.</p>
      </header>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="nombre">Nombre completo</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@ejemplo.com"
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="6"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Cuéntanos cómo podemos ayudarte"
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button-primary">
            Enviar mensaje
          </button>
        </div>

        {status && <p className="status-message">{status}</p>}
      </form>
    </section>
  );
};

export default Contact;
