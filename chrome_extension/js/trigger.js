// Corro función por primera vez
(async() => {
  await getUsdExchangeRate();
  getPrices("standard");

  // Trigger recursivo con debounce.
  // Filtra sólo ELEMENT_NODE para ignorar los text nodes que genera nuestro
  // propio innerHTML= y evitar que getPrices() se re-ejecute en bucle.
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


  // Observador de contenedor de Search
  const searchDiv = document.querySelector('div[id*="searchSuggestion"]');
  if (searchDiv) {
      const observer = new MutationObserver((mutations) => {
        getPrices("search");
      });

      observer.observe(searchDiv, {
          childList: true,
          subtree: true
      });
  }

})();








