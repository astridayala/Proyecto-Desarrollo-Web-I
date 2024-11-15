// gestion-catalogo.js
class ProductoCatalogo {
    constructor() {
        this.productos = [];
        this.inicializar();
    }

    inicializar() {
        const formProducto = document.querySelector('#formulario-producto form');
        if (formProducto) {
            formProducto.addEventListener('submit', (e) => this.agregarProducto(e));
        }

        this.cargarProductos();
    }

    async guardarProducto(producto) {
        // Verificar si hay una imagen para cargar en Firebase Storage
        let imagenURL = '';
        if (producto.imagen) {
            const storageRef = ref(storage, `imagenes/${producto.imagen.name}`);
            const snapshot = await uploadBytes(storageRef, producto.imagen);
            imagenURL = await getDownloadURL(snapshot.ref);
        }
    
        // Crear el producto con la URL de la imagen
        const productoData = {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: parseFloat(producto.precio),
            categoria: producto.categoria,
            imagen: imagenURL
        };    
    }

    async agregarProducto(e) {
        e.preventDefault();

        const producto = {
            nombre: document.getElementById('nombre_producto').value,
            descripcion: document.getElementById('descripcion_producto').value,
            precio: document.getElementById('precio_producto').value,
            categoria: document.getElementById('categoria_producto').value,
            imagen: document.getElementById('imagen_producto').files[0]
        };

        try {
            await this.guardarProducto(producto);
            alert('Producto agregado exitosamente');
            this.cargarProductos();
        } catch (error) {
            alert('Error al agregar el producto');
        }
    }

    async cargarProductos() {
    const catalogoContainer = document.getElementById('catalogo-productos');
    catalogoContainer.innerHTML = ''; // Limpiar el contenido previo

    // Obtener productos desde Firestore
    const productosSnapshot = await getDocs(collection(db, 'productosEnEspera'));
    this.productos = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Mostrar productos en la interfaz
    this.productos.forEach(producto => {
        catalogoContainer.innerHTML += `
            <div class="producto">
                <h4>${producto.nombre}</h4>
                <p>${producto.descripcion}</p>
                <span>$${producto.precio}</span>
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
        `;
    });
}
}

const catalogo = new ProductoCatalogo();