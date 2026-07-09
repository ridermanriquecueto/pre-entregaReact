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

## 🔐 Admin y autenticación

- La aplicación usa Firebase Authentication para login y registro.
- El panel de administración está protegido y solo puede accederlo el usuario con correo `admin@gmail.com`.
- Para usar el panel admin, registrá ese correo o iniciá sesión con él.
- En el panel admin podés crear, editar, eliminar y cargar 15 productos de ejemplo.

### Usuario admin recomendado

- El panel admin está configurado para verificar el email `admin@gmail.com`.
- Para usarlo, registrá ese correo en la app y luego iniciá sesión.
- Si querés, podés cambiar el correo administrador en `src/components/NavBar.jsx` y en `src/routes/ProtectedRoute.jsx`.

## ⚙️ Configuración de Firebase

1. Crea un proyecto en Firebase y habilita Authentication con correo/contraseña.
2. Crea una base de Firestore en modo producción o en modo prueba según necesites.
3. Copia las credenciales de Firebase en `src/firebase/config.js`.
4. Asegurate de que el collection `productos` exista o se cree automáticamente al cargar productos.

## 🌐 Despliegue

- El proyecto está listo para producción con `npm run build`.
- Podés desplegarlo en plataformas como Vercel, Netlify o Firebase Hosting.
- Para ponerlo en producción:
  1. Ejecutá `npm install`
  2. Ejecutá `npm run build`
  3. Subí la carpeta `dist/` al host o configurá el service provider con el build generado.

## ⚠️ Problemas comunes

- Si el login no funciona, verificá que Firebase Authentication esté habilitado para correo/contraseña.
- Si no aparecen productos, asegurate de tener la colección `productos` en Firestore o de cargar los 15 productos desde el panel admin.
- Si el admin está bloqueado, revisá que el email sea `admin@gmail.com` o actualizá el valor en `ProtectedRoute.jsx`.

## 📂 Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
├── context/        # Context API para estado global
├── data/          # Datos de productos
├── pages/         # Páginas principales
└── routes/        # Configuración de rutas
```
