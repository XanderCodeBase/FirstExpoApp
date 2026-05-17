CREATE TABLE `recurrence_rules`
(
    `id`            text PRIMARY KEY NOT NULL,
    `task_id`       text             NOT NULL,
    `frequency`     text             NOT NULL,
    `interval`      integer DEFAULT 1,
    `days_of_week`  text,
    `day_of_month`  integer,
    `week_of_month` integer,
    `time_of_day`   text             NOT NULL,
    `end_date`      text,
    `count`         integer,
    `created_at`    text    DEFAULT (CURRENT_TIMESTAMP),
    `updated_at`    text    DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recurrence_rules_task_id_unique` ON `recurrence_rules` (`task_id`);--> statement-breakpoint
CREATE INDEX `idx_recurrence_task` ON `recurrence_rules` (`task_id`);--> statement-breakpoint
CREATE TABLE `task_occurrences`
(
    `id`              text PRIMARY KEY NOT NULL,
    `task_id`         text             NOT NULL,
    `occurrence_date` text             NOT NULL,
    `is_completed`    integer DEFAULT false,
    `completed_at`    text,
    `notes`           text,
    `custom_title`    text,
    `custom_time`     text,
    `created_at`      text    DEFAULT (CURRENT_TIMESTAMP),
    `updated_at`      text    DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_occurrences_task_date` ON `task_occurrences` (`task_id`, `occurrence_date`);--> statement-breakpoint
CREATE INDEX `idx_occurrences_date` ON `task_occurrences` (`occurrence_date`);--> statement-breakpoint
CREATE INDEX `idx_occurrences_completed` ON `task_occurrences` (`is_completed`);--> statement-breakpoint
CREATE TABLE `tasks`
(
    `id`           text PRIMARY KEY NOT NULL,
    `title`        text             NOT NULL,
    `description`  text,
    `start_date`   text,
    `life_domains` text,
    `priority`     integer DEFAULT 0,
    `position`     real    DEFAULT 0,
    `created_at`   text    DEFAULT (CURRENT_TIMESTAMP),
    `updated_at`   text    DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE INDEX `idx_tasks_title` ON `tasks` (`title`);
