# 🛒 TechGadget Store

TechGadget Store es un proyecto de tienda online que muestra productos tecnológicos con un diseño moderno, funcional y responsivo. Incluye carrito de compras con almacenamiento local, sistema de paginación, formularios con validación y modo oscuro para mejorar la experiencia del usuario. Desarrollado como trabajo final de módulo del curso Frontend Trainee 2025

---

## 🚀 Características principales

✅ Carga dinámica de productos desde un archivo JSON  
✅ Sistema de paginación para mostrar productos en bloques  
✅ Carrito de compras con añadir, eliminar y mostrar total  
✅ Almacenamiento del carrito en localStorage para persistencia  
✅ Formularios de suscripción y contacto con alertas de confirmación  
✅ Modo oscuro con toggle y detección de preferencia del sistema  
✅ Diseño responsivo basado en Bootstrap 5  
✅ Código comentado para facilitar el aprendizaje y la personalización

---

## 📂 Estructura del proyecto

techgadget-store/
│
├── dist/
│ ├── css/
│ │ ├── style.css
│ │ └── style.css.map
│ └── js/
│ └── scripts.js
│
├── node_modules/
│
├── pages/
│ ├── index.html
│ ├── products.html
│ ├── contact.html
│ └── faq.html
│
├── src/
│ ├── data/
│ │ └── productos.json
│ ├── img/
│ │ ├── ofertas/
│ │ │ ├── oferta-1.jpg
│ │ │ ├── oferta-2.jpg
│ │ │ └── oferta-3.jpg
│ │ └── productos/
│ │ └── (imágenes de productos)
│ └── sass/
│  ├── abstracts/
│  ├── base/
│  ├── components/
│  ├── layout/
│  ├── pages/
│  └── themes/
│
├── .gitignore
├── index.html (para redireccionamiento)
├── package-lock.json
├── package.json
└── README.md

---

## 💻 Tecnologías usadas

- HTML5  
- SCSS/Sass para estilos modulares  
- Bootstrap 5 (local) para diseño responsivo  
- JavaScript para interactividad y lógica del carrito  
- localStorage para persistencia de carrito  
- JSON para datos de productos

---

## 🛠️ Cómo usar el proyecto

1. Clona este repositorio o descarga el ZIP.  
2. Ejecuta un servidor local (recomendado para evitar problemas con fetch), por ejemplo con Live Server en VSCode o `python -m http.server` en la carpeta raíz.  
3. Abre `pages/index.html` en el navegador.  
4. Navega por productos, agrega al carrito y prueba las funcionalidades.  
5. Explora el modo oscuro usando el toggle en el navbar.

---

## 🎨 Estilos y organización Sass

El proyecto usa una estructura clara para los estilos:

- **abstracts/**: variables y mixins Sass  
- **base/**: estilos base, tipografía, animaciones  
- **layout/**: header, footer, grillas y carousel  
- **components/**: botones, cards, carrito, enlaces  
- **pages/**: estilos específicos para cada página  
- **themes/**: modo oscuro y otros temas

El archivo principal `main.scss` importa todo en orden para una compilación modular.

---

## 📩 Formularios

- Formulario de suscripción con alerta de agradecimiento  
- Formulario de contacto con validación nativa y alerta  
- Ambos usan JavaScript para mejorar la experiencia sin frameworks externos

---

## 🌗 Modo oscuro

Detecta preferencia del sistema y guarda la elección del usuario en localStorage para mantener el tema activo entre sesiones.

---

## ✍️ Autor

Desarrollado por **José Huerta** ([GitHub](https://github.com/josemhuertab))

## Integrantes del equipo

* **Antonio Eliash**
* **Pedro Nina**
* **Odette Gallo**