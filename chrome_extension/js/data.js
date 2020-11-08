const attributeName = "data-original-price";

const taxes = [
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
        name : "Impuesto a las ganancias - RG AFIP Nº 4815/2020",
        value : 35,
        moreInfo: "https://www.boletinoficial.gob.ar/detalleAviso/primera/235038/20200916"
    }
];

const priceContainers = `
        .discount_original_price:not([${attributeName}]), 
        .discount_final_price:not([${attributeName}]), 
        .game_purchase_price:not([${attributeName}]), 
        .game_area_dlc_price:not([${attributeName}]),
        [class*=salepreviewwidgets_StoreSalePriceBox]:not([${attributeName}]), 
        [class*=salepreviewwidgets_StoreOrignalPrice]:not([${attributeName}]), 
        .search_price:not([${attributeName}]), .regular_price:not([${attributeName}]), 
        .match_price:not([${attributeName}]), 
        .cart_item .price:not([${attributeName}])`;