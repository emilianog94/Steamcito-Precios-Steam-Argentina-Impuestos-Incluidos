// Función para detectar cambios en el DOM así se dispara la función cada vez que Steam carga productos de forma asíncrona.
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const observer = new MutationObserver(function(mutations, observer) {
    getAppPrices();
});

observer.observe(document, {
  subtree: true,
  attributes: true
});





