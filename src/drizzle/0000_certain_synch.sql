CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`is_completed` integer DEFAULT false,
	`due_date` text,
	`start_date` text,
	`life_domains` text,
	`priority` integer DEFAULT 0,
	`position` real DEFAULT 0,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
