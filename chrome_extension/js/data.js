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

const cabaTaxes = [
    {
        name : "Impuesto de Sellos - LEY N° 6382/2021 - Art. 447 Bis",
        value : 1.2,
        moreInfo: "https://www.agip.gob.ar/normativa/leyes/2020/ley-n-6382--2020---codigo-fiscal-con-vigencia-2021"
    },
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

function setTax(){

    // Si no existe ningún medio de pago en el localStorage, defaultea
    if(!localStorage.hasOwnProperty('steamcito-payment') && !localStorage.hasOwnProperty('steamcito-caba')){
        localStorage.setItem('steamcito-payment','standard');
        localStorage.setItem('steamcito-caba','desactivado');
        selectPayment.value="desactivado";
        selectCaba.value="desactivado";
        return standardTaxes;
    } 

    if(localStorage.getItem('steamcito-caba') == "activado"){
        return cabaTaxes;
    }

    if(localStorage.getItem('steamcito-payment') == 'standard'){
        return standardTaxes;
    }

    return standardTaxes;
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
        .apphub_StorePrice .price:not([${attributeName}]),
        .item_def_price:not([${attributeName}])
        `;
