let oldCart = document.querySelector(".estimated_total_box");
let cartTotal = getCartTotal();
let cartTotalCreditCard = setCartTotalCC(cartTotal);
let cartTotalMixed = setMixedCartTotal(cartTotal);

function getCartTotal(){
    let totalWallet = document.querySelector("#cart_estimated_total");
    return stringToNumber(totalWallet,5).toFixed(2);
}

function setCartTotalCC(cartValue){
    return ((cartValue * totalTaxes).toFixed(2));
}

function setMixedCartTotal(cartValue){
    if(walletBalance > 0){
        return (( (cartValue - walletBalance) * totalTaxes).toFixed(2));
    } 
}

function showCart(){
    let estimatedTotalDisplay = walletBalance < cartTotal ? "hide" : "show";
    let totalMixedDisplay = estimatedTotalDisplay == "hide" && walletBalance != 0 ? "show" : "hide";

    let newCart = 
    `<div class="estimated_total_extension">
        <div class="total_wallet ${estimatedTotalDisplay}"> 
            <p>Total Final pagando con Steam Wallet ${emojiWallet}</p>
            <span class="green">${numberToString(cartTotal)}</span>
        </div>

        <div class="total_cc">
            <p>Total Final pagando con Tarjeta ${emojiMate}</p>
            <span>${numberToString(cartTotalCreditCard)}</span>        
        </div>

        <div class="total_mixed ${totalMixedDisplay}">
            <p>Total Final pagando con Steam Wallet + Tarjeta</p>
            <span> <span class="green">${numberToString(walletBalance)} WALLET </span> + ${numberToString(cartTotalMixed)}</span>        
        </div>

    </div>`;
    oldCart.insertAdjacentHTML('afterbegin',newCart);
}

function showTaxes(){
    let taxesContainer = 
    `<div class="tax-container">
        <h3>¿Qué impuestos me cobran pagando con tarjeta?</h3>
        <ul></ul>
        <span class="final-total">Carga Impositiva Total ${((totalTaxes-1)*100).toFixed(0)}%</span>
    </div>`;
    oldCart.insertAdjacentHTML('afterend',taxesContainer);

    taxes.forEach(tax => showFullInfo(tax));

    function showFullInfo(tax){
        let taxList = `
        <li>
            <p>${tax.name}</p>
            <a href="${tax.moreInfo}" target="_blank">
                <span>(Ver más)</span>
            </a>
            <p class="value">${tax.value}%</p>
        </li>
        `
        document.querySelector(".tax-container ul").insertAdjacentHTML('afterbegin',taxList);
    }
}




showCart();
showTaxes();
