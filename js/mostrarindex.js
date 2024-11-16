import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// Función para cargar productos de una categoría específica creados por un vendedor específico
async function loadCategoryProducts(category, sellerId) {
    try {
        const productsRef = collection(db, "productos");
        const q = query(
            productsRef,
            where("estado", "==", "aprobado"),
            where("categoria", "==", category),
            where("sellerId", "==", sellerId) // Filtra por sellerId
        );
        const querySnapshot = await getDocs(q);

        const container = document.getElementById("productos-container");

        if (!container) {
            console.error("No se encontró el contenedor de productos en esta página.");
            return;
        }

        if (querySnapshot.empty) {
            console.warn("No hay productos disponibles para esta categoría y vendedor.");
            return;
        }

        querySnapshot.forEach((doc) => {
            const product = doc.data();

            // Define la carpeta según la categoría
            let folder = "";
            switch (category) {
                case "Alimentos":
                    folder = "comida";
                    break;
                case "Salud":
                    folder = "salud";
                    break;
                case "Things":
                    folder = "things";
                    break;
                case "Viajes":
                    folder = "viajes";
                    break;
                default:
                    folder = "general"; // Por si hay una categoría genérica
            }

            const item = document.createElement("a");
            item.href = `../pages-products/${folder}/${product.slug}.html`; // Cambia "slug" por el campo correcto en tu base de datos
            item.innerHTML = `
                <div class="opciones">
                    <img src="${product.imagenURL}" alt="${product.nombre}" width="260" height="150">
                    <div class="info-cupon">
                        <img src="${product.logoURL}" alt="${product.nombre}">
                        <p>${product.descripcion}</p>
                    </div>
                    <h3>$${product.precio}</h3>
                    <h4>${product.descuento}% off | Antes $${product.precioa}</h4>
                    <h5>Finaliza en: <span id="bold">${product.diasRestantes} días</span></h5>
                </div>
            `;

            container.appendChild(item);
        });
    } catch (error) {
        console.error("Error al cargar productos de la categoría:", error);
    }
}

// Determina la categoría según la página
const categoryMapping = {
    "belleza.html": "Belleza",
    "comida.html": "Alimentos",
    "salud.html": "Salud",
    "things.html": "Things",
    "viajes.html": "Viajes"
};

// Obtén el nombre del archivo actual
const currentPage = window.location.pathname.split("/").pop();
const category = categoryMapping[currentPage];

// Obtén el identificador del vendedor (por ejemplo, desde el localStorage, una cookie o una variable global)
let sellerId;
try {
    sellerId = localStorage.getItem("sellerId");
    if (!sellerId) {
        console.error("No se encontró sellerId en el localStorage.");
    }
} catch (error) {
    console.error("Error al acceder al localStorage:", error);
}

// Carga los productos solo si se reconoce la categoría y el sellerId
if (category && sellerId) {
    loadCategoryProducts(category, sellerId);
} else {
    console.error("No se pudo determinar la categoría o el identificador del vendedor.");
}
