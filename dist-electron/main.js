import { BrowserWindow, app, ipcMain } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/shared/services.ts
var prodServices = {
	getData: (id) => `Datos reales para ${id}`,
	saveConfig: (cfg) => console.log(cfg)
};
var devServices = {
	resetDatabase: () => "Base de datos reseteada",
	logDebugInfo: (info) => console.log(info)
};
var allServices = {
	...prodServices,
	...devServices
};
//#endregion
//#region src/backend/handles.ts
function startHandlers() {
	Object.entries(allServices).forEach(([channel, handler]) => {
		ipcMain.handle(channel, (_event, ...args) => {
			return handler(...args);
		});
	});
}
//#endregion
//#region src/backend/main.ts
var __dirname = dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = join(__dirname, "../../");
var VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
var MAIN_DIST = join(process.env.APP_ROOT, "dist-electron");
var RENDERER_DIST = join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? join(process.env.APP_ROOT, "public") : RENDERER_DIST;
var mainWindow = null;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		icon: join(process.env.VITE_PUBLIC, "electron-vite.svg"),
		webPreferences: {
			preload: join(__dirname, "preload.mjs"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true
		}
	});
	if (VITE_DEV_SERVER_URL) mainWindow.loadURL(VITE_DEV_SERVER_URL);
	else mainWindow.loadFile(join(RENDERER_DIST, "index.html"));
}
app.whenReady().then(async () => {
	startHandlers();
	createWindow();
});
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		mainWindow = null;
	}
});
//#endregion
export { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL };
