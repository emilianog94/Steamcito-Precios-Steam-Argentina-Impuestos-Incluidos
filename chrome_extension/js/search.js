function changeRangeValue() {
    let currentNumber = document.querySelector('input#maxprice_input');

    if (!isNaN(currentNumber.value) && currentNumber.value) {
        rangeDisplayTextSteamcito.innerText = `Menos de ARS$ ${(currentNumber.value * totalTaxes).toFixed(2)} 🧉`;
    } else {
        rangeDisplayTextSteamcito.innerText = "";
    }
}

let rangeInput = document.querySelector('input#price_range');
let rangeDisplayText = document.querySelector('#price_range_display');
rangeDisplayText.insertAdjacentHTML('afterend', `<p class="range_display range_display_steamcito"></p>`)
let rangeDisplayTextSteamcito = document.querySelector('.range_display_steamcito');
