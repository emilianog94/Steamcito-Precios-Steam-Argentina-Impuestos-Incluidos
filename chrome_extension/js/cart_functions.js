let oldCart = document.querySelector(".estimated_total_box");
let cartTotal = getCartTotal();
let cartTotalCreditCard = setCartTotalCC(cartTotal);
let cartTotalMixed = setMixedCartTotal(cartTotal);

function getCartTotal(){
    let totalWallet = document.querySelector("#cart_estimated_total");
    return convertStringToNumber(totalWallet,5);
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
            <p>Total Final pagando con Steam Wallet</p>
            <span class="green">${convertNumberToString(cartTotal)}</span>
        </div>

        <div class="total_cc">
            <p>Total Final pagando con Tarjeta</p>
            <span>${convertNumberToString(cartTotalCreditCard)}</span>        
        </div>

        <div class="total_mixed ${totalMixedDisplay}">
            <p>Total Final pagando con Steam Wallet + Tarjeta</p>
            <span> <span class="green">${convertNumberToString(walletBalance)} WALLET </span> + ${convertNumberToString(cartTotalMixed)}</span>        
        </div>

    </div>`;
    oldCart.insertAdjacentHTML('afterbegin',newCart);
}

function showTaxes(){
    let taxesContainer = `<div class="tax-container"><ul></ul></div>`;
    oldCart.insertAdjacentHTML('afterend',taxesContainer);

    taxes.forEach(tax => showFullInfo(tax));

    function showFullInfo(tax){
        let taxList = `
        <li>
        <p>${tax.name}</p>
        <p>${tax.value}</p>
        <p>${tax.moreInfo}</p>
        </li>
        `
        document.querySelector(".tax-container").insertAdjacentHTML('afterbegin',taxList);
    }
}




showCart();
showTaxes();
