const url = window.location.pathname;
let indicatorStyle = localStorage.getItem('estilo-barra');

const getAppData = (url) => {
    let appData = {
        type: '',
        id: ''
    };
    url.includes('/sub/') ? appData.type = "sub" : appData.type = "app";

    let startingPosition = url.indexOf('/', 1);
    let endingPosition = url.indexOf('/', startingPosition + 1);
    appData.id = url.slice(startingPosition + 1, endingPosition);
    return appData;
}

// Checks if the game was developed in Argentina
const isFromArgentina = () => {
    if(localStorage.getItem('steamcito-argentina-games')) {
        let argentinaGames = JSON.parse(localStorage.getItem('steamcito-argentina-games'));
        if(argentinaGames.games.length){
            if(window.location.href.includes('/app/')){
                let url = window.location.href;
                let regex = /\/app\/(\d+)\//;
                let match = url.match(regex);
                if (match) {
                    let appId = match[1];
                    let matchingGame = argentinaGames.games.find(game => game.appId == appId);
                    matchingGame && renderArgentinaIndicator(matchingGame);
                } else {
                    return;
                }
            }
        }
    }
}

const renderArgentinaIndicator = (matchingGame) => {
    let orgulloArgentinoHidden = localStorage.getItem('ocultar-orgullo-argentino');
    if (orgulloArgentinoHidden == "ocultar") {
        return;
    }
    
    let gameName = document.querySelector('#appHubAppName');
    let targetContainer = document.querySelector('.leftcol.game_description_column');
    
    function validateUrl(urlString){
        try{
            let url = new URL(urlString) 
            if(url){ 
                let parameters = new URLSearchParams(url.search);
                if(parameters){
                    if(parameters.get('coverType') && parameters.get('guest')){
                        return {
                            hostname: url.hostname,
                            coverType: parameters.get('coverType'),
                            guest: parameters.get('guest')
                        } 
                    }
                }
            }  
        } catch(error) {
            return "";
        }     
    }

    let finalURL = validateUrl(matchingGame.informationUrl)

    if(finalURL) {
        let argentinaIndicator = 
        `
        <a class="franchise_notice franchise_notice_with_description" target=_"blank" href="${matchingGame.informationUrl}">
            <div class="background_image" style="background-image: url('${chrome.runtime.getURL("emojis/argentina-flag.png")}');"></div>
            <div class="franchise_name">${gameName.innerText} es un juego argentino 💖</div>
            ${finalURL.hostname == "youtube.com"
                ?
                `
                <div class="franchise_description">${finalURL.coverType == "entrevista" ? "Mirá la entrevista " : "Conocé más sobre " } ${finalURL.guest.replaceAll('-',' ')} [${finalURL.hostname}] </div>
                `
                : ""
            }

            ${finalURL.hostname == "pressover.news"
                ?
                `
                <div class="franchise_description">${finalURL.coverType == "entrevista" ? "Leé la nota " : "Conocé más sobre " } ${finalURL.guest.replaceAll('-',' ')} [${finalURL.hostname}] </div>
                `
                : ""
            }

        </a>    
        `
        targetContainer.insertAdjacentHTML('afterbegin', argentinaIndicator)
    } else{
        let argentinaIndicator = 
        `
        <a class="franchise_notice franchise_notice_without_description" href="#">
            <div class="background_image" style="background-image: url('${chrome.runtime.getURL("emojis/argentina-flag.png")}');"></div>
            <div class="franchise_name">${gameName.innerText} es un juego argentino 💖</div>
        </a>    
        `
        targetContainer.insertAdjacentHTML('afterbegin', argentinaIndicator)
    }



}


const admirePublisher = (publisher) => {

    const phrases = [
        `¡Te queremos mucho ${publisher}!`,
        `¡Te amamos ${publisher}!`,
        `¡Tenés que cerrar el estadio ${publisher}!`,
        `¡Genio ${publisher}!`,
        `¡Gracias ${publisher}!`,
        `¡Bien ahí ${publisher}!`,
        `¡Sos groso ${publisher}!`
    ]

    return phrases[Math.floor(Math.random() * phrases.length)];
}


const criticizePublisher = (margin,publisher) => {

    const phrases = [
        `¿Lo trajiste de Dubai, ${publisher}?`,
        `¡Te fuiste al pasto ${publisher}!`,
        `¡Te zarpaste mal ${publisher}!`,
        `Epa, ¿qué rompimos ${publisher}?`,
        `¡Saladito ${publisher}!`,
        `¡Se te fue la mano ${publisher}!`,
        `${publisher}, hasta acá llegaste...`,
        `¿Viene firmado por Messi, ${publisher}?`,
        `${publisher}, en qué te has convertido...`
    ]

    const randomChoice = Math.floor(Math.random() * phrases.length);
    if(margin >= 100){
        return `<br><br><span>${phrases[randomChoice]}</span>`
    }
    return "";
}


const getExchangeRate = async () => {
    await getUsdExchangeRate();
    let exchangeRate = JSON.parse(localStorage.getItem('steamcito-cotizacion-tarjeta'))?.rate;
    let exchangeRateDate = JSON.parse(localStorage.getItem('steamcito-cotizacion-tarjeta'))?.rateDateProvided;
    let exchangeRateCrypto = JSON.parse(localStorage.getItem('steamcito-cotizacion-crypto'))?.rate;
    let exchangeRateCryptoDate = JSON.parse(localStorage.getItem('steamcito-cotizacion-crypto'))?.rateDateProvided;
    let exchangeRateMep = JSON.parse(localStorage.getItem('steamcito-cotizacion-mep'))?.rate;
    let exchangeRateMepDate = JSON.parse(localStorage.getItem('steamcito-cotizacion-mep'))?.rateDateProvided;
    let exchangeRateArq = JSON.parse(localStorage.getItem('steamcito-cotizacion-arq'))?.rate;
    let tarjetaTax = JSON.parse(localStorage.getItem('steamcito-cotizacion-tarjeta'))?.taxAmount || 21
    let cryptoTax = JSON.parse(localStorage.getItem('steamcito-cotizacion-crypto'))?.taxAmount || 0
    let mepTax = JSON.parse(localStorage.getItem('steamcito-cotizacion-mep'))?.taxAmount || 21


    if(exchangeRate && exchangeRateDate && exchangeRateCrypto && exchangeRateCryptoDate && exchangeRateMep && exchangeRateMepDate && exchangeRateArq && tarjetaTax && cryptoTax && mepTax){
        renderExchangeIndicator(exchangeRate,exchangeRateDate,exchangeRateCrypto,exchangeRateCryptoDate,exchangeRateMep,exchangeRateMepDate,tarjetaTax,cryptoTax,mepTax,exchangeRateArq)
    }
}

const getAppPricing = async (appInitialData) => {
    await getUsdExchangeRate();
    const { type, id } = appInitialData;
    let appEndpoint = `/api/appdetails?appids=${id}`;
    let subEndpoint = `/api/packagedetails?packageids=${id}`

    const appIdFetch = await fetch(`${type == "app" ? `${appEndpoint}&cc=us` : `${subEndpoint}&cc=us`}`, { credentials: 'omit' })

    const appIdFetchArg = await fetch(`${type == "app" ? `${appEndpoint}&cc=ar` : `${subEndpoint}&cc=ar`}`, { credentials: 'omit' })

    let exchangeRate = JSON.parse(localStorage.getItem('steamcito-cotizacion-tarjeta'))?.rate;


    let appIdResponse = await appIdFetch.json();
    let appIdArgResponse = await appIdFetchArg.json();

    if (appIdResponse[id].success && appIdArgResponse[id].success) {
        if (appIdResponse[id].data.is_free || !appIdResponse[id].data[type == "sub" ? "price" : "price_overview"]) {
            return;
        }
        appIdResponse = appIdResponse[id].data;
        appIdArgResponse = appIdArgResponse[id].data;

        const appData = {
            name: appIdResponse.name,
            discount: (appIdResponse[type == "sub" ? "price" : "price_overview"].discount_percent),
            publisher: appIdResponse.publishers?.[0] || "El publisher",
            releaseDate: appIdResponse.release_date?.date || "Sin fecha de lanzamiento",
            baseUsdPrice: (appIdResponse[type == "sub" ? "price" : "price_overview"].initial) / 100,
            baseArsPrice: (appIdArgResponse[type == "sub" ? "price" : "price_overview"].initial) / 100,
            usdPrice: (appIdResponse[type == "sub" ? "price" : "price_overview"].final) / 100,
            arsPrice: (appIdArgResponse[type == "sub" ? "price" : "price_overview"].final) / 100,
            support_url: appIdResponse?.support_info?.url,
            support_email: appIdResponse?.support_info?.email,
            baseRecommendedArsPrice: undefined,
            recommendedArsPrice: undefined,
            recommendedLatamPrice: undefined,
            regionalStatus: undefined
        }

        if(appData.publisher != "El publisher" && !appData.support_email.includes('@')){
            // Si el mail no incluye una @, es porque lo cargó mal
            !appData.support_url ? appData.support_url = appData.support_email : ""
            appData.support_email = "";

        }

        const nearestOption = regionalPricingOptionsLatam.reduce((prev, curr) => Math.abs(curr - appData.baseUsdPrice) < Math.abs(prev - appData.baseUsdPrice) ? curr : prev);

        const baseRecommendedArsPrice = regionalPricingChartLatam
            .filter(item => item.usdPrice == nearestOption)
            .map(item => item.argPrice)[0];

        const recommendedArsPrice = regionalPricingChartLatam
            .filter(item => item.usdPrice == nearestOption)
            .map(item => item.argPrice)[0] * (100 - appData.discount) / 100;
            

        appData.recommendedArsPrice = recommendedArsPrice;
        appData.baseRecommendedArsPrice = baseRecommendedArsPrice;

        const pppPrice = regionalPricingChartLatamPPP
            .filter(item => item.usdPrice == nearestOption)
            .map(item => item.argPrice)[0] * (100 - appData.discount) / 100;
        appData.pppPrice = pppPrice;

        // Tiene el mismo precio que en Estados Unidos
        if (appData.arsPrice == appData.usdPrice) {
            appData.regionalDifference = 0;
            appData.regionalStatus = "expensive"
        }

        // Está más caro que lo esperado
        if (appData.arsPrice > appData.recommendedArsPrice && appData.arsPrice != appData.usdPrice ) {
            appData.regionalDifference = Math.round((parseFloat((appData.arsPrice - appData.recommendedArsPrice)) / appData.recommendedArsPrice) * 100);
            appData.regionalDifference <= 25 ? appData.regionalStatus = "fair" : appData.regionalStatus = "semifair";
        }
        else if (appData.arsPrice < appData.recommendedArsPrice) {
            appData.regionalDifference = Math.round((parseFloat((appData.recommendedArsPrice - appData.arsPrice)) / appData.recommendedArsPrice) * 100);
            appData.regionalDifference <= 25 ? appData.regionalStatus = "fair" : appData.regionalStatus = "cheap";
        }
        else if (appData.arsPrice == appData.recommendedArsPrice) {
            appData.regionalStatus = "fair";
            appData.regionalDifference = 0;
        }

        // Excellent: precio dentro del 20% del PPP
        if (appData.pppPrice && appData.regionalStatus !== "expensive") {
            const pppDifference = Math.abs(appData.arsPrice - appData.pppPrice) / appData.pppPrice;
            if (pppDifference <= 0.20) {
                appData.regionalStatus = "excellent";
                appData.pppDifference = Math.round(pppDifference * 100);
            }
        }

        renderRegionalIndicator(appData, exchangeRate);
        if(walletBalance < appData.arsPrice && localStorage.getItem('metodo-de-pago') != "steamcito-cotizacion-crypto"){
            renderCryptoPrice(appData)
        }
        return appData;

    }
}



const renderCryptoPrice = async (appData) => {
    await getUsdExchangeRate();
    let cryptoPriceHidden = localStorage.getItem('ocultar-crypto');
    if (cryptoPriceHidden == "ocultar") {
        return;
    }

    let exchangeRate = JSON.parse(localStorage.getItem('steamcito-cotizacion-tarjeta'))?.rate;
    if(!exchangeRate){
        return
    }
    let staticExchangeRate = exchangeRate;

    provinceTaxes &&
    provinceTaxes.forEach(tax => {
        exchangeRate += parseFloat((staticExchangeRate * tax.value / 100).toFixed(2));
    })

    let cryptoExchangeRate = JSON.parse(localStorage.getItem('steamcito-cotizacion-crypto')).rate;
    let cryptoExchangeRateDate = JSON.parse(localStorage.getItem('steamcito-cotizacion-crypto')).rateDateProvided;
    let cardPrice = (appData.arsPrice * exchangeRate).toFixed(2)
    let cryptoPrice = (appData.arsPrice * cryptoExchangeRate).toFixed(2)
    let difference = (appData.arsPrice * exchangeRate - appData.arsPrice * cryptoExchangeRate).toFixed(2);

    let arqExchangeRateDate = JSON.parse(localStorage.getItem('steamcito-cotizacion-arq'))?.rateDateProvided;
    let arqExchangeRate = ARQ_EXCHANGE_RATE;
    let staticArqExchangeRate = arqExchangeRate;
    provinceTaxes &&
    provinceTaxes.forEach(tax => {
        arqExchangeRate += parseFloat((staticArqExchangeRate * tax.value / 100).toFixed(2));
    })
    let isUsingArq = (localStorage.getItem('metodo-de-pago') || "steamcito-cotizacion-tarjeta") == "steamcito-cotizacion-arq";
    let showGiftPill = localStorage.getItem('ocultar-arq-welcome-banner') != 'ocultar';

    if(cryptoExchangeRate > exchangeRate){
        // console.log("Retorno");
        return;
    }

    let gamePurchaseAreas = document.querySelectorAll('.game_area_purchase_game_wrapper .game_area_purchase_game');
    if(!gamePurchaseAreas.length){
        return;
    }

    gamePurchaseAreas.forEach((gamePurchaseArea, index) => {
        let isFirstEdition = index === 0;

        let editionPriceElement = gamePurchaseArea.querySelector('[data-price-final]');
        let editionArsPrice = editionPriceElement ? parseFloat(editionPriceElement.dataset.priceFinal) / 100 : appData.arsPrice;
        let editionCardPrice = (editionArsPrice * exchangeRate).toFixed(2);
        let arqPrice = (editionArsPrice * arqExchangeRate).toFixed(2);
        let arqSavings = (editionCardPrice - arqPrice).toFixed(2);

        let CryptoPriceContainer = isFirstEdition
        ?
        `<a class="steamcito_saving_tip_url" href="https://steamcito.com.ar/mejor-metodo-de-pago-steam-argentina" target="_blank">

            <div class="steamcito_saving_tip ${isUsingArq ? 'steamcito_saving_tip--compact' : ''}">
                <span class="steamcito_saving_tip_close">X</span>

                <span class="steamcito_saving_tip_arq_logo">
                    <img src="${chrome.runtime.getURL("emojis/arq-logo.svg")}" alt="ARQ" />
                </span>

                <div class="steamcito_saving_tip_text">

                    ${isUsingArq
                        ?
                        `<p class="steamcito_saving_tip_text_main">
                            <span class="steamcito_saving_tip_best_label">Precio final pagando con ARQ al mejor precio posible ✓</span>
                        </p>`
                        :
                        `<p class="steamcito_saving_tip_text_main">
                            <span class="steamcito_saving_tip_green">Precio pagando con ARQ · ${numberToString(arqPrice)}</span>
                            <br>
                            <span class="steamcito_saving_tip_amount">
                                Ahorrás ${numberToString(arqSavings)}
                            </span>

                        </p>`
                    }

                </div>



                ${showGiftPill
                    ?
                    `<span class="steamcito_saving_tip_gift_pill">
                        🎁 Beneficio extra: 5 USD de regalo
                    </span>`
                    :
                    ""
                }

            </div>
        </a>
        `
        :
        `<a class="steamcito_saving_tip_url" href="https://steamcito.com.ar/mejor-metodo-de-pago-steam-argentina" target="_blank">

            <div class="steamcito_saving_tip steamcito_saving_tip--minified">

                <p class="steamcito_saving_tip_text_main steamcito_saving_tip_text_main--minified">
                    ${isUsingArq
                        ?
                        `<span class="steamcito_saving_tip_best_label">Precio final pagando con ARQ al mejor precio posible ✓</span>`
                        :
                        `<span class="steamcito_saving_tip_green">Precio pagando con ARQ · ${numberToString(arqPrice)}</span>
                        <span class="steamcito_saving_tip_amount">Ahorrás ${numberToString(arqSavings)}</span>`
                    }
                </p>

                ${showGiftPill
                    ?
                    `<span class="steamcito_saving_tip_gift_pill">
                        🎁 Beneficio extra: 5 USD de regalo
                    </span>`
                    :
                    ""
                }

            </div>
        </a>
        `;

        gamePurchaseArea.insertAdjacentHTML('beforebegin', CryptoPriceContainer);
    });

    let savingTipCloseButton = document.querySelector('.steamcito_saving_tip_close');
    let savingTipElements = document.querySelectorAll('.steamcito_saving_tip_url');
    if(savingTipCloseButton){
        savingTipCloseButton.addEventListener('click', (e) =>{
            e.preventDefault();
            localStorage.setItem('ocultar-crypto','ocultar');
            savingTipElements[0] && savingTipElements[0].insertAdjacentHTML('beforebegin','<span>Podés habilitar la opción nuevamente desde el Menú de Opciones -> Tips de Ahorro</span><br><br>')
            savingTipElements.forEach(el => el.remove());
        })
    }

   }

const renderExchangeIndicator = (exchangeRate,exchangeRateDate,exchangeRateCrypto,exchangeRateCryptoDate,exchangeRateMep,exchangeRateMepDate,tarjetaTax,cryptoTax,mepTax,exchangeRateArq) => {
    if (indicatorStyle == "barra-oculta") {
        return;
    }

    let sidebar = document.querySelector('.rightcol.game_meta_data');

    let paymentMethod = localStorage.getItem('metodo-de-pago') || "steamcito-cotizacion-tarjeta";

    let staticExchangeRate = exchangeRate;
    let staticExchangeRateArq = exchangeRateArq;

    provinceTaxes &&
    provinceTaxes.forEach(tax => {
        exchangeRate += parseFloat((staticExchangeRate * tax.value / 100).toFixed(2));
        exchangeRateArq += parseFloat((staticExchangeRateArq * tax.value / 100).toFixed(2));
    })

    let container = `
        <div class="block responsive_apppage_details_right heading heading_steamcito_3">
            <p>Cotización del dólar</p>
            <span>por Steamcito</span>
        </div>

        <div class="block responsive_apppage_details_right recommendation_reasons regional-meter-wrapper cotizacion-wrapper ${indicatorStyle} content_steamcito_3">


            <p class="reason for dolar_tarjeta">
                <span class="name-span steamcito-dolar-title">Otras tarjetas ${paymentMethod == "steamcito-cotizacion-tarjeta" ? `<span class="steamcito-selected-tag">Seleccionado</span>` : ""}</span>
                <br>
                <span class="name-span steamcito-dolar-rate">1 USD ≈ ${exchangeRate.toFixed(2)} ARS</span>
                <br>
                <span class="name-smaller">
                   ${tarjetaTax ? `Incluye ${tarjetaTax}% de cargos extra. (${exchangeRateDate}) ` : ""}  <br>
                   Aplica a  tarjetas emitidas en Argentina.
                </span>
            </p>

            <p class="reason for dolar_arq">
                <span class="name-span steamcito-dolar-title">Tarjeta ARQ Local <span class="steamcito-cheapest-tag">Mejor precio</span>${paymentMethod == "steamcito-cotizacion-arq" ? `<span class="steamcito-selected-tag">Seleccionado</span>` : ""}</span>
                <br>
                <span class="name-span steamcito-dolar-rate">1 USD ≈ ${exchangeRateArq.toFixed(2)} ARS</span>
                <br>
                <span class="name-smaller">
                   Sin cargos extra. <br>
                   Aplica pagando con tu tarjeta local de ARQ.
                </span>
            </p>

            <div class="DRM_notice">
                <div>
                    <a href="https://steamcito.com.ar/mejor-metodo-de-pago-steam-argentina?ref=steamcito-cotizaciones" target="_blank">Guía paso a paso para pagar sin cargos extra en Steam con tu tarjeta local de ARQ.</a>
                </div>
            </div>

        </div>



    `;

    sidebar.insertAdjacentHTML('afterbegin', container);

    let dolarTarjetaItem = document.querySelector('.dolar_tarjeta');
    let dolarCryptoItem = document.querySelector('.dolar_crypto');
    let dolarMepItem = document.querySelector('.dolar_mep');
    let dolarArqItem = document.querySelector('.dolar_arq');

    dolarTarjetaItem && dolarTarjetaItem.addEventListener('click', () => {changePaymentMethodState('steamcito-cotizacion-tarjeta');window.location.reload()} )

    dolarCryptoItem && dolarCryptoItem.addEventListener('click', () => {changePaymentMethodState('steamcito-cotizacion-crypto');window.location.reload()} )

    dolarMepItem && dolarMepItem.addEventListener('click', () => {changePaymentMethodState('steamcito-cotizacion-mep');window.location.reload()} )

    dolarArqItem && dolarArqItem.addEventListener('click', () => {changePaymentMethodState('steamcito-cotizacion-arq');window.location.reload()} )
}


const renderPriceIndicators = (appData) => {
    return(`
        <p class="reason info">
            Precio sugerido para Argentina <br><span class="regional-meter-price">ARS$ ${appData.recommendedArsPrice.toFixed(2)}</span>
            ${appData.discount != 0 
                ?
                `<span class="regional-meter-price steamcito-strikethrough-price">ARS$ ${appData.baseRecommendedArsPrice}</span>`
                :
                ""
            }
        </p>
        <hr>
        <p class="reason info">
            Precio actual en Argentina<br><span class="regional-meter-price">ARS$ ${appData.arsPrice.toFixed(2)} </span>
            ${appData.discount != 0 
                ?
                `<span class="regional-meter-price steamcito-strikethrough-price">ARS$ ${appData.baseArsPrice.toFixed(2)}</span>`
                :
                ""
            }
        </p> 
        <hr>
        <p class="reason info">
            Precio actual en Estados Unidos<br><span class="regional-meter-price-us">USD$ ${appData.usdPrice} </span> 
            ${appData.discount != 0 
                ?
                `<span class="steamcito-strikethrough-price">USD$ ${appData.baseUsdPrice} </span>`
                :
                ""
            }
        </p>     
    `)
}


const renderRegionalIndicator = (appData, exchangeRate) => {
    if (indicatorStyle == "barra-oculta") {
        return;
    }
    
    let sidebar = document.querySelector('.rightcol.game_meta_data');

    let container =
        `
    <div class="block responsive_apppage_details_right heading heading_steamcito_1">
        <p>Análisis de precio regional</p>    
        <span>por Steamcito</span>
    
    </div>
    <div class="block responsive_apppage_details_right recommendation_reasons regional-meter-wrapper ${indicatorStyle} content_steamcito_1">
        <div class="regional-meter-container">
            <div class="regional-meter-bar regional-meter-bar--expensive ${appData.regionalStatus == "expensive" && "regional-meter-bar--selected"}">
                <span>No tiene</span>
            </div>
            <div class="regional-meter-bar regional-meter-bar--semifair ${appData.regionalStatus == "semifair" && "regional-meter-bar--selected"}">
                <span>Elevado</span>
            </div>
            <div class="regional-meter-bar regional-meter-bar--fair ${appData.regionalStatus == "fair" && "regional-meter-bar--selected"}">
                <span>Bueno</span>
            </div>
            <div class="regional-meter-bar regional-meter-bar--cheap ${appData.regionalStatus == "cheap" && "regional-meter-bar--selected"}">
                <span>Muy bueno</span>
            </div>
            <div class="regional-meter-bar regional-meter-bar--excellent ${appData.regionalStatus == "excellent" && "regional-meter-bar--selected"}">
                <span>Increíble</span>
            </div>
        </div>

        ${appData.usdPrice == appData.arsPrice && (appData.support_email || appData.support_url)
            ?
            `<span class="notify-publisher-button green-steamcito-button">Solicitar precio regional</span>`
            : 
            ""
        }

        <hr>
        ${appData.regionalStatus == "expensive"
            ?
            `
        <p class="reason against">
            <span class="name-span">${appData.name}</span> no tiene precio regional.
        </p>

        <hr>
        <p class="reason against">
        <span class="name-span"> ${appData.publisher}</span> todavía no cargó un precio para nuestra región.
        </p>
        <hr>
        ${renderPriceIndicators(appData)}

        `
            : ""
        }


        ${appData.regionalStatus == "semifair"
            ?
            `
        <p class="reason against">
            <span class="name-span">${appData.name}</span> tiene un precio regional relativamente alto.
        </p>
        <hr>
        <p class="reason against">
        <span class="name-span"> ${appData.publisher}</span> cargó un precio <span class="regional-meter-reason--orange">${appData.regionalDifference}% más caro</span> que lo sugerido en nuestra región.
        </p>
        <hr>
        ${renderPriceIndicators(appData)}

        `
        : 
        ""
        }
        

        ${appData.regionalStatus == "fair"
            ?
            `
        <p class="reason for">
        
        <span class="name-span">${appData.name}</span> tiene un precio regional relativamente accesible.
        </p>
        <hr>


            ${appData.arsPrice > appData.recommendedArsPrice && appData.regionalDifference != 1
                ?
                `
            <p class="reason info">
                <span class="name-span"> ${appData.publisher}</span> cargó un precio <span class="regional-meter-reason--yellow">${appData.regionalDifference}% más caro</span> que lo sugerido en nuestra región.
            </p>
            <hr>                
            `
                :
                ""
            }

            ${appData.arsPrice < appData.recommendedArsPrice && appData.regionalDifference != 0  && appData.regionalDifference != 1
                ?
                `
            <p class="reason for">
                <span class="name-span"> ${appData.publisher}</span> cargó un precio <span class="regional-meter-reason--yellow">${appData.regionalDifference}% más barato</span> que lo sugerido en nuestra región.
            </p>
            <hr>                
            `
                :
                ""
            }

            ${appData.arsPrice == appData.recommendedArsPrice || appData.regionalDifference == 1
                ?
                `
            <p class="reason for">
                <span class="name-span"> ${appData.publisher}</span> cargó el precio sugerido por Valve.
            </p>
            <hr>                
            `
                :
                ""
            }
            ${renderPriceIndicators(appData)}




        `
            : ""
        }

        ${appData.regionalStatus == "excellent"
            ?
            `
        <p class="reason for">
        <span class="name-span">${appData.name}</span> tiene un precio regional extraordinario.
        </p>
        <hr>
        <p class="reason for">
        <span class="name-span">${appData.publisher}</span> cargó un precio basado en el índice de paridad de poder adquisitivo para nuestra región.
        <br><br>
        ${admirePublisher(appData.publisher)}
        </p>
        <hr>
        ${renderPriceIndicators(appData)}

        `
            : ""
        }

        ${appData.regionalStatus == "cheap"
            ?
            `
        <p class="reason for">
        <span class="name-span">${appData.name}</span> tiene un precio regional relativamente barato.<br>

        </p>
        <hr>
        <p class="reason info">
        <span class="name-span">${appData.publisher}</span> cargó un precio <span class="regional-meter-reason--green">${appData.regionalDifference}% más bajo </span> que el sugerido por Valve.<br><br> ¡Te quiero mucho ${appData.publisher}!
        </p>
        <hr>
        ${renderPriceIndicators(appData)}

        `
            : ""
        }

        <p class="regional-meter-disclaimer">Análisis basado en la <a href="https://partner.steamgames.com/pricing/explorer" target="_blank">herramienta oficial de fijación de precios regionales de Valve.</a></p>

    </div>

    ${appData.usdPrice == appData.arsPrice && (appData.support_email || appData.support_url)
        ?
        `
        <div class="notify-publisher-popup notify-publisher-popup--hidden">
            <span class="publisher-popup-close-button">X</span>

            <div class="contact-method-container">
                <h5>Medio de contacto oficial</h5>  
                <div class="publisher-popup-flex-container">
                    ${appData.support_email 
                        ? `<p class="publisher-email">${appData.support_email}</p>`
                        : `<a target=_blank href="${appData.support_url}">${appData.support_url}</a> &nbsp; (${appData.publisher} no brinda un mail de contacto público)`
                    }  
                    ${appData.support_email ? `<button class="copiar-texto-steamcito green-steamcito-button" type="button" data-clipboard="publisher-email">Copiar</button>` : ""}
                </div>

            </div>

            <hr>

            <div class="email-template-container">
                
                ${appData.support_email ? 
                `<div class="email-template-container-subheader">
                    <h5>Asunto</h5> 
                    <div class="publisher-popup-flex-container">
                        <p class="publisher-subject">Question about new regional pricing on ${appData.name}</p> 
                        <button class="copiar-texto-steamcito green-steamcito-button" type="button" data-clipboard="publisher-subject">Copiar</button>
                    </div>
                </div>
                <hr>

                `
                :
                ""
                }

                


                <div class="email-template-container-subheader">
                    <div class="publisher-popup-flex-container">
                        <h5>Cuerpo del Mensaje</h5>
                        <button class="copiar-texto-steamcito green-steamcito-button" type="button" data-clipboard="email-template">Copiar</button>
                    </div>

                </div>
                <p class="email-template">
                    Hi there! <br>
                    <br>

                    I'm a Steam user from Argentina and wanted to bring something to your attention. In 2023, Steam introduced a new LATAM region which includes many countries in Latin America such as mine, and also added suggested prices to make games more affordable while boosting sales.
                    <br><br>                 

                    Currently, ${appData.name} doesn't have regional pricing here. Would you consider setting a price for our region when you get a chance? This would be greatly appreciated by players across Latin America! <br><br>

                    Kind regards,
                </p>
            </div>
        </div>

        `

        :
            ""
    }

    `
    sidebar.insertAdjacentHTML('afterbegin', container);

    if(appData.usdPrice == appData.arsPrice  && (appData.support_email || appData.support_url)){

        let clipboardHandlers = document.querySelectorAll('.copiar-texto-steamcito');
        clipboardHandlers.forEach(handler => {
            let valueToCopy = document.querySelector(`.${handler.dataset.clipboard}`)
            handler.addEventListener('click', () => {
                navigator.clipboard.writeText(valueToCopy.innerText);
                handler.innerText = '✔ ¡Copiado! '
                setTimeout( () => {
                    handler.innerText = "Copiar"
                },3000)
            })
        })

        let modal = document.querySelector('.notify-publisher-popup');
        let openModalButton = document.querySelector('.notify-publisher-button');
        let closeModalButton = document.querySelector('.publisher-popup-close-button');
        openModalButton.addEventListener('click', () => modal.classList.toggle('notify-publisher-popup--hidden'));
        

        closeModalButton.addEventListener('click', () => modal.classList.toggle('notify-publisher-popup--hidden'))
    }




}

getExchangeRate();
isFromArgentina();

const appData = getAppData(url);
getAppPricing(appData);
