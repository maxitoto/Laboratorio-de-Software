// backend/services/index.ts
import { databaseService } from './database';
import { developerService } from './developer';

// Estructura central de implementaciones
export const allServices = {
  servicioBD: databaseService,
  servicioDev: developerService,
} as const;

// Extraemos el TIPO puro para compartirlo con el frontend
export type AppServices = typeof allServices;