CREATE TABLE `nurseries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`contactName` varchar(200) NOT NULL,
	`contactEmail` varchar(320),
	`contactPhone` varchar(20),
	`logo` text,
	`address` text,
	`city` varchar(100),
	`country` varchar(100),
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`adminId` int,
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nurseries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('super_admin','admin','staff','parent') NOT NULL DEFAULT 'parent';--> statement-breakpoint
ALTER TABLE `activities` ADD `nurseryId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `children` ADD `nurseryId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `parents` ADD `nurseryId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `nurseryId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `staff` ADD `nurseryId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `nurseryId` int;