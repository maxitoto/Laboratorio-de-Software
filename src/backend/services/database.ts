import { agentesRepository } from "@backend/repositories/agentes.repository";
import { dbCommunication } from "@backend/dbCommunication";
import { NuevoAgente, NuevoVehiculo } from "@models/schema";
import { vehiculosRepository } from "@backend/repositories/vehiculos.repository";

// backend/services/database.ts
export const databaseService = {
  obtenerAgentes: async () => {
    return await agentesRepository.obtenerTodos();
  },

  registrarNuevoAgente: async (agente: NuevoAgente) => {
    return await agentesRepository.crear(agente);
  },

  // Aquí implementaremos luego StartDBComunication.ts para transacciones complejas
  sincronizarNodo: async (hub: 'Ushuaia' | 'Rio Grande' | 'Tolhuin') => {
    const agentesDelHub = await agentesRepository.obtenerPorHub(hub);
    return `Se encontraron ${agentesDelHub.length} registros en el nodo ${hub}.`;
  },
  asignarPatrullero: async (legajoAgente: string, dominioVehiculo: string) => {
    return await dbCommunication.asignarPatrullero(legajoAgente, dominioVehiculo);
  },
  obtenerVehiculos: async () => {
    return await vehiculosRepository.obtenerTodos();
  },
  registrarNuevoVehiculo: async (vehiculo: NuevoVehiculo) => {
    return await vehiculosRepository.crear(vehiculo);
  },
};