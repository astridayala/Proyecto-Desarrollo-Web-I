import { registerSeller, logInSeller } from "./firebase.js";

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const storeName = document.getElementById("storeName").value;
    const address = document.getElementById("loginDireccion").value;
    const phone = document.getElementById("loginTelefono").value;
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const seller = await registerSeller(email, password, storeName, address, phone);
    if (seller) {
        alert("Usuario creado exitosamente");
    } else {
        alert("Ya existe un usuario asociado a este correo o ocurrió un error");
    }
});

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("correo").value;
    const password = document.getElementById("psswrd").value;

    const loggedIn = await logInSeller(email, password);
    if (loggedIn) {
        alert("Inicio de sesión exitoso");
        window.location.href = "../vendedor/index.html";
    } else {
        alert("Usuario y/o contraseña incorrecta o error en el inicio de sesión");
    }
});
