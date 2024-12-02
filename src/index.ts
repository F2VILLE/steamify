import config from "../config.json";
import { CEF, ModManager, Tab } from "./core";
import fs from "fs";
import type { Filter } from "./core/types/Filter";

const cef = new CEF();

const renderVariables = {
  steamID: "",
  steamID64: "",
  username: "",
  avatar: "",
  balance: "",
  balanceFormatted: "",
  balanceFormattedShort: "",
};

function checkFilter(filter: Filter, tab: Tab) {
  if (filter.url && filter.url !== tab.url) {
    return false;
  }

  if (filter.title && filter.title !== tab.title) {
    return false;
  }

  if (filter.urlContains && !tab.url.includes(filter.urlContains)) {
    return false;
  }

  if (filter.titleContains && !tab.title.includes(filter.titleContains)) {
    return false;
  }

  if (filter.id && filter.id !== tab.id) {
    return false;
  }

  return true;
}

function checkFilterURL(filter: Filter, url: string) {
  if (filter.url && filter.url !== url) {
    return false;
  }

  if (filter.urlContains && !url.includes(filter.urlContains)) {
    return false;
  }

  return true;
}

function renderScript(script: string) {
  script = script.replaceAll("{%{STEAM_API_KEY}%}", config.steamAPIKey);
  return script;
}

async function injectScript(tab: Tab, modManager: ModManager) {
  for (const mod of modManager.mods) {
    if (mod.config.pageFilters) {
      for (const filter of mod.config.pageFilters) {
        if (checkFilter(filter, tab) && !mod.config.disabled) {
          mod.init(tab);
          await tab.injectScript(renderScript(mod.runtime));
          if (mod.config.enableDevTools) {
            // tab.openDevTools();
          }
        }
      }
    }
  }
}

cef.fetchTabs().then(async (tabs) => {
  const modManager = new ModManager();
  modManager.loadAllMods(config.modsPath);

  for (const tab of tabs) {
    tab.on("open", async () => {
      injectScript(tab, modManager);
    });

    tab.on("Log.entryAdded", (data) => {
      // console.log("Log.entryAdded", data.params);
    })

    tab.on("Runtime.consoleAPICalled", (data) => {
      // console.log("Runtime.consoleAPICalled", data);
    })

    //Runtime.executionContextCreated
    tab.on("Runtime.executionContextCreated", (data) => {
      // console.log("Runtime.executionContextCreated", data.params);
    });

    tab.on("Debugger.scriptParsed", (data) => {
      // if data.params.url is in filters, then inject script
      // console.log("Debugger.scriptParsed", data.params);
      for (const mod of modManager.mods) {
        if (mod.config.pageFilters) {
          for (const filter of mod.config.pageFilters) {
            if (checkFilterURL(filter, data.params.url) && !mod.config.disabled) {
              // mod.init(tab);
              tab.injectScript(renderScript(mod.runtime));
              if (mod.config.enableDevTools) {
                // tab.openDevTools();
              }
            }
          }
        }
      }
    });
  }
});

// handle errors and close websocket connections
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  for (const tab of cef.tabs) {
    tab.ws?.close();
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  for (const tab of cef.tabs) {
    tab.ws?.close();
  }

  process.exit();
});
