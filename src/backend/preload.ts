import { contextBridge, ipcRenderer } from 'electron';

// Exponemos un canal seguro genérico. Solo pasa strings y argumentos serializables.
contextBridge.exposeInMainWorld('electronIpc', {
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args)
});