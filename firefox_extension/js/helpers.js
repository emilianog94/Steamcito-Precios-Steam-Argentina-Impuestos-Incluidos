const attributeName = "data-original-price";

let standardTaxes = [
    {
        name: "Percepción de Impuesto a las Ganancias - RG AFIP Nº 5232/2022",
        value: 45,
        moreInfo: "https://www.boletinoficial.gob.ar/detalleAviso/primera/266506/20220714"
    },
    {
        name: "Impuesto PAIS - RG AFIP N° 4659/2020",
        value: 30,
        moreInfo: "https://www.boletinoficial.gob.ar/detalleAviso/primera/224404/20200107"
    },
    {
        name: "Percepción de Bienes Personales - RG AFIP Nº 5430/2023",
        value: 25,
        moreInfo: "https://www.boletinoficial.gob.ar/#!DetalleNorma/295840/20231010"
    }
];

let provinceTaxes = [
    {
        name: "Cargá los impuestos de tu provincia para que el precio sea más exacto.<br><a href='https://steamcito.com.ar/impuestos-hoy/#impuestos-provinciales' target='_blank'>Ver listado de impuestos provinciales en Steamcito</a>",
        value: 0
    }
]


let regionalPricingChart = [
    {
        usdPrice: 0.99,
        argPrice: 82.00
    },
    {
        usdPrice: 1.99,
        argPrice: 165.00
    },
    {
        usdPrice: 2.99,
        argPrice: 249.00
    },
    {
        usdPrice: 3.99,
        argPrice: 320.00
    },
    {
        usdPrice: 4.99,
        argPrice: 400.00
    },
    {
        usdPrice: 5.99,
        argPrice: 475.00
    },
    {
        usdPrice: 6.99,
        argPrice: 550.00
    },
    {
        usdPrice: 7.99,
        argPrice: 620.00
    },
    {
        usdPrice: 8.99,
        argPrice: 700.00
    },
    {
        usdPrice: 9.99,
        argPrice: 765.00
    },
    {
        usdPrice: 10.99,
        argPrice: 835.00
    },
    {
        usdPrice: 11.99,
        argPrice: 900.00
    },
    {
        usdPrice: 12.99,
        argPrice: 970.00
    },
    {
        usdPrice: 13.99,
        argPrice: 1000.00
    },
    {
        usdPrice: 14.99,
        argPrice: 1050.00
    },
    {
        usdPrice: 15.99,
        argPrice: 1100.00
    },
    {
        usdPrice: 16.99,
        argPrice: 1200.00
    },
    {
        usdPrice: 17.99,
        argPrice: 1300.00
    },
    {
        usdPrice: 18.99,
        argPrice: 1350.00
    },
    {
        usdPrice: 18.99,
        argPrice: 1400.00
    },
    {
        usdPrice: 18.99,
        argPrice: 1350.00
    },
    {
        usdPrice: 19.99,
        argPrice: 1400.00
    },
    {
        usdPrice: 24.99,
        argPrice: 1750.00
    },
    {
        usdPrice: 29.99,
        argPrice: 2100.00
    },
    {
        usdPrice: 34.99,
        argPrice: 2400.00
    },
    {
        usdPrice: 39.99,
        argPrice: 2600.00
    },
    {
        usdPrice: 44.99,
        argPrice: 2850.00
    },
    {
        usdPrice: 49.99,
        argPrice: 3200.00
    },
    {
        usdPrice: 54.99,
        argPrice: 3700.00
    },
    {
        usdPrice: 59.99,
        argPrice: 3800.00
    },
    {
        usdPrice: 64.99,
        argPrice: 4100.00
    },
    {
        usdPrice: 69.99,
        argPrice: 4500.00
    },
    {
        usdPrice: 74.99,
        argPrice: 4750.00
    },
    {
        usdPrice: 79.99,
        argPrice: 5100.00
    },
    {
        usdPrice: 84.99,
        argPrice: 5400.00
    },
    {
        usdPrice: 89.99,
        argPrice: 5700.00
    },
    {
        usdPrice: 89.99,
        argPrice: 5700.00
    },
    {
        usdPrice: 89.99,
        argPrice: 5700.00
    },
    {
        usdPrice: 99.99,
        argPrice: 6400.00
    },
    {
        usdPrice: 119.99,
        argPrice: 7600.00
    },
    {
        usdPrice: 129.99,
        argPrice: 8200.00
    },
    {
        usdPrice: 149.99,
        argPrice: 9500.00
    },
    {
        usdPrice: 199.99,
        argPrice: 13000.00
    },
]

const regionalPricingOptions = regionalPricingChart.map(item => item.usdPrice)


function setProvinceTax() {
    if (localStorage.hasOwnProperty('province-tax')) {
        let taxValue = localStorage.getItem('province-tax');

        if (taxValue == 0) {
            return [{
                name: "No se seleccionaron impuestos provinciales. <a href='https://steamcito.com.ar/impuestos-hoy#impuestos-provinciales' target='_blank'>(Listado de impuestos provinciales)</a>",
                value: taxValue
            }]
        }

        return [{
            name: "Impuestos Provinciales personalizados por vos",
            value: taxValue
        }]
    }

    return provinceTaxes;
}

function setNationalTax() {

    if (localStorage.hasOwnProperty('national-tax')) {
        let taxValue = localStorage.getItem('national-tax');

        if (taxValue == 0) return standardTaxes;

        standardTaxes = [{
            name: "Impuestos Nacionales personalizados por vos",
            value: taxValue
        }];
    }

    // Si no existen custom taxes nacionales en localStorage, agarrar taxes oficiales
    return standardTaxes;
}

let taxes = setNationalTax();
provinceTaxes = setProvinceTax();

const priceContainers = `
        .discount_original_price:not([${attributeName}]), 
        .discount_final_price:not([${attributeName}]), 
        .game_purchase_price:not([${attributeName}]), 
        [class*=salepreviewwidgets_StoreSalePriceBox]:not([${attributeName}]), 
        [class*=salepreviewwidgets_StoreOrignalPrice]:not([${attributeName}]), 
        [class*=salepreviewwidgets_StoreOriginalPrice]:not([${attributeName}]), 
        .search_price:not([${attributeName}]), 
        .regular_price:not([${attributeName}]), 
        .match_price:not([${attributeName}]), 
        .cart_item .price:not([${attributeName}]),
        .price.bundle_final_package_price:not([${attributeName}]),
        .price.bundle_final_price_with_discount:not([${attributeName}]),
        .bundle_savings:not([${attributeName}]),
        .package_info_block_content .price:not([${attributeName}]),
        #package_savings_bar .savings:not([${attributeName}]),
        .promo_item_list .price span:not([${attributeName}]),
        .apphub_StorePrice .price:not([${attributeName}]),
        .item_def_price:not([${attributeName}]),
        .match_subtitle:not([${attributeName}]),
        .regional-meter-price:not([${attributeName}])        
        `;


function getTotalTaxes() {
    function reducer(total, num) {
        return total + num;
    }
    let taxesValues = taxes.map(tax => tax.value);
    let provinceTaxesValues = provinceTaxes.map(tax => tax.value);
    let totalTaxes = (1 + (taxesValues.reduce(reducer) / 100) + (provinceTaxesValues.reduce(reducer) / 100));

    return totalTaxes;
}

function calcularImpuestos(initialPrice) {
    let finalPrice = initialPrice;
    standardTaxes &&
        standardTaxes.forEach(tax => {
            finalPrice += parseFloat((initialPrice * tax.value / 100).toFixed(2));
        })

    provinceTaxes &&
        provinceTaxes.forEach(tax => {
            finalPrice += parseFloat((initialPrice * tax.value / 100).toFixed(2));
        })

    return finalPrice.toFixed(2);

}

function getBalance() {
    let walletBalanceContainer = document.querySelector("#header_wallet_balance");

    if (localStorage.getItem('manual-mode') == "wallet") {
        return 9999999;
    } else if (localStorage.getItem('manual-mode') == "mate") {
        return 0;
    }
    else if (walletBalanceContainer) {
        walletBalanceContainer.innerHTML = DOMPurify.sanitize(walletBalanceContainer.innerHTML += emojiWallet);
        return stringToNumber(walletBalanceContainer);
    }
    return 0;
}

function stringToNumber(number, positionArs = 5) {

    // Comprobación para cuando a Steam le pinta cambiar el orden de las comas y decimales!
    const numero = number.innerText;
    if (numero) {
        if (numero.indexOf(',') != -1 && numero.indexOf('.') != -1) {
            if (numero.indexOf(',') < numero.indexOf('.')) {
                const numeroArreglado = numero.replace(',', '')
                return parseFloat(numeroArreglado.slice(positionArs));
            }
        }
    }

    if (numero) {
        if (numero.indexOf(',') == -1) {
            const numeroArreglado = numero;
            return parseFloat(numeroArreglado.slice(positionArs));
        }
    }


    if (positionArs != "none") {
        return parseFloat(number.innerText.slice(positionArs).replace(".", "").replace(",", "."));
    } else {
        return parseFloat(number.replace(".", "").replace(",", "."));
    }
}

function stringToNumber2(number, positionArs = 5) {
    return parseFloat(number.slice(positionArs).replace(".", "").replace(",", "."));
}

function numberToString(number) {
    if (number) {
        let parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return 'ARS$ ' + parts.join(",");
    }
}

function numberToStringSub(number) {
    return `${number}`.replace('.', ',');
}

function isInsideString(element, string) {
    return element.innerText.indexOf(string) != -1 ? true : false;
}

function argentinizar(contenedor, emoji = true) {
    let emojiStatus = emoji ? emojiMate : "";
    return numberToString(contenedor) + emojiStatus;
}

function steamizar(contenedor, emoji = true) {
    let emojiStatus = emoji ? emojiWallet : "";
    return numberToString(contenedor) + emojiStatus;
}

const currentChange = "minor"; // patch | minor | major

function showUpdate() {
    chrome.storage.local.get(['justUpdated'], function (result) {

        // Si es la primera vez que se abre desde la actualización
        if (result.justUpdated == 1 && currentChange == "major") {
            let header = document.querySelector('#global_header');
            let changelogUrl = 'https://steamcito.com.ar/changelog'
            let newVersion = chrome.runtime.getManifest().version;

            let updateAdvice = `
                <div class="actualizacion-steamcito">
                    <p>${emojiMate} ¡Steamcito se actualizó correctamente a la versión ${newVersion}! 
                        <a href="${changelogUrl}" target="_blank">¿Qué hay de nuevo?</a>
                    </p> 
                </div>
            `;

            header.insertAdjacentHTML('afterend', DOMPurify.sanitize(updateAdvice));
            chrome.storage.local.set({ justUpdated: 0 });
        }
    });
}