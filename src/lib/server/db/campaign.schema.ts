import { relations, sql } from 'drizzle-orm';
import {
	check,
	foreignKey,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';

import { user } from './auth.schema';

const createdAt = () =>
	integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull();

const updatedAt = () =>
	integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull();

export const campaign = sqliteTable('campaign', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	createdAt: createdAt(),
	updatedAt: updatedAt()
});

export const character = sqliteTable(
	'character',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name').notNull(),
		ownerUserId: text('owner_user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [index('character_ownerUserId_idx').on(table.ownerUserId)]
);

/** Characters may be reused across campaigns, so this is a many-to-many membership. */
export const campaignCharacter = sqliteTable(
	'campaign_character',
	{
		campaignId: text('campaign_id')
			.notNull()
			.references(() => campaign.id, { onDelete: 'cascade' }),
		characterId: text('character_id')
			.notNull()
			.references(() => character.id, { onDelete: 'cascade' }),
		createdAt: createdAt()
	},
	(table) => [
		primaryKey({ columns: [table.campaignId, table.characterId] }),
		index('campaignCharacter_characterId_idx').on(table.characterId)
	]
);

/** Campaign membership is independent of character ownership. */
export const campaignUser = sqliteTable(
	'campaign_user',
	{
		campaignId: text('campaign_id')
			.notNull()
			.references(() => campaign.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		isGameMaster: integer('is_game_master', { mode: 'boolean' }).default(false).notNull(),
		createdAt: createdAt()
	},
	(table) => [
		primaryKey({ columns: [table.campaignId, table.userId] }),
		index('campaignUser_userId_idx').on(table.userId),
		check('campaignUser_isGameMaster_check', sql`${table.isGameMaster} in (0, 1)`)
	]
);

export const pageVisibilityValues = ['private', 'game_master_shared', 'public'] as const;
export type PageVisibility = (typeof pageVisibilityValues)[number];

export const asset = sqliteTable(
	'asset',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		campaignId: text('campaign_id')
			.notNull()
			.references(() => campaign.id, { onDelete: 'cascade' }),
		/** Kept as an audit identifier even if the Better Auth user is deleted. */
		createdByUserId: text('created_by_user_id').notNull(),
		r2ObjectKey: text('r2_object_key').notNull(),
		originalFilename: text('original_filename').notNull(),
		mimeType: text('mime_type').notNull(),
		byteSize: integer('byte_size').notNull(),
		width: integer('width'),
		height: integer('height'),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [
		uniqueIndex('asset_campaignId_id_uidx').on(table.campaignId, table.id),
		uniqueIndex('asset_r2ObjectKey_uidx').on(table.r2ObjectKey),
		index('asset_campaignId_idx').on(table.campaignId),
		index('asset_createdByUserId_idx').on(table.createdByUserId),
		check('asset_r2ObjectKey_check', sql`length(trim(${table.r2ObjectKey})) > 0`),
		check('asset_originalFilename_check', sql`length(trim(${table.originalFilename})) > 0`),
		check('asset_mimeType_check', sql`length(trim(${table.mimeType})) > 0`),
		check('asset_byteSize_check', sql`${table.byteSize} >= 0`),
		check('asset_width_check', sql`${table.width} is null or ${table.width} > 0`),
		check('asset_height_check', sql`${table.height} is null or ${table.height} > 0`)
	]
);

/**
 * Tag hierarchy is encoded in the full name (for example, "Location/Building").
 * Slashes are a presentation delimiter rather than a relational parent reference.
 */
export const tag = sqliteTable(
	'tag',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		campaignId: text('campaign_id')
			.notNull()
			.references(() => campaign.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [
		uniqueIndex('tag_campaignId_id_uidx').on(table.campaignId, table.id),
		index('tag_campaignId_idx').on(table.campaignId),
		check('tag_name_check', sql`length(trim(${table.name})) > 0`)
	]
);

export const page = sqliteTable(
	'page',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		campaignId: text('campaign_id')
			.notNull()
			.references(() => campaign.id, { onDelete: 'cascade' }),
		/** Kept as an audit identifier even if the Better Auth user is deleted. */
		createdByUserId: text('created_by_user_id').notNull(),
		title: text('title'),
		description: text('description'),
		visibility: text('visibility', { enum: pageVisibilityValues }).default('private').notNull(),
		/** Application writes must ensure referenced assets belong to this page's campaign. */
		bannerAssetId: text('banner_asset_id').references(() => asset.id, { onDelete: 'set null' }),
		iconAssetId: text('icon_asset_id').references(() => asset.id, { onDelete: 'set null' }),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [
		uniqueIndex('page_campaignId_id_uidx').on(table.campaignId, table.id),
		index('page_campaignId_visibility_idx').on(table.campaignId, table.visibility),
		index('page_campaignId_createdByUserId_idx').on(table.campaignId, table.createdByUserId),
		index('page_bannerAssetId_idx').on(table.bannerAssetId),
		index('page_iconAssetId_idx').on(table.iconAssetId),
		check(
			'page_visibility_check',
			sql`${table.visibility} in ('private', 'game_master_shared', 'public')`
		)
	]
);

export const pageTag = sqliteTable(
	'page_tag',
	{
		campaignId: text('campaign_id').notNull(),
		pageId: text('page_id').notNull(),
		tagId: text('tag_id').notNull(),
		createdAt: createdAt()
	},
	(table) => [
		primaryKey({ columns: [table.pageId, table.tagId] }),
		foreignKey({
			name: 'pageTag_campaignId_pageId_page_campaignId_id_fk',
			columns: [table.campaignId, table.pageId],
			foreignColumns: [page.campaignId, page.id]
		}).onDelete('cascade'),
		foreignKey({
			name: 'pageTag_campaignId_tagId_tag_campaignId_id_fk',
			columns: [table.campaignId, table.tagId],
			foreignColumns: [tag.campaignId, tag.id]
		}),
		index('pageTag_campaignId_tagId_idx').on(table.campaignId, table.tagId)
	]
);

export const campaignRelations = relations(campaign, ({ many }) => ({
	characters: many(campaignCharacter),
	members: many(campaignUser),
	assets: many(asset),
	tags: many(tag),
	pages: many(page)
}));

export const characterRelations = relations(character, ({ many, one }) => ({
	owner: one(user, {
		fields: [character.ownerUserId],
		references: [user.id]
	}),
	campaigns: many(campaignCharacter)
}));

export const campaignCharacterRelations = relations(campaignCharacter, ({ one }) => ({
	campaign: one(campaign, {
		fields: [campaignCharacter.campaignId],
		references: [campaign.id]
	}),
	character: one(character, {
		fields: [campaignCharacter.characterId],
		references: [character.id]
	})
}));

export const campaignUserRelations = relations(campaignUser, ({ one }) => ({
	campaign: one(campaign, {
		fields: [campaignUser.campaignId],
		references: [campaign.id]
	}),
	user: one(user, {
		fields: [campaignUser.userId],
		references: [user.id]
	})
}));

export const assetRelations = relations(asset, ({ many, one }) => ({
	campaign: one(campaign, {
		fields: [asset.campaignId],
		references: [campaign.id]
	}),
	bannerForPages: many(page, { relationName: 'pageBanner' }),
	iconForPages: many(page, { relationName: 'pageIcon' })
}));

export const tagRelations = relations(tag, ({ many, one }) => ({
	campaign: one(campaign, {
		fields: [tag.campaignId],
		references: [campaign.id]
	}),
	pages: many(pageTag)
}));

export const pageRelations = relations(page, ({ many, one }) => ({
	campaign: one(campaign, {
		fields: [page.campaignId],
		references: [campaign.id]
	}),
	banner: one(asset, {
		fields: [page.bannerAssetId],
		references: [asset.id],
		relationName: 'pageBanner'
	}),
	icon: one(asset, {
		fields: [page.iconAssetId],
		references: [asset.id],
		relationName: 'pageIcon'
	}),
	tags: many(pageTag)
}));

export const pageTagRelations = relations(pageTag, ({ one }) => ({
	page: one(page, {
		fields: [pageTag.campaignId, pageTag.pageId],
		references: [page.campaignId, page.id]
	}),
	tag: one(tag, {
		fields: [pageTag.campaignId, pageTag.tagId],
		references: [tag.campaignId, tag.id]
	})
}));
