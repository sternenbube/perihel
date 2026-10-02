CREATE TABLE `account` (
	`id` integer PRIMARY KEY NOT NULL,
	`category_id` integer NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_name_unique` ON `category` (`name`);--> statement-breakpoint
CREATE TABLE `entry` (
	`id` integer PRIMARY KEY NOT NULL,
	`snapshot_id` integer NOT NULL,
	`account_id` integer NOT NULL,
	`value` integer NOT NULL,
	FOREIGN KEY (`snapshot_id`) REFERENCES `snapshot`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entry_per_account_and_month` ON `entry` (`snapshot_id`,`account_id`);--> statement-breakpoint
CREATE TABLE `setting` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `snapshot` (
	`id` integer PRIMARY KEY NOT NULL,
	`year_month` text NOT NULL,
	CONSTRAINT "year_month_format" CHECK("snapshot"."year_month" GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]'
        AND substr("snapshot"."year_month", 6, 2) BETWEEN '01' AND '12')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `snapshot_year_month_unique` ON `snapshot` (`year_month`);