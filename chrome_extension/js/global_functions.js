const walletBalance = getBalance();
const totalTaxes = getTotalTaxes();

function getPrices(type){
    let prices;
    if (type == "standard"){
        prices = document.querySelectorAll(priceContainers);
        // Fix específico para obtener las DLCs sin descuento y que estas no hagan overlap con las DLCs con descuento
        let standardDlcPrices = document.querySelectorAll(`.game_area_dlc_price:not([${attributeName}]`);
        standardDlcPrices.forEach(dlcPrice => { 
            if(!dlcPrice.querySelector("div")){
                setArgentinaPrice(dlcPrice);
            }
        });
        prices.forEach(price => setArgentinaPrice(price));
    } else if(type == "cart"){
        setTimeout(() => {
            return renderCart();
        },1000)
    } 
    else if(type == "wishlist"){
        setInterval(() => {
            let divs = document.querySelectorAll('div.Panel div');
            divs.forEach(div => {
                if(div.innerText.slice(0,1) == "$" && div.children.length == 0) {
                    setArgentinaPrice(div);
                }
            })
        },1000)
    }
}

function getNeededWalletAmount(currentWalletAmount){
    return Math.ceil(currentWalletAmount / 5) * 5;
}

function setPaymentMethodName(){
    let paymentMethod = localStorage.getItem('metodo-de-pago') || "steamcito-cotizacion-tarjeta";
    if(paymentMethod == "steamcito-cotizacion-tarjeta"){
        return "Tarjeta"
    } else if(paymentMethod == "steamcito-cotizacion-crypto"){
        return "Astropay" 
    } else if(paymentMethod == "steamcito-cotizacion-mep"){
        return "Dólar Bancario"   
    } 
    return "Tarjeta";
}

function renderCart(){
    let paymentMethod = setPaymentMethodName();
    let exchangeRateTarjeta = JSON.parse(localStorage.getItem('steamcito-cotizacion-tarjeta'))?.rate;
    let exchangeRateCrypto = JSON.parse(localStorage.getItem('steamcito-cotizacion-crypto'))?.rate;
    let exchangeRateMep = JSON.parse(localStorage.getItem('steamcito-cotizacion-mep'))?.rate;

    if(!exchangeRateTarjeta || !exchangeRateMep || !exchangeRateCrypto){
        return;
    }

    let staticExchangeRate = exchangeRateTarjeta;
    if(paymentMethod == "Astropay"){
        staticExchangeRate = exchangeRateCrypto
    } else if(paymentMethod == "Dólar Bancario"){
        staticExchangeRate = exchangeRateMep
    }

    provinceTaxes &&
    provinceTaxes.forEach(tax => {
        staticExchangeRate += parseFloat((staticExchangeRate * tax.value / 100).toFixed(2));
    })

    let cartContent = document.querySelector('.Panel.Focusable:has(+ .Panel.Focusable)')
    const cartContentSibling = cartContent.nextElementSibling;
    let cartSidebar = cartContentSibling && cartContentSibling.querySelector('div:has(> button.Primary)')

    if(cartSidebar && cartContent){

        let total = Array.from(cartSidebar.querySelectorAll('div:not(:has(*))')).find(element => element.innerText[0] == "$")
        if(total?.innerText){
            let totalWallet = stringToNumber(total)
            let totalWithCurrentPaymentMethod = calculateTaxesAndExchange(totalWallet,staticExchangeRate)
            let totalMixed = calculateTaxesAndExchange(totalWallet - walletBalance, staticExchangeRate)
            let totalCrypto = calculateTaxesAndExchange(totalWallet, exchangeRateCrypto);
            
            let estimatedTotalDisplay = walletBalance < parseFloat(totalWallet) ? "hide" : "show";
            let totalMixedDisplay = estimatedTotalDisplay == "hide" && walletBalance != 0 ? "show" : "hide";

            if(!document.querySelector('.steamcito_cart')){
                cartSidebar.insertAdjacentHTML('beforebegin', `
                
                <div class="steamcito_cart">
                    <div class="steamcito_cart_wallet">
                        <p class="steamcito_cart_wallet_label">Total Exacto pagando con Steam Wallet</p>
                        <span class="steamcito_cart_wallet_value"></span>
                    </div>
                    <div class="steamcito_cart_currentmethod">
                        <p class="steamcito_cart_currentmethod_label">Total Aproximado pagando con ${paymentMethod} </p>
                        <span class="steamcito_cart_currentmethod_value"></span>
                    </div>
                    <div class="steamcito_cart_mixed">
                        <p class="steamcito_cart_mixed_label">Total Pagando con Steam Wallet + ${paymentMethod} </p>
                        <span class="steamcito_cart_mixed_value"></span>
                    </div>
                </div>

                <a href="https://steamcito.com.ar/mejor-metodo-de-pago-steam-argentina?ref=steamcito-cart" target="_blank" class="steamcito_crypto_savings">
                </a>


                <div class="steamcito_cart_exchangerate">
                    <p>Cotización aproximada con ${paymentMethod} </p>
                    <span class="exchangerate_value">1 USD ≈ ${staticExchangeRate.toFixed(2)} ARS ${emojiMate}</span>
                    <br>
                </div>        
                
                
                
                `)
            }

            let cartTotalWalletContainer = document.querySelector('.steamcito_cart_wallet_value');
            let cartTotalCurrentMethodContainer = document.querySelector('.steamcito_cart_currentmethod_value');
            let mixedWrapper = document.querySelector('.steamcito_cart_mixed');
            let cartTotalMixedContainer = document.querySelector('.steamcito_cart_mixed_value');
            let neededWalletAmount = totalWallet - walletBalance;
            let cryptoSavingsContainer = document.querySelector('.steamcito_crypto_savings');
            let cryptoSavings = totalWithCurrentPaymentMethod - totalCrypto;
            
            cartTotalWalletContainer.innerText = `${numberToStringUsd(totalWallet)}`
            cartTotalCurrentMethodContainer.innerText = `${numberToString(totalWithCurrentPaymentMethod)}`
            cartTotalMixedContainer.innerText = `${numberToStringUsd(walletBalance)} + ${numberToString(totalMixed)}`
            
            if(paymentMethod == "Tarjeta" && localStorage.getItem('ocultar-crypto') != "ocultar"){
                cryptoSavingsContainer.style.display="block";
                cryptoSavingsContainer.innerText = `Podés ahorrarte ${numberToString(cryptoSavings.toFixed(2))} en tu compra pagando con Astropay.` 
            }
            else{
                cryptoSavingsContainer.style.display="none";
            }

            // if(neededWalletAmount >= 0 && paymentMethod == "Astropay"){
            //     paymentAlertContainer.style.display="block";
            //     paymentAlertContainer.innerText = `Te faltan ${numberToStringUsd(neededWalletAmount.toFixed(2))} en tu cartera de Steam para completar la compra.\r\n\r\n Necesitás cargar ${getNeededWalletAmount(neededWalletAmount)} USD (${numberToString((getNeededWalletAmount(neededWalletAmount) * exchangeRateCrypto).toFixed(2))}) usando Astropay para avanzar.` 
            // }
            // else{
            //     paymentAlertContainer.style.display="none";
            // }

            if(totalMixedDisplay == "hide" || paymentMethod == "Astropay" ){
                mixedWrapper.style.display = "none";
            } else{
                mixedWrapper.style.display = "block";
            }


        }

        let dynamicClasses = Array.from(cartContent.querySelectorAll('div:not(:has(*))'));
        let filteredDynamicClasses = dynamicClasses.filter(element => element.innerText[0] == "$")
        prices = filteredDynamicClasses
        prices.forEach(price => setArgentinaPrice(price));
        return;
    }
    else{
        return;
    }

}

async function getArgentinaGames(){
    let shouldRefreshArgentinaList = evaluateDate('steamcito-argentina-games',86400);

    if(shouldRefreshArgentinaList){
        try{
            let argentinaGames = await fetch('/curator/45013169/ajaxgetfilteredrecommendations/?query&start=0&count=1000')
            let argentinaGamesJSON = await argentinaGames.json();
            if(argentinaGamesJSON.results_html){
                let sanitizedDOM = argentinaGamesJSON.results_html.replace(/[\r\n\t]/g, '');
                let steamGeneratedDOM = new DOMParser().parseFromString(sanitizedDOM, 'text/html').body.childNodes[0]
                let gamesElements = steamGeneratedDOM.querySelectorAll('div.recommendation');
                if(gamesElements){
                    let gamesElementsArray = Array.from(gamesElements)
                    let gamesList = gamesElementsArray.map(recomendacion => {
                        let itemElement = recomendacion.querySelector('div > a');
                        let item = itemElement.dataset.dsAppid;
                        let urlElement = recomendacion.querySelector('.recommendation_readmore a[target=_blank]');
                        let url = urlElement?.href || "";
                        if(url){
                            url = url.replace('https://steamcommunity.com/linkfilter/?u=','');
                            url = decodeURIComponent(url);
                        }
                        return({ 
                            appId: item,
                            informationUrl: url
                        })
                    })
                    let finalObject = {
                        games: gamesList,
                        date: Date.now()
                    }            
                    gamesList.length && localStorage.setItem('steamcito-argentina-games',JSON.stringify(finalObject))
                }
            }
        } catch(error){
            console.log("Hubo un error al obtener el JSON");
            console.log(error);
        }
    }
}

async function getOwnedGames(){
    // Si el usuario está logueado
    if(document.querySelector("#header_wallet_balance")){
        let shouldRefreshOwnedList = evaluateDate('steamcito-owned-games',86400);
        if(shouldRefreshOwnedList){
            const ownedGames = await fetch(`/dynamicstore/userdata/?time=${Date.now()}`)
            const ownedGamesJSON = await ownedGames.json();
            if(ownedGamesJSON.rgOwnedApps && ownedGamesJSON.rgOwnedApps.length){
                const ownedGamesObject = {
                    games: ownedGamesJSON.rgOwnedApps,
                    date: Date.now()
                }
                localStorage.setItem('steamcito-owned-games',JSON.stringify(ownedGamesObject))
            }
        }
    } else{
        // El usuario no está logueado, limpiar la listita local
        localStorage.removeItem('steamcito-owned-games')
    }
}


async function setArgentinaPrice(price){
    // await getUsdExchangeRate(); Comento esta línea para prevenir actualizaciones innecesarias

    let selectedPaymentMethod = localStorage.getItem('metodo-de-pago') || "steamcito-cotizacion-tarjeta";
    let exchangeRate = JSON.parse(localStorage.getItem(selectedPaymentMethod))?.rate;

        // Ignoro los juegos sin precio (Ejemplo: F2Ps)
        if(price.innerText.includes('$') && exchangeRate){
            let baseNumericPrice = extractNumberFromString(price.innerText)
            price.dataset.originalPrice = baseNumericPrice;
            price.dataset.argentinaPrice = calculateTaxesAndExchange(baseNumericPrice,exchangeRate);
            renderPrices(price);
        }
}

function sanitizePromoLists(){
    let items = document.querySelectorAll('.promo_item_list .price br');
    items.forEach(item => item.remove());
}

function renderPrices(price){

    let argentinaPrice = numberToString(price.dataset.argentinaPrice);
    let originalPrice = numberToStringUsd(price.dataset.originalPrice);
    price.addEventListener('click',showSecondaryPrice); 
    price.style.cursor="pointer";

    // Fix para contenedores que intercalan un BR entre precio original y precio en oferta 
    price.classList.contains("was") && sanitizePromoLists();
    
    // Si el saldo te alcanza para comprar el juego
    if(walletBalance > parseFloat(price.dataset.originalPrice)){
        price.innerHTML = originalPrice + emojiWallet;     
        price.classList.add("original");

        // Si tiene un descuento
        if(price.previousElementSibling){
            if(isInsideString(price.previousElementSibling,"$")){
                price.previousElementSibling.classList.add('original');
                price.previousElementSibling.classList.remove('argentina');
                price.previousElementSibling.innerText = numberToStringUsd(price.previousElementSibling.dataset.originalPrice); 
            }
        }
    } 

    // Si el saldo no alcanza
    else{
        price.innerHTML = argentinaPrice + emojiMate;
        price.classList.add("argentina");

        if(price.previousElementSibling){
            if(isInsideString(price.previousElementSibling,"$")){
                price.previousElementSibling.classList.remove('original');
                price.previousElementSibling.classList.add('argentina');
                price.previousElementSibling.innerText = numberToString(price.previousElementSibling.dataset.argentinaPrice); 
            }
        }
    }

    // Fix para reprocesar bundles dinámicos cuyo precio se carga de manera asíncrona
    setTimeout(function(){
        if(price.classList.contains('argentina') && !price.innerText.includes("ARS") &&  (price.closest('.dynamic_bundle_description') || price.closest('div[data-bundlediscount'))){
            setArgentinaPrice(price);
        }

        if(price.classList.contains('original') && !price.innerText.includes("USD") && price.closest('.dynamic_bundle_description')){
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
        switchPrices(selectedPrice,"argentina","original",emojiWallet);
    }
    else if(selectedPrice.classList.contains("original")){
        switchPrices(selectedPrice,"original","argentina",emojiMate);
    }
}

function switchPrices(selector,first,second,symbol){
    setTimeout(function(){
        selector.style.opacity=1;
        selector.classList.remove(first);
        selector.classList.add(second);

        if(selector.classList.contains("suscription-price")){
            selector.innerHTML = numberToStringSub(selector.dataset[second+"Price"] + symbol);
        } else{
            selector.innerHTML = first == "argentina" ? numberToStringUsd(selector.dataset[second+"Price"] + symbol) : numberToString(selector.dataset[second+"Price"] + symbol)  ;
        }            
    },250);
}



function evaluateDate(localStorageItem, seconds = 900){
    if(localStorage.getItem(localStorageItem)){
        let exchangeRateJSON = JSON.parse(localStorage.getItem(localStorageItem))
        let savedTimestamp = Math.floor(parseInt(exchangeRateJSON.date) / 1000);
        let currentTimestamp = Math.floor(Date.now()/1000);
        let difference = currentTimestamp - savedTimestamp;
        if(difference >= seconds){
            return true;
        } else{
            return false;
        }
    }
    return true;
}

async function processExchangeRate(type,localStorageItemKey,defaultValue){
    try{
        let exchangeRateResponse = await fetch('/curator/45349538/ajaxgetfilteredrecommendations/?query&start=0&count=10')
        let exchangeRateJson = await exchangeRateResponse.json();
        if(exchangeRateJson.results_html){
            let sanitizedDOM = exchangeRateJson.results_html.replace(/[\r\n\t]/g, '');
            let steamGeneratedDOM = new DOMParser().parseFromString(sanitizedDOM, 'text/html').body.childNodes[0]
            let gamesElements = steamGeneratedDOM.querySelectorAll('div.recommendation');
            if(gamesElements.length){

                let element = Array.from(gamesElements).find( (gameElement,index) => {
                    let domElement = gamesElements[index].querySelector('.recommendation_desc');
                    let rateData = domElement.innerText.split('|'); // RateData String Format: Rate|Tax|Name|Timestamp
                    return rateData[2].includes(type)
                })

                element = element.querySelector('.recommendation_desc');
                let rateData = element.innerText.split('|'); // RateData String Format: Rate|Tax|Name|Timestamp

                const taxAmount = rateData[1]

                const formattedDate = new Date(parseInt(rateData[3])).toLocaleString("es-AR", {
                day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false 
                }).replace(",", " -");


                let exchangeRateJSON = {
                    rate : parseFloat(rateData[0]),
                    taxAmount: taxAmount,
                    rateDateProvided: formattedDate,
                    date: Date.now()
                }

                localStorage.setItem(localStorageItemKey, JSON.stringify(exchangeRateJSON));
            }
        }
    } 
    catch(err){
        console.log(err);
        if(!localStorage.getItem(localStorageItemKey)){
            localStorage.setItem(localStorageItemKey, JSON.stringify({
                rate: defaultValue,
                rateDateProvided:"11/06/2024 - 16:00",
                date:Date.now()
            }));
        } else{
            let currentRateValue = JSON.parse(localStorage.getItem(localStorageItemKey));
            currentRateValue.date = Date.now();
            localStorage.setItem(localStorageItemKey,JSON.stringify(currentRateValue));                
        }
    }
}

async function getUsdExchangeRate(){
    let shouldGetNewRateDolarTarjeta = evaluateDate('steamcito-cotizacion-tarjeta');
    if(shouldGetNewRateDolarTarjeta){
        processExchangeRate('Tarjeta','steamcito-cotizacion-tarjeta',1600)
    }

    let shouldGetNewRateDolarCrypto = evaluateDate('steamcito-cotizacion-crypto');
    if(shouldGetNewRateDolarCrypto){
        processExchangeRate('Crypto','steamcito-cotizacion-crypto',1200)
    }
        
    let shouldGetNewRateDolarMep = evaluateDate('steamcito-cotizacion-mep');
    if(shouldGetNewRateDolarMep){
        processExchangeRate('Bancario','steamcito-cotizacion-mep',1400)
    }
}


async function getBnaExchangeRate(){ // Legacy function: not used!

    let shouldGetNewRate = evaluateDate('steamcito-cotizacion-bna');

    if(shouldGetNewRate){
        try{
            let exchangeRateResponse = await fetch('https://mercados.ambito.com/dolarnacion/variacion');
            let exchangeRateJson = await exchangeRateResponse.json();
            let exchangeRate = exchangeRateJson.venta;
            let exchangeRateDate = exchangeRateJson.fecha
            exchangeRate = parseFloat(exchangeRate.replace(',','.'));
            
            let exchangeRateJSON = {
                rate : exchangeRate,
                rateDateProvided: exchangeRateDate,
                date: Date.now()
            }

    
        localStorage.setItem('steamcito-cotizacion-bna', JSON.stringify(exchangeRateJSON));
        }
        catch(err){
            localStorage.setItem('steamcito-cotizacion-bna', JSON.stringify({
                rate:841.25,
                rateDateProvided:"23/01/2024 - 15:57",
                date:Date.now()
            }));
        }
    }
}


let currentDate = new Date();
const hoy = {
			day: currentDate.getDate(),
			month: currentDate.getMonth()+1,
			year: currentDate.getFullYear()
};

// Pasa de un stirng de iniciales de un mes al número de mes. Ejemplo: AGO (Agosto) será 8
function monthStrToNumber(month)
{
    if(month.indexOf(',')){
        let commaPosition = month.indexOf(',');
        let monthSanitized = commaPosition != -1 ? (month.slice(0,commaPosition)).toUpperCase() : month.toUpperCase();
        return ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"].indexOf(monthSanitized) + 1;
    } else{
        return ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"].indexOf(month) + 1;
    }
}

// Pasa de un string del formato 15 ENE 2023 a un json { day:15, month:1, year:2023}
function stringToDate(dateStr)
{
	let dateArr = dateStr.split(" ");
	return {
		day:Number(dateArr[0]),
		month:monthStrToNumber(dateArr[1]),
		year:Number(dateArr[2])
	};
}


getArgentinaGames();
getOwnedGames();
renderArgentinaShortcut();