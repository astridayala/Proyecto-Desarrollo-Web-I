import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB68QDO-q8ngnF5Cz1cvkNJswDX4vGcs18",
    authDomain: "proyecto-desarrollo-web-i.firebaseapp.com",
    projectId: "proyecto-desarrollo-web-i",
    storageBucket: "proyecto-desarrollo-web-i.appspot.com",
    messagingSenderId: "922911576837",
    appId: "1:922911576837:web:0a723db5841c12c1649d6c"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para registrar un vendedor
export async function registerSeller(storeImg, email, password, storeName, address, phone) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "sellers", user.uid), {
            storeImg,
            storeName,
            address,
            phone,
            email
        });

        return user; // Usuario creado exitosamente
    } catch (error) {
        console.error("Error registrando usuario:", error.message);
        return null;
    }
}

// Función para iniciar sesión
export async function loginSeller(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        localStorage.setItem("sellerId", user.uid); // Guarda el UID del vendedor
        return user;
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        return null;
    }
}

// Manejador para el formulario de inicio de sesión
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("correo").value;
    const password = document.getElementById("psswrd").value;

    if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const user = await loginSeller(email, password);
    if (user) {
        alert("Inicio de sesión exitoso.");
        window.location.href = "../vendedor/index.html"; // Redirige al dashboard del vendedor
    } else {
        alert("Usuario y/o contraseña incorrecta.");
    }
});
