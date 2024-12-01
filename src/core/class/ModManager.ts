import Mod from "./Mod";
import path from "path";
import fs from "fs";
import type { ModConfig } from "../types/ModConfig";
import type { ModMetadata } from "../types/ModMetadata";
class ModManager {
  mods: Mod[] = [];
  constructor() {}

  async loadMod(modPath: string) {
    const modConfig = JSON.parse(
      fs.readFileSync(path.join(modPath, "mod.json"), "utf-8")
    );
    const metadata = {} as ModMetadata;
    const config = {} as ModConfig;

    if (!modConfig.name) {
      throw new Error("Mod name is required");
    }

    if (!modConfig.version) {
      throw new Error("Mod version is required");
    }

    if (!modConfig.config) {
      throw new Error("Mod config is required");
    }

    if (!modConfig.pages) {
      throw new Error("Mod pages is required");
    }

    if (!modConfig.config.runtime) {
      throw new Error("Mod runtime is required");
    }

    metadata.name = modConfig.name;
    metadata.author = modConfig.author;
    metadata.description = modConfig.description;
    metadata.version = modConfig.version;

    config.disabled = modConfig.disabled;
    config.enableDevTools = modConfig.enableDevTools;
    config.pageFilters = modConfig.pages;

    const mod = new Mod(metadata, config);

    mod.runtime = fs.readFileSync(
      path.join(modPath, modConfig.config.runtime),
      "utf-8"
    );

    if (modConfig.config.init) {
      mod.init = () => {
        eval(
          fs.readFileSync(path.join(modPath, modConfig.config.init), "utf-8")
        );
      };
    }

    if (modConfig.config.stop) {
      mod.stop = () => {
        eval(
          fs.readFileSync(path.join(modPath, modConfig.config.stop), "utf-8")
        );
      };
    }

    // print a message "Loaded Mod" and pretty print the metadata
    mod.log("Loaded Mod", metadata);

    this.mods.push(mod);
  }

  async loadAllMods(modsPath: string) {
    if (!fs.existsSync(modsPath)) {
      throw new Error(`Mods path does not exist: ${modsPath}`);
    }

    const files = fs.readdirSync(modsPath);

    for (const file of files) {
      if (fs.statSync(path.join(modsPath, file)).isDirectory()) {
        if (fs.existsSync(path.join(modsPath, file, "mod.json"))) {
          this.loadMod(path.join(modsPath, file));
        }
      }
    }

    return this.mods;
  }
}

export default ModManager;
