let emojiMate = setEmojiMate();
const impuestosFinales = localStorage.getItem('taxAmount');

let addFundsPrices = document.querySelectorAll('.game_purchase_price.price,.giftcard_text');
addFundsPrices.forEach(price => {
    let positionArs = price.innerText.lastIndexOf("ARS$ ") + 5;
    let baseNumericPrice = stringToNumber(price,positionArs);
    price.dataset.argentinaPrice = (baseNumericPrice * impuestosFinales).toFixed(2);
    price.innerHTML = numberToString(price.dataset.argentinaPrice) + emojiMate ;
});


