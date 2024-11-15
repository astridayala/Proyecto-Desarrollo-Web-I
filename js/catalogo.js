import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB68QDO-q8ngnF5Cz1cvkNJswDX4vGcs18",
    authDomain: "proyecto-desarrollo-web-i.firebaseapp.com",
    projectId: "proyecto-desarrollo-web-i",
    messagingSenderId: "922911576837",
    appId: "1:922911576837:web:0a723db5841c12c1649d6c"
};
        
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


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