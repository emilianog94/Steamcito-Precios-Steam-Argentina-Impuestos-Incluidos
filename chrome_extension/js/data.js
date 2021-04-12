const attributeName = "data-original-price";

let standardTaxes = [
    {
        name : "Retención del Impuesto a las ganancias - RG AFIP Nº 4815/2020",
        value : 35,
        moreInfo: "https://www.boletinoficial.gob.ar/detalleAviso/primera/235038/20200916"
    },
    {
        name : "Impuesto PAIS - RG AFIP N° 4659/2020",
        value : 30,
        moreInfo: "http://biblioteca.afip.gob.ar/dcp/REAG01004659_2020_01_06"
    }
];

function setTax(){

    if(localStorage.hasOwnProperty('custom-tax')){
        let taxValue = localStorage.getItem('custom-tax');
        
        if(taxValue == 0) return standardTaxes;

        standardTaxes = [{
            name: "Impuestos Personalizados por el usuario",
            value: taxValue
        }];
    }

    // Si no existen custom taxes en localStorage, agarrar taxes oficiales
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
