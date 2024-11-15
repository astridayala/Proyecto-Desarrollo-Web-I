import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, setDoc, collection, getDocs, getDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const listaEspera = document.getElementById("lista-espera");
const listaAprobados = document.getElementById("lista-aprobados");
const listaRechazados = document.getElementById("lista-rechazados");

let productoSeleccionado = null;

async function cargarProductos() {
    try {
        const productosRef = collection(db, "productos");
        const querySnapshot = await getDocs(productosRef);

        listaEspera.innerHTML = "";
        listaAprobados.innerHTML = "";
        listaRechazados.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const producto = doc.data();
            const productoId = doc.id;

            const container = document.createElement("div");
            container.classList.add("producto");
            container.textContent = producto.nombre;
            container.onclick = () => mostrarModal(producto, productoId);

            if (producto.estado === "pendiente") {
                listaEspera.appendChild(container);
            } else if (producto.estado === "aprobado") {
                listaAprobados.appendChild(container);
            } else if (producto.estado === "rechazado") {
                listaRechazados.appendChild(container);
            }
        });

    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}
cargarProductos();

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

// Función para mostrar el modal con los detalles del producto
function mostrarModal(producto, productoId) {
    productoSeleccionado = productoId;
    document.getElementById("modal-producto-nombre").textContent = producto.nombre;
    document.getElementById("modal-producto-vendedor").textContent = producto.vendedorId;
    document.getElementById("modal-producto-descripcion").textContent = producto.descripcion;
    document.getElementById("modal-producto-precio").textContent = producto.precio;
    document.getElementById("modal-producto-categoria").textContent = producto.categoria;
    document.getElementById("modal-producto-imagen").src = producto.imagenURL;

    const botonesAprobacion = document.getElementById("botones-aprobacion");
    const rejectionReasonContainer = document.getElementById("rejection-reason-container");

    if (producto.estado === "pendiente") {
        botonesAprobacion.style.display = "block";
        if (rejectionReasonContainer) rejectionReasonContainer.style.display = "none";
    } else if (producto.estado === "rechazado") {
        botonesAprobacion.style.display = "none";
        if (rejectionReasonContainer) rejectionReasonContainer.style.display = "block";
    } else {
        botonesAprobacion.style.display = "none";
        if (rejectionReasonContainer) rejectionReasonContainer.style.display = "none";
    }

    document.getElementById("aprobar-btn").onclick = () => cambiarEstadoProducto("aprobado");
    document.getElementById("rechazar-btn").onclick = () => cambiarEstadoProducto("rechazado");

    document.getElementById("modal").style.display = "flex";
}

// Función para cambiar el estado del producto
async function cambiarEstadoProducto(estado) {
    if (!productoSeleccionado) return;

    const productoRef = doc(db, "productos", productoSeleccionado);

    try {
        await updateDoc(productoRef, { estado: estado });
        cerrarModal();
        cargarProductos();
    } catch (error) {
        console.error("Error al actualizar el estado del producto:", error);
    }
}

// Configuración y envío del motivo de rechazo
const rejectionReasonContainer = document.createElement('div');
rejectionReasonContainer.id = "rejection-reason-container";
rejectionReasonContainer.style.display = "none";
rejectionReasonContainer.innerHTML = `
    <h4>Motivo de Rechazo</h4>
    <textarea id="rejection-reason" placeholder="Escribe el motivo del rechazo..." rows="3"></textarea>
    <button onclick="enviarMotivoRechazo()">Enviar</button>
`;
document.querySelector('.modal-content').appendChild(rejectionReasonContainer);

async function enviarMotivoRechazo() {
    const motivo = document.getElementById("rejection-reason").value;
    if (!motivo.trim()) {
        alert("Por favor, escribe un motivo para el rechazo.");
        return;
    }
    const productoRef = doc(db, "productos", productoSeleccionado);

    try {
        await updateDoc(productoRef, { motivoRechazo: motivo, estado: "rechazado" });
        cerrarModal();
        cargarProductos();
    } catch (error) {
        console.error("Error al actualizar el motivo de rechazo:", error);
    }
}
