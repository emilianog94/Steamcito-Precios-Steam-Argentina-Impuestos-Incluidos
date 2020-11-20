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

function setEmojiMate(){
    let OSversion = window.navigator.userAgent;
    return OSversion.indexOf("NT 10.0") != -1 ? " 🧉" : `<span class="emojis mate"> A </span>`;
}

function setEmojiWallet(){
    let OSversion = window.navigator.userAgent;
    return OSversion.indexOf("NT 10.0") != -1 ? " 💲" : `<span class="emojis saldo"> B </span>`;
}