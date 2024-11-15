// Importamos las funciones de autenticación desde firebase.js
import { registerUser, logInUser } from "./firebase.js";

// Evento para el formulario de registro
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita el envío del formulario por defecto
    
    // Capturamos los valores ingresados en el formulario de registro
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;

    const status = await registerUser(email, password, firstName, lastName);
    if (status) {
        alert("Usuario creado exitosamente");
        window.location.hred = "../index.html";
    } else {
        alert("Ya existe un usuario asociado a este correo o ocurrió un error");
    }
});

// Evento para el formulario de inicio de sesión
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const status = await logInUser(email, password);
    if (status) {
        alert("Inicio de sesión exitoso");
        window.location.href = "../index.html";
    } else {
        alert("Usuario y/o contraseña incorrecta");
    }
});
