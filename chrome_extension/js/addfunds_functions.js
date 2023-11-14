let addFundsPrices = document.querySelectorAll('.game_purchase_price.price,.giftcard_text');
addFundsPrices.forEach(price => {

    // Fix para sección /selectgiftcard
    if(price?.classList?.[0] == "giftcard_text"){
        if(isStoreDolarized()){
            price.innerText += ".00";
        } else{
            price.innerText += ",00"; 
        }
    }
    setArgentinaPrice(price)
});