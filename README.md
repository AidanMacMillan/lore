# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.17.0 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:none" drizzle="database:d1" better-auth="demo:none" experimental="versions:kit+features:async,remoteFunctions,explicitEnvironmentVariables,handleRenderingErrors" --install pnpm lore
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deployment

Pushes to `main` deploy to Cloudflare through the `production` GitHub Environment. Configure the following values in that environment:

Variables:

- `ORIGIN`: Production app origin, `https://lore.aidan.sh`.

Secrets:

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account containing the Worker.
- `CLOUDFLARE_API_TOKEN`: Account-scoped token created from Cloudflare's Edit Cloudflare Workers template.
- `BETTER_AUTH_SECRET`: High-entropy secret of at least 32 characters.
- `GOOGLE_CLIENT_ID`: Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret.

The D1 database and R2 bucket referenced by `wrangler.jsonc` must already exist. The deployment does not run database migrations.
Configure Google OAuth with `${ORIGIN}/api/auth/callback/google` as an authorized redirect URI.
