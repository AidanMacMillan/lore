<script lang="ts">
	import './layout.css';
	import logo from '#lib/assets/logo.svg';
	import AppHeader from '#lib/components/app-header.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
	<title>Lore</title>
</svelte:head>

{#if data.user}
	<AppHeader />
{/if}

{@render children()}
