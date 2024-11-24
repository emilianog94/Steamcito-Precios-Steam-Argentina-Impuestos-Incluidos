// Corro función por primera vez
(async() => {
    await getUsdExchangeRate();
    getPrices("wishlist");
  
    // Trigger recursivo
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(function(mutations, observer) {
        getPrices("wishlist");
    });
  
    observer.observe(document, {
      subtree: true,
      characterData: true
    });
  
  })();