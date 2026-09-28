// Corro función por primera vez
(async() => {
    await getUsdExchangeRate();
    getPrices("cart");
  
    // Trigger recursivo con debounce
    let debounceTimer;
    const observer = new MutationObserver(function(mutations) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => getPrices("cart"), 200);
    });

    observer.observe(document, {
      subtree: true,
      characterData: true,
      childList: true
    });
  
  })();