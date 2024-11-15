import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB68QDO-q8ngnF5Cz1cvkNJswDX4vGcs18",
    authDomain: "proyecto-desarrollo-web-i.firebaseapp.com",
    projectId: "proyecto-desarrollo-web-i",
    storageBucket: "proyecto-desarrollo-web-i.appspot.com", // Corregido storageBucket
    messagingSenderId: "922911576837",
    appId: "1:922911576837:web:0a723db5841c12c1649d6c"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

export async function registerUser(email, password, firstName, lastName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            role: "user"
        });
        console.log('Usuario registrado exitosamente:', user);
        return true;
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        return false;
    }
}

export async function logInUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Inicio de sesión exitoso", user);
        return true;
    } catch (error) {
        console.error("Usuario y/o contraseña incorrecta:", error.message);
        return false;
    }
}

export async function registerSeller(email, password, storeName, address, phone) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "sellers", user.uid), {
            storeName,
            address,
            phone,
            email,
            role: "seller"
        });

        console.log("Vendedor registrado exitosamente:", user);
        return true; 
    } catch (error) {
        console.error("Error al registrar vendedor:", error.message);
        return false;
    }
}