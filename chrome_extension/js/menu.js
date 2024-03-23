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
                <span class="titulo">CONFIGURACIÓN DE STEAMCITO <br><span class="titulo__version"> Versión ${chrome.runtime.getManifest().version}</span></span>

                <div class="opciones-avanzadas-steamcito">

                    <div class="grupo-opciones">
                        <h3> Opciones de Impuestos </h3>
                        <div class="opcion">
                            <div>
                                <label for="national-tax">Impuestos nacionales</label>
                                <input id="national-tax" type="number" name="national-tax" placeholder="60"/>
                            </div>
                            <small><a target="_blank" href='https://steamcito.com.ar/impuestos-hoy' style="display:inline">Ver listado de impuestos nacionales.</a></small>
                        </div>                    

                        <div class="opcion">
                            <div>
                                <label for="province-tax">Impuestos provinciales</label>
                                <input id="province-tax" type="number" name="province-tax" placeholder="0"/>
                            </div>
                            <small> <a target="_blank" href='https://steamcito.com.ar/impuestos-hoy#impuestos-provinciales' style="display:inline">Ver listado de impuestos provinciales.</a></small>
                        </div>   
                    </div>

                    <div class="grupo-opciones">
                        <h3> Opciones Visuales </h3>

                        <div class="opcion">
                            <div>
                                <label for="modo-manual">Preferencia de precios</label>
                                <select name="" id="modo-manual">
                                    <option value="">Recomendado</option>
                                    <option value="mate">Forzar precio con mate</option>
                                    <option value="wallet">Forzar precio con saldo</option>
                                </select>
                            </div>
                            <small>El modo recomendado te muestra de manera inteligente aquellos juegos que podés comprar usando tu saldo.</small>
                        </div>

                        <div class="opcion">
                            <div>
                                <label for="estilo-emoji">Estilo de Emojis</label>
                                <select name="estilo-emoji" id="estilo-emoji">
                                    <option value="unicode">Recomendado</option>
                                    <option value="fallback">Retrocompatibles</option>
                                </select>
                            </div>
                            <small>Modificá esta opción si los emojis te aparecen como un rectángulo así: ▯. Pensado para versiones antiguas de Windows que no tienen emojis.</small>
                        </div>

                        <div class="opcion">
                            <div>
                                <label for="estilo-barra">Información en barra lateral</label>
                                <select name="estilo-barra" id="estilo-barra">
                                    <option value="barra-normal">Normal</option>
                                    <option value="barra-minificada">Minificada</option>
                                </select>
                            </div>
                            <small>Seleccioná "Minificada" para que la información de cotización del dólar y precios regionales ocupe menos espacio.</small>
                        </div>

                        <div class="opcion">
                            <div>
                                <input type="checkbox" name="ocultar-crypto" id="ocultar-crypto" style="width: unset; margin-left: unset; margin-top: unset; margin-right: 1rem"/>
                                <label for="ocultar-crypto">Ocultar Dolar Crypto</label>
                            </div>
                            <small>Ocultar banner con cotización de Dolar Crypto.</small>
                        </div>

                    </div>

                    <a class="refresher btnv6_green_white_innerfade" onClick="window.location.reload();">Aplicar cambios</a> 
                    
                    <br>


                </div>

                <div class="ayuda-steamcito"> 
                    <div class="grupo-opciones">
                        <h3>Enlaces Útiles</h3>
                        <a href="https://cafecito.app/steamcito" target="_blank">Donar a Steamcito ☕</a>
                        <a href="https://twitter.com/steamcito_ar" target="_blank">Seguime en Twitter 🐦</a>
                        <a href="https://steamcito.com.ar" target="_blank">Web de Steamcito 🧉</a>
                        <a href="https://steamcito.com.ar/changelog" target="_blank">Historial de Actualizaciones 📄</a>
                        <a href="https://github.com/emilianog94/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/issues" target="_blank">Reportar un bug 🐛</a>
                        <a href="https://store.steampowered.com/account/history/">Calcular devolución de impuestos anual 🧾</a>
                        ${getReviewLink()} 
                    </div>
                </div>

            </div>

    </div>
    `;
    document.body.insertAdjacentHTML('beforeend',steamcitoMenu);
}

function getReviewLink(){
    chromeLink = `<a href="https://chrome.google.com/webstore/detail/steamcito-steam-con-impue/fcjljapncagfmfhdkccgnbkgdpbcefcj" target="_blank">Valorá Steamcito en Chrome Store ⭐</a> `;
    firefoxLink = `<a href="https://addons.mozilla.org/es/firefox/addon/steamcito-steam-impuestos-arg/" target="_blank">¡Valorá Steamcito en Firefox Addons!</a>`;
    return navigator.userAgent.indexOf('Firefox') != -1 ? firefoxLink : chromeLink;
}

function setInitialLocalStates(){
    localStorage.getItem('steamcito-emoji') == 'unicode' ? selectEmoji.value='unicode' : selectEmoji.value='fallback';
    localStorage.getItem('national-tax') ? nationalTax.value=localStorage.getItem('national-tax') : localStorage.removeItem('national-tax');
    localStorage.getItem('province-tax') ? provinceTax.value=localStorage.getItem('province-tax') : localStorage.removeItem('province-tax');
    localStorage.getItem('manual-mode') ? selectManualMode.value=localStorage.getItem('manual-mode') : localStorage.removeItem('manual-mode');
    localStorage.getItem('estilo-barra') ? selectBarStyle.value=localStorage.getItem('estilo-barra') : localStorage.removeItem('estilo-barra');
    localStorage.getItem('ocultar-crypto') ? selectBarStyle.value=localStorage.getItem('ocultar-crypto') : localStorage.removeItem('ocultar-crypto');
}

function changeBarStyleState(){
    selectBarStyle.value == 'barra-normal' ? localStorage.setItem('estilo-barra','barra-normal') : localStorage.setItem('estilo-barra','barra-minificada');
}

function changeEmojiState(){
    selectEmoji.value == 'unicode' ? localStorage.setItem('steamcito-emoji','unicode') : localStorage.setItem('steamcito-emoji','fallback');
}

function changeDolarCryptoVisibility() {
  localStorage.setItem('ocultar-crypto', String(checkboxDolarCrypto.checked));
}

function changeManualModeState(){
    if(!selectManualMode.value){
        localStorage.removeItem('manual-mode')
    } else{
        selectManualMode.value == 'mate' ? localStorage.setItem('manual-mode', 'mate') : localStorage.setItem('manual-mode', 'wallet');
    }
    
}

function changeNationalTax(){
    localStorage.setItem('national-tax',this.value);
}

function changeProvinceTax(){
    localStorage.setItem('province-tax',this.value);
}

function showMenu(e){
    menu.classList.add('enabled');
    document.body.classList.add('menu-enabled');
    document.addEventListener('click',hideMenu);
}

function hideMenu(e){
    if(!menu.contains(e.target) && !steamcitoIcon.contains(e.target)) {
        menu.classList.remove('enabled');
        document.body.classList.remove('menu-enabled');
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
let selectManualMode = document.querySelector("#modo-manual")
let selectEmoji = document.querySelector("#estilo-emoji");
let selectBarStyle = document.querySelector("#estilo-barra");
let checkboxDolarCrypto = document.querySelector("#ocultar-crypto");

selectEmoji.addEventListener('input',changeEmojiState);
selectManualMode.addEventListener('input', changeManualModeState);
selectBarStyle.addEventListener('input',changeBarStyleState);
checkboxDolarCrypto.addEventListener('change', changeDolarCryptoVisibility);

let nationalTax = document.querySelector("#national-tax");
nationalTax.addEventListener('input',changeNationalTax);

let provinceTax = document.querySelector("#province-tax");
provinceTax.addEventListener('input',changeProvinceTax);

// Seteo el estado inicial de payment y emojis
setInitialLocalStates();

// Defino qué emojis se van a usar
const emojis = setEmojis();
const emojiMate = emojis[0];
const emojiWallet = emojis[1];

