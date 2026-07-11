export const prodServices = {
  getData: (id: string) => `Datos reales para ${id}`,
  saveConfig: (cfg: string) => console.log(cfg),
} as const;

export const devServices = {
  resetDatabase: () => "Base de datos reseteada",
  logDebugInfo: (info: string) => console.log(info),
} as const;

export const allServices = { 
  ...prodServices, 
  ...devServices 
} as const;

export type AppServices = typeof allServices;