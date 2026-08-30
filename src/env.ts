import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	ORIGIN: {
		description: 'The app origin (base URL), e.g. `http://localhost:5173`.'
	},
	BETTER_AUTH_SECRET: {
		description:
			'Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).'
	},
	GOOGLE_CLIENT_ID: {
		description: 'OAuth client ID for the Google social provider.'
	},
	GOOGLE_CLIENT_SECRET: {
		description: 'OAuth client secret for the Google social provider.'
	}
});
