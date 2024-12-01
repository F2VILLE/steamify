const respagetempcont = document.querySelector(
  "#responsive_page_template_content"
);
const script = respagetempcont.querySelector("script");
/*
<script type="text/javascript">
		g_rgProfileData = {"url":"https:\/\/steamcommunity.com\/profiles\/76561198946231234\/","steamid":"76561198946231234","personaname":"romainqss","summary":"<img src=\"https:\/\/community.fastly.steamstatic.com\/economy\/emoticon\/steamsalty\" alt=\":steamsalty:\" class=\"emoticon\">"};
		const g_bViewingOwnProfile = 0;
		$J( function() {
			window.Responsive_ReparentItemsInResponsiveMode && Responsive_ReparentItemsInResponsiveMode( '.responsive_groupfriends_element', $J('#responsive_groupfriends_element_ctn') );
			
			SetupAnimateOnHoverImages();
		});
	</script>
*/

const profileData = JSON.parse(
  script.textContent.match(/g_rgProfileData = ({.*?});/)[1]
);

function steam64toId(steam64) {
  const y = BigInt(steam64) - BigInt(76561197960265728);
  const x = y % BigInt(2);
  const z = (y - x) / BigInt(2);
  return `STEAM_0:${x}:${z.toString()}`; // Convert BigInt to string
}


try {
  let steamID64 = profileData.steamid;
  let steamID = steam64toId(steamID64);
  document.querySelector(".profile_header").insertAdjacentHTML(
    "beforeend",
    `<div class='profile_customization'> <div class='profile_customization_header'> <div class='profile_customization_header_text'>User Infos</div> </div> 
    <div class='profile_customization_content'> 
      <div class='profile_customization_section'> 
        <div class='profile_customization_section_header'> 
          <div class='profile_customization_section_header_text'>SteamID: 
              <code style="width: fit-content; height: fit-content; background-color: #0005; padding: 2px; border-radius: 2px;">${steamID}</code>
          </div> 
        </div> 
      </div> 

      <div class='profile_customization_section'> 
        <div class='profile_customization_section_header'> 
          <div class='profile_customization_section_header_text'>SteamID 64: 
              <code style="width: fit-content; height: fit-content; background-color: #0005; padding: 2px; border-radius: 2px;">${steamID64}</code>
          </div> 
        </div> 
      </div> 

    </div>`
  );
} catch (error) {
  alert(error)
}
