// Initialize EmailJS with your Public Key
document.addEventListener("DOMContentLoaded", function () {
  if (window.emailjs) {
    emailjs.init("YzHZQfslTp3kfGvcw");
  } else {
    console.error("EmailJS no está disponible. Verifica que el script se haya cargado correctamente.");
  }
});

// === VARIABLES GLOBALES ===
let carritoSidebar;
let carritoNotificacion;
let productosData = []; // Variable global para almacenar los productos y su stock

// === FUNCIÓN GLOBAL PARA ACTUALIZAR NOTIFICACIÓN DEL CARRITO ===
function actualizarNotificacionCarrito() {
  const carritoNotificacionElement = document.getElementById("carritoNotificacion");
  if (!carritoNotificacionElement) return;

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalCantidad = carrito.reduce((total, item) => total + item.cantidad, 0);

  if (totalCantidad > 0) {
    carritoNotificacionElement.textContent = totalCantidad;
    carritoNotificacionElement.style.display = "block";
  } else {
    carritoNotificacionElement.style.display = "none";
  }
}

// === FUNCIÓN GLOBAL PARA CARGAR CARRITO ===
function cargarCarrito() {
  const carritoItemsContainer = document.getElementById("carritoItems");
  const totalContainer = document.getElementById("carritoTotal");
  const vaciarBtn = document.getElementById('vaciarCarritoBtn');
  const realizarPedidoBtn = document.getElementById("realizarPedidoBtn");

  if (!carritoItemsContainer) return;

  carritoItemsContainer.innerHTML = "";
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    carritoItemsContainer.innerHTML = '<p class="text-muted">Tu carrito está vacío.</p>';
    if (vaciarBtn) vaciarBtn.style.display = 'none';
    if (realizarPedidoBtn) realizarPedidoBtn.style.display = 'none';
    if (totalContainer) totalContainer.innerHTML = "";
    actualizarNotificacionCarrito();
    return;
  }

  if (vaciarBtn) vaciarBtn.style.display = 'block';
  if (realizarPedidoBtn) realizarPedidoBtn.style.display = 'block';

  let total = 0;
  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const div = document.createElement("div");
    div.classList.add(
      "d-flex",
      "align-items-center",
      "mb-2",
      "gap-2",
      "justify-content-between",
      "border-bottom",
      "pb-2"
    );
    div.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}" width="50" height="50" style="object-fit: cover;">
      <div class="flex-grow-1 ms-2">
        <p class="mb-0 fw-bold">${item.nombre}</p>
        <small class="d-block text-muted">Precio: $${item.precio.toLocaleString("es-CL")}</small>
        <div class="d-flex align-items-center mt-1">
          <button class="btn btn-sm btn-outline-secondary me-1" data-id="${item.id}" data-action="decrease">-</button>
          <span>${item.cantidad.toLocaleString(Number)}</span>
          <button class="btn btn-sm btn-outline-secondary ms-1" data-id="${item.id}" data-action="increase">+</button>
        </div>
        <small class="d-block mt-1">Subtotal: <span class="fw-bold">$${subtotal.toLocaleString("es-CL")}</span></small>
      </div>
      <button class="btn btn-sm btn-danger" data-id="${item.id}" data-action="remove">&times;</button>
    `;
    carritoItemsContainer.appendChild(div);
  });

  if (totalContainer) {
    totalContainer.innerHTML = `
      <div class="mt-3 fw-bold text-end">
        Total: $${total.toLocaleString("es-CL")}
      </div>
    `;
  }

  actualizarNotificacionCarrito();
}

// === FUNCIÓN PARA VACIAR EL CARRITO ===
function vaciarCarrito() {
  if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
    localStorage.removeItem("carrito");
    cargarCarrito();
  }
}

// === FUNCIÓN PARA CERRAR CARRITO ===
function cerrarCarrito() {
  carritoSidebar.classList.remove("abierto");
  overlayCarrito.classList.remove("activo");
  formularioPedidoContainer.style.display = "none";
}

// === FUNCIÓN PARA REALIZAR LA COMPRA Y ACTUALIZAR STOCK ===
async function realizarCompra() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let productosSinStock = [];

  // Simular verificación de stock en servidor
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Verificar disponibilidad antes de modificar el stock
  const hayStockSuficiente = carrito.every(itemCarrito => {
    const producto = productosData.find(prod => prod.id == itemCarrito.id); // Usar == para comparación flexible
    return producto && producto.stock >= itemCarrito.cantidad;
  });

  if (!hayStockSuficiente) {
    alert("Error: Uno o más productos no tienen stock suficiente para completar la compra.");
    return; // Cancelar la operación
  }

  // Si hay stock suficiente, proceder con la compra
  carrito.forEach(itemCarrito => {
    const productoEnStock = productosData.find(prod => prod.id == itemCarrito.id); // Usar == para comparación flexible
    if (productoEnStock) {
      productoEnStock.stock -= itemCarrito.cantidad;
      if (productoEnStock.stock <= 0) {
        productosSinStock.push(productoEnStock.nombre);
        productoEnStock.stock = 0;
      }
    }
  });
  

  localStorage.setItem("productosStock", JSON.stringify(productosData));

  // Si hay productos sin stock, enviar el correo
  if (productosSinStock.length > 0) {
    // Objeto de parámetros para la plantilla de EmailJS
    const templateParams = {
      message: `¡Alerta! Los siguientes productos han quedado sin stock después de la venta: ${productosSinStock.join(", ")}. Por favor, repón el inventario.`,
      to_name: "Responsable", // Nombre del destinatario
      from_name: "Sistema de Inventario", // Nombre del remitente
      // Puedes añadir otros campos que definas en tu plantilla de EmailJS, como el correo del responsable
    };

    try {
      const result = await emailjs.send("service_8xlj3jl", "template_1jgco1f", templateParams);
      console.log("SUCCESS!", result.status, result.text);
      alert(`¡Alerta! Correo de notificación enviado al responsable.`);
    } catch (error) {
      console.error("FAILED...", error);
      alert(`¡Alerta! No se pudo enviar el correo de notificación. Por favor, revisa la consola para más detalles.`);
    }
  }

  // Limpiar el carrito y actualizar la vista de productos
  localStorage.removeItem("carrito");
  cargarCarrito();
  cerrarCarrito();
  // Vuelve a cargar el grid con el stock actualizado
  mostrarProductosEnGrid(productosData, 1);
}

// === IIFE para encapsular el código principal ===
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // === VERIFICAR SESIÓN Y MOSTRAR USUARIO ===
    function verificarYMostrarUsuario() {
      const sesion = localStorage.getItem('sesionActiva') || sessionStorage.getItem('sesionActiva');
      const logoutBtn = document.getElementById('logoutBtn');

      if (sesion) {
        const usuario = JSON.parse(sesion);
        const navbar = document.querySelector('.navbar .container');
        const navbarBrand = navbar.querySelector('.navbar-brand');

        // Crear elemento de bienvenida si no existe
        let welcomeElement = document.getElementById('welcomeUser');
        if (!welcomeElement) {
          welcomeElement = document.createElement('span');
          welcomeElement.id = 'welcomeUser';
          welcomeElement.className = 'navbar-text ms-3';
          welcomeElement.style.color = '#0D3B66';
          welcomeElement.style.fontWeight = '600';
          welcomeElement.innerHTML = `¡Bienvenido, ${usuario.nombre}!`;

          // Insertar después del navbar-brand
          navbarBrand.parentNode.insertBefore(welcomeElement, navbarBrand.nextSibling);
        }

        // Mostrar botón de cerrar sesión
        if (logoutBtn) {
          logoutBtn.style.display = 'inline-block';
        }
      } else {
        // Ocultar botón de cerrar sesión si no hay sesión
        if (logoutBtn) {
          logoutBtn.style.display = 'none';
        }
      }
    }

    // === FUNCIÓN PARA CERRAR SESIÓN ===
    function cerrarSesion() {
      // Eliminar datos de sesión
      localStorage.removeItem('sesionActiva');
      sessionStorage.removeItem('sesionActiva');

      // Redirigir a la página de login
      window.location.href = '../index.html';
    }

    // Llamar la función al cargar la página
    verificarYMostrarUsuario();

    // === EVENT LISTENER PARA CERRAR SESIÓN ===
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', cerrarSesion);
    }

    // === SUSCRIPCIÓN CON ALERTA ===
    const subscriptionForm = document.getElementById("subscriptionForm");
    const alertContainer = document.getElementById("alertContainer");

    if (subscriptionForm) {
      subscriptionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>¡Gracias por suscribirte!</strong> Te mantendremos informado sobre nuestras promociones y ofertas.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
        subscriptionForm.reset();
        setTimeout(() => {
          const alert = bootstrap.Alert.getOrCreateInstance(
            document.querySelector(".alert")
          );
          alert.close();
        }, 3000);
      });
    }

    // === CONTACTO CON ALERTA ===
    const contactForm = document.getElementById("contactForm");
    const contactAlertContainer = document.getElementById(
      "contactAlertContainer"
    );

    if (contactForm && contactAlertContainer) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        contactAlertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>¡Gracias por escribirnos!</strong> Nos pondremos en contacto contigo a la brevedad posible.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
        contactForm.reset();
        setTimeout(() => {
          const alert = bootstrap.Alert.getOrCreateInstance(
            contactAlertContainer.querySelector(".alert")
          );
          alert.close();
        }, 3000);
      });
    }

    // === VARIABLES CARRITO ===
    const abrirCarritoBtn = document.getElementById("abrirCarrito");
    const cerrarCarritoBtn = document.getElementById("cerrarCarrito");
    carritoSidebar = document.getElementById("carritoSidebar");
    const carritoItemsContainer = document.getElementById("carritoItems");
    const realizarPedidoBtn = document.getElementById("realizarPedidoBtn");
    const formularioPedidoContainer = document.getElementById("formularioPedidoContainer");
    const formularioPedido = document.getElementById("formularioPedido");
    const overlayCarrito = document.getElementById("overlayCarrito");
    carritoNotificacion = document.getElementById("carritoNotificacion");

    // === EVENTOS DEL CARRITO ===
    abrirCarritoBtn?.addEventListener("click", () => {
      carritoSidebar.classList.add("abierto");
      overlayCarrito.classList.add("activo");
      cargarCarrito();
    });

    cerrarCarritoBtn?.addEventListener("click", cerrarCarrito);
    overlayCarrito?.addEventListener("click", cerrarCarrito);

    // Evento para modificar o eliminar productos del carrito
    carritoItemsContainer?.addEventListener("click", (e) => {
      const target = e.target;
      const id = target.getAttribute("data-id");
      const action = target.getAttribute("data-action");

      if (!id || !action) return;

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const index = carrito.findIndex(item => item.id == id); // Usar == para comparación flexible
      const productoEnStock = productosData.find(prod => prod.id == id); // Usar == para comparación flexible

      if (index === -1) return;

      if (action === "increase") {
        if (productoEnStock && carrito[index].cantidad < productoEnStock.stock) {
          carrito[index].cantidad++;
        } else {
          alert("No puedes agregar más unidades, se ha alcanzado el límite de stock.");
        }
      } else if (action === "decrease") {
        if (carrito[index].cantidad > 1) {
          carrito[index].cantidad--;
        }
      } else if (action === "remove") {
        carrito.splice(index, 1);
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      cargarCarrito();
    });

    realizarPedidoBtn?.addEventListener("click", () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      if (carrito.length === 0) {
        alert(
          "Tu carrito está vacío. Agrega productos antes de realizar un pedido."
        );
        return;
      }
      formularioPedidoContainer.style.display = "block";
    });

    // === EVENTO PARA VACIAR CARRITO ===
    document.getElementById('vaciarCarritoBtn')?.addEventListener('click', vaciarCarrito);

    formularioPedido?.addEventListener("submit", (e) => {
      e.preventDefault();
      realizarCompra();
      alert("¡Pedido realizado!, te daremos seguimiento a través de tu correo. Si tienes dudas o consultas adicionales, no dudes en contactarnos.");
      formularioPedido.reset();
    });

    // Carga inicial de productos usando XHR
function cargarProductosConXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://68b6ef8f73b3ec66cec335f6.mockapi.io/api/v1/Products', true);
  
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      productosData = JSON.parse(xhr.responseText);
      localStorage.setItem("productosStock", JSON.stringify(productosData));
      mostrarProductosEnGrid(productosData, 1);
      actualizarPaginacion(productosData);
    } else {
      console.error('Error al cargar productos con XHR:', xhr.status, xhr.statusText);
      productosGrid.innerHTML = `<p class="text-danger">No se pudieron cargar los productos. Inténtalo nuevamente más tarde.</p>`;
    }
  };

  xhr.onerror = function() {
    console.error('Error de red al cargar productos con XHR.');
    productosGrid.innerHTML = `<p class="text-danger">Error de red. Verifica tu conexión.</p>`;
  };

  xhr.send();
}

// Llama a esta función para cargar los productos al inicio, si no están en el localStorage
if (productosData.length === 0) {
  cargarProductosConXHR();
} else {
  mostrarProductosEnGrid(productosData, 1);
  actualizarPaginacion(productosData);
}

    // === FILTRADO, CARGA Y PAGINACIÓN DE PRODUCTOS ===
    const productosGrid = document.getElementById("productosGrid");
    const pagina1Btn = document.getElementById("pagina1");
    const pagina2Btn = document.getElementById("pagina2");

    // Función para mostrar los productos en el grid con la nueva lógica de stock
    function mostrarProductosEnGrid(productos, pagina) {
      if (!productosGrid) return;
      
      productosGrid.innerHTML = "";
      if (productos.length === 0) {
        productosGrid.innerHTML = `
            <div class="col-12 text-center">
                <p class="h4 text-muted">No se encontraron productos que coincidan con la búsqueda.</p>
            </div>
        `;
        return;
      }

      const itemsPorPagina = 9;
      const inicio = (pagina - 1) * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      const productosMostrar = productos.slice(inicio, fin);

      productosMostrar.forEach((producto) => {
        const card = document.createElement("div");
        const agotado = producto.stock <= 0;
        const stockBajo = producto.stock > 0 && producto.stock <= 4;
        const ultimoProducto = producto.stock === 1;

        // Genera el HTML para las etiquetas dinámicamente
        const etiquetasHtml = (producto.etiquetas && producto.etiquetas.length > 0)
          ? `<div class="d-flex flex-wrap gap-1 mb-2">
                   ${producto.etiquetas.map(tag => `<span class="badge bg-secondary">${tag}</span>`).join('')}
               </div>`
          : '';

        card.classList.add("col-md-4", "mb-3");
        card.innerHTML = `
            <div class="card h-100 ${agotado ? 'border-danger' : ''}">
                <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="small data-id" data-id="${producto.id}">ID: ${producto.id}</p>
                    <p class="card-text">${producto.desc}</p>
                    <p class="card-text fw-bold text-primary">$${producto.precio.toLocaleString("es-CL")}</p>
                    <p class="mb-1"><small class="text-muted">Categoría: ${producto.categoria || 'N/A'}</small></p>
                    <p class="mb-1"><small class="text-muted">Stock: ${producto.stock}</small></p>
                    ${etiquetasHtml}
                    <div class="mt-auto">
                        ${agotado ?
            `<span class="badge bg-danger mb-2">Agotado</span>` :
            (ultimoProducto ?
              `<span class="badge bg-warning text-dark mb-2">¡Último producto!</span>` :
              (stockBajo ?
                `<span class="badge bg-warning text-dark mb-2">Quedan ${producto.stock} en stock</span>` :
                ''
              )
            )
          }
                        <button class="btn btn-primary w-100" data-id="${producto.id}" ${agotado ? 'disabled' : ''}>Comprar</button>
                    </div>
                </div>
            </div>
        `;
        productosGrid.appendChild(card);
      });
    }

    // Funciones de paginación y filtro
    function actualizarPaginacion(productos) {
      if (!pagina1Btn || !pagina2Btn) return;
      
      const totalPaginas = Math.ceil(productos.length / 9);
      pagina1Btn.style.display = "block";
      pagina2Btn.style.display = totalPaginas > 1 ? "block" : "none";
      if (totalPaginas <= 1) {
        pagina1Btn.classList.add("active");
      }
    }

    function removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function filtrarProductos(filtros) {
      const productosFiltrados = productosData.filter(producto => {
        const { texto, categoria, precioMin, precioMax } = filtros;
        const nombreNormalizado = removeAccents(producto.nombre.toLowerCase());
        const descNormalizada = removeAccents(producto.desc.toLowerCase());
        const categoriaProductoNormalizada = producto.categoria ? removeAccents(producto.categoria.toLowerCase()) : '';
        const etiquetasNormalizadas = producto.etiquetas ? producto.etiquetas.map(tag => removeAccents(tag.toLowerCase())) : [];

        // Coincidencia de texto libre
        const coincideTextoLibre = !texto ||
          nombreNormalizado.includes(removeAccents(texto.toLowerCase())) ||
          descNormalizada.includes(removeAccents(texto.toLowerCase())) ||
          categoriaProductoNormalizada.includes(removeAccents(texto.toLowerCase())) ||
          etiquetasNormalizadas.some(tag => tag.includes(removeAccents(texto.toLowerCase())));

        // Coincidencia de categoría
        const coincideCategoria = !categoria || categoriaProductoNormalizada.includes(removeAccents(categoria.toLowerCase()));

        // Coincidencia de precio
        const coincidePrecio = (!precioMin || producto.precio >= precioMin) &&
          (!precioMax || producto.precio <= precioMax);

        return coincideTextoLibre && coincideCategoria && coincidePrecio;
      });

      actualizarPaginacion(productosFiltrados);
      mostrarProductosEnGrid(productosFiltrados, 1);
    }

    // Eventos de paginación
    pagina1Btn?.addEventListener("click", () => {
      mostrarProductosEnGrid(productosData, 1);
      pagina1Btn.classList.add("active");
      pagina2Btn.classList.remove("active");
    });

    pagina2Btn?.addEventListener("click", () => {
      mostrarProductosEnGrid(productosData, 2);
      pagina2Btn.classList.add("active");
      pagina1Btn.classList.remove("active");
    });

    // Evento para el formulario de filtro
    const filtroForm = document.getElementById("filtroForm");
    const limpiarFiltrosBtn = document.getElementById("limpiarFiltrosBtn");

    filtroForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const terminoTexto = document.getElementById("filtroTexto").value.trim();
      const categoria = document.getElementById("filtroCategoria").value.trim();
      const etiquetas = document.getElementById("filtroEtiquetas").value.trim();
      const precioMin = parseFloat(document.getElementById("filtroPrecioMin").value);
      const precioMax = parseFloat(document.getElementById("filtroPrecioMax").value);

      const filtros = {
        texto: terminoTexto,
        categoria: categoria,
        etiquetas: etiquetas,
        precioMin: isNaN(precioMin) ? null : precioMin,
        precioMax: isNaN(precioMax) ? null : precioMax,
      };

      filtrarProductos(filtros);
    });

    limpiarFiltrosBtn?.addEventListener("click", () => {
      filtroForm?.reset();
      filtrarProductos({}); // Llama a la función con un objeto vacío para mostrar todos los productos
    });

    // === MODO OSCURO ===
    const darkModeToggle = document.getElementById("darkModeToggle");
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Cargar preferencia previa
    if (
      localStorage.getItem("dark-mode") === "enabled" ||
      (!localStorage.getItem("dark-mode") && prefersDarkScheme.matches)
    ) {
      document.body.classList.add("dark-mode");
    }

    darkModeToggle?.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
      } else {
        localStorage.setItem("dark-mode", "disabled");
      }
    });

    // === ANIMACIONES ===
    requestAnimationFrame(() => {
      document.body.classList.add("fade-in");

      // Remover el transform después de que termine la animación
      setTimeout(() => {
        document.body.classList.add("animation-complete");
      }, 500);
    });

    const main = document.querySelector("main");
    if (main) {
      main.classList.add("fade-in");
    }

    // Cargar productos inicial
    cargarProductos();
    
    // Llamar actualizarNotificacionCarrito al cargar la página
    actualizarNotificacionCarrito();
  });

  // === AGREGAR PRODUCTO AL CARRITO DESDE BOTÓN COMPRAR ===
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (target.matches(".btn.btn-primary") && target.textContent.trim() === "Comprar") {
      e.preventDefault();
      const id = target.getAttribute("data-id");
      
      console.log("ID del producto:", id);
      console.log("Productos disponibles:", productosData);
      
      // Usar comparación flexible == para manejar strings y números
      const producto = productosData.find(prod => prod.id == id);
      
      console.log("Producto encontrado:", producto);

      if (!producto) {
        alert("Producto no encontrado. Error en el sistema.");
        return;
      }

      if (producto.stock <= 0) {
        alert("Producto agotado. No se puede agregar al carrito.");
        return;
      }

      let cantidad = prompt(`¿Cuántas unidades de ${producto.nombre} deseas agregar? (Stock disponible: ${producto.stock})`, "1");
      cantidad = parseInt(cantidad);

      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad inválida.");
        return;
      }

      if (cantidad > producto.stock) {
        alert(`No puedes seleccionar más de ${producto.stock} unidades. Por favor, revisa el stock disponible.`);
        return;
      }

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const itemExistente = carrito.find(item => item.id == id); // Usar == para comparación flexible

      if (itemExistente) {
        if (itemExistente.cantidad + cantidad > producto.stock) {
          alert(`No puedes agregar más unidades. El stock disponible es de ${producto.stock} y ya tienes ${itemExistente.cantidad} en tu carrito.`);
          return;
        }
        itemExistente.cantidad += cantidad;
      } else {
        const { nombre, img, precio } = producto;
        carrito.push({ id: id.toString(), nombre, img, precio, cantidad }); // Convertir ID a string para consistencia
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));

      // Feedback visual del botón
      target.textContent = "Agregado";
      target.disabled = true;
      setTimeout(() => {
        target.textContent = "Comprar";
        target.disabled = false;
      }, 1500);

      // Actualizar el carrito si está abierto
      if (carritoSidebar && carritoSidebar.classList.contains("abierto")) {
        cargarCarrito();
      }
      actualizarNotificacionCarrito();
      
      console.log("Producto agregado al carrito exitosamente");
    }
  });

})();