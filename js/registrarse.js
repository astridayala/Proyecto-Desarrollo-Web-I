import { registerUser, logInUser } from "./firebase.js";


document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    
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
