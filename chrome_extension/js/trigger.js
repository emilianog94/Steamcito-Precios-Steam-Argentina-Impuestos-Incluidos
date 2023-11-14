// Corro función por primera vez

async function lala(){
  console.log("entré a lala");
  await getUsdExchangeRate();
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

lala();







