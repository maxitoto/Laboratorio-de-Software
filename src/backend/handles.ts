import { ipcMain } from 'electron';
import { allServices } from '@shared/services';

export function startHandlers() {
  Object.entries(allServices).forEach(([channel, handler]) => {
    ipcMain.handle(channel, (_event, ...args: any[]) => {
      return (handler as Function)(...args);
    });
  });
}