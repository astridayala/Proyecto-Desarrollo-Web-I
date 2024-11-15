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


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
        import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
        import { getAuth, onAuthStateChanged , signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

        // Configuración de Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyDZigv2X5_57XfBkfE4zb2R2GobZ90igVI",
            authDomain: "proyectometodologias-2186a.firebaseapp.com",
            projectId: "proyectometodologias-2186a",
            storageBucket: "proyectometodologias-2186a.appspot.com",
            messagingSenderId: "1035665597993",
            appId: "1:1035665597993:web:fd75c9d15de9988b7a5e38"
        };

        // Inicializa Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

        const productosContainer = document.getElementById("productos-container");
        
        document.getElementById("cerrarSesion").addEventListener("click", (e) => {
            e.preventDefault(); // Previene el comportamiento predeterminado del enlace

            // Muestra la ventana de confirmación
            const confirmar = confirm("¿Está seguro de que desea cerrar sesión?");
            
            // Si el usuario confirma, cierra la sesión y redirige a la página de inicio de sesión
            if (confirmar) {
                signOut(auth).then(() => {
                    // Redirige a la pantalla de inicio de sesión después de cerrar sesión
                    location.assign("/Log-in-Vendedor.html");
                }).catch((error) => {
                    console.error("Error al cerrar sesión:", error);
                    alert("Hubo un error al intentar cerrar sesión.");
                });
            }
        });

        // Cargar productos del vendedor autenticado
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const q = query(collection(db, "productos"), where("vendedorId", "==", user.uid));
                    const querySnapshot = await getDocs(q);

                    productosContainer.innerHTML = "";
                    querySnapshot.forEach((doc) => {
                        const producto = doc.data();
                        const productoElement = document.createElement("div");
                        productoElement.classList.add("producto");

                        // Clase de color según el estado del producto
                        let estadoClase = "estado-pendiente";
                        if (producto.estado === "aprobado") {
                            estadoClase = "estado-aprobado";
                        } else if (producto.estado === "rechazado") {
                            estadoClase = "estado-rechazado";
                        }

                        productoElement.innerHTML = `
                            <h3>${producto.nombre}</h3>
                            <p>Descripción: ${producto.descripcion}</p>
                            <p>Precio: $${producto.precio}</p>
                            <p>Categoría: ${producto.categoria}</p>
                            <p>Estado de aprobación: <span class="${estadoClase}">${producto.estado}</span></p>
                            <img src="${producto.imagenURL}" alt="${producto.nombre}">
                        `;
                        productosContainer.appendChild(productoElement);
                    });
                } catch (error) {
                    console.error("Error al cargar los productos:", error);
                    alert("Error: No se pudieron cargar los productos.");
                }
            }
        });