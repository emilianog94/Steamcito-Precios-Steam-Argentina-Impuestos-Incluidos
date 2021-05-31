
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
            let contenedorTotal = transaction.querySelector('.wht_total');
            contenedorTotal.innerHTML += `<b>(Precio Steam)</b> <br><br> ${steamizar(stringToNumber(walletValue))} <br> ${argentinizar(calcularImpuestos(stringToNumber(ccValue)))}`;
        } 
        
        // One-Method Purchase
        else{
            const paymentType = transaction.querySelector('.wth_payment');
            if( paymentType.innerText.indexOf('MasterCard') == -1 && paymentType.innerText.indexOf('Visa') == -1 ){
                transaction.classList.add('wallet-purchase');
            } else{
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

const showDevolucionHtml = () => {
    const html = 
    `<div class="aviso-devolucion">
        <div class="left">
            <p>En 2022 AFIP te devolverá el 35% de tus compras realizadas con tarjetas de crédito y débito correspondientes al año fiscal 2021. <b>(RG AFIP Nº 4815/2020)</b></p>
            <div class="botones">
                <span class="calculo-primario">CALCULAR DEVOLUCIÓN AÑO FISCAL 2021</span>
                <span class="calculo-secundario">CALCULAR DEVOLUCIÓN 2020</span>
            </div>
        </div>

        <div class="right">

        </div>

    </div>`;
    
    const mainDiv = document.querySelector('#main_content');
    mainDiv.insertAdjacentHTML('afterbegin',html);
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
