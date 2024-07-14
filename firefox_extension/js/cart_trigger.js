// Corro función por primera vez
(async() => {
    await getUsdExchangeRate();
    getPrices("cart");
  
    // Trigger recursivo
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(function(mutations, observer) {
        getPrices("cart");
    });
  
    observer.observe(document, {
      subtree: true,
      characterData: true
    });
  
  })();