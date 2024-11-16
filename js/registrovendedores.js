import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

export async function registerSeller(storeImg, email, password, storeName, address, phone) {
    try {
        console.log("Iniciando registro del usuario...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Usuario registrado en Auth con UID:", user.uid);

        // Guardar detalles adicionales en Firestore
        await setDoc(doc(db, "sellers", user.uid), {
            storeImg,
            storeName,
            address,
            phone,
            email
        });

        console.log("Información adicional guardada en Firestore.");
        return user; // Usuario creado exitosamente
    } catch (error) {
        console.error("Error registrando usuario:", error.message);
        switch (error.code) {
            case "auth/email-already-in-use":
                alert("El correo ya está registrado. Usa otro correo.");
                break;
            case "auth/invalid-email":
                alert("Correo inválido. Revisa el formato.");
                break;
            case "auth/weak-password":
                alert("La contraseña es muy débil. Usa al menos 6 caracteres.");
                break;
            default:
                alert("Ocurrió un error. Intenta nuevamente.");
        }
        return null;
    }
}

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target; // Referencia al formulario
    const storeImg = document.getElementById("storeImg").value;
    const storeName = document.getElementById("storeName").value;
    const address = document.getElementById("loginDireccion").value;
    const phone = document.getElementById("loginTelefono").value;
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password || !storeName || !address || !phone) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    console.log("Datos del formulario:", { storeImg, storeName, address, phone, email, password });

    const seller = await registerSeller(storeImg, email, password, storeName, address, phone);
    if (seller) {
        alert("Usuario creado exitosamente");
        form.reset(); // Vacía el formulario después del registro exitoso
    } else {
        alert("Error: Ya existe un usuario con este correo o hubo un problema.");
    }
});
