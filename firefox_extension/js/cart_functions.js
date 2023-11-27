(async() => {
    await getUsdExchangeRate();

    let oldCart = document.querySelector(".estimated_total_box");
    let walletElement = document.querySelector('#cart_estimated_total');
    let cartTotal = getCartTotal();
    let cartTotalCreditCard = setCartTotalCC(cartTotal);
    let cartTotalMixed = setMixedCartTotal(cartTotal);
    
    let exchangeRateJSON = JSON.parse(localStorage.getItem('steamcito-cotizacion'))
    
    function getCartTotal() {
        return stringToNumber(walletElement);
    }
    
    function setCartTotalCC(cartValue) {
        if(!walletElement.innerText.includes('ARS')){
            walletElement.dataset.currency = "usd"
            return calculateTaxesAndExchange(cartValue)
        }
        walletElement.dataset.currency = "ars"
        return calcularImpuestos(cartValue);
    }
    
    function setMixedCartTotal(cartValue) {
        if (walletBalance > 0) {
            if(!walletElement.innerText.includes('ARS')){
                walletElement.dataset.currency = "usd"
                return calculateTaxesAndExchange(cartValue - walletBalance)
            }
            return calcularImpuestos(cartValue - walletBalance);
        }
    }
    
    function showExchangeRate(exchangeRate) {
    
        let exchangeRateContainer = 
            `<div class="tax-container">
                <h3>Aclaración sobre los precios en pesos argentinos</h3>
                <p>
                    Todos los precios en pesos argentinos mostrados por Steamcito son aproximados muy cercanos ya que cada banco/billetera digital tiene su propia cotización del dólar. <br/><br/>Por esta razón terminarás pagando un monto muy cercano al indicado en esta sección.
                </p>   
            </div>`
    
            oldCart.insertAdjacentHTML('afterend', DOMPurify.sanitize(exchangeRateContainer));
    }
    
    function showCart() {
        let estimatedTotalDisplay = walletBalance < cartTotal ? "hide" : "show";
        let totalMixedDisplay = estimatedTotalDisplay == "hide" && walletBalance != 0 ? "show" : "hide";
    
        let newCart =
        `<div class="estimated_total_extension">
    
            <div class="total_wallet"> 
                <p>Total Final pagando con Steam Wallet </p>
                <span class="green">${walletElement.dataset.currency == "ars" ? numberToString(cartTotal.toFixed(2)) : numberToStringUsd(cartTotal)} ${emojiWallet}</span>
            </div>
    
            <div class="total_cc">
                <p>Total Aproximado pagando con Tarjeta</p>
                <span>${numberToString(cartTotalCreditCard)} ${emojiMate}</span>        
            </div>
    
            <div class="total_mixed ${totalMixedDisplay}">
                <p>Total Aproximado pagando con Steam Wallet + Tarjeta</p>
                <span> <span class="green">${walletElement.dataset.currency == "ars" ? numberToString(walletBalance) : numberToStringUsd(walletBalance)} ${emojiWallet} </span> + &nbsp;${numberToString(cartTotalMixed)} ${emojiMate}</span>        
            </div>
    
        </div>`;
        oldCart.insertAdjacentHTML('afterbegin', DOMPurify.sanitize(newCart));
    }
    
    function showTaxes() {
        let staticExchangeRate = JSON.parse(localStorage.getItem('steamcito-cotizacion')).rate;
        let newExchangeRate = JSON.parse(localStorage.getItem('steamcito-cotizacion')).rate;

        standardTaxes &&
        standardTaxes.forEach(tax => {
            newExchangeRate += parseFloat((staticExchangeRate * tax.value / 100).toFixed(2));
        })

        provinceTaxes &&
        provinceTaxes.forEach(tax => {
            newExchangeRate += parseFloat((staticExchangeRate * tax.value / 100).toFixed(2));
        })

        let taxesContainer =
            `<div class="tax-container">

            <h3>Cotización del dólar tarjeta: 1 USD ≈ ${newExchangeRate} ARS </h3>
            <ul class="cotizacion-dolar">
                <li>Esta cotización  referencial es provista por Steamcito e incluye todos los impuestos listados abajo.</li>
            </ul>
            <span class="taxes-separator"></span>

            <h3>Impuestos Nacionales</h3>
            <ul class="impuestos-nacionales"></ul>
    
            <span class="taxes-separator"></span>
    
            <h3>Impuestos Provinciales</h3>
            <ul class="impuestos-provinciales"></ul>  
            
            <span class="taxes-separator"></span>
    
            <div class="taxes-final-total">
                <span class="final-total">Total de Impuestos: ${((totalTaxes - 1) * 100).toFixed(2)}%</span>
                <p id="tax-change">Personalizar impuestos</p>
            </div>
    
        </div>`;
        oldCart.insertAdjacentHTML('afterend', DOMPurify.sanitize(taxesContainer));
    
        taxes.forEach(tax => showFullInfo(tax, "national"));
        provinceTaxes && provinceTaxes.forEach(tax => showFullInfo(tax, "province"));
    
        function showFullInfo(tax, type) {
            let taxList = `
            <li>
                <p>${tax.name}</p>&nbsp;
                <a href="${tax.moreInfo}" target="_blank">
                    <span>(Boletín Oficial)</span>
                </a>
                <p class="value">${tax.value}%</p>
            </li>
            `
            if (type == "national") {
                document.querySelector(".tax-container ul.impuestos-nacionales").insertAdjacentHTML('afterbegin', DOMPurify.sanitize(taxList));
            } else {
                document.querySelector(".tax-container ul.impuestos-provinciales").insertAdjacentHTML('afterbegin', DOMPurify.sanitize(taxList));
            }
        }
    }
    
    showCart();
    showTaxes();
    if(isStoreDolarized() && exchangeRateJSON){
        showExchangeRate(exchangeRateJSON);
    }
    
    let taxChangeShortcut = document.querySelector("#tax-change");
    taxChangeShortcut.addEventListener('click', function () {
        setTimeout(function () {
            steamcitoIcon.click();
        }, 1);
    });

})();



