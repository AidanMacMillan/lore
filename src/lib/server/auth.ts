import { ORIGIN, BETTER_AUTH_SECRET } from "$app/env/private";
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { getDb } from "#lib/server/db";

const authConfig = {
	baseURL: ORIGIN,
	secret: BETTER_AUTH_SECRET,
	emailAndPassword: { enabled: true },
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
} satisfies Omit<Parameters<typeof betterAuth>[0], "database">;

export const createAuth = (d1: D1Database) => betterAuth({
	...authConfig,
	database: drizzleAdapter(getDb(d1), { provider: 'sqlite' })
});

/**
* DO NOT USE!
*
* This instance is used by the `auth` CLI for schema generation ONLY.
* To access `auth` at runtime, use `event.locals.auth`.
*/
export const auth = createAuth(null!);
