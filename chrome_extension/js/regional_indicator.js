const url = window.location.pathname;

function evaluateDate(){
    if(localStorage.getItem('steamcito-cotizacion')){
        let exchangeRateJSON = JSON.parse(localStorage.getItem('steamcito-cotizacion'))

        let savedTimestamp = parseInt(exchangeRateJSON.date) / 1000;
        let currentTimestamp = Date.now()/1000;
        let difference = currentTimestamp - savedTimestamp;

        if(difference >= 86400){
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
            exchangeRate = parseFloat(exchangeRate.replace(',','.'));
            
            let exchangeRateJSON = {
                rate : exchangeRate,
                date: Date.now()
            }

    
        localStorage.setItem('steamcito-cotizacion', JSON.stringify(exchangeRateJSON));
        return exchangeRate;
        }
        catch(err){
            return 367.72
        }


    } else{
        let exchangeRateJSON = JSON.parse(localStorage.getItem('steamcito-cotizacion'))
        return parseFloat(exchangeRateJSON.rate)
    }
}



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
        `¡Se te fue la mano ${publisher}!`
    ]

    const randomChoice = Math.floor(Math.random() * phrases.length);
    if(margin >= 290){
        return `<br><br><span>${phrases[randomChoice]}</span>`
    }
    return "";
}


const getAppPricing = async (appInitialData) => {
    const { type, id } = appInitialData;
    let appEndpoint = `/api/appdetails?appids=${id}`;
    let subEndpoint = `/api/packagedetails?packageids=${id}`

    const appIdFetch = await fetch(`${type == "app" ? `${appEndpoint}&cc=us` : `${subEndpoint}&cc=us`}`, { credentials: 'omit' })

    const appIdFetchArg = await fetch(`${type == "app" ? `${appEndpoint}&cc=ar` : `${subEndpoint}&cc=ar`}`, { credentials: 'omit' })

    let exchangeRate = await getUsdExchangeRate();
    

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
            recommendedLatamPrice: undefined,
            regionalStatus: undefined
        }

        const nearestOption = regionalPricingOptions.reduce((prev, curr) => Math.abs(curr - appData.baseUsdPrice) < Math.abs(prev - appData.baseUsdPrice) ? curr : prev);

        const recommendedArsPrice = regionalPricingChart
            .filter(item => item.usdPrice == nearestOption)
            .map(item => item.argPrice)[0] * (100 - appData.discount) / 100;
            
        const nearestOptionLatam = regionalPricingOptionsLatam.reduce((prev, curr) => Math.abs(curr - appData.baseUsdPrice) < Math.abs(prev - appData.baseUsdPrice) ? curr : prev);

        const recommendedArsPriceLatam = regionalPricingChartLatam
            .filter(item => item.usdPrice == nearestOptionLatam)
            .map(item => item.argPrice)[0] * (100 - appData.discount) / 100;

        appData.recommendedArsPrice = recommendedArsPrice;
        appData.recommendedLatamPrice = recommendedArsPriceLatam.toFixed(2);

        // Está más caro que lo esperado
        if (appData.arsPrice > appData.recommendedArsPrice) {
            appData.regionalDifference = Math.round((parseFloat((appData.arsPrice - appData.recommendedArsPrice)) / appData.recommendedArsPrice) * 100);
            appData.regionalDifference <= 20 ? appData.regionalStatus = "fair" : appData.regionalStatus = "expensive";
        }
        else if (appData.arsPrice < appData.recommendedArsPrice) {
            appData.regionalDifference = Math.round((parseFloat((appData.recommendedArsPrice - appData.arsPrice)) / appData.recommendedArsPrice) * 100);
            appData.regionalDifference <= 20 ? appData.regionalStatus = "fair" : appData.regionalStatus = "cheap";
        }
        else if (appData.arsPrice == appData.recommendedArsPrice) {
            appData.regionalStatus = "fair";
            appData.regionalDifference = 0;
        }

        renderRegionalIndicator(appData, exchangeRate);

        return appData;

    } else {
    }
}


const renderRegionalIndicator = (appData, exchangeRate) => {
    let sidebar = document.querySelector('.rightcol.game_meta_data');

    let container =
        `

    <div class="block responsive_apppage_details_right heading">
        ¿Cómo cambiará el precio el 20/11?
    </div>


    <div class="block responsive_apppage_details_right recommendation_reasons regional-meter-wrapper">
        <p class="reason info">
        <span class="name-span">${appData.publisher != "El publisher" ? `${appData.publisher}` : "El publisher"} </span>debe decidir si <span class="name-span">"${appData.name}"</span> adopta el nuevo precio sugerido por Valve.
        </p>
        <hr>
        
        <p class="reason for">
            Precio sugerido por Valve desde el 20/11<br>
            <span>
                USD$ ${appData.recommendedLatamPrice}💲
                (${numberToString((appData.recommendedLatamPrice * exchangeRate * 2).toFixed(2))}🧉)
            </span>
        </p> 
        <hr>
        <p class="reason against">
            Si se ignora el precio sugerido<br>
            <span>
                USD$ ${appData.usdPrice}💲
                (${numberToString((appData.usdPrice * exchangeRate * 2).toFixed(2))}🧉) 
            </span> 
        </p> 
        <div class="DRM_notice">
            <div>
                Cálculo hecho por Steamcito en base a la 
                <a href="https://steamcito.com.ar/precios-regionales-steam-argentina" target="_blank">Valve Regional Pricing Recommendation.</a>
                <br>
                Cotización de hoy: 1 USD = ${exchangeRate} Pesos
            </div>
        </div>


    </div>

    

    <div class="block responsive_apppage_details_right heading">
        ¿Cómo es el precio regional?
    </div>
    <div class="block responsive_apppage_details_right recommendation_reasons regional-meter-wrapper">
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
        <span class="name-span">${appData.name}${appData.publisher != "El publisher" ? `, de ${appData.publisher},` : ""} </span> es <span class="regional-meter-reason--red">${appData.regionalDifference}%</span> más caro en Argentina que lo sugerido por Valve. ${criticizePublisher(appData.regionalDifference,appData.publisher)}
        </p>
        <hr>
        <p class="reason info">
            Precio regional sugerido para Argentina <br><span class="regional-meter-price">ARS$ ${appData.recommendedArsPrice}</span>
        </p>
        <hr>
        <p class="reason info">
            Precio actual en Argentina<br><span class="regional-meter-price">ARS$ ${appData.arsPrice} </span>
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
        
        <span class="name-span">${appData.name}</span> está a un precio accesible en Argentina, siguiendo de cerca la sugerencia de precios de Valve.
        
        ${appData.publisher != "El publisher" ? `<span class="name-span">¡Gracias ${appData.publisher}!</span>` : ""}
        </p>
        <hr>


        ${appData.arsPrice > appData.recommendedArsPrice
                ?
                `
            <p class="reason info">
                Está <span class="regional-meter-reason--yellow">${appData.regionalDifference}%</span> más caro que lo sugerido. 
            </p>
            <hr>                
            `
                :
                ""
            }

            ${appData.arsPrice < appData.recommendedArsPrice
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
            Precio regional sugerido para Argentina <br><span class="regional-meter-price">ARS$ ${appData.recommendedArsPrice}</span>
        </p>
        <hr>
        <p class="reason info">
            Precio actual en Argentina<br><span class="regional-meter-price">ARS$ ${appData.arsPrice} </span>
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
        <span class="name-span">${appData.name}</span> es <span class="regional-meter-reason--green">${appData.regionalDifference}%</span> más barato en Argentina que lo sugerido por Valve.
        </p>
        <hr>
        <p class="reason info">
        <span class="name-span">${appData.publisher}</span> olvidó actualizar el precio para Argentina o bien el precio actual tiene un bug.  
        </p>
        <hr>
        <p class="reason info">
            Precio mínimo sugerido para Argentina <br><span class="regional-meter-price">ARS$ ${appData.recommendedArsPrice}</span>
        </p>
        <hr>
        <p class="reason info">
            Precio actual en Argentina<br><span class="regional-meter-price">ARS$ ${appData.arsPrice} </span>
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
    sidebar.insertAdjacentHTML('afterbegin', container);
}

const appData = getAppData(url);
getAppPricing(appData);