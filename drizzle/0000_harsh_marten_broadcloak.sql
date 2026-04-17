CREATE TABLE `kundlis` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`birth_time` text NOT NULL,
	`birth_place` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`result_json` text,
	`pdf_url` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`razorpay_order_id` text,
	`razorpay_payment_id` text,
	`razorpay_signature` text,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'INR',
	`plan` text NOT NULL,
	`status` text DEFAULT 'created',
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image` text,
	`phone` text,
	`date_of_birth` text,
	`birth_time` text,
	`birth_place` text,
	`language` text DEFAULT 'mr',
	`role` text DEFAULT 'user',
	`plan` text DEFAULT 'free',
	`plan_expires_at` text,
	`provider` text DEFAULT 'google',
	`provider_account_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);