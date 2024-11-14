import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previene el envío del formulario

    // Obtiene los valores de los campos de entrada
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    // Configura Firebase Authentication
    const auth = getAuth();
    
    try {
        // Intenta iniciar sesión con Firebase Authentication
        await signInWithEmailAndPassword(auth, correo, contrasena);
        window.location.href = 'admin.html'; // Redirige a admin.html si la autenticación es exitosa
    } catch (error) {
        alert('Credenciales inválidas. Por favor, intenta de nuevo.'); // Muestra un mensaje de error en caso de fallo
    }
});

