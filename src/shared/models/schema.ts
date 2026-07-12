import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Definición de la entidad principal
export const agentes = sqliteTable('agentes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  legajo: text('legajo').notNull().unique(),
  nombre: text('nombre').notNull(),
  rango: text('rango').notNull(),
  // Hub geográfico para la sincronización distribuida
  hubAsignado: text('hub_asignado', { enum: ['Ushuaia', 'Rio Grande', 'Tolhuin'] }).notNull(),
  estado: text('estado', { enum: ['Activo', 'Inactivo'] }).default('Activo').notNull(),
});

// Entidad relacional
export const vehiculos = sqliteTable('vehiculos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  dominio: text('dominio').notNull().unique(),
  modelo: text('modelo').notNull(),
  agenteId: integer('agente_id').references(() => agentes.id),
});

// Inferencia de Tipos Puros (El "contrato" para React)
export type Agente = typeof agentes.$inferSelect;
export type NuevoAgente = typeof agentes.$inferInsert;

export type Vehiculo = typeof vehiculos.$inferSelect;
export type NuevoVehiculo = typeof vehiculos.$inferInsert;