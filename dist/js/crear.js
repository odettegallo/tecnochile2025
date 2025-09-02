// === CÓDIGO NUEVO PARA CREAR PRODUCTO ===
document.addEventListener("DOMContentLoaded", function () {
    const crearProductoForm = document.getElementById("crearProductoForm");
    const alertContainer = document.getElementById("alertContainer");

    crearProductoForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Obtener valores del formulario
        const idProducto = document.getElementById("idProducto").value.trim();
        const nombreProducto = document.getElementById("nombreProducto").value.trim();
        const imgUrl = document.getElementById("imgUrl").value.trim();
        const descripcionProducto = document.getElementById("descripcionProducto").value.trim();
        const categoriaProducto = document.getElementById("categoriaProducto").value.trim();
        const etiquetasProducto = document.getElementById("etiquetasProducto").value.trim();
        const precioProducto = parseInt(document.getElementById("precioProducto").value);
        const stockProducto = parseInt(document.getElementById("stockProducto").value);

        // Validar que el ID no exista previamente
        let productosData = JSON.parse(localStorage.getItem("productosStock")) || [];
        if (productosData.find(p => p.id === idProducto)) {
            showAlert("El ID del producto ya existe. Por favor, ingrese un ID único.", "danger");
            return;
        }

        // Crear el objeto del nuevo producto
        const nuevoProducto = {
            id: idProducto,
            img: imgUrl,
            nombre: nombreProducto,
            categoria: categoriaProducto,
            etiquetas: etiquetasProducto ? etiquetasProducto.split(',').map(tag => tag.trim()) : [],
            desc: descripcionProducto,
            precio: precioProducto,
            stock: stockProducto
        };

        // Agregar el nuevo producto a la lista
        productosData.push(nuevoProducto);

        // Guardar la lista actualizada en localStorage
        localStorage.setItem("productosStock", JSON.stringify(productosData));

        showAlert("Producto agregado exitosamente. 🥳", "success");
        crearProductoForm.reset();
    });

    function showAlert(message, type) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        alertContainer.innerHTML = alertHtml;
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(alertContainer.querySelector(".alert"));
            alert.close();
        }, 3000);
    }
});