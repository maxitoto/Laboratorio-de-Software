import { agentes, vehiculos } from '@models/schema';
import { db } from '@backend/database/connection';
import { eq } from 'drizzle-orm';

export const dbCommunication = {
  /**
   * Transacción ACID: Asigna un patrullero y activa al agente.
   * Garantiza que ambas tablas se actualicen juntas o ninguna lo haga (Rollback).
   */
  asignarPatrullero: async (legajoAgente: string, dominioVehiculo: string) => {
    
    // Inyectamos la transacción de Drizzle
    return await db.transaction(async (tx) => {
        
      // 1. Consulta SQL directa y optimizada (No cargamos toda la tabla en RAM)
      const agente = await tx.select().from(agentes).where(eq(agentes.legajo, legajoAgente)).get();
      if (!agente) {
        // Lanzar el error obliga a Drizzle a ejecutar un ROLLBACK automático
        throw new Error(`Agente con legajo ${legajoAgente} no encontrado.`);
      }

      // 2. Consulta SQL del vehículo
      const vehiculo = await tx.select().from(vehiculos).where(eq(vehiculos.dominio, dominioVehiculo)).get();
      if (!vehiculo) {
        throw new Error(`Vehículo con dominio ${dominioVehiculo} no registrado en el sistema.`);
      }

      // 3. Operación de Escritura A: Asignar el agente al vehículo
      await tx.update(vehiculos)
        .set({ agenteId: agente.id })
        .where(eq(vehiculos.id, vehiculo.id));

      // 4. Operación de Escritura B: Cambiar el estado del agente a 'Activo'
      await tx.update(agentes)
        .set({ estado: 'Activo' })
        .where(eq(agentes.id, agente.id));

      // Si la ejecución llega a esta línea sin excepciones, Drizzle ejecuta el COMMIT
      return `Patrullero ${dominioVehiculo} asignado exitosamente al agente ${legajoAgente} en el nodo de ${agente.hubAsignado}.`;
    });
  }
};