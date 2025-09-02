document.addEventListener("DOMContentLoaded", function () {
    const productosJSON = [
        { "id": "95843", "img": "../src/img/productos/audifonos-inalambricos-1.jpg", "nombre": "Audífonos Bluetooth", "categoria": "audífonos", "etiquetas": ["inalámbricos", "bluetooth", "deporte"], "desc": "Audífonos de alta calidad, ideales para actividades al aire libre con conexión inalámbrica.", "precio": 19990, "stock": 15 },
        { "id": "42518", "img": "../src/img/productos/audifonos-compactos.jpg", "nombre": "Audífonos Bluetooth Compactos", "categoria": "audífonos", "etiquetas": ["inalámbricos", "bluetooth", "compactos"], "desc": "Libertad de movimiento con sonido envolvente.", "precio": 24990, "stock": 10 },
        { "id": "95482", "img": "../src/img/productos/mouse-rgb.jpg", "nombre": "Mouse RGB", "categoria": "mouse", "etiquetas": ["rgb", "gaming", "inalámbrico"], "desc": "Mouse con iluminación RGB, perfecto para gaming y trabajo.", "precio": 22990, "stock": 20 },
        { "id": "13248", "img": "../src/img/productos/teclado-rgb-1.jpg", "nombre": "Teclado Mecánico RGB", "categoria": "teclado", "etiquetas": ["rgb", "mecánico", "gaming"], "desc": "Teclado mecánico ideal para oficina y gaming con retroiluminación.", "precio": 25990, "stock": 8 },
        { "id": "68421", "img": "../src/img/productos/cargador-inalambrico.jpg", "nombre": "Cargador Inalámbrico", "categoria": "cargador", "etiquetas": ["inalámbrico", "rápido", "compatible"], "desc": "Carga rápida y cómoda para tus dispositivos.", "precio": 14990, "stock": 25 },
        { "id": "94871", "img": "../src/img/productos/drone-compacto.jpg", "nombre": "Drone Compacto", "categoria": "drone", "etiquetas": ["fotografía", "aérea", "fácil de usar"], "desc": "Drone de fotografía aérea fácil de manejar y con buena autonomía.", "precio": 119990, "stock": 5 },
        { "id": "32457", "img": "../src/img/productos/audifonos-inalambricos-2.jpg", "nombre": "Audífonos Inalámbricos Pro", "categoria": "audífonos", "etiquetas": ["inalámbricos", "bluetooth", "pro"], "desc": "Sonido de alta fidelidad para disfrutar música en cualquier lugar.", "precio": 79990, "stock": 12 },
        { "id": "64847", "img": "../src/img/productos/monitor-full-led-hd.jpg", "nombre": "Monitor LED Full HD", "categoria": "monitor", "etiquetas": ["full hd", "led", "pantalla"], "desc": "Pantalla con imágenes nítidas y claras para trabajo o entretenimiento.", "precio": 149990, "stock": 7 },
        { "id": "14935", "img": "../src/img/productos/mouse-rgb-inalambrico.jpg", "nombre": "Mouse Inalámbrico", "categoria": "mouse", "etiquetas": ["inalámbrico", "ergonómico", "bluetooth"], "desc": "Precisión y comodidad para tus tareas diarias.", "precio": 19990, "stock": 30 },
        { "id": "14847", "img": "../src/img/productos/tablet.jpg", "nombre": "Tablet 10 pulgadas", "categoria": "tablet", "etiquetas": ["portátil", "pantalla táctil", "multimedia"], "desc": "Ideal para estudiar, trabajar o entretenerse en cualquier lugar.", "precio": 87990, "stock": 18 },
        { "id": "96148", "img": "../src/img/productos/auriculares-gaming.jpg", "nombre": "Auriculares Gaming", "categoria": "audífonos", "etiquetas": ["gaming", "micrófono", "sonido envolvente"], "desc": "Sumérgete en tus juegos con sonido envolvente y micrófono integrado.", "precio": 59990, "stock": 14 },
        { "id": "36485", "img": "../src/img/productos/camara-web-hd.jpg", "nombre": "Cámara Web HD", "categoria": "cámara", "etiquetas": ["hd", "videollamadas", "plug and play"], "desc": "Videollamadas con calidad de imagen clara y nítida.", "precio": 29990, "stock": 22 }
    ];

    const listaProductosBody = document.getElementById("listaProductos");
    const editarProductoForm = document.getElementById("editarProductoForm");
    const modalEditar = new bootstrap.Modal(document.getElementById('editarProductoModal'));

    // Cargar datos en localStorage si no existen
    if (!localStorage.getItem("productosStock")) {
        localStorage.setItem("productosStock", JSON.stringify(productosJSON));
    }

    // Función para renderizar la tabla de productos
    function renderizarProductos() {
        const productosData = JSON.parse(localStorage.getItem("productosStock")) || [];
        listaProductosBody.innerHTML = ""; // Limpiar la tabla antes de renderizar
        if (productosData.length === 0) {
            listaProductosBody.innerHTML = `<tr><td colspan="7" class="text-center">No hay productos en el inventario.</td></tr>`;
            return;
        }

        productosData.forEach(producto => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.desc}</td>
                <td>${producto.categoria}</td>
                <td>$${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2 editar-btn" data-id="${producto.id}" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm eliminar-btn" data-id="${producto.id}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            listaProductosBody.appendChild(row);
        });
    }

    // Eventos para los botones de la tabla
    listaProductosBody.addEventListener("click", function (e) {
        if (e.target.closest(".eliminar-btn")) {
            const id = e.target.closest(".eliminar-btn").dataset.id;
            eliminarProducto(id);
        }
        if (e.target.closest(".editar-btn")) {
            const id = e.target.closest(".editar-btn").dataset.id;
            cargarDatosParaEdicion(id);
        }
    });

    // Función para eliminar un producto
    function eliminarProducto(id) {
        if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            let productosData = JSON.parse(localStorage.getItem("productosStock")) || [];
            productosData = productosData.filter(producto => producto.id !== id);
            localStorage.setItem("productosStock", JSON.stringify(productosData));
            renderizarProductos();
        }
    }

    // Función para cargar los datos del producto en el modal de edición
    function cargarDatosParaEdicion(id) {
        const productosData = JSON.parse(localStorage.getItem("productosStock")) || [];
        const productoAEditar = productosData.find(producto => producto.id === id);
        if (productoAEditar) {
            document.getElementById("editNombre").value = productoAEditar.nombre;
            document.getElementById("editDescripcion").value = productoAEditar.desc;
            document.getElementById("editPrecio").value = productoAEditar.precio;
            document.getElementById("editCategoria").value = productoAEditar.categoria;
            document.getElementById("editCantidad").value = productoAEditar.stock;
            document.getElementById("editProductoId").value = productoAEditar.id; // Guardar el ID en un campo oculto
            modalEditar.show();
        }
    }

    // Evento para guardar los cambios del modal de edición
    editarProductoForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("editProductoId").value;
        let productosData = JSON.parse(localStorage.getItem("productosStock")) || [];
        const productoIndex = productosData.findIndex(p => p.id === id);

        if (productoIndex !== -1) {
            productosData[productoIndex].nombre = document.getElementById("editNombre").value.trim();
            productosData[productoIndex].desc = document.getElementById("editDescripcion").value.trim();
            productosData[productoIndex].precio = parseFloat(document.getElementById("editPrecio").value);
            productosData[productoIndex].categoria = document.getElementById("editCategoria").value.trim();
            productosData[productoIndex].stock = parseInt(document.getElementById("editCantidad").value);
            localStorage.setItem("productosStock", JSON.stringify(productosData));
            modalEditar.hide();
            renderizarProductos();
        }
    });

    // Cargar la tabla al iniciar la página
    renderizarProductos();
});