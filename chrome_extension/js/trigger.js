// Corro función por primera vez
(async() => {
  await getUsdExchangeRate();

  let _ticking = false;

  function tick() {
    if (_ticking) return;

    const pending = [
      ...Array.from(document.querySelectorAll(`.game_area_dlc_price:not([${attributeName}])`))
        .filter(p => !p.querySelector("div")),
      ...Array.from(document.querySelectorAll(priceContainers))
    ];

    if (pending.length === 0) return;

    // Procesar en lotes de 8 por frame para no bloquear el hilo principal
    _ticking = true;
    let i = 0;
    function batch() {
      const end = Math.min(i + 8, pending.length);
      for (; i < end; i++) setArgentinaPrice(pending[i]);
      if (i < pending.length) {
        requestAnimationFrame(batch);
      } else {
        _ticking = false;
      }
    }
    requestAnimationFrame(batch);
  }

  tick(); // Ejecución inicial
  setInterval(tick, 1500); // Recheck periódico para contenido cargado dinámicamente

  // El search sí necesita respuesta inmediata al tipear
  const searchDiv = document.querySelector('div[id*="searchSuggestion"]');
  if (searchDiv) {
    new MutationObserver(() => getPrices("search"))
      .observe(searchDiv, { childList: true, subtree: true });
  }

})();








