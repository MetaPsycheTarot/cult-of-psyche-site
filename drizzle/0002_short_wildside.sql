CREATE TABLE `email_engagement_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emailId` varchar(255) NOT NULL,
	`emailType` enum('welcome','payment_confirmation','referral_notification') NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`sentAt` timestamp NOT NULL,
	`deliveredAt` timestamp,
	`openedAt` timestamp,
	`openCount` int DEFAULT 0,
	`clickCount` int DEFAULT 0,
	`lastClickedAt` timestamp,
	`bounced` boolean DEFAULT false,
	`complained` boolean DEFAULT false,
	`failed` boolean DEFAULT false,
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_engagement_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `email_engagement_metrics` ADD CONSTRAINT `email_engagement_metrics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;