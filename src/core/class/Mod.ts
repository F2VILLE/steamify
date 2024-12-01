import type { Filter } from "../types/Filter";

class Mod {
  name: string = "";
  author: string = "";
  description: string = "";
  version: string = "";

  runtime: string = "";

  constructor(
    public metadata: {
      name: string;
      author: string;
      description: string;
      version: string;
    },
    public config: {
      disabled?: boolean;
      enableDevTools?: boolean;
      pageFilters: Filter[];
    }
  ) {}

  log(...messages: any[]) {
    console.log(`[${this.name}]`, ...messages);
  }

  init() {}

  stop() {}

}

export default Mod;
