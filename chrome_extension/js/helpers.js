function getTotalTaxes(){
    function reducer(total,num){
        return total+num;
    }
    let taxesValues = taxes.map(tax => tax.value);
    let provinceTaxesValues = provinceTaxes.map(tax => tax.value);
    let totalTaxes = (1 + (taxesValues.reduce(reducer)/100) + (provinceTaxesValues.reduce(reducer)/100));

    return totalTaxes;
}

function calcularImpuestos(initialPrice){
    let finalPrice = initialPrice;
    standardTaxes.forEach(tax => {
        finalPrice += parseFloat( (initialPrice * tax.value/100).toFixed(2));
    })

    provinceTaxes.forEach(tax => {
        finalPrice += parseFloat( (initialPrice * tax.value/100).toFixed(2));
    })

    return finalPrice.toFixed(2);

}

function getBalance(){
    let walletBalanceContainer = document.querySelector("#header_wallet_balance");
    if(walletBalanceContainer){
        walletBalanceContainer.innerHTML += emojiWallet;
        return stringToNumber(walletBalanceContainer);
    }
    return 0;
}

function stringToNumber(number,positionArs = 5){

    // Comprobación para cuando a Steam le pinta cambiar el orden de las comas y decimales!
    const numero = number.innerText;
    if(numero){
        if( numero.indexOf(',') != -1  && numero.indexOf('.') != -1){
            if(numero.indexOf(',') < numero.indexOf('.')){
                const numeroArreglado = numero.replace(',','')
                return parseFloat(numeroArreglado.slice(positionArs));
            }
        }
    }

    if(numero){
        if( numero.indexOf(',') == -1){
            const numeroArreglado = numero;
            return parseFloat(numeroArreglado.slice(positionArs));
        }
    }


    if(positionArs != "none"){
        return parseFloat(number.innerText.slice(positionArs).replace(".","").replace(",","."));
    } else {
        return parseFloat(number.replace(".","").replace(",","."));
    }
}

function stringToNumber2(number,positionArs = 5){
    return parseFloat(number.slice(positionArs).replace(".","").replace(",","."));
}

function numberToString(number){
    return `ARS$ ${number}`.replace('.',',');
}

function numberToStringSub(number){
    return `${number}`.replace('.',',');
}

function isInsideString(element,string){
    return element.innerText.indexOf(string) != -1 ? true : false;
}

function argentinizar(contenedor,emoji = true){
    let emojiStatus = emoji ? emojiMate : "";
    return numberToString(contenedor) + emojiStatus;
}

function steamizar(contenedor,emoji = true){
    let emojiStatus = emoji ? emojiWallet : "";
    return numberToString(contenedor) + emojiStatus;
}

function showUpdate(){
    chrome.storage.local.get(['justUpdated'], function(result) {

        // Si es la primera vez que se abre desde la actualización
        if(result.justUpdated == 1) {
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
            
            header.insertAdjacentHTML('afterend',updateAdvice);
            chrome.storage.local.set({justUpdated: 0});
      } 
    });
}