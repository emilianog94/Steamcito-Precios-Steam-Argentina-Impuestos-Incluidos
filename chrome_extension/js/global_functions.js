const attributeName = "data-original-price";
const walletBalance = 6000; //getBalance();
const totalTaxes = getTotalTaxes();


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
        return convertStringToNumber(walletBalanceContainer,5)
    } else{
        return 0;
    }
}

function getAppPrices(){
    // Get all current non-converted prices
    let prices = document.querySelectorAll(`.discount_original_price:not([${attributeName}]), .discount_final_price:not([${attributeName}]), .game_purchase_price:not([${attributeName}]), [class*=salepreviewwidgets_StoreSalePriceBox]:not([${attributeName}]), .search_price:not([${attributeName}]), .regular_price:not([${attributeName}]), .match_price:not([${attributeName}]), .cart_item .price:not([${attributeName}]):not([class*=original_price])`);
    prices.forEach(price => setArgentinaPrice(price));
}

function setArgentinaPrice(price){

    // Verificar si el producto realmente tiene un precio.
    if(price.innerText.includes("ARS$") && price.hasChildNodes()){
        let positionArs = price.innerText.lastIndexOf("ARS$ ") + 5;
        let baseNumericPrice = convertStringToNumber(price,positionArs);
        price.dataset.originalPrice = baseNumericPrice;
        price.dataset.argentinaPrice = (baseNumericPrice * totalTaxes).toFixed(2);

        // Verifico si alcanza con el saldo actual de la wallet
        //price.dataset.originalPrice <= walletBalance ? price.classList.add("wallet-available") : price.classList.add("wallet-unavailable");

        displayAppPrices(price);
    }
    else{
        price.dataset.originalPrice = "none";
    }
}

function convertStringToNumber(price,positionArs){
    return parseFloat(price.innerText.slice(positionArs).replace(".","").replace(",","."));
}

function convertNumberToString(price){
    return `ARS$ ${price}`.replace('.',',');
}

function displayAppPrices(price){
    let argentinaPrice = convertNumberToString(price.dataset.argentinaPrice);
    let originalPrice = convertNumberToString(price.dataset.originalPrice);
    price.innerText = argentinaPrice;

    if(price.dataset.originalPrice < walletBalance && !price.classList.contains('discount_original_price')){
        let parent = price.closest('div:not([data-original-price])');
        let pipi = parent.cloneNode(true);
        if(pipi.querySelector(".discount_original_price")){
            pipi.querySelector(".discount_original_price").innerText = convertNumberToString(pipi.querySelector(".discount_original_price").dataset.originalPrice);
        }
        if(pipi.querySelector(".discount_final_price")){
            pipi.querySelector(".discount_final_price").innerText = convertNumberToString(pipi.querySelector(".discount_final_price").dataset.originalPrice);
        }
        parent.insertAdjacentElement('afterend',pipi);
    }

    // price.dataset.originalPrice="none";
}

