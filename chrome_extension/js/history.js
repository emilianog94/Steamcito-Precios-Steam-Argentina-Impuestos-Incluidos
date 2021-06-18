
function getTransactions(){
    const transactions = document.querySelectorAll('.wallet_table_row:not(.processed)');
    setTransactionType(transactions);
}
function setTransactionType(transactions){
    transactions.forEach(transaction => {



        transaction.classList.add('processed');

        // Evito que las transacciones con moneda extranjera sean convertidas
        if(transaction.innerText.indexOf('USD') != -1 ){
            return;
        }

        const payments = transaction.querySelectorAll('.wht_type .wth_payment div');



        // Split Purchase
        if(payments.length){
            console.log(payments);
            transaction.classList.add('split-purchase');
            let walletValue = transaction.querySelector('.wht_type .wth_payment > div:first-child');
            let ccValue = transaction.querySelector('.wht_type .wth_payment > div:last-child');
            transaction.dataset.originalValue = ccValue.innerText;
            let contenedorTotal = transaction.querySelector('.wht_total');
            contenedorTotal.innerHTML += `<b>(Precio Steam)</b> <br><br> ${steamizar(stringToNumber(walletValue))} <br> ${argentinizar(calcularImpuestos(stringToNumber(ccValue)))}`;
        } 
        
        // One-Method Purchase
        else{
            const paymentType = transaction.querySelector('.wht_type .wth_payment');

            // Este código previene que si tenés una digital card redemption se rompa todo
            if(transaction.querySelector('.wht_total').innerText == ""){
                return;
            } else{
                if( paymentType.innerText.indexOf('MasterCard') == -1 && paymentType.innerText.indexOf('Visa') == -1 ){
                    transaction.classList.add('wallet-purchase');
                } else{
                    transaction.dataset.originalValue = transaction.querySelector('.wht_total').innerText;
                    transaction.classList.add('cc-purchase');
                }
            }


        }
        calculateTotals(transaction);

    })
}

function calculateTotals(transaction){
    if(transaction.classList.contains('cc-purchase')){
        const precio = transaction.querySelector('.wht_total');
        precio.innerText = argentinizar(calcularImpuestos(stringToNumber(precio)));
    }

    else if(transaction.classList.contains('wallet-purchase')){
        const precio = transaction.querySelector('.wht_total');
        precio.innerHTML += emojiWallet;
    }
}
getTransactions();


let currentYear = new Date().getFullYear();
let lastYear = currentYear - 1;

const totalByYear = (e) => {
    const pickedYear = e.currentTarget.dataset.year;
    checkForReload(pickedYear);
}

function checkForReload(pickedYear){
    console.log(pickedYear);
    const lastDate = document.querySelector(".wallet_history_table tbody > tr.wallet_table_row:nth-last-child(2) td[class*=date]").innerText;
    const year = parseInt(lastDate.slice(-4));
    const refreshButton = document.querySelector('#load_more_button');
    const loadingIcon = document.querySelector('#wallet_history_loading');
    let rightContainer = document.querySelector('.right');


    // Condición para ver si es posible que hayan más transacciones del año seleccionado
    if(pickedYear == year || pickedYear < year ){
        refreshButton.click();
        rightContainer.classList.add('loading');
        let interval = setInterval(function(){
            // Chequeo si cargaron las transacciones necesarias
            if(loadingIcon.style.display == "none"){
                if(pickedYear == year || pickedYear < year ){
                    clearInterval(interval);
                    checkForReload(pickedYear);
                }
            }
        },500);
    } else{
        rightContainer.classList.remove('loading');
        showCalculoHtml(pickedYear);
    }

}

function showCalculoHtml(pickedYear){
    // Agarro todas las transacciones elegibles (Split y CC)
    let transactionElements = Array.from(document.querySelectorAll('.split-purchase:not(.picked),.cc-purchase:not(.picked)'));
    transactionElements.forEach(transaction => transaction.classList.add('picked'));
    let total = transactionElements

    // Mapeo creando un objeto con los valores que me interesan
    .map(transaction => {
    return {
            date: transaction.querySelector('.wht_date').innerText,
            status: transaction.querySelector('*[class*=refunded]') ? "refunded" : "valid",
            originalValue: stringToNumber2(transaction.dataset.originalValue)
        }
    })

    // Filtro para eliminar las refundeadas y las de años anteriores
    .filter(transaction => transaction.status === "valid" && transaction.date.includes(pickedYear))

    // Sumo el total de los montos originales 
    .reduce( (acumulado,item) => acumulado + item.originalValue , 0);

    let totalImpuestos =  (total * totalTaxes) - total;
    let totalDevolucion = total * 0.35;
    let totalFinal = total + totalImpuestos;
    let rightContainer = document.querySelector('.right');
    let leftContainer = document.querySelector('.left');

    let htmlRenderRight = `
        <h4>Cálculos de compras del ${pickedYear} al día de hoy</h4>
        <div class="results-table">
            <div>
                <p>Total pagado a Steam</p>
                <span>${numberToString(total.toFixed(2))}</span>
            </div> 
            <div>
                <p>Total de impuestos pagados al Estado</p>
                <span>${numberToString(totalImpuestos.toFixed(2))}</span>
            </div>
            <div>
                <p>Total final</p>
                <span>${numberToString(totalFinal.toFixed(2))}</span>
            </div>                
            <div>
                <p>Devolución del 35% correspondiente</p>
                <span class="bold">${numberToString(totalDevolucion.toFixed(2))}</span>
            </div>
        </div>
    `;

    rightContainer.insertAdjacentHTML('afterbegin',htmlRenderRight);
    leftContainer.innerHTML = `
    <h3>¡Cálculo listo!</h3>
    <p class="monto">En el año ${parseInt(pickedYear) + 1} te corresponde una devolución de <b>${numberToString(totalDevolucion.toFixed(2))}</b> por todas tus compras realizadas en Steam durante el ${parseInt(pickedYear)} </p>
    <a href="https://steamcito.com.ar/devolucion-35-impuesto-ganancias" target="_blank">Solicitar la devolución</a>
    `
}


const showDevolucionHtml = () => {
    const html = 
    `<div class="aviso-devolucion">
        <div class="left">
            <p>En ${currentYear + 1} AFIP te devolverá el 35% de tus compras realizadas con tarjetas de crédito y débito correspondientes al año ${currentYear}. <b>(RG AFIP Nº 4815/2020)</b></p>
            <div class="botones">
                <span class="calculo-primario" data-year="${currentYear}">CALCULAR DEVOLUCIÓN DE COMPRAS DEL ${currentYear}</span>
                <span class="calculo-secundario" data-year="${lastYear}">CALCULAR DEVOLUCIÓN ${lastYear}</span>
            </div>
        </div>
        <div class="right">
            <div class="loader-icon"> 
                <img src="https://store.akamai.steamstatic.com/public/images/login/throbber.gif"/>
                <p> Cargando transacciones del año elegido...
            </div>
        </div>
    </div>`;
    
    const mainDiv = document.querySelector('#main_content');
    mainDiv.insertAdjacentHTML('afterbegin',html);

    const botonCalcular = document.querySelector('.calculo-primario');
    botonCalcular.addEventListener('click',totalByYear);

    const botonCalcular2 = document.querySelector('.calculo-secundario');
    botonCalcular2.addEventListener('click',totalByYear);
}
showDevolucionHtml();


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const transactionObserver = new MutationObserver(function(mutations, observer) {
    getTransactions();
});

transactionObserver.observe(document, {
  subtree: true,
  attributes: true
});
