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
}

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

function renderScript(script: string) {
  script = script.replaceAll("{%{STEAM_API_KEY}%}", config.steamAPIKey);
  return script;
}

cef.fetchTabs().then((tabs) => {
  const modManager = new ModManager();
  modManager.loadAllMods(config.modsPath);

  for (const tab of tabs) {
    tab.on("open", () => {
      for (const mod of modManager.mods) {
        if (mod.config.pageFilters) {
          for (const filter of mod.config.pageFilters) {
            if (checkFilter(filter, tab) && !mod.config.disabled) {
              mod.init();
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
