function createMenus(){
    let oldMenu = document.querySelector("#global_action_menu") || document.querySelector('#checkout_steam_logo span');
    let steamcitoIcon = 
    `<div class="ico-steamcito"> 
        🧉
    </div>`;
    oldMenu && oldMenu.insertAdjacentHTML('afterend',steamcitoIcon);
    steamcitoIcon = document.querySelector(".ico-steamcito");
    steamcitoIcon && steamcitoIcon.addEventListener('click',showMenu);

    let steamcitoMenu = `
    <div class="menu-steamcito-background"></div>
    <div class="menu-steamcito">
            <div class="internal-menu">
                <span class="titulo">CONFIGURACIÓN DE STEAMCITO <br><span class="titulo__version"> Versión ${chrome.runtime.getManifest().version}</span></span>

                <div class="opciones-avanzadas-steamcito">

                    <div class="grupo-opciones">
                        <h3> Opciones de Cotización e Impuestos </h3>

                        <div class="opcion" id="metodo-de-pago">
                            <div>
                                <label for="metodo-de-pago-opciones">Tu método de pago</label>
                                <select name="" id="metodo-de-pago-opciones">
                                    <option value="steamcito-cotizacion-tarjeta">🧉 Tarjeta en pesos</option>
                                    <option value="steamcito-cotizacion-mep">💸 Tarjeta en dólares</option>
                                    <option value="steamcito-cotizacion-crypto">🚀 Astropay</option>

                                </select>
                            </div>
                            <small><a target="_blank" href='https://steamcito.com.ar/mejor-metodo-de-pago-steam-argentina?ref=steamcito-menu' style="display:inline">Ver listado de medios de pago.</a></small>
                        </div>

                        <div class="opcion">
                            <div>
                                <label for="national-tax">Impuestos nacionales</label>
                                <div class="input-container">
                                    <input id="national-tax" type="number" name="national-tax" disabled placeholder="21"/>
                                    <span> % </span>
                                </div>
                            </div>
                            <small>Basado en tu método de pago. <br><a target="_blank" href='https://steamcito.com.ar/impuestos-hoy' style="display:inline">Ver listado de impuestos nacionales.</a></small>
                        </div>                    

                        <div class="opcion">
                            <div>
                                <label for="province-tax">Impuestos provinciales</label>
                            <div class="input-container">
                                <input id="province-tax" type="number" name="province-tax" placeholder="0"/>
                                <span> % </span>
                            </div>    
                        </div>
                        <small> <a target="_blank" href='https://steamcito.com.ar/impuestos-hoy#impuestos-provinciales' style="display:inline">Ver listado de impuestos provinciales.</a></small>
                        </div>   

                    </div>

                    <div class="grupo-opciones">
                        <h3> Opciones Visuales </h3>

                        <div class="opcion" id="preferencia-de-precios">
                            <div>
                                <label for="modo-manual">Preferencia de visualización de precios</label>
                                <select name="" id="modo-manual">
                                    <option value="">Modo inteligente (Recomendado)</option>
                                    <option value="mate">Por defecto en pesos</option>
                                    <option value="wallet">Por defecto en dólares</option>
                                </select>
                            </div>
                            <small>El modo inteligente te muestra el precio en función de tu saldo si estás logueado.</small>
                        </div>

                        <div class="opcion" id="tips-de-ahorro">
                            <div>
                                <label for="ocultar-crypto">Tips de ahorro</label>
                                <select name="ocultar-crypto" id="ocultar-crypto">
                                    <option value="mostrar">Mostrar</option>
                                    <option value="ocultar">Ocultar</option>
                                </select>
                            </div>
                            <small>Los tips de ahorro te indican cuánto podés ahorrarte al pagar con un método de pago alternativo.</small>
                        </div>

                        <div class="opcion" id="informacion-en-barra-lateral">
                            <div>
                                <label for="estilo-barra">Información en barra lateral</label>
                                <select name="estilo-barra" id="estilo-barra">
                                    <option value="barra-normal">Normal</option>
                                    <option value="barra-minificada">Minificada</option>
                                </select>
                            </div>
                            <small>Seleccioná "Minificada" para que la información de cotización del dólar y precios regionales ocupe menos espacio.</small>
                        </div>

                    </div>

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
    localStorage.getItem('national-tax') ? nationalTax.value = localStorage.getItem('national-tax') : localStorage.setItem('national-tax',60);
    localStorage.getItem('province-tax') ? provinceTax.value=localStorage.getItem('province-tax') : localStorage.removeItem('province-tax');
    localStorage.getItem('manual-mode') ? selectManualMode.value=localStorage.getItem('manual-mode') : localStorage.removeItem('manual-mode');
    localStorage.getItem('estilo-barra') ? selectBarStyle.value=localStorage.getItem('estilo-barra') : localStorage.removeItem('estilo-barra');
    localStorage.getItem('metodo-de-pago') ? selectPaymentMethod.value=localStorage.getItem('metodo-de-pago') : localStorage.setItem('metodo-de-pago','steamcito-cotizacion-tarjeta');
    localStorage.getItem('ocultar-crypto') ? checkboxDolarCrypto.value=localStorage.getItem('ocultar-crypto') : localStorage.removeItem('ocultar-crypto');
}



function changeBarStyleState(){
    selectBarStyle.value == 'barra-normal' ? localStorage.setItem('estilo-barra','barra-normal') : localStorage.setItem('estilo-barra','barra-minificada');
}

function changePaymentMethodState(e){
    let value = e?.currentTarget?.value || e

    let tarjetaTax = JSON.parse(localStorage.getItem('steamcito-cotizacion-tarjeta')).taxAmount || 60 
    let cryptoTax = JSON.parse(localStorage.getItem('steamcito-cotizacion-crypto')).taxAmount || 0
    let mepTax = JSON.parse(localStorage.getItem('steamcito-cotizacion-mep')).taxAmount || 21

    localStorage.setItem('metodo-de-pago', value)
    switch (value) {
        case "steamcito-cotizacion-tarjeta": 
            localStorage.setItem('national-tax',tarjetaTax)
            nationalTax.value = tarjetaTax;
            break;

        case "steamcito-cotizacion-crypto": 
            localStorage.setItem('national-tax',cryptoTax)
            nationalTax.value = cryptoTax;
            break;            
 
        case "steamcito-cotizacion-mep": 
            localStorage.setItem('national-tax',mepTax)
            nationalTax.value = mepTax;
            break;                    

        default: localStorage.setItem('national-tax',nationalTax)
            break;
    }
}

function changeDolarCryptoVisibility() {
    checkboxDolarCrypto.value == 'mostrar' ? localStorage.setItem('ocultar-crypto','mostrar') : localStorage.setItem('ocultar-crypto','ocultar');
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
    menuBackground.classList.add('menu-steamcito-background-enabled');
    document.body.classList.add('menu-enabled');
    document.addEventListener('click',hideMenu);
}

function hideMenu(e){
    if(!menu.contains(e.target) && !steamcitoIcon.contains(e.target)) {
        menu.classList.remove('enabled');
        menuBackground.classList.remove('menu-steamcito-background-enabled');
        document.body.classList.remove('menu-enabled');
        document.removeEventListener('click',hideMenu);
    }
}

function setEmojis(){

    let paymentMethod = localStorage.getItem('metodo-de-pago') || "steamcito-cotizacion-tarjeta";

    if(paymentMethod == "steamcito-cotizacion"){
        return ['<span class="emojis">🧉</span>','<span class="emojis">💲</span>']
    } else if(paymentMethod == "steamcito-cotizacion-crypto"){
        return ['<span class="emojis">🚀</span>','<span class="emojis">💲</span>']
    } else if(paymentMethod == "steamcito-cotizacion-mep"){
        return ['<span class="emojis">💸</span>','<span class="emojis">💲</span>']   
    } 
    return ['<span class="emojis">🧉</span>','<span class="emojis">💲</span>'];        
}

// Inicializo Menú 
createMenus();

// Selecciono los botones del menú y les asigno eventos
const menu = document.querySelector(".menu-steamcito");
const menuBackground = document.querySelector(".menu-steamcito-background");

const steamcitoIcon = document.querySelector(".ico-steamcito");
let selectManualMode = document.querySelector("#modo-manual");
let selectBarStyle = document.querySelector("#estilo-barra");
let selectPaymentMethod = document.querySelector('#metodo-de-pago-opciones');
let checkboxDolarCrypto = document.querySelector("#ocultar-crypto");

selectManualMode.addEventListener('input', changeManualModeState);
selectBarStyle.addEventListener('input',changeBarStyleState);
selectPaymentMethod.addEventListener('input', changePaymentMethodState);
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

