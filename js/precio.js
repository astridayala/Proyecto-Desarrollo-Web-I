const botonComprar = document.getElementById('comprarBtn');
const precioElemento = document.getElementById('precio');

botonComprar.addEventListener('click', function() {
    const precioTexto = precioElemento.textContent;  // 'Precio: $100'
    const precio = precioTexto.split('$')[1];  // Obtenemos solo el número, '100'
    
    // Redirigimos a la página de pago subiendo dos niveles desde 'pages-products/belleza'
    window.location.href = `../../pagar.html?precio=${precio}`;
});
