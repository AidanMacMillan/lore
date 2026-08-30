<script lang="ts">
	import './layout.css';
	import { goto } from '$app/navigation';
	import { authClient } from '#lib/auth-client';
	import logo from '#lib/assets/logo.svg';
	import Button from '#lib/components/ui/button.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	let isSigningOut = $state(false);

	async function signOut() {
		isSigningOut = true;

		try {
			const { error } = await authClient.signOut();

			if (!error) {
				await goto('/signin', { invalidateAll: true });
			}
		} finally {
			isSigningOut = false;
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={logo} />
	<title>Lore</title>
</svelte:head>

{#if data.user}
	<header class="border-b border-zinc-200 bg-white">
		<nav class="mx-auto flex h-14 w-full items-center px-6" aria-label="Primary">
			<a href="/" class="flex shrink-0 items-center" aria-label="Lore home">
				<img src={logo} alt="" class="size-6" />
			</a>
			<a href="/campaigns" class="ml-6 text-sm font-medium text-zinc-600 hover:text-zinc-950">
				Campaigns
			</a>
			<Button
				class="ml-auto h-9 border border-zinc-200 bg-white px-3 text-zinc-900 shadow-none hover:bg-zinc-100"
				disabled={isSigningOut}
				onclick={signOut}
			>
				{isSigningOut ? 'Signing out…' : 'Sign out'}
			</Button>
		</nav>
	</header>
{/if}

{@render children()}
