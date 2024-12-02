const respagetempcont = document.querySelector(
  "#responsive_page_template_content"
);
const script = respagetempcont.querySelector("script");

const profileData = JSON.parse(
  script.textContent.match(/g_rgProfileData = ({.*?});/)[1]
);

function steam64toId(steam64) {
  const y = BigInt(steam64) - BigInt(76561197960265728);
  const x = y % BigInt(2);
  const z = (y - x) / BigInt(2);
  return `STEAM_0:${x}:${z.toString()}`; // Convert BigInt to string
}

function inject(steamID, steamID64) {
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
}

try {
  let steamID64 = profileData.steamid;
  let steamID = steam64toId(steamID64);
  inject(steamID, steamID64);
} catch (error) {
  alert(error);
}
