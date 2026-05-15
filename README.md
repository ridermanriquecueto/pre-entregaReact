# SportRyder - Tienda Deportiva Online

Aplicación de ecommerce deportiva construida con **React 19**, **Vite** y **React Router**. Proyecto académico que demuestra prácticas modernas de desarrollo en frontend con gestión de estado, routing y validaciones en tiempo real.

## 🚀 Características

- **Catálogo dinámico**: Explora equipos deportivos con categorías y búsqueda
- **Carrito funcional**: Agrega/elimina productos con validación de stock en tiempo real
- **Control de inventario**: Previene sobrestock con límites automáticos por producto
- **Alertas visuales**: Mensajes temporales en verde/rojo para confirmaciones y errores
- **Formulario de contacto**: Página con validación de formulario y estado
- **Navegación completa**: Menú con Inicio, Productos, Contacto y Carrito
- **Diseño responsive**: Adaptativo a móviles, tablets y desktop
- **Context API**: Gestión centralizada del carrito de compras

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **Vite** - Build tool y dev server
- **React Router** - Navegación SPA
- **Context API** - Gestión de estado global
- **ESLint** - Linting y calidad de código

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
2. Agrega items al carrito (respeta stock disponible)
3. Revisa tu carrito y modifica cantidades
4. Contacta con nosotros a través del formulario

## 📂 Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
├── context/        # Context API para estado global
├── data/          # Datos de productos
├── pages/         # Páginas principales
└── routes/        # Configuración de rutas
```
