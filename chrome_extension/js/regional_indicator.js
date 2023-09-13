const url = window.location.pathname;
console.log(regionalPricingChart);
console.log(regionalPricingOptions);

const getAppId = (url) => {
    let startingPosition = url.indexOf('/', 1);
    let endingPosition = url.indexOf('/', startingPosition + 1);
    let appId = url.slice(startingPosition + 1, endingPosition);
    console.log(`App id is ${appId}`);
    return appId;
}


const getAppData = async (appId) => {
    const appIdFetch = await fetch(`/api/appdetails?appids=${appId}&cc=us`, { credentials: 'omit' })
    const appIdFetchArg = await fetch(`/api/appdetails?appids=${appId}&cc=ar`, { credentials: 'omit' })

    let appIdResponse = await appIdFetch.json();
    let appIdArgResponse = await appIdFetchArg.json();


    console.log("la response de US es", appIdResponse);
    console.log("-----------")
    console.log("la response de AR es", appIdArgResponse);

    if (appIdResponse[appId].success && appIdArgResponse[appId].success) {
        appIdResponse = appIdResponse[appId].data;
        appIdArgResponse = appIdArgResponse[appId].data;

        const appData = {
            name: appIdResponse.name,
            publisher: appIdResponse.publishers[0],
            usdPrice: (appIdResponse.price_overview.final) / 100,
            // arsPrice: 11400,
            arsPrice: (appIdArgResponse.price_overview.final) / 100,
            recommendedArsPrice: undefined,
            regionalStatus: undefined
        }

        const nearestOption = regionalPricingOptions.reduce((prev, curr) => Math.abs(curr - appData.usdPrice) < Math.abs(prev - appData.usdPrice) ? curr : prev);
        console.log("Nearest option is", nearestOption);

        const recommendedArsPrice = regionalPricingChart
            .filter(item => item.usdPrice == nearestOption)
            .map(item => item.argPrice)[0];
        console.log(recommendedArsPrice);

        appData.recommendedArsPrice = recommendedArsPrice;

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
            appData.regionalStatus = "absolutely-fair";
            appData.regionalDifference = 0;
        }

        console.log(appIdResponse);
        console.log(appData);
        return appData;

    } else {
        console.log("falló el fetch");
        console.log(appIdResponse);
    }


    // Ejemplo para Packages
    // const subIdContainer = document.querySelector('form[name^="add_to_cart_"]');
    // const subId = subIdContainer.querySelector('input[name="subid"]').value;
    // console.log(subId);

    // fetch(`/api/packagedetails?packageids=${subId}&cc=us`, { credentials: 'omit' }).then(res => res.json()).then(res => console.log(res))
}


const renderRegionalIndicator = () => {
    let sidebar = document.querySelector('.rightcol.game_meta_data');

    let container =
        `
    <div class="block responsive_apppage_details_right heading">
        Medidor de precio regional
    </div>
    <div class="block responsive_apppage_details_right recommendation_reasons regional-meter-wrapper">
        <div class="regional-meter-container">
            <div class="regional-meter-bar regional-meter-bar--cheap">
                <span>Barato</span>
            </div>
            <div class="regional-meter-bar regional-meter-bar--fair">
                <span>Adecuado</span>
            </div>
            <div class="regional-meter-bar regional-meter-bar--expensive regional-meter-bar--selected">
                <span>Caro</span>
            </div>
        </div>
        <hr>
        <p class="reason against">
            Este juego es un <span class="regional-meter-reason--red">167%</span> más caro que la recomendación de precios regionales en pesos argentinos de Steam.
        </p>
        <hr>
        <p class="reason against">
            Steam recomienda a Bethesda Softworks poner Starfield a <span class="regional-meter-reason--green">$7.875,00🧉</span>  en vez de <span class="regional-meter-reason--red">$21.118,24</span>🧉
        </p>

        <div class="DRM_notice">
            <div>
                Cálculo realizado por Steamcito en base a la
                <a href="#">Valve Regional Pricing Recommendation</a>
            </div>
        </div>

    </div>
    `

    sidebar.insertAdjacentHTML('afterbegin', container);
}

const appId = getAppId(url);
getAppData(appId);
renderRegionalIndicator();
