let electron = require("electron");
//#region src/backend/preload.ts
electron.contextBridge.exposeInMainWorld("electronIpc", { invoke: (channel, ...args) => electron.ipcRenderer.invoke(channel, ...args) });
//#endregion
