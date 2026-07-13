import { eq } from 'drizzle-orm';
import { db } from '../database/connection';
import { agentes, type Agente, type NuevoAgente } from '@models/schema';

export const agentesRepository = {
  
  obtenerTodos: async (): Promise<Agente[]> => {
    return await db.select().from(agentes);
  },

  obtenerPorHub: async (hub: 'Ushuaia' | 'Rio Grande' | 'Tolhuin'): Promise<Agente[]> => {
    return await db.select().from(agentes).where(eq(agentes.hubAsignado, hub));
  },

  crear: async (agente: NuevoAgente): Promise<Agente> => {
    const result = await db.insert(agentes).values(agente).returning();
    return result[0];
  },

  obtenerAgentePorLegajo: async (legajo: string): Promise<Agente | undefined> => {
    return await db.select().from(agentes).where(eq(agentes.legajo, legajo)).get();
  },
};