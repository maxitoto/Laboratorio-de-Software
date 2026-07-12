// frontend/vite-env.d.ts
/// <reference types="vite/client" />
import type { ElectronAPI } from '@shared/ipc.types';

declare global {
  interface Window {
    apis: ElectronAPI;
  }
}