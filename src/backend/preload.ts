import { ipcRenderer, contextBridge } from 'electron';
import { prodServices, devServices } from '@shared/services';

const buildApi = (services: Record<string, any>) => {
  const api: any = {};
  Object.keys(services).forEach((channel) => {
    api[channel] = (...args: any[]) => ipcRenderer.invoke(channel, ...args);
  });
  return api;
};

contextBridge.exposeInMainWorld('apis', {
  prod: buildApi(prodServices),
  dev: buildApi(devServices),
});