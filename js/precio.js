const botonComprar = document.getElementById('comprarBtn');
const precioElemento = document.getElementById('precio');

botonComprar.addEventListener('click', function() {
    const precioTexto = precioElemento.textContent;  
    const precio = precioTexto.split('$')[1];  
    
    window.location.href = `../../pagar.html?precio=${precio}`;
});
