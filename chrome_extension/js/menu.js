function createMenus(){
    let oldMenu = document.querySelector("#global_action_menu") || document.querySelector('#checkout_steam_logo span');
    let steamcitoIcon = 
    `<div class="ico-steamcito"> 
        <img src="${chrome.runtime.getURL("emojis/mate-emoji.png")}" />
    </div>`;
    oldMenu.insertAdjacentHTML('afterend',steamcitoIcon);
    steamcitoIcon = document.querySelector(".ico-steamcito");
    steamcitoIcon.addEventListener('click',showMenu);

    let steamcitoMenu = `
    <div class="menu-steamcito">
            <div class="internal-menu">
                <span class="titulo">Configuración de Steamcito v${chrome.runtime.getManifest().version}</span>
                <hr>

                <div class="opciones-avanzadas-steamcito">

                    <div class="opcion">
                        <div>
                            <label>Estilo de Emojis</label>
                            <select name="estilo-emoji" id="estilo-emoji">
                                <option value="unicode">Emoji Full Color</option>
                                <option value="fallback">Emoji Plano</option>
                            </select>
                        </div>
                        <small>Seleccioná la opción Plano si los emojis se ven como un rectángulo blanco ▯</small>

                    </div>

                    <div class="opcion">
                        <div>
                            <label>Modo MercadoPago</label>
                            <select name="steamcito-payment" id="steamcito-payment">
                                <option value="desactivado">Desactivado</option>
                                <option value="activado">Activado</option>
                            </select>
                        </div>
                        <small>Seleccioná esta opción si pagás con la tarjeta de débito de MercadoPago. Actualmente, MercadoPago tiene aproximadamente 6% menos de impuestos.</small>

                    </div>
                    
                    <a class="refresher" onClick="window.location.reload();">Refrescá la página para ver los cambios</a> 

                </div>

                <div class="ayuda-steamcito"> 
                    <a href="https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/index.html#howto" target="_blank">Tutorial</a>
                    <a href="https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/changelog.html" target="_blank">Historial de Actualizaciones</a>
                    <a href="https://github.com/emilianog94/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/issues" target="_blank">Reportar un bug / Sugerir una funcionalidad </a>
                    <a href="https://chrome.google.com/webstore/detail${chrome.runtime.id}" target="_blank">¡Valorá Steamcito en la Chrome Store!</a>
                </div>
            </div>

    </div>
    `;
    document.body.insertAdjacentHTML('beforeend',steamcitoMenu);
}

function setInitialLocalStates(){
    localStorage.getItem('steamcito-payment') == 'standard' ? selectPayment.value='desactivado' : selectPayment.value='activado';
    localStorage.getItem('steamcito-emoji') == 'unicode' ? selectEmoji.value='unicode' : selectEmoji.value='fallback';
}

function changePaymentState(){
    selectPayment.value == 'desactivado' ? localStorage.setItem('steamcito-payment','standard') : localStorage.setItem('steamcito-payment','mercadopago');
}

function changeEmojiState(){
    selectEmoji.value == 'unicode' ? localStorage.setItem('steamcito-emoji','unicode') : localStorage.setItem('steamcito-emoji','fallback');
}

function showMenu(e){
    menu.classList.add('enabled');
    document.addEventListener('click',hideMenu);
}

function hideMenu(e){
    if(!menu.contains(e.target) && !steamcitoIcon.contains(e.target)) {
        menu.classList.remove('enabled');
        document.removeEventListener('click',hideMenu);
    }
}

function setEmojis(){
    let OSversion = window.navigator.userAgent;
    if(!localStorage.hasOwnProperty('steamcito-emoji')){
        if(OSversion.indexOf("NT 10.0") != -1){
            localStorage.setItem('steamcito-emoji','unicode');
            selectEmoji.value = "unicode";
            return [" 🧉"," 💲"];
        } else{
            localStorage.setItem('steamcito-emoji','compatibility');
            selectEmoji.value = "fallback";
            return ['<span class="emojis mate"> A </span>','<span class="emojis saldo"> B </span>'];
        }
    }
    else{
        if(localStorage.getItem('steamcito-emoji') == 'unicode'){
            selectEmoji.value = "unicode";
            return [" 🧉"," 💲"];
        }
        else{
            selectEmoji.value = "fallback";
            return ['<span class="emojis mate"> A </span>','<span class="emojis saldo"> B </span>'];
        }
    }
}

// Inicializo Menú 
createMenus();

// Selecciono los botones del menú y les asigno eventos
const menu = document.querySelector(".menu-steamcito");
const steamcitoIcon = document.querySelector(".ico-steamcito");
let selectPayment = document.querySelector('#steamcito-payment');
let selectEmoji = document.querySelector("#estilo-emoji");
selectPayment.addEventListener('input',changePaymentState);
selectEmoji.addEventListener('input',changeEmojiState);

// Seteo el estado inicial de payment y emojis
setInitialLocalStates();

// Defino qué emojis se van a usar
const emojis = setEmojis();
const emojiMate = emojis[0];
const emojiWallet = emojis[1];

