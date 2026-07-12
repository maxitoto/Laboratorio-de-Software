import { BrowserWindow, app, ipcMain } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
//#endregion
//#region src/backend/services/index.ts
var allServices = {
	servicioBD: {
		getData: async (id) => `Datos reales de BD para ${id}`,
		saveConfig: async (cfg) => {
			console.log(cfg);
			return true;
		},
		getAgenteLocalizacion: async (legajo) => {
			return {
				legajo,
				hubAsignado: "Ushuaia",
				estado: "Activo"
			};
		},
		registrarVehiculo: async (dominio, locacion) => {
			return `Vehículo ${dominio} sincronizado correctamente en el nodo de ${locacion}.`;
		}
	},
	servicioDev: {
		resetDatabase: async () => "Base de datos reseteada",
		logDebugInfo: async (info) => console.log(info)
	}
};
//#endregion
//#region src/backend/handles.ts
function startHandlers() {
	Object.entries(allServices).forEach(([namespace, service]) => {
		Object.entries(service).forEach(([methodName, handler]) => {
			const channel = `${namespace}:${methodName}`;
			ipcMain.handle(channel, async (_event, ...args) => {
				return handler(...args);
			});
		});
	});
}
//#endregion
//#region src/backend/main.ts
var __dirname = dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = join(__dirname, "../../");
var VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
if (VITE_DEV_SERVER_URL) process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
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
app.disableHardwareAcceleration();
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
