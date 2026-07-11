let electron = require("electron");
//#region src/shared/services.ts
var prodServices = {
	getData: (id) => `Datos reales para ${id}`,
	saveConfig: (cfg) => console.log(cfg)
};
var devServices = {
	resetDatabase: () => "Base de datos reseteada",
	logDebugInfo: (info) => console.log(info)
};
({
	...prodServices,
	...devServices
});
//#endregion
//#region src/backend/preload.ts
var buildApi = (services) => {
	const api = {};
	Object.keys(services).forEach((channel) => {
		api[channel] = (...args) => electron.ipcRenderer.invoke(channel, ...args);
	});
	return api;
};
electron.contextBridge.exposeInMainWorld("apis", {
	prod: buildApi(prodServices),
	dev: buildApi(devServices)
});
//#endregion
