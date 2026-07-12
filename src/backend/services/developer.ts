// backend/services/developer.ts
export const developerService = {
  resetDatabase: async () => "Base de datos reseteada",
  logDebugInfo: async (info: string) => console.log(info),
};