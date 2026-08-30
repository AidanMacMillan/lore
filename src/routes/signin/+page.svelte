<script lang="ts">
	import logo from '#lib/assets/logo.svg';
	import { authClient } from '#lib/auth-client';
	import Button from '#lib/components/ui/button.svelte';
	import Card from '#lib/components/ui/card.svelte';

	let isSigningIn = $state(false);

	async function signInWithGoogle() {
		isSigningIn = true;

		try {
			const { data, error } = await authClient.signIn.social({
				provider: 'google',
				callbackURL: '/'
			});

			if (error || !data?.redirect) {
				isSigningIn = false;
			}
		} catch {
			isSigningIn = false;
		}
	}
</script>

<svelte:head>
	<title>Sign in · Lore</title>
</svelte:head>

<main class="min-h-svh overflow-y-auto bg-zinc-50 p-6 sm:p-8">
	<div
		class="flex min-h-[calc(100svh-3rem)] items-center justify-center sm:min-h-[calc(100svh-4rem)]"
	>
		<Card class="w-full max-w-sm p-6 sm:p-8">
			<div class="flex flex-col items-center gap-8">
				<img src={logo} alt="Lore" class="size-12" />

				<Button class="w-full" disabled={isSigningIn} onclick={signInWithGoogle}>
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						class="size-4"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill="currentColor"
							d="M21.35 12.22c0-.7-.06-1.22-.2-1.77H12v3.31h5.37a4.7 4.7 0 0 1-1.99 3.04l-.02.11 2.89 2.24.2.02c1.84-1.7 2.9-4.2 2.9-6.95Z"
						/>
						<path
							fill="currentColor"
							d="M12 21.75c2.63 0 4.83-.87 6.45-2.58l-3.07-2.37c-.82.55-1.92.94-3.38.94a5.87 5.87 0 0 1-5.55-4.06l-.1.01-3.01 2.33-.04.1A9.74 9.74 0 0 0 12 21.75Z"
						/>
						<path
							fill="currentColor"
							d="M6.45 13.68A6 6 0 0 1 6.13 12c0-.59.11-1.15.3-1.68v-.12L3.4 7.84l-.1.05A9.75 9.75 0 0 0 2.25 12c0 1.48.33 2.87 1.05 4.11l3.15-2.43Z"
						/>
						<path
							fill="currentColor"
							d="M12 6.26c1.83 0 3.06.79 3.76 1.44l2.75-2.69A9.3 9.3 0 0 0 12 2.25a9.74 9.74 0 0 0-8.7 5.64l3.13 2.43A5.9 5.9 0 0 1 12 6.26Z"
						/>
					</svg>
					{isSigningIn ? 'Signing in…' : 'Sign in with Google'}
				</Button>
			</div>
		</Card>
	</div>
</main>
