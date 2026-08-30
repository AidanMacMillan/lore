import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/env';
import { createAuth } from '#lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env?.DB)
		throw new Error('D1 binding "DB" not found - are you running with wrangler?');

	event.locals.auth = createAuth(event.platform.env.DB);

	const { auth } = event.locals;
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const { pathname } = event.url;
	const isAuthApiRoute = pathname === '/api/auth' || pathname.startsWith('/api/auth/');

	if (!session && pathname !== '/signin' && !isAuthApiRoute) {
		redirect(303, '/signin');
	}

	if (session && pathname === '/signin') {
		redirect(303, '/');
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
