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

                    <div class="grupo-opciones">
                        <h3> Opciones de Impuestos </h3>
                        <div class="opcion">
                            <div>
                                <label for="national-tax">Impuestos nacionales</label>
                                <input id="national-tax" type="number" name="national-tax" placeholder="Porcentaje personalizado"/>
                            </div>
                            <small>Es recomendable no cambiar este valor.<br> <a target="_blank" href='https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/funcionalidad-personalizador.html' style="display:inline">Ver impuestos nacionales actuales.</a></small>
                        </div>                    

                        <div class="opcion">
                            <div>
                                <label for="province-tax">Impuestos provinciales</label>
                                <input id="province-tax" type="number" name="province-tax" placeholder="Porcentaje personalizado"/>
                            </div>
                            <br>
                            <small> <a target="_blank" href='https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/funcionalidad-personalizador.html' style="display:inline">Clickeá acá para ver los impuestos que cobra tu provincia.</a></small>
                        </div>   
                    </div>

                    <div class="grupo-opciones">
                        <h3> Opciones Visuales </h3>
                        <div class="opcion">
                            <div>
                                <label for="estilo-emoji">Estilo de Emojis</label>
                                <select name="estilo-emoji" id="estilo-emoji">
                                    <option value="unicode">Emojis Nativos</option>
                                    <option value="fallback">Emojis Planos</option>
                                </select>
                            </div>
                            <small>Seleccioná "Emojis Planos" si los emojis te aparecen como un rectángulo blanco ▯</small>
                        </div>
                    </div>

                    <a class="refresher" onClick="window.location.reload();">Aplicar cambios</a> 

                </div>

                <div class="ayuda-steamcito"> 
                    <div class="grupo-opciones">
                        <h3>Ayuda y enlaces útiles</h3>
                        <a href="https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/index.html#howto" target="_blank">Sitio Web de Steamcito</a>
                        <a href="https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/index.html#howto" target="_blank">Impuestos actuales</a>
                        <a href="https://emilianog94.github.io/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/landing/changelog.html" target="_blank">Historial de Actualizaciones</a>
                        <a href="https://github.com/emilianog94/Steamcito-Precios-Steam-Argentina-Impuestos-Incluidos/issues" target="_blank">Reportar un bug / Sugerir una funcionalidad </a>
                        <a href="https://trello.com/b/iv56hIIT/steamcito-roadmap-p%C3%BAblico" target="_blank">¿Qué se viene? </a>

                        ${getReviewLink()} 
                    </div>
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
    localStorage.getItem('national-tax') ? nationalTax.value=localStorage.getItem('national-tax') : localStorage.removeItem('national-tax');
    localStorage.getItem('province-tax') ? provinceTax.value=localStorage.getItem('province-tax') : localStorage.removeItem('province-tax');
}

function changeEmojiState(){
    selectEmoji.value == 'unicode' ? localStorage.setItem('steamcito-emoji','unicode') : localStorage.setItem('steamcito-emoji','fallback');
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
let selectEmoji = document.querySelector("#estilo-emoji");
selectEmoji.addEventListener('input',changeEmojiState);

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

