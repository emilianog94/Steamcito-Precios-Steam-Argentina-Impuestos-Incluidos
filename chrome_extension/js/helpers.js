// Implementar una actualización manual de localStorage tras 24hs para fetchear impuestos de forma consistente.
async function getImpuestos(){
    if(!localStorage.hasOwnProperty('taxAmount')){
        let endpoint = "http://localhost:8000/steamcito/valor"; // https://emilianogioia.com.ar/steamcito/valor
        let response = await fetch(endpoint);
        let data = await response.text();
        localStorage.setItem('taxAmount',data);
        console.log(localStorage.getItem('taxAmount'));
    }
}

function impuestosFallback(){
    console.log("Hubo un error al conectar, acá va la fallback");
    localStorage.setItem('taxAmount',1.70);
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

function setEmojiMate(){
    let OSversion = window.navigator.userAgent;
    return OSversion.indexOf("NT 10.0") != -1 ? " 🧉" : `<span class="emojis mate"> A </span>`;
}

function setEmojiWallet(){
    let OSversion = window.navigator.userAgent;
    return OSversion.indexOf("NT 10.0") != -1 ? " 💲" : `<span class="emojis saldo"> B </span>`;
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