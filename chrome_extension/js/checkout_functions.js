MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const observerCart = new MutationObserver(function(mutations, observer) {
    isReviewTab();
});

observerCart.observe(document, {
  subtree: true,
  attributes: true
});

function PaymentMethod(div,type){
    this.div = div;
    this.type = type;
    this.originalAmountDiv = div.querySelector(".payment_method_total");
    this.newAmount = this.type == "cc" ? numberToString((stringToNumber(this.originalAmountDiv) * totalTaxes).toFixed(2)) : this.originalAmountDiv.innerText; 

    PaymentMethod.prototype.setPrice = function(){
        console.log("corri");
        this.originalAmountDiv.innerText = this.newAmount;
    }
}

// Arreglar porque se rompe en el refresh cuando le ponés modify. 
// Debería almacenar en el objeto el precio original, y siempre hacer el cálculo sobre el precio original.
function isReviewTab(){
    let reviewTab = document.querySelector("#review_tab:not(.modified)");
    if(reviewTab){
        if(reviewTab.style.display == "block"){
            console.log("Estamos en ultimostep");
    
            let currentMethods = Array.from(document.querySelectorAll(".checkout_review_payment_method_area .payment_method_review_row"));
            currentMethods = currentMethods.map(method => {
                if(method.innerText.includes("Visa") || method.innerText.includes("MasterCard")){
                    return new PaymentMethod(method,"cc");
                }
                return new PaymentMethod(method,"wallet");
            });
            console.log(currentMethods);
            currentMethods.forEach(method => method.setPrice());
            reviewTab.classList.add("modified");

            let returnButtons = reviewTab.querySelectorAll("a");
            returnButtons.forEach(button => button.addEventListener('click',resetReviewTab));

            function resetReviewTab(){
                reviewTab.classList.remove("modified");
                console.log("borré modified");
            }
        } 
    }
}

