import { EventEmitter } from "events";
import Tab from "./Tab";
import type { ApiTab } from "../types/ApiTab";

class CEF extends EventEmitter {
  tabs: Tab[] = [];
  constructor() {
    super();
  }

  async fetchTabs(
    options: {
      retry?: boolean;
    } = { retry: true }
  ): Promise<Tab[]> {
    return new Promise((resolve, reject) => {
      fetch("http://localhost:8080/json")
        .then((x) => x.json())
        .then((tabs) => {
          tabs = tabs as ApiTab[];
          if (tabs.length == 0) {
            if (options.retry && tabs.length == 0) {
              setTimeout(() => {
                resolve(this.fetchTabs());
              }, 1000);
            } else {
              reject("Failed to fetch tabs. Is CEF server running?");
            }
          } else {
            for (const tab of tabs) {
              this.tabs.push(new Tab(tab));
            }
            resolve(this.tabs);
          }
        })
        .catch((e) => {
          console.log("CATCH", e);
          if (options.retry) {
            setTimeout(() => {
              resolve(this.fetchTabs());
            }, 1000);
          } else {
            reject("Failed to fetch tabs. Is CEF server running?");
          }
        });
    });
  }
}

export default CEF;
