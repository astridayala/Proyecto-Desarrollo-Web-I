// Importamos las funciones necesarias desde Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB68QDO-q8ngnF5Cz1cvkNJswDX4vGcs18",
    authDomain: "proyecto-desarrollo-web-i.firebaseapp.com",
    projectId: "proyecto-desarrollo-web-i",
    storageBucket: "proyecto-desarrollo-web-i.firebasestorage.app",
    messagingSenderId: "922911576837",
    appId: "1:922911576837:web:0a723db5841c12c1649d6c"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Evento para crear una nueva cuenta
document.getElementById('crearCuenta').addEventListener('click', (e) => {
    e.preventDefault(); // Evitamos el envío del formulario por defecto
    
    // Capturamos los valores ingresados por el usuario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Función para crear usuario en Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('¡Cuenta creada exitosamente!');
            window.location.href = "../index.html"; // Redirige a la página principal después de crear la cuenta
        })
        .catch((error) => {
            alert(`Error: ${error.message}`);
        });
});

/*

// Evento de inicio de sesión
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar recargar la página

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Autenticación con Firebase
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Obtener el nombre del usuario (displayName) o usar el correo como fallback
            const username = user.displayName ? user.displayName : user.email;

            // Guardar el nombre del usuario en localStorage
            localStorage.setItem('username', username);

            // Mostrar un mensaje de bienvenida
            alert(`Bienvenido ${username}`);
            console.log("Redirigiendo a la página principal...");

            // Redirigir a la página de inicio
            window.location.href = "../index.html";
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(`Error: ${errorMessage}`);
        });
});*/
