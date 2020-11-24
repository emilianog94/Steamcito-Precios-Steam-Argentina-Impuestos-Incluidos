
async function trigger(){

  // Obtengo los impuestos desde la API y los almaceno en localStorage
  await getImpuestos().catch(impuestosFallback);

  // Corro función por primera vez
  getPrices();

  // Trigger recursivo
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  const observer = new MutationObserver(function(mutations, observer) {
      getPrices();
  });

  observer.observe(document, {
    subtree: true,
    attributes: true
  });

}

trigger();







