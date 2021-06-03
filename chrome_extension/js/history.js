
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
            transaction.classList.add('split-purchase');
            let walletValue = transaction.querySelector('.wth_payment > div:first-child');
            let ccValue = transaction.querySelector('.wth_payment > div:last-child');
            transaction.dataset.originalValue = ccValue.innerText;
            let contenedorTotal = transaction.querySelector('.wht_total');
            contenedorTotal.innerHTML += `<b>(Precio Steam)</b> <br><br> ${steamizar(stringToNumber(walletValue))} <br> ${argentinizar(calcularImpuestos(stringToNumber(ccValue)))}`;
        } 
        
        // One-Method Purchase
        else{
            const paymentType = transaction.querySelector('.wth_payment');
            if( paymentType.innerText.indexOf('MasterCard') == -1 && paymentType.innerText.indexOf('Visa') == -1 ){
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
    const lastDate = document.querySelector(".wallet_history_table tbody > tr.wallet_table_row:nth-last-child(2) td[class*=date]").innerText;
    const year = parseInt(lastDate.slice(-4));
    const refreshButton = document.querySelector('#load_more_button');
    const loadingIcon = document.querySelector('#wallet_history_loading');
    if(year == pickedYear){
        console.log("Trayendo nuevas transacciones...");
        refreshButton.click();
        let interval = setInterval(function(){
            // Chequeo si cargaron las transacciones necesarias
            if(loadingIcon.style.display == "none"){
                clearInterval(interval);
                showCalculo(pickedYear);
            }
        },500);
    } else{
        showCalculo(pickedYear);
    }

}

function showCalculo(pickedYear){
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

    let totalConImpuestos =  (total * totalTaxes) - total;
    let totalDevolucion = total * 0.35;

    let html = document.querySelector('.right');
    html.classList.remove('not-defined');

    let htmlAno = html.querySelector('h4 span');
    htmlAno.innerText = pickedYear;

    let htmlTotal = html.querySelector('.results-table > div:nth-child(1) span');
    htmlTotal.innerText = numberToString(total.toFixed(2));

    let htmlConImpuestos = html.querySelector('.results-table > div:nth-child(2) span');
    htmlConImpuestos.innerText = numberToString(totalConImpuestos.toFixed(2));

    let htmlDevolucion = html.querySelector('.results-table > div:nth-child(3) span');
    htmlDevolucion.innerText = numberToString(totalDevolucion.toFixed(2));
}

const showDevolucionHtml = () => {
    const html = 
    `<div class="aviso-devolucion">
        <div class="left">
            <p>En ${currentYear + 1} AFIP te devolverá el 35% de tus compras realizadas con tarjetas de crédito y débito correspondientes al año fiscal ${currentYear}. <b>(RG AFIP Nº 4815/2020)</b></p>
            <div class="botones">
                <span class="calculo-primario" data-year="${currentYear}">CALCULAR DEVOLUCIÓN AÑO FISCAL ${currentYear}</span>
                <span class="calculo-secundario" data-year="${currentYear - 1}">CALCULAR DEVOLUCIÓN ${currentYear -1}</span>
            </div>
        </div>

        <div class="right not-defined">
            <h4>Cálculos Año Fiscal <span></span></h4>
            <div class="results-table">
                <div>
                    <p>Compras con tarjeta (Sin impuestos)</p>
                    <span></span>
                </div> 
                <div>
                    <p>Impuestos pagados</p>
                    <span></span>
                </div>
                <div>
                    <p>Devolución del 35% correspondiente</p>
                    <span class="bold"></span>
                </div>
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
