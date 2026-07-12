// shared/ipc.types.ts
import type { AppServices } from '@backend/services'; // ¡Importante usar "import type"!

// Utilidad recursiva para asegurar que todo devuelva Promesas (regla de oro del IPC)
export type Promisified<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<Awaited<R>>
    : T[K] extends object
    ? Promisified<T[K]>
    : never;
};

// Este es el contrato final que usará el frontend
export type ElectronAPI = Promisified<AppServices>;