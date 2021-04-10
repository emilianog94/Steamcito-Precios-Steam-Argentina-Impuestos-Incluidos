
function getTransactions(){
    const transactions = document.querySelectorAll('.wallet_table_row:not(.processed)');
    setTransactionType(transactions);
}

function setTransactionType(transactions){
    transactions.forEach(transaction => {
        transaction.classList.add('processed');
        const payments = transaction.querySelectorAll('.wth_payment div');

        // Split Purchase
        if(payments.length){
            transaction.classList.add('split-purchase');
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
        precio.innerText = argentinizar(precio);
    }

    else if(transaction.classList.contains('wallet-purchase')){
        const precio = transaction.querySelector('.wht_total');
        precio.innerHTML += emojiWallet;
    }


}

getTransactions();


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const transactionObserver = new MutationObserver(function(mutations, observer) {
    getTransactions();
});

transactionObserver.observe(document, {
  subtree: true,
  attributes: true
});
