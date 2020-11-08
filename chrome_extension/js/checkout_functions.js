
// Observo cambios en atributos Display de #review_tab
let reviewTab = document.querySelector("#review_tab");
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const observerCheckout = new MutationObserver(function(mutations, observer) {
    changeReviewTab();
});

observerCheckout.observe(reviewTab, {
  subtree: false,
  attributes: true,
});


function convertTotals(paymentType, walletAmount = "", ccAmount = ""){
    let totals = document.querySelectorAll('.cart_totals_area #cart_price_summary, .cart_totals_area #cart_price_total');

    totals.forEach(total => {
        let totalAmount = total.querySelector(".price");
        totalAmount.dataset.originalPrice =  totalAmount.innerText;    
        if(paymentType == "cc") {
            let newAmount = numberToString((stringToNumber(totalAmount) * totalTaxes).toFixed(2));
            totalAmount.insertAdjacentHTML('beforebegin',`<span class="new-amount">${newAmount} 🧉</span>`);
        }    
        else if (paymentType == "wallet"){
            totalAmount.innerText = totalAmount.innerText + " 💲";
        }

        else if (paymentType == "mixto"){
            totalAmount.insertAdjacentHTML('beforebegin',`<span class="new-amount">${walletAmount.innerText} + ${ccAmount} 🧉 </span>`);
        }
    })
}

function resetReviewTab(){
    let newAmounts = document.querySelectorAll(".new-amount");
    newAmounts.forEach(amount => amount.remove());
}

function changeReviewTab(){
    let reviewTab = document.querySelector("#review_tab");
        // Si entramos a la review tab
        if(reviewTab.style.display == "block"){
            let creditCardPayment = reviewTab.querySelector("#payment_method_review_row_provider");
            let walletPayment = reviewTab.querySelector("#payment_method_review_row_steam_account");

            // Caso 1: Pago Mixto
            if(creditCardPayment.style.display == "block" && walletPayment.style.display == "block"){
                let ccAmount = numberToString((stringToNumber(creditCardPayment.querySelector(".payment_method_total")) * totalTaxes).toFixed(2));
                creditCardPayment.querySelector(".payment_method_total").insertAdjacentHTML('beforebegin',`<span class="new-amount">${ccAmount} 🧉</span>`);
                let walletAmount = walletPayment.querySelector(".payment_method_total");
                walletAmount.innerText = walletAmount.innerText + " 💲";
                convertTotals("mixto",walletAmount,ccAmount);
            } 

            // Caso 2: Pago con Tarjeta
            else if(creditCardPayment.style.display == "block"){
                convertTotals("cc");
            }

            // Caso 3: Pago con Wallet
            else if (walletPayment.style.display == "block"){
                convertTotals("wallet");
            }
        } 

        else if (reviewTab.style.display == "none"){
            resetReviewTab();
        }
}

