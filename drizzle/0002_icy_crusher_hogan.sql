ALTER TABLE `photos` ADD `isPublic` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `photos` ADD `tags` text;--> statement-breakpoint
CREATE INDEX `photos_isPublic_idx` ON `photos` (`isPublic`);