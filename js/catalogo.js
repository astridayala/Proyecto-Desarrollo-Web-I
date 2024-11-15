import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const auth = getAuth(app);

// Elementos del DOM
const mostrarBtn = document.getElementById("mostrar_producto");
const listaProductos = document.getElementById("listaProductos");

// Función para mostrar los productos
async function mostrarProductos() {
    listaProductos.innerHTML = "<p>Cargando productos...</p>"; // Mensaje de carga
    try {
        const querySnapshot = await getDocs(collection(db, "productos"));

        if (querySnapshot.empty) {
            listaProductos.innerHTML = "<p>No hay productos disponibles.</p>";
            return;
        }

        // Limpiar contenedor
        listaProductos.innerHTML = "";

        // Recorrer y mostrar los productos
        querySnapshot.forEach((doc) => {
            const producto = doc.data();
            const productoElemento = crearProductoElemento(producto);
            listaProductos.appendChild(productoElemento);
        });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        listaProductos.innerHTML = "<p>Error al cargar los productos.</p>";
    }
}

// Función para crear elementos HTML para cada producto
function crearProductoElemento(producto) {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto-card");
    productoDiv.innerHTML = `
        <div class="producto-img">
            <img src="${producto.imagenURL || '#'}" alt="${producto.nombre}">
        </div>
        <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
            <p><strong>Categoría:</strong> ${producto.categoria}</p>
            <p><strong>Estado:</strong> ${producto.estado}</p>
        </div>
    `;
    return productoDiv;
}

// Evento para mostrar productos al hacer clic
mostrarBtn.addEventListener("click", mostrarProductos);
