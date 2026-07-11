/// <reference types="vite-plugin-electron/electron-env" />

import { prodServices, devServices } from './services';

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string;
    VITE_PUBLIC: string;
  }
}

type Promisified<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R 
    ? (...args: A) => Promise<Awaited<R>> 
    : never;
};

declare global {
  interface Window {
    electronAPI: {
      prod: Promisified<typeof prodServices>;
      dev: Promisified<typeof devServices>;
    }
  }
}