import { error } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

import { getDb } from '#lib/server/db';
import { campaign, campaignUser } from '#lib/server/db/campaign.schema';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.user) {
		error(401, 'You must be signed in to view campaigns.');
	}

	if (!platform?.env.DB) {
		error(500, 'D1 binding "DB" not found.');
	}

	const campaigns = await getDb(platform.env.DB)
		.select({
			id: campaign.id,
			name: campaign.name
		})
		.from(campaign)
		.innerJoin(campaignUser, eq(campaignUser.campaignId, campaign.id))
		.where(eq(campaignUser.userId, locals.user.id))
		.orderBy(desc(campaign.updatedAt));

	return { campaigns };
};
