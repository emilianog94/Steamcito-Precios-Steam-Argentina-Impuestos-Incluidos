// Creo un timeout para compensar el tiempo de respuesta de los bundles con descuentos dinámicos
setTimeout(function(){
    getPrices();


    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(function(mutations, observer) {
        getPrices();
    });
    
    observer.observe(document, {
      subtree: true,
      attributes: true
    });

},1500);