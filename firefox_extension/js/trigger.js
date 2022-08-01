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





