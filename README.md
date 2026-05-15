# SportRyder - Tienda Deportiva Online

Aplicación de ecommerce deportiva construida con **React 19**, **Vite** y **React Router**. Proyecto académico que muestra prácticas modernas de desarrollo en frontend con gestión de estado, routing y validaciones en tiempo real.

## 🚀 Características

- **Catálogo dinámico**: explora equipos deportivos con categorías y búsqueda
- **Carrito funcional**: agrega o elimina productos con validación de stock en tiempo real
- **Control de inventario**: evita sobreventa con límites automáticos por producto
- **Alertas visuales**: mensajes temporales en verde/rojo para confirmaciones y errores
- **Formulario de contacto**: página con validación y manejo de estado
- **Navegación completa**: Inicio, Productos, Contacto y Carrito
- **Diseño responsive**: adaptativo a móviles, tablets y desktop
- **Context API**: gestión centralizada del carrito de compras

## 🛠️ Tecnologías

- **React 19** - framework principal
- **Vite** - herramienta de construcción y servidor de desarrollo
- **React Router** - navegación SPA
- **Context API** - estado global
- **ESLint** - linting y calidad de código

## 📦 Instalación

```bash
npm install
```

## 🚀 Ejecutar en desarrollo

```bash
npm run dev
```

## 🏗️ Build para producción

```bash
npm run build
```

## 📱 Uso

1. Navega por el catálogo de productos
2. Agrega productos al carrito respetando el stock disponible
3. Revisa el carrito y modifica las cantidades
4. Envía el formulario de contacto

## 📂 Estructura del proyecto

```
src/
├── components/   # Componentes reutilizables
├── context/      # Context API para estado global
├── data/         # Datos de productos
├── pages/        # Páginas principales
└── routes/       # Configuración de rutas
```
