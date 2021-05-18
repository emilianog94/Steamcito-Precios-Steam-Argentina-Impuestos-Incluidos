let contenedorPrecioFinal = document.querySelector("#review_total_value");
let otrosContenedores = document.querySelectorAll(".approvetxn_lineitem_row .approvetxn_lineitem_price,#review_subtotal_value,#review_taxes_value");
let enlace = document.querySelector("#purchase_button_container_bottom a");

function setearPrecios(){
    if(enlace.href.indexOf("addfunds") == -1){
        contenedorPrecioFinal.innerHTML += emojiWallet;
        otrosContenedores.forEach(contenedor => {
            // Verifico si el billing original es en ARS
            if(contenedor.innerHTML.indexOf("ARS$") != -1)  contenedor.innerHTML += emojiWallet;
        });
    }
    else{
        contenedorPrecioFinal.innerHTML = argentinizar(calcularImpuestos(stringToNumber(contenedorPrecioFinal)));
        otrosContenedores.forEach(contenedor => {
            if(contenedor.innerHTML.indexOf("ARS$") != -1) contenedor.innerHTML = argentinizar(calcularImpuestos(stringToNumber(contenedor)));
        });
    }
}


setearPrecios();