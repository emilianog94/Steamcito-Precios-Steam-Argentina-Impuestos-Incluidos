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
    let oldCart = document.querySelector(".estimated_total_box");
    let newCart = 
    `<div class="estimated_total_extension">
        <div class="total_wallet"> 
            <p>Total Final pagando con Steam Wallet</p>
            <span>${convertNumberToString(cartTotal)}</span>
        </div>

        <div class="total_cc">
            <p>Total Final pagando con Tarjeta</p>
            <span>${convertNumberToString(cartTotalCreditCard)}</span>        
        </div>

        <div class="total_mixed">
            <p>Total Final pagando con Tarjeta y gastando los $${walletBalance} de tu Steam Wallet</p>
            <span>${convertNumberToString(cartTotalMixed)}</span>        
        </div>

    </div>`;
    oldCart.insertAdjacentHTML('afterbegin',newCart);
}

let cartTotal = getCartTotal();
let cartTotalCreditCard = setCartTotalCC(cartTotal);
let cartTotalMixed = setMixedCartTotal(cartTotal);

showCart();