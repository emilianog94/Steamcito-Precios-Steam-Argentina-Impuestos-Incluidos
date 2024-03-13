// Corro función por primera vez
(async() => {
  await getUsdExchangeRate();
  await getCryptoUsdExchangeRate();
  getPrices("standard");

  // Trigger recursivo
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  const observer = new MutationObserver(function(mutations, observer) {
    getPrices("standard");
  });

  observer.observe(document, {
    subtree: true,
    attributes: true
  });

})();








