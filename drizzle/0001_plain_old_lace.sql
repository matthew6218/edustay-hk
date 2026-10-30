CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
