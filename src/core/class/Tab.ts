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
    this.id = id;
    this.url = url;
    this.title = title;
    this.type = type;
    this.description = description;
    this.devtoolsFrontendUrl = devtoolsFrontendUrl;
    this.ws = new WebSocket(webSocketDebuggerUrl);
    this.ws.onopen = () => {
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
          id: 1,
          method: "Runtime.evaluate",
          params: {
            expression: script,
          },
        })
      );

      this.ws.onmessage = (data) => {
        try {
          const message = JSON.parse(data.data.toString());
          if (message.id && message.id === 1) {
            resolve(message.result?.value);
          }
          else {
            console.log("Unknown message", message);
          }
        } catch (error) {
          console.log("Error parsing message", error);
          resolve("");
        }
      };
    });
  }
}

export default Tab;
