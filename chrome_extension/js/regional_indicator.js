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
            appData.regionalStatus = "expensive";
            appData.regionalDifference = parseInt((appData.arsPrice / appData.recommendedArsPrice) * 100);
        }
        else if (appData.arsPrice < appData.recommendedArsPrice) {
            appData.regionalStatus = "cheap";
            appData.regionalDifference = parseInt((appData.recommendedArsPrice / appData.arsPrice) * 100);
        }
        else if (appData.arsPrice == appData.recommendedArsPrice) {
            appData.regionalStatus = "fair";
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

const appId = getAppId(url);
getAppData(appId);
