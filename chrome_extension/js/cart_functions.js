let oldCart = document.querySelector(".estimated_total_box");
let cartTotal = getCartTotal();
let cartTotalCreditCard = setCartTotalCC(cartTotal);
let cartTotalMixed = setMixedCartTotal(cartTotal);

function getCartTotal(){
    let totalWallet = document.querySelector("#cart_estimated_total");
    return stringToNumber(totalWallet);
}

function setCartTotalCC(cartValue){
    return calcularImpuestos(cartValue);
}

function setMixedCartTotal(cartValue){
    if(walletBalance > 0){
        return calcularImpuestos(cartValue - walletBalance);
    } 
}

function showCart(){
    let estimatedTotalDisplay = walletBalance < cartTotal ? "hide" : "show";
    let totalMixedDisplay = estimatedTotalDisplay == "hide" && walletBalance != 0 ? "show" : "hide";

    let newCart = 
    `<div class="estimated_total_extension">
        <div class="total_wallet ${estimatedTotalDisplay}"> 
            <p>Total Final pagando con Steam Wallet </p>
            <span class="green">${numberToString(cartTotal.toFixed(2))} ${emojiWallet}</span>
        </div>

        <div class="total_cc">
            <p>Total Final pagando con Tarjeta</p>
            <span>${numberToString(cartTotalCreditCard)} ${emojiMate}</span>        
        </div>

        <div class="total_mixed ${totalMixedDisplay}">
            <p>Total Final pagando con Steam Wallet + Tarjeta</p>
            <span> <span class="green">${numberToString(walletBalance)} ${emojiWallet} </span> + &nbsp;${numberToString(cartTotalMixed)} ${emojiMate}</span>        
        </div>

    </div>`;
    oldCart.insertAdjacentHTML('afterbegin',newCart);
}

function showTaxes(){
    let taxesContainer = 
    `<div class="tax-container">
        <h3>Impuestos Nacionales</h3>
        <ul class="impuestos-nacionales"></ul>


        <br><br>
        <h3>Impuestos Provinciales</h3>
        <ul class="impuestos-provinciales"></ul>        

        <span class="final-total">Impuestos totales: ${((totalTaxes-1)*100).toFixed(2)}%</span>
        <p id="tax-change">Personalizar impuestos</p>

    </div>`;
    oldCart.insertAdjacentHTML('afterend',taxesContainer);

    taxes.forEach(tax => showFullInfo(tax,"national"));
    provinceTaxes && provinceTaxes.forEach(tax => showFullInfo(tax,"province"));

    function showFullInfo(tax,type){
        let taxList = `
        <li>
            <p>${tax.name}</p>
            <a href="${tax.moreInfo}" target="_blank">
                <span>(Ver más)</span>
            </a>
            <p class="value">${tax.value}%</p>
        </li>
        `
        if(type == "national"){
            document.querySelector(".tax-container ul.impuestos-nacionales").insertAdjacentHTML('afterbegin',taxList);
        } else{
            document.querySelector(".tax-container ul.impuestos-provinciales").insertAdjacentHTML('afterbegin',taxList);
        }
    }
}

showCart();
showTaxes();

let taxChangeShortcut = document.querySelector("#tax-change");
taxChangeShortcut.addEventListener('click',function(){
    setTimeout(function(){
        steamcitoIcon.click();
    },1);
});

