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

    async obtenerSellerId() {
        const auth = getAuth(); // Obtenemos el servicio de autenticación
        const user = auth.currentUser; // Usuario autenticado

        if (user) {
            const sellerDoc = await getDoc(doc(db, 'sellers', user.uid));
            if (sellerDoc.exists()) {
                return { sellerId: user.uid, urlLogo: sellerDoc.data().urlLogo };
            } else {
                console.error('No se encontró un documento en la colección sellers para este usuario.');
                throw new Error('No se pudo obtener el logo del vendedor.');
            }
        } else {
            console.error('No hay un usuario autenticado.');
            throw new Error('Debe iniciar sesión para agregar productos.');
        }
    }

    async guardarProducto(producto) {
        let imagenURL = '';

        // Verificar si hay una imagen para cargar en Firebase Storage
        if (producto.imagen) {
            const storageRef = ref(storage, `imagenes/${producto.imagen.name}`);
            const snapshot = await uploadBytes(storageRef, producto.imagen);
            imagenURL = await getDownloadURL(snapshot.ref);
        }

        // Obtener el sellerId y la URL del logo automáticamente
        const { sellerId, urlLogo } = await this.obtenerSellerId();

        // Crear el producto con los datos completos
        const productoData = {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: parseFloat(producto.precio),
            categoria: producto.categoria,
            imagen: imagenURL,
            urlLogo: urlLogo,
            sellerId: sellerId
        };

        // Guardar en Firestore
        await addDoc(collection(db, 'productosEnEspera'), productoData);
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
            console.error(error);
        }
    }

    async cargarProductos() {
        const catalogoContainer = document.getElementById('catalogo-productos');
        catalogoContainer.innerHTML = '';

        try {
            const { sellerId } = await this.obtenerSellerId();

            // Filtrar productos que correspondan al vendedor autenticado
            const productosSnapshot = await getDocs(
                query(collection(db, 'productosEnEspera'), where('sellerId', '==', sellerId))
            );

            this.productos = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (this.productos.length === 0) {
                catalogoContainer.innerHTML = '<p>No hay productos para mostrar.</p>';
            }

            this.productos.forEach(producto => {
                catalogoContainer.innerHTML += `
                    <div class="producto">
                        <h4>${producto.nombre}</h4>
                        <p>${producto.descripcion}</p>
                        <span>$${producto.precio}</span>
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                        <img src="${producto.urlLogo}" alt="Logo del Vendedor">
                    </div>
                `;
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            catalogoContainer.innerHTML = '<p>Error al cargar los productos. Intenta nuevamente.</p>';
        }
    }
}

const catalogo = new ProductoCatalogo();
    