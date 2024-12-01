document
  .querySelector(".profile_header")
  .insertAdjacentHTML(
    "beforeend",
    "<div class='profile_customization'> <div class='profile_customization_header'> <div class='profile_customization_header_text'>Steam Inventory Price</div> </div> <div class='profile_customization_content'> <div class='profile_customization_section'> <div class='profile_customization_section_header'> <div class='profile_customization_section_header_text'>Total Inventory Value</div> </div> <div class='profile_customization_section_content'> <div class='profile_customization_section_content_text' id='totalInventoryValue'>Loading...</div> </div> </div> <div class='profile_customization_section'> <div class='profile_customization_section_header'> <div class='profile_customization_section_header_text'>Total Inventory Value (USD)</div> </div> <div class='profile_customization_section_content'> <div class='profile_customization_section_content_text' id='totalInventoryValueUSD'>Loading...</div> </div> </div> </div> </div>"
  );
let totalInventoryValue = 0;
let totalInventoryValueUSD = 0;
let totalInventoryValueUSDFormatted = "";
let totalInventoryValueFormatted = "";

