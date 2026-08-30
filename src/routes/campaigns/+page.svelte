<script lang="ts">
	import Card from '#lib/components/ui/card.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Campaigns · Lore</title>
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
	<header class="mb-6">
		<h1 class="text-2xl font-semibold tracking-tight text-zinc-950">Campaigns</h1>
		<p class="mt-1 text-sm text-zinc-600">Campaigns you play in or manage.</p>
	</header>

	{#if data.campaigns.length === 0}
		<Card class="p-6">
			<p class="font-medium text-zinc-900">No campaigns yet</p>
			<p class="mt-1 text-sm text-zinc-600">Your campaigns will appear here.</p>
		</Card>
	{:else}
		<ul class="grid gap-3 sm:grid-cols-2" aria-label="Campaigns">
			{#each data.campaigns as campaign (campaign.id)}
				<li>
					<Card class="p-5">
						<h2 class="font-medium text-zinc-950">{campaign.name}</h2>
					</Card>
				</li>
			{/each}
		</ul>
	{/if}
</main>
