function createMenus(){
    let oldMenu = document.querySelector("#global_action_menu");
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
                            <select name="mercadopago" id="mercadopago">
                                <option value="desactivado">Desactivado</option>
                                <option value="activado">Activado</option>
                            </select>
                        </div>
                        <small>Seleccioná esta opción si pagás con la tarjeta de débito de MercadoPago. Actualmente, MercadoPago tiene aproximadamente 6% menos de impuestos.</small>

                    </div>

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

createMenus();
const menu = document.querySelector(".menu-steamcito");
const steamcitoIcon = document.querySelector(".ico-steamcito");

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

