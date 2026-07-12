import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@models/schema';
import { join } from 'node:path';

// En desarrollo, la BD se guarda en la raíz. En producción, se guardará en userData.
const dbPath = process.env.APP_ROOT 
  ? join(process.env.APP_ROOT, 'local.db')
  : 'local.db';

// Cliente de LibSQL (Soporta Offline local + Sync Remoto)
const client = createClient({
  url: `file:${dbPath}`,
  // syncUrl: process.env.TURSO_DATABASE_URL, // Se activará luego para backup remoto
  // authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });