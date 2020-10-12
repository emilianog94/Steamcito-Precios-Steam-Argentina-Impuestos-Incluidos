const walletBalance = 2500; //getBalance();
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
        // Verifico si alcanza con el saldo actual de la wallet
        //price.dataset.originalPrice <= walletBalance ? price.classList.add("wallet-available") : price.classList.add("wallet-unavailable");
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
    if(price.dataset.originalPrice < walletBalance && !price.classList.contains('discount_original_price')){
        let parent = price.closest('div:not([data-original-price])');
        let newContainer = parent.cloneNode(true);
        let newContainerFirstPrice = newContainer.querySelector(".discount_original_price");
        let newContainerSecondPrice = newContainer.querySelector(".discount_final_price");
        newContainer.classList.add("jej");
        newContainerFirstPrice ? newContainerFirstPrice.innerText = convertNumberToString(newContainerFirstPrice.dataset.originalPrice) : "";
        newContainerSecondPrice ? newContainerSecondPrice.innerText = convertNumberToString(newContainerSecondPrice.dataset.originalPrice) : "";
        parent.insertAdjacentElement('afterend',newContainer);
    }
    // price.dataset.originalPrice="none";
}

