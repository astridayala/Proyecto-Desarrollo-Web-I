import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB68QDO-q8ngnF5Cz1cvkNJswDX4vGcs18",
    authDomain: "proyecto-desarrollo-web-i.firebaseapp.com",
    projectId: "proyecto-desarrollo-web-i",
    storageBucket: "proyecto-desarrollo-web-i.appspot.com",
    messagingSenderId: "922911576837",
    appId: "1:922911576837:web:0a723db5841c12c1649d6c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const listaProductos = document.getElementById("listaProductos");

    async function mostrarProductos() {
        if (!listaProductos) return;
        listaProductos.innerHTML = "<p>Cargando productos...</p>";

        try {
            const querySnapshot = await getDocs(collection(db, "productos"));

            if (querySnapshot.empty) {
                listaProductos.innerHTML = "<p>No hay productos disponibles.</p>";
                return;
            }

            listaProductos.innerHTML = "";
            querySnapshot.forEach((doc) => {
                const producto = doc.data();
                listaProductos.innerHTML += `
                    <div class="producto-card">
                        <div class="producto-img">
                            <img src="${producto.imagenURL || '#'}" alt="${producto.nombre}">
                        </div>
                        <div class="producto-info">
                            <h3>${producto.nombre}</h3>
                            <p>${producto.descripcion}</p>
                            <p><strong>Precio:</strong> $${producto.precio?.toFixed(2) || "0.00"}</p>
                            <p><strong>Categoría:</strong> ${producto.categoria || "Sin categoría"}</p>
                            <p><strong>Estado:</strong> ${producto.estado || "No especificado"}</p>
                        </div>
                    </div>`;
            });
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            listaProductos.innerHTML = "<p>Error al cargar los productos.</p>";
        }
    }

    mostrarProductos();
});
