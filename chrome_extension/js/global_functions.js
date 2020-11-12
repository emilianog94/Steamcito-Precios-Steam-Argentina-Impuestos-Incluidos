const walletBalance = getBalance();
const totalTaxes = getTotalTaxes();

function stringToNumber(number,positionArs = 5){
    return parseFloat(number.innerText.slice(positionArs).replace(".","").replace(",","."));
}

function numberToString(number){
    return `ARS$ ${number}`.replace('.',',');
}

function isInsideString(element,string){
    return element.innerText.indexOf(string) != -1 ? true : false;
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
        return stringToNumber(walletBalanceContainer);
    }
    return 0;
}

function getPrices(){
    let prices = document.querySelectorAll(priceContainers);

    // Fix específico para obtener las DLCs sin descuento y que estas no hagan overlap con las DLCs con descuento
    let standardDlcPrices = document.querySelectorAll(`.game_area_dlc_price:not([${attributeName}]`);
    standardDlcPrices.forEach(dlcPrice => { 
        if(!dlcPrice.querySelector("div")){
            setArgentinaPrice(dlcPrice);
        }
    });
    prices.forEach(price => setArgentinaPrice(price));
}


function setArgentinaPrice(price){
    if(price.innerText.includes("ARS$") && price.hasChildNodes()){
        let positionArs = price.innerText.lastIndexOf("ARS$ ") + 5;
        let baseNumericPrice = stringToNumber(price,positionArs);
        price.dataset.originalPrice = baseNumericPrice.toFixed(2);
        price.dataset.argentinaPrice = (baseNumericPrice * totalTaxes).toFixed(2);
        renderPrices(price);
    }
    else{
        price.dataset.originalPrice = "none";
    }
}

function renderPrices(price){
    let argentinaPrice = numberToString(price.dataset.argentinaPrice);
    let originalPrice = numberToString(price.dataset.originalPrice);
    
    // Agrego Listener para switchear precios con click
    if(!price.classList.contains('discount_original_price') || !price.classList.contains('responsive_secondrow')){
        price.addEventListener('click',showSecondaryPrice); 
        price.style.cursor="pointer";
    }

    if(walletBalance > price.dataset.originalPrice && !price.classList.contains('discount_original_price')){
        price.innerText = originalPrice + " 💲";     
        price.classList.add("original");
        if(price.previousElementSibling){
            if(isInsideString(price.previousElementSibling,"ARS$")) price.previousElementSibling.innerText = numberToString(price.previousElementSibling.dataset.originalPrice); 
        }
    } else
    {
        // Fix para Search View
        if(price.matches('.discounted.responsive_secondrow')){
            let precioTachado = price.querySelector("strike");
            if(precioTachado) price.innerHTML = `<strike style="color: #888888;">${precioTachado.innerText}</strike> <br> ${argentinaPrice} 🧉`; 
            price.removeEventListener('click',showSecondaryPrice); 

        } else{
            price.innerText = argentinaPrice + " 🧉";
            price.classList.add("argentina");
            if(price.previousElementSibling){
                if(isInsideString(price.previousElementSibling,"ARS$")) price.previousElementSibling.innerText = numberToString(price.previousElementSibling.dataset.argentinaPrice); 
            }
        }
    }
}

function showSecondaryPrice(e){
    e.preventDefault();
    let selectedPrice = e.currentTarget;
    selectedPrice.classList.add("transition-effect");
    selectedPrice.style.opacity = 0;
    if(selectedPrice.classList.contains("argentina")){
        switchPrices(selectedPrice,"argentina","original"," 💲");
    }
    else if(selectedPrice.classList.contains("original")){
        switchPrices(selectedPrice,"original","argentina"," 🧉");
    }
}

function switchPrices(selector,first,second,symbol){
    setTimeout(function(){
        selector.style.opacity=1;
        selector.classList.remove(first);
        selector.classList.add(second);
        selector.innerText = numberToString(selector.dataset[second+"Price"] + symbol);
    },250);
}



