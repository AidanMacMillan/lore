CREATE TABLE `asset` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`created_by_user_id` text NOT NULL,
	`r2_object_key` text NOT NULL,
	`original_filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`byte_size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "asset_r2ObjectKey_check" CHECK(length(trim("asset"."r2_object_key")) > 0),
	CONSTRAINT "asset_originalFilename_check" CHECK(length(trim("asset"."original_filename")) > 0),
	CONSTRAINT "asset_mimeType_check" CHECK(length(trim("asset"."mime_type")) > 0),
	CONSTRAINT "asset_byteSize_check" CHECK("asset"."byte_size" >= 0),
	CONSTRAINT "asset_width_check" CHECK("asset"."width" is null or "asset"."width" > 0),
	CONSTRAINT "asset_height_check" CHECK("asset"."height" is null or "asset"."height" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `asset_campaignId_id_uidx` ON `asset` (`campaign_id`,`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `asset_r2ObjectKey_uidx` ON `asset` (`r2_object_key`);--> statement-breakpoint
CREATE INDEX `asset_campaignId_idx` ON `asset` (`campaign_id`);--> statement-breakpoint
CREATE INDEX `asset_createdByUserId_idx` ON `asset` (`created_by_user_id`);--> statement-breakpoint
CREATE TABLE `page` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`created_by_user_id` text NOT NULL,
	`title` text,
	`description` text,
	`visibility` text DEFAULT 'private' NOT NULL,
	`banner_asset_id` text,
	`icon_asset_id` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`banner_asset_id`) REFERENCES `asset`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`icon_asset_id`) REFERENCES `asset`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "page_visibility_check" CHECK("page"."visibility" in ('private', 'game_master_shared', 'public'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `page_campaignId_id_uidx` ON `page` (`campaign_id`,`id`);--> statement-breakpoint
CREATE INDEX `page_campaignId_visibility_idx` ON `page` (`campaign_id`,`visibility`);--> statement-breakpoint
CREATE INDEX `page_campaignId_createdByUserId_idx` ON `page` (`campaign_id`,`created_by_user_id`);--> statement-breakpoint
CREATE INDEX `page_bannerAssetId_idx` ON `page` (`banner_asset_id`);--> statement-breakpoint
CREATE INDEX `page_iconAssetId_idx` ON `page` (`icon_asset_id`);--> statement-breakpoint
CREATE TABLE `page_tag` (
	`campaign_id` text NOT NULL,
	`page_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`page_id`, `tag_id`),
	FOREIGN KEY (`campaign_id`,`page_id`) REFERENCES `page`(`campaign_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campaign_id`,`tag_id`) REFERENCES `tag`(`campaign_id`,`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `pageTag_campaignId_tagId_idx` ON `page_tag` (`campaign_id`,`tag_id`);--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "tag_name_check" CHECK(length(trim("tag"."name")) > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_campaignId_id_uidx` ON `tag` (`campaign_id`,`id`);--> statement-breakpoint
CREATE INDEX `tag_campaignId_idx` ON `tag` (`campaign_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_campaign_user` (
	`campaign_id` text NOT NULL,
	`user_id` text NOT NULL,
	`is_game_master` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	PRIMARY KEY(`campaign_id`, `user_id`),
	FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "campaignUser_isGameMaster_check" CHECK("is_game_master" in (0, 1))
);
--> statement-breakpoint
INSERT INTO `__new_campaign_user`("campaign_id", "user_id", "is_game_master", "created_at") SELECT "campaign_id", "user_id", true, "created_at" FROM `campaign_user`;--> statement-breakpoint
DROP TABLE `campaign_user`;--> statement-breakpoint
ALTER TABLE `__new_campaign_user` RENAME TO `campaign_user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `campaignUser_userId_idx` ON `campaign_user` (`user_id`);
