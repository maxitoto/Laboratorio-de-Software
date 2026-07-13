import 'dotenv/config'; 
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@models/schema';
import { join } from 'node:path';

const dbPath = process.env.APP_ROOT 
  ? join(process.env.APP_ROOT, 'local.db')
  : join(process.cwd(), 'local.db');

const syncUrl = process.env.TURSO_DATABASE_URL?.trim();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

console.log(`=========================================`);
console.log(`[Motor DB] Evaluando ruta local: ${dbPath}`);

export let client: ReturnType<typeof createClient>;

try {
  if (syncUrl && authToken) {
    console.log(`[Motor DB] Estado: MODO DISTRIBUIDO 🌐`);
    console.log(`[Motor DB] Conectando a: ${syncUrl}`);
    
    client = createClient({
      url: `file:${dbPath}`,
      syncUrl: syncUrl,
      authToken: authToken,
      syncInterval: 60,
    });
  } else {
    console.log(`[Motor DB] Estado: MODO LOCAL (Offline) 🔒`);
    client = createClient({ url: `file:${dbPath}` });
  }
} catch (error) {
  console.error(`[Motor DB] ❌ Error Crítico:`, error);
  client = createClient({ url: ':memory:' });
}

export const db = drizzle(client, { schema });

// NUEVA FUNCIÓN: Fuerza la descarga de Turso antes de abrir la UI
export const inicializarBaseDeDatos = async () => {
  if (syncUrl && authToken) {
    console.log(`[Motor DB] ⏳ Descargando esquema y datos desde Turso...`);
    await client.sync();
    console.log(`[Motor DB] ✅ Sincronización inicial completada. Listo para operar.`);
  }
};