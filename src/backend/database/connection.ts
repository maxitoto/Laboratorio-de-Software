import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@models/schema';
import { join } from 'node:path';
import 'dotenv/config';

// En desarrollo, la BD se guarda en la raíz. En producción, se guardará en userData.
const dbPath = process.env.APP_ROOT 
  ? join(process.env.APP_ROOT, 'local.db')
  : 'local.db';

// Cliente de LibSQL (Soporta Offline local + Sync Remoto)
const client = createClient({
  url: `file:${dbPath}`,
  ...(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN && {
    syncUrl: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
    syncInterval: 60, // Sincroniza bidireccionalmente cada 60 segundos
  })
});

export const db = drizzle(client, { schema });