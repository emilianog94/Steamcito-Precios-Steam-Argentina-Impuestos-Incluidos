const emojiMate = setEmojiMate();
const emojiWallet = setEmojiWallet();
const walletBalance = getBalance();
const totalTaxes = getTotalTaxes();

function getPrices(){
    let prices = document.querySelectorAll(priceContainers);

    // Fix específico para obtener las DLCs sin descuento y que estas no hagan overlap con las DLCs con descuento
    let standardDlcPrices = document.querySelectorAll(`.game_area_dlc_price:not([${attributeName}]`);
    standardDlcPrices.forEach(dlcPrice => { 
        if(!dlcPrice.querySelector("div")){
            setArgentinaPrice(dlcPrice);
        }
    });
    prices.forEach(price => setArgentinaPrice(price));
}

function setArgentinaPrice(price){
    if(price.innerText.includes("ARS$") && price.hasChildNodes()){
        let positionArs = price.innerText.lastIndexOf("ARS$ ") + 5;
        let baseNumericPrice = stringToNumber(price,positionArs);
        price.dataset.originalPrice = baseNumericPrice.toFixed(2);
        price.dataset.argentinaPrice = (baseNumericPrice * totalTaxes).toFixed(2);
        renderPrices(price);
    }
    else{
        price.dataset.originalPrice = "none";
    }
}

function renderPrices(price){
    let argentinaPrice = numberToString(price.dataset.argentinaPrice);
    let originalPrice = numberToString(price.dataset.originalPrice);
    
    // Agrego Listener para switchear precios con click
    if(!price.classList.contains('discount_original_price') || !price.classList.contains('responsive_secondrow')){
        price.addEventListener('click',showSecondaryPrice); 
        price.style.cursor="pointer";
    }

    if(walletBalance > price.dataset.originalPrice && !price.classList.contains('discount_original_price')){
        price.innerHTML = originalPrice + emojiWallet;     
        price.classList.add("original");
        if(price.previousElementSibling){
            if(isInsideString(price.previousElementSibling,"ARS$")) price.previousElementSibling.innerText = numberToString(price.previousElementSibling.dataset.originalPrice); 
        }
    } else
    {
        // Fix para Search View
        if(price.matches('.discounted.responsive_secondrow')){
            let precioTachado = price.querySelector("strike");
            if(precioTachado) price.innerHTML = `<strike style="color: #888888;">${precioTachado.innerText}</strike> <br> ${argentinaPrice} ${emojiMate}`; 
            price.removeEventListener('click',showSecondaryPrice); 

        } else{
            price.innerHTML = argentinaPrice + emojiMate;
            price.classList.add("argentina");

            /*
            // Fix específico para la sección /bundle/ cuando no estás logueado
            if(document.location.href.indexOf('/bundle/') > -1){
                setTimeout(function(){
                    if(!price.classList.contains("discount_original_price") && !price.classList.contains("he")){
                        if(price.querySelector(".your_price_label")){
                            setArgentinaPrice(price);
                            price.classList.add("he");
                        }
                        if(price.classList.contains("bundle_final_price_with_discount") || price.classList.contains("bundle_final_package_price")){
                            // setArgentinaPrice(price);
                            price.classList.add("he");    
                        }
                    }
                },1500);
            }
            */



            if(price.previousElementSibling){
                if(isInsideString(price.previousElementSibling,"ARS$")) price.previousElementSibling.innerText = numberToString(price.previousElementSibling.dataset.argentinaPrice); 
            }
        }
    }
}

function showSecondaryPrice(e){
    e.preventDefault();
    let selectedPrice = e.currentTarget;
    selectedPrice.classList.add("transition-effect");
    selectedPrice.style.opacity = 0;
    if(selectedPrice.classList.contains("argentina")){
        switchPrices(selectedPrice,"argentina","original",emojiWallet);
    }
    else if(selectedPrice.classList.contains("original")){
        switchPrices(selectedPrice,"original","argentina",emojiMate);
    }
}

function switchPrices(selector,first,second,symbol){
    setTimeout(function(){
        selector.style.opacity=1;
        selector.classList.remove(first);
        selector.classList.add(second);
        selector.innerHTML = numberToString(selector.dataset[second+"Price"] + symbol);
    },250);
}



