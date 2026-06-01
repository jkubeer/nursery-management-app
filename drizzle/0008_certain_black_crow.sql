CREATE TABLE `email_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nurseryId` int NOT NULL,
	`smtpHost` varchar(255) NOT NULL,
	`smtpPort` int NOT NULL,
	`smtpUser` varchar(255) NOT NULL,
	`smtpPassword` text NOT NULL,
	`fromEmail` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `email_settings_nurseryId_idx` ON `email_settings` (`nurseryId`);