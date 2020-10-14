const walletBalance = getBalance();
const totalTaxes = getTotalTaxes();

function convertStringToNumber(number,positionArs = 5){
    return parseFloat(number.innerText.slice(positionArs).replace(".","").replace(",","."));
}

function convertNumberToString(number){
    return `ARS$ ${number}`.replace('.',',');
}

function getTotalTaxes(){
    function reducer(total,num){
        return total+num;
    }
    let taxesValues = taxes.map(tax => tax.value);
    let totalTaxes = (1 + (taxesValues.reduce(reducer)/100)).toFixed(2);
    return totalTaxes;
}

function getBalance(){
    let walletBalanceContainer = document.querySelector("#header_wallet_balance");
    if(walletBalanceContainer){
        walletBalanceContainer.style.color="#a4d007";
        return convertStringToNumber(walletBalanceContainer);
    }
    return 0;
}

function getPrices(){
    let prices = document.querySelectorAll(priceContainers);
    prices.forEach(price => setArgentinaPrice(price));
}

function setArgentinaPrice(price){
    if(price.innerText.includes("ARS$") && price.hasChildNodes()){
        let positionArs = price.innerText.lastIndexOf("ARS$ ") + 5;
        let baseNumericPrice = convertStringToNumber(price,positionArs);
        price.dataset.originalPrice = baseNumericPrice;
        price.dataset.argentinaPrice = (baseNumericPrice * totalTaxes).toFixed(2);
        renderPrices(price);
    }
    else{
        price.dataset.originalPrice = "none";
    }
}

function renderPrices(price){
    let argentinaPrice = convertNumberToString(price.dataset.argentinaPrice);
    let originalPrice = convertNumberToString(price.dataset.originalPrice);
    price.innerText = argentinaPrice;

    // Verificar si es necesario mostrar el precio con Steam Wallet
    if(originalPrice < walletBalance && !price.classList.contains('discount_original_price')){
        renderWalletPrices(price);
    }
    else{
        let originalContainer = price.closest('div:not([data-original-price])');
        originalContainer.classList.add("mate");
    }
    // price.dataset.originalPrice="none";
}

function renderWalletPrices(price){
    let originalContainer = price.closest('div:not([data-original-price])');
    let newContainer = originalContainer.cloneNode(true);

    // Quito los childs que no son precios
    let extraDivs = newContainer.querySelectorAll('div:not([data-original-price])')
    extraDivs.forEach(div => div.remove());

    newContainer.classList.remove("mate");
    originalContainer.classList.add("mate");

    let newContainerPrices = newContainer.querySelectorAll(".discount_original_price,.game_purchase_price,.discount_final_price");
    newContainerPrices.forEach(container => container.innerText = convertNumberToString(container.dataset.originalPrice));
    originalContainer.insertAdjacentElement('beforebegin',newContainer);

}

