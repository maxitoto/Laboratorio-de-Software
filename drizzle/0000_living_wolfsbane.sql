CREATE TABLE `agentes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`legajo` text NOT NULL,
	`nombre` text NOT NULL,
	`rango` text NOT NULL,
	`hub_asignado` text NOT NULL,
	`estado` text DEFAULT 'Activo' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agentes_legajo_unique` ON `agentes` (`legajo`);--> statement-breakpoint
CREATE TABLE `vehiculos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dominio` text NOT NULL,
	`modelo` text NOT NULL,
	`agente_id` integer,
	FOREIGN KEY (`agente_id`) REFERENCES `agentes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehiculos_dominio_unique` ON `vehiculos` (`dominio`);