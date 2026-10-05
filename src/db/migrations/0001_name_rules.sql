PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_category` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT "category_name_not_empty" CHECK(length(trim("__new_category"."name")) > 0)
);
--> statement-breakpoint
INSERT INTO `__new_category`("id", "name") SELECT "id", "name" FROM `category`;--> statement-breakpoint
DROP TABLE `category`;--> statement-breakpoint
ALTER TABLE `__new_category` RENAME TO `category`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `category_name_lower_unique` ON `category` (lower("name"));--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` integer PRIMARY KEY NOT NULL,
	`category_id` integer NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "account_name_not_empty" CHECK(length(trim("__new_account"."name")) > 0)
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "category_id", "name", "is_active") SELECT "id", "category_id", "name", "is_active" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;