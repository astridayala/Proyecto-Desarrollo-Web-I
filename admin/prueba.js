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
            <div class="producto">
                <h4 class="producto-titulo" onclick="admin.mostrarModal(${JSON.stringify(producto).replace(/"/g, '&quot;')})">${producto.nombre}</h4>
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
    
    async mostrarModal(producto) {
        try {
            console.log("Abriendo modal para producto:", producto);
    
            // Llenar los datos del modal con la información del producto
            document.getElementById('modal-producto-nombre').textContent = producto.nombre || 'Sin nombre';
            document.getElementById('modal-producto-descripcion').textContent = producto.descripcion || 'Sin descripción';
            document.getElementById('modal-producto-precio').textContent = producto.precio || '0.00';
            document.getElementById('modal-producto-categoria').textContent = producto.categoria || 'Sin categoría';
            document.getElementById('modal-producto-imagen').src = producto.imagenURL || '';
            document.getElementById('modal-producto-imagen').alt = producto.nombre || 'Imagen no disponible';

            // Mostrar botones solo si el producto está en estado "pendiente"
            const botones = document.getElementById('botones-aprobacion');
            if (producto.estado === 'pendiente') {
                botones.style.display = 'flex';
                document.getElementById('aprobar-btn').onclick = () => this.aprobarProducto(producto.id);
                document.getElementById('rechazar-btn').onclick = () => this.rechazarProducto(producto.id);
            } else {
                botones.style.display = 'none';
            }
    
            // Mostrar el modal
            document.querySelector('.modal-container').style.display = 'flex';
        } catch (error) {
            console.error("Error al mostrar el modal o al obtener datos del vendedor:", error);
            document.getElementById('modal-producto-vendedor').textContent = 'Error al cargar';
        }
    }    

    cerrarModal() {
        document.querySelector('.modal-container').style.display = 'none';
    }
    
}

window.admin = new AdminPanel();