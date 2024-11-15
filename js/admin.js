import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB68QDO-q8ngnF5Cz1cvkNJswDX4vGcs18",
    authDomain: "proyecto-desarrollo-web-i.firebaseapp.com",
    projectId: "proyecto-desarrollo-web-i",
    storageBucket: "proyecto-desarrollo-web-i.firebasestorage.app",
    messagingSenderId: "922911576837",
    appId: "1:922911576837:web:0a723db5841c12c1649d6c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('psswrd').value;

    try {
        const adminRef = collection(db, "admin");
        const q = query(adminRef, where("user", "==", correo), where("psswrd", "==", contrasena));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert("Inicio de sesión exitoso.");
            window.location.href = '../admin.html';
        } else {
            alert("Credenciales inválidas. Por favor, intenta de nuevo.");
        }
    } catch (error) {
        console.error("Error al verificar el administrador:", error); // Detalle de error en consola
        alert("Ocurrió un error al intentar iniciar sesión. Por favor, intenta más tarde.");
    }
});