import { EventEmitter } from "events";
import type { ApiTab } from "../types/ApiTab";

class Tab extends EventEmitter {
  ws: WebSocket | null = null;
  id: string = "";
  url: string = "";
  title: string = "";
  type: string = "";
  description: string = "";
  devtoolsFrontendUrl: string = "";

  constructor(tab: ApiTab) {
    super();
    const {
      description,
      devtoolsFrontendUrl,
      id,
      title,
      type,
      url,
      webSocketDebuggerUrl,
    } = tab;
    // console.log("Tab", tab);
    this.id = id;
    this.url = url;
    this.title = title;
    this.type = type;
    this.description = description;
    this.devtoolsFrontendUrl = devtoolsFrontendUrl;
    this.ws = new WebSocket(webSocketDebuggerUrl);
    this.ws.onopen = () => {
      if (!this.ws) {
        return;
      }

      this.ws.onmessage = (data) => {
        try {
          const message = JSON.parse(data.data.toString());
          if (message.method) {
            console.log("Emitting", message.method);
            this.emit(message.method, message);
          }
        } catch (error) {
          console.log("Error parsing message", error);
          // resolve("");
        }
      }

      this.ws.send(
        JSON.stringify({
          id: Math.floor(Math.random() * 1000000),
          method: "Runtime.enable",
        })
      );

      // {"id":16,"method":"Log.enable","params":{}}
      this.ws.send(
        JSON.stringify({
          id: Math.floor(Math.random() * 1000000),
          method: "Log.enable",
          params: {},
        })
      );

      /*
{"id":29,"method":"Page.getNavigationHistory","params":{}}
{"id":8,"method":"Debugger.enable","params":{"maxScriptsCacheSize":10000000}}
{"id":7,"method":"CSS.enable","params":{}}
{"id":6,"method":"DOM.enable","params":{}}

      */
      this.ws.send(
        JSON.stringify({
          id: Math.floor(Math.random() * 1000000),
          method: "Page.getNavigationHistory",
          params: {},
        })
      );

      this.ws.send(
        JSON.stringify({
          id: Math.floor(Math.random() * 1000000),
          method: "Debugger.enable",
          params: { maxScriptsCacheSize: 10000000 },
        })
      );

      this.ws.send(
        JSON.stringify({
          id: Math.floor(Math.random() * 1000000),
          method: "CSS.enable",
          params: {},
        })
      );

      this.ws.send(
        JSON.stringify({
          id: Math.floor(Math.random() * 1000000),
          method: "DOM.enable",
          params: {},
        })
      );

      this.emit("open");
    };
  }

  async close() {
    return new Promise((resolve) => {
      if (this.ws) {
        this.ws.close();
        this.ws.onclose = () => {
          resolve("");
          this.emit("close");
        };
      }
    });
  }

  async injectScript(script: string) {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return reject("Tab is not open");
      }

      this.ws?.send(
        JSON.stringify({
          id: Math.floor(Math.random() * 1000000),
          method: "Runtime.evaluate",
          params: {
            expression: script,
          },
        })
      );

      this.ws.onmessage = (data) => {
        resolve("")
        try {
          const message = JSON.parse(data.data.toString());
          if (JSON.stringify(message).includes("steamcommunity")) {
            // console.log("Message", message);
          }
          if (message.id && message.id === 1) {
            // resolve(message.result?.value);
          } else {
            // console.log("Unknown message", message);
          }
        } catch (error) {
          console.log("Error parsing message", error);
          // resolve("");
        }
      };
      
    });
  }

  async sendAlert(message: string) {
    this.injectScript(`alert("${message}")`);
  }
}

export default Tab;
