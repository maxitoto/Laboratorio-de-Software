import { db } from '../database/connection';
import { vehiculos, type Vehiculo, type NuevoVehiculo } from '@models/schema';

export const vehiculosRepository = {
    obtenerTodos: async (): Promise<Vehiculo[]> => {
        return await db.select().from(vehiculos);
    },
    crear: async (vehiculo: NuevoVehiculo) => {
        return await db.insert(vehiculos).values(vehiculo);
    },
}