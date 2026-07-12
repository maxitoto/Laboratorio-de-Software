// backend/handles.ts
import { ipcMain } from 'electron';
import { allServices } from './services'; // Importamos la implementación real

export function startHandlers() {
  // Recorremos los namespaces ('servicioBD', 'servicioDev')
  Object.entries(allServices).forEach(([namespace, service]) => {
    
    // Recorremos los métodos de cada servicio ('getData', 'saveConfig')
    Object.entries(service).forEach(([methodName, handler]) => {
      
      const channel = `${namespace}:${methodName}`; // Construye: 'servicioBD:getData'
      
      ipcMain.handle(channel, async (_event, ...args: any[]) => {
        // Ejecutamos la función de forma segura
        return (handler as Function)(...args);
      });
    });
  });
}