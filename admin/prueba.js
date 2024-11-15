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

    mostrarDetalles(id) {
        const detalles = document.getElementById(`detalles-${id}`);
        if (detalles.style.display === 'none') {
            detalles.style.display = 'block';
        } else {
            detalles.style.display = 'none';
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
            <button class="producto">
                <h4 class="producto-titulo" onclick="admin.mostrarModal(${JSON.stringify(producto).replace(/"/g, '&quot;')})">${producto.nombre}</h4>
            </button>
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
    
    mostrarModal(producto) {
        // Llenar los datos del modal
        document.getElementById('modal-producto-nombre').textContent = producto.nombre;
        document.getElementById('modal-producto-vendedor').textContent = producto.idVendedor || 'N/A';
        document.getElementById('modal-producto-descripcion').textContent = producto.descripcion;
        document.getElementById('modal-producto-precio').textContent = producto.precio;
        document.getElementById('modal-producto-categoria').textContent = producto.categoria;
        document.getElementById('modal-producto-imagen').src = producto.imagenURL;
        document.getElementById('modal-producto-imagen').alt = producto.nombre;
    
        // Configurar botones para aprobar y rechazar
        document.getElementById('aprobar-btn').onclick = () => this.aprobarProducto(producto.id);
        document.getElementById('rechazar-btn').onclick = () => this.rechazarProducto(producto.id);
    
        // Mostrar el modal
        document.querySelector('.modal-container').style.display = 'flex';
    }
    

    cerrarModal() {
        document.querySelector('.modal-container').style.display = 'none';
    }
    
}

window.admin = new AdminPanel();


// Asegúrate de que el modal esté cerrado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.modal-container').style.display = 'none';
});
