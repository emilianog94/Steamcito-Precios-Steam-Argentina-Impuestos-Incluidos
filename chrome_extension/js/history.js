function getTransactions(){
    // Agarro todas las transacciones que todavía no fueron procesadas por la función
    const transactions = document.querySelectorAll('.wallet_table_row:not(.processed)');
    setTransactionType(transactions);
}

function setTransactionType(transactions){
    transactions.forEach(transaction => {
        transaction.classList.add('processed');

        // Evito que las transacciones con moneda extranjera sean tomadas en cuenta
        if(transaction.innerText.indexOf('USD') != -1 ){
            return;
        }

        // Obtengo la información de pago de la transacción
        const payments = transaction.querySelectorAll('.wht_type .wth_payment div');

        // Split Purchase
        if(payments.length){
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

            // Evito que las transacciones Digital Card Redemption sean tomadas en cuenta
            if(transaction.querySelector('.wht_total').innerText == ""){
                return;
            } 

            if( paymentType.innerText.indexOf('Master') == -1 && paymentType.innerText.indexOf('Visa') == -1 ){
                transaction.classList.add('wallet-purchase');
            } else{
                transaction.dataset.originalValue = transaction.querySelector('.wht_total').innerText;
                transaction.classList.add('cc-purchase');
            }
        }
        calculateTotals(transaction);
    })
}

function calculateTotals(transaction){
    if(transaction.classList.contains('cc-purchase')){
        const precio = transaction.querySelector('.wht_total');
        precio.innerHTML = argentinizar(calcularImpuestos(stringToNumber(precio)));
    }

    else if(transaction.classList.contains('wallet-purchase')){
        const precio = transaction.querySelector('.wht_total');
        precio.innerHTML += emojiWallet;
    }
}

// Corro toda la lógica declarada arriba
getTransactions();

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const transactionObserver = new MutationObserver(function(mutations, observer) {
    getTransactions();
});

transactionObserver.observe(document, {
  subtree: true,
  attributes: true
});




// Lógica de la calculadora de impuestos

let currentYear = new Date().getFullYear();
let lastYear = currentYear - 1;

const lastDayNumber = new Date(currentYear , 3, 0).getDate();
const lastDay =  new Date(currentYear , 3, 0).getTime(); // Último día para solicitar devolución
const currentDay = new Date().getTime();
console.log(lastDay);
console.log(currentDay);

const totalByYear = (e) => {
    const pickedYear = e.currentTarget.dataset.year;
    checkForReload(pickedYear);
}

function checkForReload(pickedYear){
    const lastDate = document.querySelector(".wallet_history_table tbody > tr.wallet_table_row:nth-last-child(2) td[class*=date]").innerText;
    // Obtengo el año de la última transacción visible
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

    // Filtro para no tomar en cuenta las refundeadas y las de años anteriores
    .filter(transaction => transaction.status === "valid" && transaction.date.includes(pickedYear))

    // Sumo el total de los montos originales 
    .reduce( (acumulado,item) => acumulado + item.originalValue , 0);

    let totalImpuestos =  (total * totalTaxes) - total;
    let totalDevolucion = total * 0.45;
    let totalFinal = total + totalImpuestos;
    let rightContainer = document.querySelector('.right');
    let leftContainer = document.querySelector('.left');

    let htmlRenderRight = `
        <h4>Pagos del ${pickedYear} con tarjetas de débito/crédito</h4>
        <div class="results-table">
            <div>
                <p>Plata que llegó a Steam</p>
                <span>${numberToString(total.toFixed(2))}</span>
            </div> 
            <div>
                <p>Plata que llegó al Estado Nacional</p>
                <span>${numberToString(totalImpuestos.toFixed(2))}</span>
            </div>
            <div>
                <p>Total que pagaste</p>
                <span>${numberToString(totalFinal.toFixed(2))}</span>
            </div>                
            <div>
                <p>Devolución del 45% correspondiente</p>
                <span class="bold">${numberToString(totalDevolucion.toFixed(2))}</span>
            </div>
        </div>
    `;

    rightContainer.insertAdjacentHTML('afterbegin',htmlRenderRight);
    leftContainer.innerHTML = `
    <h3>Te corresponden ${numberToString(totalDevolucion.toFixed(2))}</h3>
    <p class="monto">
    Este cálculo se realizó teniendo en cuenta todos los pagos con tarjeta de crédito y débito del ${parseInt(pickedYear)}. Se excluyeron todos los reembolsos y compras con saldo Steam Wallet. <br><br>
    En el año ${parseInt(pickedYear) + 1} te corresponde una devolución de <b>${numberToString(totalDevolucion.toFixed(2))}</b>.
    </p>
    <a href="https://steamcito.com.ar/devolucion-35-impuesto-ganancias" target="_blank">Guía de Devolución en Steamcito.com.ar</a>
    `
}


const showDevolucionHtml = () => {
    const html = 
    `<div class="aviso-devolucion">
        <div class="left">

            <p>
                ${currentDay > lastDay 
                ? 
                    `El ${currentYear + 1} podés solicitar que AFIP te devuelva el 45% de tus compras realizadas con tarjetas de crédito y débito que realizaste en el transcurso de este año. <b>(RG AFIP Nº 5232/2022)</b> ` 
                : 
                   `Tenés tiempo hasta el ${lastDayNumber} de Marzo de ${currentYear} para solicitar que AFIP te devuelva el 45% de tus compras realizadas con tarjetas de crédito y débito del ${currentYear-1}`
                }

            </p>
            <div class="botones">
                ${currentDay > lastDay
                ?
                    `<span class="calculo-primario" data-year="${currentYear}">CALCULAR DEVOLUCIÓN DEL PERÍODO ${currentYear}</span>`
                :
                    `<span class="calculo-secundario" data-year="${lastYear}">CALCULAR DEVOLUCIÓN DEL PERÍODO ${lastYear}</span>`
                }
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
    botonCalcular && botonCalcular.addEventListener('click',totalByYear);

    const botonCalcular2 = document.querySelector('.calculo-secundario');
    botonCalcular2 && botonCalcular2.addEventListener('click',totalByYear);
}

showDevolucionHtml();


