function getTotalTaxes(){
    function reducer(total,num){
        return total+num;
    }
    let taxesValues = taxes.map(tax => tax.value);
    let totalTaxes = (1 + (taxesValues.reduce(reducer)/100)).toFixed(2);
    return totalTaxes;
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
    return parseFloat(number.innerText.slice(positionArs).replace(".","").replace(",","."));
}

function numberToString(number){
    return `ARS$ ${number}`.replace('.',',');
}

function isInsideString(element,string){
    return element.innerText.indexOf(string) != -1 ? true : false;
}


function showUpdate(){
    chrome.storage.local.get(['justUpdated'], function(result) {

        // Si es la primera vez que se abre desde la actualización
        if(result.justUpdated == 1) {
            let header = document.querySelector('#global_header');
            let changelogUrl = 'https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/changelog.html'
            let funcionalidadesUrl = 'https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/#howto'
            let newVersion = chrome.runtime.getManifest().version;

            let updateAdvice = `
                <div class="actualizacion-steamcito">
                    <p>${emojiMate} ¡Steamcito se actualizó correctamente a la versión ${newVersion}! 
                        <a href="${changelogUrl}" target="_blank">¿Qué hay de nuevo?</a>
                        <a href="${funcionalidadesUrl}" target="_blank">¿Cómo funciona Steamcito?</a>
                    </p> 
                </div>
            `;
            
            header.insertAdjacentHTML('afterend',updateAdvice);
            chrome.storage.local.set({justUpdated: 0});
      } 
    });
}