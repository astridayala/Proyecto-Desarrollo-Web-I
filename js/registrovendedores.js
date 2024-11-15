import { registerSeller } from "./firebase.js";

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