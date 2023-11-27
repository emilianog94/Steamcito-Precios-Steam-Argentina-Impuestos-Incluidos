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

const criticizePublisher = (margin,publisher) => {

    const phrases = [
        `¿Lo trajiste de Dubai, ${publisher}?`,
        `¡Te fuiste al pasto ${publisher}!`,
        `¡Te zarpaste mal ${publisher}!`,
        `Epa, ¿qué rompimos ${publisher}?`,
        `¡Saladito ${publisher}!`,
        `¡Se te fue la mano ${publisher}!`,
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
    let exchangeRate = JSON.parse(localStorage.getItem('steamcito-cotizacion')).rate;
    let exchangeRateDate = JSON.parse(localStorage.getItem('steamcito-cotizacion')).rateDateProvided;

    renderExchangeIndicator(exchangeRate,exchangeRateDate)

}



const getAppPricing = async (appInitialData) => {
    await getUsdExchangeRate();
    const { type, id } = appInitialData;
    let appEndpoint = `https://store.steampowered.com/api/appdetails?appids=${id}`;
    let subEndpoint = `https://store.steampowered.com/api/packagedetails?packageids=${id}`

    const appIdFetch = await fetch(`${type == "app" ? `${appEndpoint}&cc=us` : `${subEndpoint}&cc=us`}`, { credentials: 'omit' })

    const appIdFetchArg = await fetch(`${type == "app" ? `${appEndpoint}&cc=ar` : `${subEndpoint}&cc=ar`}`, { credentials: 'omit' })

    let exchangeRate = JSON.parse(localStorage.getItem('steamcito-cotizacion')).rate;

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
            baseUsdPrice: (appIdResponse[type == "sub" ? "price" : "price_overview"].initial) / 100,
            baseArsPrice: (appIdArgResponse[type == "sub" ? "price" : "price_overview"].initial) / 100,
            usdPrice: (appIdResponse[type == "sub" ? "price" : "price_overview"].final) / 100,
            arsPrice: (appIdArgResponse[type == "sub" ? "price" : "price_overview"].final) / 100,
            recommendedArsPrice: undefined,
            regionalStatus: undefined
        }

        const nearestOption = regionalPricingOptionsLatam.reduce((prev, curr) => Math.abs(curr - appData.baseUsdPrice) < Math.abs(prev - appData.baseUsdPrice) ? curr : prev);

        const recommendedArsPrice = regionalPricingChartLatam
            .filter(item => item.usdPrice == nearestOption)
            .map(item => item.argPrice)[0] * (100 - appData.discount) / 100;


        appData.recommendedArsPrice = recommendedArsPrice;

        // Está más caro que lo esperado
        if (appData.arsPrice > appData.recommendedArsPrice) {
            appData.regionalDifference = Math.round((parseFloat((appData.arsPrice - appData.recommendedArsPrice)) / appData.recommendedArsPrice) * 100);
            appData.regionalDifference <= 35 ? appData.regionalStatus = "fair" : appData.regionalStatus = "expensive";
        }
        else if (appData.arsPrice < appData.recommendedArsPrice) {
            appData.regionalDifference = Math.round((parseFloat((appData.recommendedArsPrice - appData.arsPrice)) / appData.recommendedArsPrice) * 100);
            appData.regionalDifference <= 25 ? appData.regionalStatus = "fair" : appData.regionalStatus = "cheap";
        }
        else if (appData.arsPrice == appData.recommendedArsPrice) {
            appData.regionalStatus = "fair";
            appData.regionalDifference = 0;
        }

        renderRegionalIndicator(appData,exchangeRate);

        return appData;

    }
}


const renderExchangeIndicator = (exchangeRate,exchangeRateDate) => {
    let sidebar = document.querySelector('.rightcol.game_meta_data');

    let staticExchangeRate = exchangeRate;

    standardTaxes &&
    standardTaxes.forEach(tax => {
        exchangeRate += parseFloat((staticExchangeRate * tax.value / 100).toFixed(2));
    })

    provinceTaxes &&
    provinceTaxes.forEach(tax => {
        exchangeRate += parseFloat((staticExchangeRate * tax.value / 100).toFixed(2));
    })

    let container = `
        <div class="block responsive_apppage_details_right heading">
            Cotización del dólar de Steamcito
        </div>

        <div class="block responsive_apppage_details_right recommendation_reasons regional-meter-wrapper cotizacion-wrapper ${indicatorStyle}">
            <p class="reason info">
                <span class="name-span">1 USD ≈ ${exchangeRate} ARS</span>
                <br>
                <span class="name-smaller">
                    Resultado de dólar oficial más impuestos<br><br>
                    <span class="name-white">- Cotización promedio del dólar oficial <a href="https://www.bcra.gob.ar/PublicacionesEstadisticas/Tipo_de_cambio_minorista.asp"target="_blank">(BCRA)</a></span> <br>
                    1 USD = ${staticExchangeRate}
                    ${exchangeRateDate ? `<span class="name-smaller">(Cierre del ${exchangeRateDate})</span>` : ""}
                    <br><br>
                    <span class="name-white">- Total de impuestos nacionales y provinciales</span><br>
                    ${((totalTaxes - 1) * 100).toFixed(2)}% ${localStorage.getItem('national-tax') || localStorage.getItem('province-tax') ? "(Personalizados por vos)" : ""}
                    ${localStorage.getItem('national-tax') ? `<br>Cargaste ${localStorage.getItem('national-tax')}% de impuestos nacionales` : ""}
                    ${localStorage.getItem('province-tax') ? `<br>Cargaste ${localStorage.getItem('province-tax')}% de impuestos provinciales` : ""}
                </span>
            </p>
        </div>
    
    `;

    sidebar.insertAdjacentHTML('afterbegin', DOMPurify.sanitize(container));
}


const renderRegionalIndicator = (appData,exchangeRate) => {
    let sidebar = document.querySelector('.rightcol.game_meta_data');

    let container =
        `

    <div class="block responsive_apppage_details_right heading">
        ¿Cómo es el precio regional?
    </div>
    <div class="block responsive_apppage_details_right recommendation_reasons regional-meter-wrapper ${indicatorStyle}">
        <div class="regional-meter-container">
            <div class="regional-meter-bar regional-meter-bar--cheap ${appData.regionalStatus == "cheap" && "regional-meter-bar--selected"}">
                <span>Barato</span>
            </div>
            <div class="regional-meter-bar regional-meter-bar--fair ${appData.regionalStatus == "fair" && "regional-meter-bar--selected"}">
                <span>Adecuado</span>
            </div>
            <div class="regional-meter-bar regional-meter-bar--expensive ${appData.regionalStatus == "expensive" && "regional-meter-bar--selected"}">
                <span>Caro</span>
            </div>
        </div>
        <hr>
        ${appData.regionalStatus == "expensive"
            ?
            `
        <p class="reason against">
            <span class="name-span">${appData.name}${appData.publisher != "El publisher" ? `, de ${appData.publisher},` : ""} </span> es <span class="regional-meter-reason--red">${appData.regionalDifference}%</span> más caro en Argentina que lo sugerido por Valve.
        </p>
        ${appData.usdPrice == appData.arsPrice 
            ?
                `<hr><p class="reason against">
                El precio en Argentina es igual al de Estados Unidos. Es posible que <span class="name-span">${appData.publisher}</span> se haya olvidado y lo corrija en el futuro.
                </p>`
            :   ``
        }
        <hr>
        <p class="reason info">
            Precio regional sugerido para Argentina <br><span class="regional-meter-price">ARS$ ${appData.recommendedArsPrice.toFixed(2)}</span>
        </p>
        <hr>
        <p class="reason info">
            Precio actual en Argentina<br><span class="regional-meter-price">ARS$ ${appData.arsPrice.toFixed(2)} </span>
        </p> 
        <hr>
        <p class="reason info">
            Precio actual en Estados Unidos<br><span>USD$ ${appData.usdPrice} </span> 
        </p> 
        `
            : ""
        }
        ${appData.regionalStatus == "fair"
            ?
            `
        <p class="reason for">
        
        <span class="name-span">${appData.name}</span> está a un precio accesible, siguiendo de cerca la sugerencia de precios de Valve.
        
        ${appData.publisher != "El publisher" ? `<span class="name-span">¡Gracias ${appData.publisher}!</span>` : ""}
        </p>
        <hr>
        ${appData.arsPrice > appData.recommendedArsPrice
                ?
                `
            <p class="reason info">
                El precio es solamente <span class="regional-meter-reason--yellow">${appData.regionalDifference}%</span> más caro que lo sugerido. 
            </p>
            <hr>                
            `
                :
                ""
            }
            ${appData.arsPrice < appData.recommendedArsPrice && appData.regionalDifference != 0
                ?
                `
            <p class="reason info">
                Está <span class="regional-meter-reason--yellow">${appData.regionalDifference}%</span> más barato que lo sugerido. 
            </p>
            <hr>                
            `
                :
                ""
            }
        <p class="reason info">
            Precio regional sugerido para Argentina <br><span class="regional-meter-price">ARS$ ${appData.recommendedArsPrice.toFixed(2)}</span>
        </p>
        <hr>
        <p class="reason info">
            Precio actual en Argentina<br><span class="regional-meter-price">ARS$ ${appData.arsPrice.toFixed(2)} </span>
        </p> 
        <hr>
        <p class="reason info">
            Precio actual en Estados Unidos<br><span>USD$ ${appData.usdPrice} </span> 
        </p> 
        `
            : ""
        }
        ${appData.regionalStatus == "cheap"
            ?
            `
        <p class="reason for">
        <span class="name-span">${appData.name}</span> es <span class="regional-meter-reason--green">${appData.regionalDifference}%</span> más barato en Argentina que lo sugerido por Valve.<br>
        </p>
        <hr>
        <p class="reason info">
        <span class="name-span">${appData.publisher}</span> cargó manualmente un precio más barato que el sugerido. <br><br> ¡Te quiero mucho ${appData.publisher}!
        </p>
        <hr>
        <p class="reason info">
            Precio mínimo sugerido para Argentina <br><span class="regional-meter-price">ARS$ ${appData.recommendedArsPrice.toFixed(2)}</span>
        </p>
        <hr>
        <p class="reason info">
            Precio actual en Argentina<br><span class="regional-meter-price">ARS$ ${appData.arsPrice.toFixed(2)} </span>
        </p> 
        <hr>
        <p class="reason info">
            Precio actual en Estados Unidos<br><span>USD$ ${appData.usdPrice} </span> 
        </p> 
        `
            : ""
        }
        <div class="DRM_notice">
            <div>
                Cálculo hecho por Steamcito en base a la
                <a href="https://steamcito.com.ar/precios-regionales-steam-argentina" target="_blank">Valve Regional Pricing Recommendation</a>
            </div>
        </div>
    </div>
    `
    sidebar.insertAdjacentHTML('afterbegin', DOMPurify.sanitize(container));
}

if(isStoreDolarized()){
    getExchangeRate();
}

const appData = getAppData(url);
getAppPricing(appData);
