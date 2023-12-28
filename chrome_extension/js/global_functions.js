const walletBalance = getBalance();
const totalTaxes = getTotalTaxes();

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

async function setArgentinaPrice(price){
    let exchangeRate = JSON.parse(localStorage.getItem('steamcito-cotizacion')).rate;


    // Update 20/11 si los precios están en una currency distinta a ARS
    if(price.innerText.includes("$")){
        let baseNumericPrice = extractNumberFromString(price.innerText)
        price.dataset.originalPrice = baseNumericPrice;
        price.dataset.argentinaPrice = calculateTaxesAndExchange(baseNumericPrice,exchangeRate);
        price.dataset.isDolarized = "dolarized";
        renderPrices(price);
    }

}

function sanitizePromoLists(){
    let items = document.querySelectorAll('.promo_item_list .price br');
    items.forEach(item => item.remove());
}

function renderPrices(price){

    let argentinaPrice = numberToString(price.dataset.argentinaPrice);
    let originalPrice = price.dataset.isDolarized == "dolarized" ? numberToStringUsd(price.dataset.originalPrice) : numberToString(price.dataset.originalPrice);


    // Fix para contenedores que intercalan un BR entre precio original y precio en oferta 
    if (price.classList.contains("was")) sanitizePromoLists();
    
    // Agrego Listener para switchear precios con click
    if(!price.classList.contains('discount_original_price') || !price.classList.contains('responsive_secondrow')){
        price.addEventListener('click',showSecondaryPrice); 
        price.style.cursor="pointer";
    }

    if(walletBalance > parseFloat(price.dataset.originalPrice) && !price.classList.contains('discount_original_price')){

        // Fix para Search View
        if(price.matches('.discounted.responsive_secondrow')){
            let precioTachado = price.querySelector("strike");
            
            if(precioTachado) price.innerHTML = `<strike style="color: #888888;">${precioTachado.innerText}</strike> <br> ${originalPrice} ${emojiWallet}`; 
            price.removeEventListener('click',showSecondaryPrice); 
        }
        else{
            price.innerHTML = originalPrice + emojiWallet;     
            price.classList.add("original");
            price.classList.add("jeje");

            if(price.previousElementSibling){
                if(isInsideString(price.previousElementSibling,"ARS$")) price.previousElementSibling.innerText = numberToStringUsd(price.previousElementSibling.dataset.originalPrice); 
            }
        }
    } 
    else
    {
        // Fix para Search View
        if(price.matches('.discounted.responsive_secondrow')){
            let precioTachado = price.querySelector("strike");
            if(precioTachado) price.innerHTML = `<strike style="color: #888888;"> ${argentinizar(calcularImpuestos(stringToNumber(precioTachado)),false)} </strike> <br> ${argentinaPrice} ${emojiMate}`; 
            price.removeEventListener('click',showSecondaryPrice); 

        } else{

            price.innerHTML = argentinaPrice + emojiMate;
            price.classList.add("argentina");




            if(price.previousElementSibling){
                if(isInsideString(price.previousElementSibling,"ARS$")) price.previousElementSibling.innerText = numberToString(price.previousElementSibling.dataset.argentinaPrice); 
            }

        }
    }

    // Fix para reprocesar bundles dinámicos cuyo precio se carga de manera asíncrona
    setTimeout(function(){
        if(price.classList.contains('argentina') && !price.innerText.includes("ARS") && price.closest('.dynamic_bundle_description')){
            setArgentinaPrice(price);
        }
    },1500)

}

function showSecondaryPrice(e){
    e.preventDefault();
    let selectedPrice = e.currentTarget;
    selectedPrice.classList.add("transition-effect");
    selectedPrice.style.opacity = 0;
    if(selectedPrice.classList.contains("argentina")){
        switchPrices(selectedPrice,"argentina","original",emojiWallet,selectedPrice.dataset.isDolarized);
    }
    else if(selectedPrice.classList.contains("original")){
        switchPrices(selectedPrice,"original","argentina",emojiMate,selectedPrice.dataset.isDolarized);
    }
}

function switchPrices(selector,first,second,symbol,isDolarized){
    setTimeout(function(){
        selector.style.opacity=1;
        selector.classList.remove(first);
        selector.classList.add(second);

        if(isDolarized == "dolarized"){
            if(selector.classList.contains("suscription-price")){
                selector.innerHTML = numberToStringSub(selector.dataset[second+"Price"] + symbol);
            } else{
                selector.innerHTML = first == "argentina" ? numberToStringUsd(selector.dataset[second+"Price"] + symbol) : numberToString(selector.dataset[second+"Price"] + symbol)  ;
            }            
        }

        else{

            if(selector.classList.contains("suscription-price")){
                selector.innerHTML = numberToStringSub(selector.dataset[second+"Price"] + symbol);
            } else{
                selector.innerHTML = numberToString(selector.dataset[second+"Price"] + symbol) ;
            }

        }


    },250);
}



function evaluateDate(){
    if(localStorage.getItem('steamcito-cotizacion')){
        let exchangeRateJSON = JSON.parse(localStorage.getItem('steamcito-cotizacion'))

        let savedTimestamp = parseInt(exchangeRateJSON.date) / 1000;
        let currentTimestamp = Date.now()/1000;
        let difference = currentTimestamp - savedTimestamp;

        if(difference >= 3600){
            return true;
        } else{
            return false;
        }
    }
    return true;
}

async function getUsdExchangeRate(){

    let shouldGetNewRate = evaluateDate();

    if(shouldGetNewRate){
        try{
            let exchangeRateResponse = await fetch('https://mercados.ambito.com/dolar/oficial/variacion');
            let exchangeRateJson = await exchangeRateResponse.json();
            let exchangeRate = exchangeRateJson.venta;
            let exchangeRateDate = exchangeRateJson.fecha
            exchangeRate = parseFloat(exchangeRate.replace(',','.'));
            
            let exchangeRateJSON = {
                rate : exchangeRate,
                rateDateProvided: exchangeRateDate,
                date: Date.now()
            }

    
        localStorage.setItem('steamcito-cotizacion', JSON.stringify(exchangeRateJSON));
        }
        catch(err){
            localStorage.setItem('steamcito-cotizacion', JSON.stringify({
                rate:367.93,
                rateDateProvided:"13/11/2023 - 16:05",
                date:1699919573049
            }));
        }


    }
}

