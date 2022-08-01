const attributeName = "data-original-price";

let standardTaxes = [
    {
        name : "Retención del Impuesto a las ganancias - RG AFIP Nº 4815/2020",
        value : 45,
        moreInfo: "https://www.boletinoficial.gob.ar/detalleAviso/primera/235038/20200916"
    },
    {
        name : "Impuesto PAIS - RG AFIP N° 4659/2020",
        value : 30,
        moreInfo: "http://biblioteca.afip.gob.ar/dcp/REAG01004659_2020_01_06"
    }
];

let provinceTaxes = [
    {
        name: "No se seleccionaron impuestos provinciales. <a href='https://steamcito.com.ar/impuestos-hoy#impuestos-provinciales' target='_blank'>(Listado de impuestos provinciales)</a>",
        value: 0  
    }
]

function setProvinceTax(){
    if(localStorage.hasOwnProperty('province-tax')){
        let taxValue = localStorage.getItem('province-tax');

        if(taxValue == 0){
            return [{
                name: "No se seleccionaron impuestos provinciales. <a href='https://steamcito.com.ar/impuestos-hoy#impuestos-provinciales' target='_blank'>(Listado de impuestos provinciales)</a>",
                value: taxValue            
            }]
        }

        return [{
            name: "Impuestos Provinciales personalizados por el usuario",
            value: taxValue            
        }]
    }

    return provinceTaxes;
}

function setNationalTax(){

    if(localStorage.hasOwnProperty('national-tax')){
        let taxValue = localStorage.getItem('national-tax');
        
        if(taxValue == 0) return standardTaxes;

        standardTaxes = [{
            name: "Impuestos Nacionales personalizados por el usuario",
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
        .item_def_price:not([${attributeName}])
        `;
