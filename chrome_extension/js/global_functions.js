const walletBalance =  getBalance();
// const walletBalance = 800;
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
    prices.forEach(price => price.addEventListener('click',showSecondaryPrice));
}

function showSecondaryPrice(e){
    e.preventDefault();
    let selectedPrice = e.currentTarget;
    if(selectedPrice.classList.contains("argentina")){
        selectedPrice.classList.remove('argentina');
        selectedPrice.classList.add("usa");
        selectedPrice.innerText = convertNumberToString(selectedPrice.dataset.originalPrice + " 💲");
    }
    else if(selectedPrice.classList.contains("usa")){
        selectedPrice.classList.remove('usa');
        selectedPrice.classList.add("argentina");
        selectedPrice.innerText = convertNumberToString(selectedPrice.dataset.argentinaPrice + " 🧉");
    }
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
    
    if(walletBalance > price.dataset.originalPrice && !price.classList.contains('discount_original_price')){
        price.innerText = originalPrice + " 💲";     
        price.classList.add("usa");
        price.previousElementSibling ? price.previousElementSibling.innerText = convertNumberToString(price.previousElementSibling.dataset.originalPrice) : ""; 
        
    } else{
        price.innerText = argentinaPrice + " 🧉";
        price.classList.add("argentina");
        price.previousElementSibling ? price.previousElementSibling.innerText = convertNumberToString(price.previousElementSibling.dataset.argentinaPrice) : ""; 
    }
}

