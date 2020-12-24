const attributeName = "data-original-price";

const standardTaxes = [
    {
        name : "IVA Servicios Digitales - RG AFIP N° 4240/2018",
        value : 21,
        moreInfo: "http://biblioteca.afip.gob.ar/dcp/REAG01004240_2018_05_11"
    },
    {
        name : "Impuesto PAIS - RG AFIP N° 4659/2020",
        value : 8,
        moreInfo: "http://biblioteca.afip.gob.ar/dcp/REAG01004659_2020_01_06"
    },
    {
        name : "Retención del Impuesto a las ganancias - RG AFIP Nº 4815/2020",
        value : 35,
        moreInfo: "https://www.boletinoficial.gob.ar/detalleAviso/primera/235038/20200916"
    }
];

const mpTaxes = [
    {
        name : "IVA Servicios Digitales - RG AFIP N° 4240/2018",
        value : 19.09,
        moreInfo: "http://biblioteca.afip.gob.ar/dcp/REAG01004240_2018_05_11"
    },
    {
        name : "Impuesto PAIS - RG AFIP N° 4659/2020",
        value : 7.27,
        moreInfo: "http://biblioteca.afip.gob.ar/dcp/REAG01004659_2020_01_06"
    },
    {
        name : "Retención del Impuesto a las ganancias - RG AFIP Nº 4815/2020",
        value : 31.82,
        moreInfo: "https://www.boletinoficial.gob.ar/detalleAviso/primera/235038/20200916"
    }
];

function setTax(){
    if(!localStorage.hasOwnProperty('steamcito-payment')){
        localStorage.setItem('steamcito-payment','standard');
        selectPayment.value="desactivado";
        return standardTaxes;
    } 
    
    if(localStorage.getItem('steamcito-payment') == 'standard'){
        return standardTaxes;
    }
    return mpTaxes;
}

let taxes = setTax();

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
        .apphub_StorePrice .price:not([${attributeName}])
        `;
