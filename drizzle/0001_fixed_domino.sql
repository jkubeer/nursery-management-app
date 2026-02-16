CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`roomId` int NOT NULL,
	`scheduledDate` date NOT NULL,
	`startTime` time,
	`endTime` time,
	`staffId` int,
	`status` enum('planned','in_progress','completed','cancelled') NOT NULL DEFAULT 'planned',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activity_attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activityId` int NOT NULL,
	`childId` int NOT NULL,
	`attended` boolean DEFAULT true,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `check_in_out` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`checkInTime` timestamp,
	`checkOutTime` timestamp,
	`checkedInBy` int,
	`checkedOutBy` int,
	`date` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `check_in_out_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `children` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`dateOfBirth` date NOT NULL,
	`gender` enum('male','female','other'),
	`enrollmentDate` date NOT NULL,
	`roomId` int,
	`allergies` text,
	`medicalConditions` text,
	`medications` text,
	`dietaryRestrictions` text,
	`emergencyContact1` varchar(100),
	`emergencyPhone1` varchar(20),
	`emergencyContact2` varchar(100),
	`emergencyPhone2` varchar(20),
	`status` enum('active','inactive','graduated') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `children_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`reportDate` date NOT NULL,
	`mood` varchar(50),
	`activities` text,
	`meals` text,
	`naps` text,
	`notes` text,
	`staffId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentId` int NOT NULL,
	`notificationType` enum('daily_report','event','payment_reminder','emergency_alert','other') NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`content` text,
	`status` enum('sent','failed','pending') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`feeType` enum('tuition','registration','activity','other') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`dueDate` date,
	`frequency` enum('one_time','weekly','monthly','yearly') NOT NULL DEFAULT 'one_time',
	`description` text,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceNumber` varchar(50) NOT NULL,
	`parentId` int NOT NULL,
	`childId` int NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`dueDate` date NOT NULL,
	`issueDate` date NOT NULL,
	`status` enum('draft','sent','paid','overdue','cancelled') NOT NULL DEFAULT 'draft',
	`items` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `parent_child_relationships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentId` int NOT NULL,
	`childId` int NOT NULL,
	`relationship` varchar(50) NOT NULL,
	`isPrimaryContact` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `parent_child_relationships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`relationship` varchar(50),
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`zipCode` varchar(20),
	`workPhone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentId` int NOT NULL,
	`childId` int NOT NULL,
	`feeId` int,
	`amount` decimal(10,2) NOT NULL,
	`paymentMethod` enum('stripe','bank_transfer','cash','check') NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentDate` timestamp,
	`invoiceNumber` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activityId` int,
	`childrenIds` text,
	`photoUrl` text NOT NULL,
	`photoKey` varchar(255) NOT NULL,
	`caption` text,
	`uploadedBy` int,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recurring_billings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentId` int NOT NULL,
	`childId` int NOT NULL,
	`feeId` int NOT NULL,
	`stripeSubscriptionId` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`frequency` enum('weekly','monthly','yearly') NOT NULL,
	`status` enum('active','paused','cancelled') NOT NULL DEFAULT 'active',
	`nextBillingDate` date,
	`cancelledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recurring_billings_id` PRIMARY KEY(`id`),
	CONSTRAINT `recurring_billings_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`capacity` int NOT NULL,
	`ageGroupMin` int,
	`ageGroupMax` int,
	`resources` text,
	`status` enum('active','inactive','maintenance') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`staffRole` enum('director','teacher','assistant','nurse','admin') NOT NULL,
	`qualifications` text,
	`emergencyContact` varchar(100),
	`emergencyPhone` varchar(20),
	`hireDate` date,
	`status` enum('active','inactive','on_leave') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffId` int NOT NULL,
	`dayOfWeek` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
	`startTime` time NOT NULL,
	`endTime` time NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','staff','parent') NOT NULL DEFAULT 'parent';--> statement-breakpoint
CREATE INDEX `activities_roomId_idx` ON `activities` (`roomId`);--> statement-breakpoint
CREATE INDEX `activities_staffId_idx` ON `activities` (`staffId`);--> statement-breakpoint
CREATE INDEX `activity_attendance_activityId_idx` ON `activity_attendance` (`activityId`);--> statement-breakpoint
CREATE INDEX `activity_attendance_childId_idx` ON `activity_attendance` (`childId`);--> statement-breakpoint
CREATE INDEX `check_in_out_childId_idx` ON `check_in_out` (`childId`);--> statement-breakpoint
CREATE INDEX `check_in_out_date_idx` ON `check_in_out` (`date`);--> statement-breakpoint
CREATE INDEX `children_roomId_idx` ON `children` (`roomId`);--> statement-breakpoint
CREATE INDEX `daily_reports_childId_idx` ON `daily_reports` (`childId`);--> statement-breakpoint
CREATE INDEX `daily_reports_reportDate_idx` ON `daily_reports` (`reportDate`);--> statement-breakpoint
CREATE INDEX `email_notifications_parentId_idx` ON `email_notifications` (`parentId`);--> statement-breakpoint
CREATE INDEX `email_notifications_status_idx` ON `email_notifications` (`status`);--> statement-breakpoint
CREATE INDEX `fees_childId_idx` ON `fees` (`childId`);--> statement-breakpoint
CREATE INDEX `invoices_parentId_idx` ON `invoices` (`parentId`);--> statement-breakpoint
CREATE INDEX `invoices_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `parent_child_relationships_parentId_idx` ON `parent_child_relationships` (`parentId`);--> statement-breakpoint
CREATE INDEX `parent_child_relationships_childId_idx` ON `parent_child_relationships` (`childId`);--> statement-breakpoint
CREATE INDEX `parents_userId_idx` ON `parents` (`userId`);--> statement-breakpoint
CREATE INDEX `payments_parentId_idx` ON `payments` (`parentId`);--> statement-breakpoint
CREATE INDEX `payments_childId_idx` ON `payments` (`childId`);--> statement-breakpoint
CREATE INDEX `payments_status_idx` ON `payments` (`status`);--> statement-breakpoint
CREATE INDEX `photos_activityId_idx` ON `photos` (`activityId`);--> statement-breakpoint
CREATE INDEX `recurring_billings_parentId_idx` ON `recurring_billings` (`parentId`);--> statement-breakpoint
CREATE INDEX `recurring_billings_stripeSubscriptionId_idx` ON `recurring_billings` (`stripeSubscriptionId`);--> statement-breakpoint
CREATE INDEX `staff_userId_idx` ON `staff` (`userId`);--> statement-breakpoint
CREATE INDEX `staff_schedules_staffId_idx` ON `staff_schedules` (`staffId`);