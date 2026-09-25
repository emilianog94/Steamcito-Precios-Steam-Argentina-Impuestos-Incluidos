// Corro función por primera vez
(() => {
  setTimeout(async function(){
    await getUsdExchangeRate();
    getPrices("standard");
  
    // Trigger recursivo con debounce con filtro de ELEMENT_NODE
    let debounceTimer;
    const observer = new MutationObserver(function(mutations) {
      const hasNewElements = mutations.some(m =>
        Array.from(m.addedNodes).some(n => n.nodeType === Node.ELEMENT_NODE)
      );
      if (!hasNewElements) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => getPrices("standard"), 200);
    });

    observer.observe(document, {
      subtree: true,
      childList: true
    });
  },1500)
})();
