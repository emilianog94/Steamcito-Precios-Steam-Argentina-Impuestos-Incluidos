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
        walletBalanceContainer.innerText += " 💲";
        return convertStringToNumber(walletBalanceContainer);
    }
    return 0;
}

function getPrices(){
    let prices = document.querySelectorAll(priceContainers);
    prices.forEach(price => setArgentinaPrice(price));
}

function showSecondaryPrice(e){
    e.preventDefault();
    let selectedPrice = e.currentTarget;
    let originalxd = e.currentTarget.innerText;
    selectedPrice.style.transition= "all 0.5s ease";
    selectedPrice.style.opacity = 0;
    if(selectedPrice.classList.contains("argentina")){
        setTimeout(function(){
            selectedPrice.style.opacity=1;
            selectedPrice.classList.remove('argentina');
            selectedPrice.classList.add("original");
            selectedPrice.innerText = convertNumberToString(selectedPrice.dataset.originalPrice + " 💲")
        },500);
    }
    else if(selectedPrice.classList.contains("original")){
        setTimeout(function(){
            selectedPrice.style.opacity=1;
            selectedPrice.classList.remove('original');
            selectedPrice.classList.add("argentina");
            selectedPrice.innerText = convertNumberToString(selectedPrice.dataset.argentinaPrice + " 🧉");
        },500);
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
    
    // Agrego Listener para switchear precios
    if(!price.classList.contains('discount_original_price')){
        price.addEventListener('click',showSecondaryPrice); 
        price.style.cursor="pointer";
    }

    if(walletBalance > price.dataset.originalPrice && !price.classList.contains('discount_original_price')){
        price.innerText = originalPrice + " 💲";     
        price.classList.add("original");
        price.previousElementSibling ? price.previousElementSibling.innerText = convertNumberToString(price.previousElementSibling.dataset.originalPrice) : ""; 
    } else{
        price.innerText = argentinaPrice + " 🧉";
        price.classList.add("argentina");
        price.previousElementSibling ? price.previousElementSibling.innerText = convertNumberToString(price.previousElementSibling.dataset.argentinaPrice) : ""; 
    }
}

