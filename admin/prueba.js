import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB68QDO-q8ngnF5Cz1cvkNJswDX4vGcs18",
    authDomain: "proyecto-desarrollo-web-i.firebaseapp.com",
    projectId: "proyecto-desarrollo-web-i",
    storageBucket: "proyecto-desarrollo-web-i.appspot.com",
    messagingSenderId: "922911576837",
    appId: "1:922911576837:web:0a723db5841c12c1649d6c"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Clase para manejar el panel de administración
class AdminPanel {
    constructor() {
        this.productosPendientes = [];
        this.productosAprobados = [];
        this.productosRechazados = [];
        this.obtenerProductos();
    }

    async obtenerProductos() {
        try {
            const querySnapshot = await getDocs(collection(db, "productos"));

            querySnapshot.forEach((doc) => {
                const producto = doc.data();
                producto.id = doc.id; // Asignamos el ID del documento al objeto producto

                // Clasificamos los productos según su estado
                if (producto.estado === 'pendiente') {
                    this.productosPendientes.push(producto);
                } else if (producto.estado === 'aprobado') {
                    this.productosAprobados.push(producto);
                } else if (producto.estado === 'rechazado') {
                    this.productosRechazados.push(producto);
                }
            });

            this.mostrarProductos();
        } catch (error) {
            console.error("Error al obtener los productos desde Firebase:", error);
        }
    }

    mostrarProductos() {
        this.actualizarLista('lista-espera', this.productosPendientes, 'pendiente');
        this.actualizarLista('lista-aprobados', this.productosAprobados, 'aprobado');
        this.actualizarLista('lista-rechazados', this.productosRechazados, 'rechazado');
    }

    actualizarLista(elementoID, listaProductos, tipo) {
        const contenedor = document.getElementById(elementoID);
        contenedor.innerHTML = listaProductos.map(producto => `
            <div class="producto">
                <h4>Nombre del Producto:</h4>
                <p>${producto.nombre}</p>
                <h4>Descripción:</h4>
                <p>${producto.descripcion}</p>
                <h4>Precio:</h4>
                <p>${producto.precio}</p>
                <h4>Categoría:</h4>
                <p>${producto.categoria}</p>
                <img src="${producto.imagenURL}" alt="${producto.nombre}">
                ${tipo === 'pendiente' ? `
                    <button class="button aprobar" onclick="admin.aprobarProducto('${producto.id}')">Aprobar</button>
                    <button class="button rechazar" onclick="admin.rechazarProducto('${producto.id}')">Rechazar</button>
                ` : ''}
            </div>
        `).join('');
    }

    async aprobarProducto(id) {
        console.log("Intentando aprobar producto con ID:", id);
        const producto = this.productosPendientes.find(p => p.id === id);
        if (producto) {
            producto.estado = 'aprobado';
            this.productosAprobados.push(producto);
            this.productosPendientes = this.productosPendientes.filter(p => p.id !== id);
            await this.actualizarProductoEnDB(producto);
            this.mostrarProductos();
            alert('Producto aprobado.');
        } else {
            console.log("Producto no encontrado en la lista de pendientes.");
        }
    }
    
    async rechazarProducto(id) {
        console.log("Intentando rechazar producto con ID:", id);
        const producto = this.productosPendientes.find(p => p.id === id);
        if (producto) {
            producto.estado = 'rechazado';
            this.productosRechazados.push(producto);
            this.productosPendientes = this.productosPendientes.filter(p => p.id !== id);
            await this.actualizarProductoEnDB(producto);
            this.mostrarProductos();
            alert('Producto rechazado.');
        } else {
            console.log("Producto no encontrado en la lista de pendientes.");
        }
    }
    
    async actualizarProductoEnDB(producto) {
        try {
            console.log("Actualizando producto en Firestore:", producto);
            const productoRef = doc(db, "productos", producto.id);
            await updateDoc(productoRef, producto);
            console.log("Producto actualizado en Firestore");
        } catch (error) {
            console.error("Error al actualizar el producto en la base de datos:", error);
        }
    }    
}

window.admin = new AdminPanel();


// Función para cerrar el modal
function cerrarModal(event) {
    if (event) event.stopPropagation();
    document.querySelector('.modal-container').style.display = 'none';
}

// Asegúrate de que el modal esté cerrado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.modal-container').style.display = 'none';
});
