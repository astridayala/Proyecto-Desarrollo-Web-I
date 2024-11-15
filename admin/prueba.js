document.addEventListener("DOMContentLoaded", () => {
    // Simulación de productos (puedes reemplazar esto con datos reales)
    const productos = [
        {
            id: 1,
            nombre: "Producto A",
            vendedor: "12345",
            descripcion: "Descripción del Producto A",
            precio: "150.00",
            categoria: "Electrónica",
            imagen: "ruta/de/imagen1.jpg"
        },
        {
            id: 2,
            nombre: "Producto B",
            vendedor: "67890",
            descripcion: "Descripción del Producto B",
            precio: "200.00",
            categoria: "Hogar",
            imagen: "ruta/de/imagen2.jpg"
        },
    ];

    const listaEspera = document.getElementById("lista-espera");
    productos.forEach(producto => {
        const item = document.createElement("div");
        item.className = "product-item";
        item.textContent = producto.nombre;
        item.dataset.productId = producto.id; 
        listaEspera.appendChild(item);
    });

    const modalContainer = document.querySelector(".modal-container");
    const modalNombre = document.getElementById("modal-producto-nombre");
    const modalVendedor = document.getElementById("modal-producto-vendedor");
    const modalDescripcion = document.querySelector("#modal .modal-content p:nth-of-type(2)");
    const modalPrecio = document.getElementById("modal-producto-precio");
    const modalCategoria = document.querySelector("#modal .modal-content p:nth-of-type(4)");
    const modalImagen = document.getElementById("modal-producto-imagen");

    listaEspera.addEventListener("click", (event) => {
        const itemId = event.target.dataset.productId;
        if (itemId) {
            const producto = productos.find(p => p.id == itemId);
            if (producto) {
                modalNombre.textContent = producto.nombre;
                modalVendedor.textContent = producto.vendedor;
                modalDescripcion.textContent = producto.descripcion;
                modalPrecio.textContent = producto.precio;
                modalCategoria.textContent = producto.categoria;
                modalImagen.src = producto.imagen;

                modalContainer.style.display = "flex";
            }
        }
    });

    function cerrarModal() {
        modalContainer.style.display = "none";
    }

    document.querySelector(".close-btn").addEventListener("click", cerrarModal);
    modalContainer.addEventListener("click", cerrarModal);
    document.querySelector(".modal-content").addEventListener("click", (event) => {
        event.stopPropagation(); 
    });
});