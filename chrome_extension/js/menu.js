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
                                <option value="unicode">Emojis Nativos</option>
                                <option value="fallback">Emojis Planos</option>
                            </select>
                        </div>
                        <small>Seleccioná "Emoji Plano" si los emojis aparecen como un rectángulo blanco ▯</small>
                    </div>
                    
                    <div class="opcion">
                        <div>
                            <label>Impuestos personalizados</label>
                            <input id="custom-tax" type="number" name="custom-tax" placeholder="Porcentaje personalizado"/>
                        </div>
                        <small>Si tu tarjeta te está cobrando más impuestos que lo oficial, insertá acá el porcentaje total de impuestos que te llega. 
                        <br>
                        <a target="_blank" href='https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/funcionalidad-personalizador.html' style="display:inline">Ver casos de ejemplo.</a></small>
                    </div>                    


                    <a class="refresher" onClick="window.location.reload();">Aplicar cambios</a> 

                </div>

                <div class="ayuda-steamcito"> 
                    <a href="https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/index.html#howto" target="_blank">Tutorial</a>
                    <a href="https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/changelog.html" target="_blank">Historial de Actualizaciones</a>
                    <a href="https://github.com/emilianog94/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/issues" target="_blank">Reportar un bug / Sugerir una funcionalidad </a>
                    ${getReviewLink()}
                </div>
            </div>

    </div>
    `;
    document.body.insertAdjacentHTML('beforeend',steamcitoMenu);
}

function getReviewLink(){
    chromeLink = `<a href="https://chrome.google.com/webstore/detail/steamcito-steam-con-impue/fcjljapncagfmfhdkccgnbkgdpbcefcj" target="_blank">¡Valorá Steamcito en la Chrome Store! ❤️</a>`;
    firefoxLink = `<a href="https://addons.mozilla.org/es/firefox/addon/steamcito-steam-impuestos-arg/" target="_blank">¡Valorá Steamcito en Firefox Addons! ❤️</a>`;
    return navigator.userAgent.indexOf('Firefox') != -1 ? firefoxLink : chromeLink;
}

function setInitialLocalStates(){
    localStorage.getItem('steamcito-emoji') == 'unicode' ? selectEmoji.value='unicode' : selectEmoji.value='fallback';
    localStorage.getItem('custom-tax') ? customTax.value=localStorage.getItem('custom-tax') : localStorage.removeItem('custom-tax');
}

function changeEmojiState(){
    selectEmoji.value == 'unicode' ? localStorage.setItem('steamcito-emoji','unicode') : localStorage.setItem('steamcito-emoji','fallback');
}

function changeCustomTax(){
    localStorage.setItem('custom-tax',this.value);
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
let selectEmoji = document.querySelector("#estilo-emoji");
selectEmoji.addEventListener('input',changeEmojiState);

let customTax = document.querySelector("#custom-tax");
customTax.addEventListener('input',changeCustomTax);

// Seteo el estado inicial de payment y emojis
setInitialLocalStates();

// Defino qué emojis se van a usar
const emojis = setEmojis();
const emojiMate = emojis[0];
const emojiWallet = emojis[1];

