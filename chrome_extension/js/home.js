function getOwnedArgentinaGames(){
    let argentinaGames = localStorage.getItem('steamcito-argentina-games')
    let ownedGamesObject = localStorage.getItem('steamcito-owned-games');
    let argentinaGamesJSON = JSON.parse(argentinaGames);
    let ownedGamesObjectJSON = JSON.parse(ownedGamesObject);

    if(argentinaGamesJSON && ownedGamesObjectJSON && ownedGamesObjectJSON?.games && argentinaGamesJSON?.games){
        let ownedGamesArray = ownedGamesObjectJSON.games;
        let argentinaGamesArray = argentinaGamesJSON.games;
        let ownedArgentinaGames = argentinaGamesArray
            .filter(game => ownedGamesArray.includes(parseInt(game.appId)))
            .map(game => game.appId );
        ownedArgentinaGames.length && renderOwnedArgentinaGames(ownedArgentinaGames)
    }
}

function shuffleArray(array) { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

function renderOwnedArgentinaGames(gamesIds){
    gamesIds = shuffleArray(gamesIds)
    let targetItem = document.querySelector('.home_ctn.tab_container')
    if(targetItem){
        let ownedArgentinaGamesElement = 
        `
        <div class="top_new_releases steamcito_argentina_owned_games home_ctn below_tabs">
		<div class="home_page_content">
    <div class="top_new_releases_banner_ctn">
        <a href="#" class="top_new_releases_banner_click">
            <div class="title">
            <img class="title_ico" src="${chrome.runtime.getURL("emojis/argentina-flag-ico.png")}"/> Desarrollados en Argentina <img class="title_ico" src="${chrome.runtime.getURL("emojis/argentina-flag-ico.png")}"/>
            
            </div>
            <div class="dateline">Tenés ${gamesIds.length} juegos argentinos en tu biblioteca de Steam</div>
        </a>
    </div>

    <div class="top_new_releases_carousel">
        <div class="basic_caps_carousel carousel_container paging_capsules">
            <div class="carousel_items store_capsule_container responsive_scroll_snap_ctn" data-panel="{&quot;bFocusRingRoot&quot;:true,&quot;flow-children&quot;:&quot;row&quot;}">
                <div class="focus">
                    ${gamesIds.map(game => 
                        `
                        <a target="_blank" class="store_capsule responsive_scroll_snap_start broadcast_capsule app_impression_tracked" data-ds-appid="${game} target="_blank" href="https://store.steampowered.com/app/${game}">
                        <div class="capsule headerv5"><img src="https://cdn.akamai.steamstatic.com/steam/apps/${game}/header_292x136.jpg"></img></div>
                        </a>                              
                        `
                    )}
                </div>
            </div>
        </div>
    </div>
</div>
	</div>
        `
    targetItem.insertAdjacentHTML('afterend',ownedArgentinaGamesElement)

    }

}

getOwnedArgentinaGames();