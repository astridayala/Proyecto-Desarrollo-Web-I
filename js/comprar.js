
// Selecciona el botón por su clase
const botonComprar = document.querySelector('.comprar');

// Define la acción que debe ocurrir cuando el botón es presionado
botonComprar.addEventListener('click', function() {
    // Aquí puedes definir lo que debe ocurrir al hacer clic
    alert("¡Cupón añadido a tu carrito!");  // Este es solo un ejemplo de alerta
    
    // O podrías redirigir a una página de pago
    // window.location.href = "pagina-de-pago.html";  // Esto redirige a una página de pago
    
    // Si estás trabajando con un carrito de compras, puedes agregar el cupón al carrito aquí
    // Ejemplo:
    // agregarAlCarrito(cuponId);
});

