CREATE TABLE `weekly_rashifal` (
	`id` text PRIMARY KEY NOT NULL,
	`week_start` text NOT NULL,
	`week_end` text NOT NULL,
	`rashi_id` integer NOT NULL,
	`rashi_mr` text NOT NULL,
	`summary` text NOT NULL,
	`narrative` text NOT NULL,
	`career_points_json` text NOT NULL,
	`love_points_json` text NOT NULL,
	`health_points_json` text NOT NULL,
	`advice` text,
	`lucky_color` text,
	`lucky_number` integer,
	`rating` integer,
	`source` text NOT NULL,
	`audit_json` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `weekly_rashifal_week_rashi` ON `weekly_rashifal` (`week_start`,`rashi_id`);
